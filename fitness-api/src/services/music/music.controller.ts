import { Controller, Get, Post, Body, UseGuards, Query, Req, Res } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { JamendoService } from './jamendo.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Controller('music')
export class MusicController {
    constructor(
        private readonly spotifyService: SpotifyService,
        private readonly jamendoService: JamendoService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    @Get('connect')
    @UseGuards(JwtAuthGuard)
    async getAuthUrl(@Req() req: any) {
        return { url: this.spotifyService.getAuthorizationUrl(req.user.sub) };
    }

    @Get('token')
    @UseGuards(JwtAuthGuard)
    async getToken(@Req() req: any) {
        const token = await this.spotifyService.getNewAccessToken(req.user.sub);
        return { access_token: token };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Req() req: any) {
        return this.spotifyService.getUserProfile(req.user.sub);
    }

    @Get('callback')
    async handleCallback(@Query('code') code: string, @Query('state') userId: string, @Res() res: Response) {
        try {
            const tokens = await this.spotifyService.getAccessToken(code);
            const spotifyUser = await this.spotifyService.getCurrentUser(tokens.access_token);

            // Link the refresh token and Spotify ID to the authenticated user
            if (userId) {
                await this.userRepository.update(userId, {
                    spotify_refresh_token: tokens.refresh_token,
                    spotify_id: spotifyUser.id
                });
            }

            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return res.redirect(`${frontendUrl}/music?status=connected`);
        } catch (error) {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
            return res.redirect(`${frontendUrl}/music?status=error`);
        }
    }

    @Get('playlists')
    @UseGuards(JwtAuthGuard)
    async getPlaylists(@Req() req: any, @Query('category') category: string) {
        try {
            return await this.spotifyService.getWorkoutPlaylists(req.user.sub, category);
        } catch (error) {
            console.warn('Spotify failed, switching to backup engine...');
            return {
                source: 'backup',
                items: await this.jamendoService.getWorkoutPlaylists(),
                message: 'Using backup music source'
            };
        }
    }

    @Get('search')
    @UseGuards(JwtAuthGuard)
    async search(@Req() req: any, @Query('q') query: string) {
        if (!query) return [];
        try {
            return await this.spotifyService.searchTracks(req.user.sub, query);
        } catch (error) {
            console.warn('Spotify search failed, switching to backup engine...');
            return await this.jamendoService.searchTracks(query);
        }
    }

    @Post('control')
    @UseGuards(JwtAuthGuard)
    async playerControl(@Body() controlData: { action: string }, @Req() req: any) {
        try {
            return await this.spotifyService.proxyCommand(req.user.sub, controlData.action);
        } catch (error) {
            return { status: 'error', message: 'Spotify device not active' };
        }
    }

    @Post('recommend')
    @UseGuards(JwtAuthGuard)
    async getRecommendation(@Body('zone') zone: string) {
        // Fallback-safe recommendation logic could go here
        return { playlistId: '37i9dQZF1DXcBWIGoYBM3M' }; // Default fallback
    }
}
