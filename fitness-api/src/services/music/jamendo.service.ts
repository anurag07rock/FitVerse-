import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class JamendoService {
    private readonly clientId = process.env.JAMENDO_CLIENT_ID || '56d30cce'; // Default dev client id if not set

    async searchTracks(query: string) {
        try {
            const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/`, {
                params: {
                    client_id: this.clientId,
                    format: 'json',
                    limit: 10,
                    search: query.replace(/\s/g, '+'),
                    include: 'musicinfo',
                    audioformat: 'mp32'
                }
            });

            return response.data.results.map(track => ({
                id: track.id,
                title: track.name,
                artist: track.artist_name,
                albumImage: track.album_image || track.image,
                previewUrl: track.audio,
                externalUrl: track.shareurl,
                duration: track.duration * 1000,
                source: 'backup'
            }));
        } catch (error) {
            console.error('Jamendo API Error:', error);
            return []; // Return empty if even fallback fails
        }
    }

    async getWorkoutPlaylists() {
        try {
            const response = await axios.get(`https://api.jamendo.com/v3.0/tracks/`, {
                params: {
                    client_id: this.clientId,
                    format: 'json',
                    limit: 6,
                    tags: 'workout,energetic,electronic',
                    order: 'popularity_week'
                }
            });

            return response.data.results.map(track => ({
                id: track.id,
                name: track.name,
                images: [{ url: track.album_image || track.image }],
                tracks: { total: 1 },
                source: 'backup'
            }));
        } catch (error) {
            return [];
        }
    }
}
