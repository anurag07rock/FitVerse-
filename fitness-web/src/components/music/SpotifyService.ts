// SpotifyService.ts — Tries backend first, then falls back to Jamendo directly
import api from '@/services/api';

const JAMENDO_CLIENT_ID = '56d30cce'; // Public dev client ID

export interface Track {
    id: string;
    title: string;
    artist: string;
    albumImage: string;
    previewUrl: string | null;
    externalUrl?: string;
    duration?: number;
    source: 'spotify' | 'jamendo' | 'backup';
}

export interface PlaylistItem {
    id: string;
    name: string;
    images: { url: string }[];
    tracks: { total: number };
    source?: string;
    // For Jamendo tracks used directly as playlists
    previewUrl?: string | null;
    artist?: string;
    title?: string;
}

// ─── Jamendo direct API (no backend required) ───────────────────────────────

async function jamendoSearch(query: string): Promise<Track[]> {
    try {
        const url = new URL('https://api.jamendo.com/v3.0/tracks/');
        url.searchParams.set('client_id', JAMENDO_CLIENT_ID);
        url.searchParams.set('format', 'json');
        url.searchParams.set('limit', '12');
        url.searchParams.set('search', query);
        url.searchParams.set('audioformat', 'mp32');
        url.searchParams.set('include', 'musicinfo');

        const res = await fetch(url.toString());
        const data = await res.json();
        if (!data.results?.length) return [];
        return data.results.map((t: any): Track => ({
            id: String(t.id),
            title: t.name,
            artist: t.artist_name,
            albumImage: t.album_image || t.image || '',
            previewUrl: t.audio || null,
            externalUrl: t.shareurl,
            duration: t.duration * 1000,
            source: 'jamendo',
        }));
    } catch {
        return [];
    }
}

async function jamendoWorkoutTracks(): Promise<Track[]> {
    try {
        const url = new URL('https://api.jamendo.com/v3.0/tracks/');
        url.searchParams.set('client_id', JAMENDO_CLIENT_ID);
        url.searchParams.set('format', 'json');
        url.searchParams.set('limit', '8');
        url.searchParams.set('tags', 'workout energetic electronic');
        url.searchParams.set('order', 'popularity_week');
        url.searchParams.set('audioformat', 'mp32');

        const res = await fetch(url.toString());
        const data = await res.json();
        if (!data.results?.length) return [];
        return data.results.map((t: any): Track => ({
            id: String(t.id),
            title: t.name,
            artist: t.artist_name,
            albumImage: t.album_image || t.image || '',
            previewUrl: t.audio || null,
            externalUrl: t.shareurl,
            duration: t.duration * 1000,
            source: 'jamendo',
        }));
    } catch {
        return [];
    }
}

// ─── Public SpotifyService ───────────────────────────────────────────────────

export class SpotifyService {
    static async connect() {
        try {
            const response = await api.get('/music/connect');
            window.location.href = response.data.url;
        } catch (error) {
            console.error('Failed to get auth URL', error);
            throw error;
        }
    }

    static async getAccessToken(): Promise<string> {
        const response = await api.get('/music/token');
        return response.data.access_token;
    }

    static async getUserProfile() {
        const response = await api.get('/music/me');
        return response.data;
    }

    /**
     * Returns { source, tracks[] } where source is 'spotify' | 'jamendo'
     * Always resolves — never throws.
     */
    static async getPlaylists(): Promise<{ source: string; items: Track[] }> {
        try {
            const response = await api.get('/music/playlists?category=workout');
            const data = response.data;

            // Backend backup mode — backend already fetched from Jamendo;
            // call Jamendo directly from the client for richer data (audio URL etc.)
            if (data.source === 'backup') {
                const tracks = await jamendoWorkoutTracks();
                return { source: 'jamendo', items: tracks };
            }

            // Real Spotify playlists — data is the raw array from the backend
            const items: Track[] = Array.isArray(data) ? data : (data.items ?? []);
            return { source: 'spotify', items };
        } catch {
            // Backend unreachable → full Jamendo fallback
            const tracks = await jamendoWorkoutTracks();
            return { source: 'jamendo', items: tracks };
        }
    }

    static async search(query: string): Promise<Track[]> {
        try {
            const response = await api.get(`/music/search?q=${encodeURIComponent(query)}`);
            const data = response.data;
            // If any result has no previewUrl, try to map — Spotify often returns null
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
            throw new Error('empty');
        } catch {
            // Fallback to Jamendo search
            return jamendoSearch(query);
        }
    }

    static async control(action: string) {
        try {
            const response = await api.post('/music/control', { action });
            return response.data;
        } catch (error) {
            console.error('Control action failed', error);
            throw error;
        }
    }
}
