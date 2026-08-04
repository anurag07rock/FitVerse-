import { Controller, Get, Post, Body, UseGuards, Query, Req } from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('community')
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }

    @Get('feed')
    async getFeed(@Query('page') page: number = 1) {
        return this.communityService.getPaginatedFeed(Number(page));
    }

    @UseGuards(JwtAuthGuard)
    @Post('post')
    async createPost(@Body() postData: { content: string; image_url?: string }, @Req() req: any) {
        return this.communityService.createPost(req.user.sub, postData);
    }

    @Get('professionals')
    async getProfessionals() {
        return this.communityService.getAllProfessionals();
    }

    @UseGuards(JwtAuthGuard)
    @Post('like')
    async toggleLike(@Body('post_id') postId: string, @Req() req: any) {
        return this.communityService.toggleLike(req.user.sub, postId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('comment')
    async createComment(@Body() data: { post_id: string; comment: string }, @Req() req: any) {
        return this.communityService.createComment(req.user.sub, data.post_id, data.comment);
    }
}


