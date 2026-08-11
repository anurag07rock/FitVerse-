import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class SpotifyService {
    private readonly clientId = process.env.SPOTIFY_CLIENT_ID;
    private readonly clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    private readonly redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/music/callback`;

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    getAuthorizationUrl(userId: string) {
        if (!this.clientId) return '#error_no_client_id';
        const scopes = [
            'user-read-private',
            'user-read-email',
            'user-modify-playback-state',
            'user-read-playback-state',
            'playlist-read-private',
            'user-top-read'
        ];
        return `https://accounts.spotify.com/authorize?response_type=code&client_id=${this.clientId}&scope=${encodeURIComponent(scopes.join(' '))}&redirect_uri=${encodeURIComponent(this.redirectUri)}&state=${userId}`;
    }

    async getNewAccessToken(userId: string) {
        return this.refreshAccessToken(userId);
    }

    async getUserProfile(userId: string) {
        const token = await this.refreshAccessToken(userId);
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }

    async refreshAccessToken(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.spotify_refresh_token) {
            throw new HttpException('Spotify not connected', HttpStatus.UNAUTHORIZED);
        }

        const params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', user.spotify_refresh_token);

        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
                },
            });
            return response.data.access_token;
        } catch (error) {
            throw new HttpException('Failed to refresh Spotify token', HttpStatus.BAD_REQUEST);
        }
    }

    async getAccessToken(code: string) {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', this.redirectUri);

        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
                },
            });
            return response.data;
        } catch (error) {
            throw new HttpException('Failed to authenticate with Spotify', HttpStatus.BAD_REQUEST);
        }
    }

    async searchTracks(userId: string, query: string) {
        const accessToken = await this.refreshAccessToken(userId);
        try {
            const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return response.data.tracks.items.map(track => ({
                id: track.id,
                title: track.name,
                artist: track.artists.map(a => a.name).join(', '),
                albumImage: track.album.images[0]?.url,
                previewUrl: track.preview_url,
                externalUrl: track.external_urls.spotify,
                duration: track.duration_ms,
                source: 'spotify'
            }));
        } catch (error) {
            throw error;
        }
    }

    async getWorkoutPlaylists(userId: string, category: string = 'workout') {
        const accessToken = await this.refreshAccessToken(userId);
        try {
            const response = await axios.get(`https://api.spotify.com/v1/browse/categories/${category}/playlists?limit=6`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return response.data.playlists.items;
        } catch (error) {
            // Fallback to general playlists if category fails
            const response = await axios.get(`https://api.spotify.com/v1/me/playlists?limit=6`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return response.data.items;
        }
    }

    async proxyCommand(userId: string, action: string) {
        const accessToken = await this.refreshAccessToken(userId);
        const endpointMap = {
            'play': 'https://api.spotify.com/v1/me/player/play',
            'pause': 'https://api.spotify.com/v1/me/player/pause',
            'next': 'https://api.spotify.com/v1/me/player/next',
            'prev': 'https://api.spotify.com/v1/me/player/previous'
        };

        const url = endpointMap[action];
        if (!url) throw new HttpException('Invalid Spotify Action', HttpStatus.BAD_REQUEST);

        try {
            await axios({
                method: action === 'play' || action === 'pause' ? 'PUT' : 'POST',
                url,
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return { status: 'success', action };
        } catch (error) {
            throw new HttpException(`Spotify Control Failed`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCurrentUser(accessToken: string) {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    }
}
