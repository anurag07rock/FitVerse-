import api from '@/services/api';

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

    static async getAccessToken() {
        try {
            const response = await api.get('/music/token');
            return response.data.access_token;
        } catch (error) {
            console.error('Failed to fetch access token', error);
            throw error;
        }
    }

    static async getUserProfile() {
        try {
            const response = await api.get('/music/me');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user profile', error);
            throw error;
        }
    }

    static async getPlaylists(category: string = 'workout') {
        try {
            const response = await api.get(`/music/playlists?category=${category}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch playlists', error);
            throw error;
        }
    }

    static async search(query: string) {
        try {
            const response = await api.get(`/music/search?q=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error) {
            console.error('Search failed', error);
            throw error;
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
