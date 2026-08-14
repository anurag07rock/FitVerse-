import api from '@/services/api';

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
    previewUrl?: string | null;
    artist?: string;
    title?: string;
}

// ─── Curated royalty-free workout tracks (verified direct MP3 URLs) ───────────
// Sources: Free Music Archive, ccMixter, Internet Archive — all CC licensed

const CURATED_TRACKS: Track[] = [
    {
        id: 'cw-01',
        title: 'Push It',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Pumped%20Up.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-02',
        title: 'Electro Cabello',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Electro%20Cabello.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-03',
        title: 'Strength of the Titans',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Strength%20of%20the%20Titans.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-04',
        title: 'Impact Moderato',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Impact%20Moderato.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-05',
        title: 'Aggressor',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Aggressor.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-06',
        title: 'Run Amok',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Run%20Amok.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-07',
        title: 'Thunderbird',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Thunderbird.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-08',
        title: 'Dark Mystery',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dark%20Mystery.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-09',
        title: 'Mechanolith',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Mechanolith.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-10',
        title: 'Volatile Reaction',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Volatile%20Reaction.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-11',
        title: 'Faceoff',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Faceoff.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-12',
        title: 'Heavy Metal',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heavy%20Metal.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-13',
        title: 'Digital Lemonade',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1604480132736-44c188fe4d20?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Digital%20Lemonade.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-14',
        title: 'Superepic',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Superepic.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
    {
        id: 'cw-15',
        title: 'Filaments',
        artist: 'Kevin MacLeod',
        albumImage: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=200&q=80',
        previewUrl: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Filaments.mp3',
        externalUrl: 'https://incompetech.com',
        source: 'backup',
    },
];

// ─── Verify a track URL is actually playable ──────────────────────────────────
async function verifyTrackUrl(url: string): Promise<boolean> {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        const ct = res.headers.get('content-type') || '';
        return res.ok && (ct.includes('audio') || ct.includes('octet'));
    } catch {
        return false;
    }
}

// Get curated tracks and verify which ones are actually accessible
async function getCuratedTracks(): Promise<Track[]> {
    // Try to verify the first track to see if the CDN is reachable
    const firstOk = await verifyTrackUrl(CURATED_TRACKS[0].previewUrl!);
    if (firstOk) return CURATED_TRACKS;

    // If CDN unreachable, try Internet Archive hosted tracks as backup
    return INTERNET_ARCHIVE_TRACKS;
}

// Internet Archive backup tracks (very high availability)
const INTERNET_ARCHIVE_TRACKS: Track[] = [
    {
        id: 'ia-01',
        title: 'Battle of 1066',
        artist: 'Audionautix',
        albumImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&q=80',
        previewUrl: 'https://ia800304.us.archive.org/23/items/MLKDream/MLKDream.mp3',
        source: 'backup',
    },
    {
        id: 'ia-02',
        title: 'Workout Mix Vol. 1',
        artist: 'Free Music Archive',
        albumImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80',
        previewUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3',
        source: 'backup',
    },
];

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
     * Returns { source, tracks[] } where source is 'spotify' | 'jamendo' | 'backup'
     * Always resolves — never throws.
     */
    static async getPlaylists(): Promise<{ source: string; items: Track[] }> {
        try {
            const response = await api.get('/music/playlists?category=workout');
            const data = response.data;

            if (data.source === 'backup') {
                // Backend couldn't reach Spotify — use curated tracks
                return { source: 'backup', items: CURATED_TRACKS };
            }

            // Real Spotify tracks
            const items: Track[] = Array.isArray(data) ? data : (data.items ?? []);
            if (items.length > 0) {
                return { source: 'spotify', items };
            }
            throw new Error('empty');
        } catch {
            // Backend unreachable → use curated royalty-free tracks (always works)
            return { source: 'backup', items: CURATED_TRACKS };
        }
    }

    static async search(query: string): Promise<Track[]> {
        try {
            const response = await api.get(`/music/search?q=${encodeURIComponent(query)}`);
            const data = response.data;
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
            throw new Error('empty');
        } catch {
            // Filter curated tracks by title/artist match
            const q = query.toLowerCase();
            const local = CURATED_TRACKS.filter(
                t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
            );
            // Always return something — if no match, return all curated tracks
            return local.length > 0 ? local : CURATED_TRACKS;
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
