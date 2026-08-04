import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Professional } from './entities/professional.entity';
import { CommunityLike } from './entities/like.entity';
import { CommunityComment } from './entities/comment.entity';

@Injectable()
export class CommunityService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,

        @InjectRepository(Professional)
        private profRepository: Repository<Professional>,

        @InjectRepository(CommunityLike)
        private likeRepository: Repository<CommunityLike>,

        @InjectRepository(CommunityComment)
        private commentRepository: Repository<CommunityComment>,
    ) { }

    async getPaginatedFeed(page: number, limit: number = 20) {
        return this.postRepository.find({
            relations: ['user', 'likes', 'likes.user', 'comments', 'comments.user'],
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async createPost(userId: string, data: { content: string; image_url?: string }) {
        const post = this.postRepository.create({
            user_id: userId,
            content: data.content,
            image_url: data.image_url,
        });
        return this.postRepository.save(post);
    }

    async getAllProfessionals() {
        return this.profRepository.find({
            where: { verified_status: true },
            order: { rating: 'DESC' },
        });
    }

    async toggleLike(userId: string, postId: string) {
        const existing = await this.likeRepository.findOne({ where: { user_id: userId, post_id: postId } });
        if (existing) {
            await this.likeRepository.remove(existing);
            return { liked: false };
        }
        const like = this.likeRepository.create({ user_id: userId, post_id: postId });
        await this.likeRepository.save(like);
        return { liked: true };
    }

    async createComment(userId: string, postId: string, commentText: string) {
        const comment = this.commentRepository.create({
            user_id: userId,
            post_id: postId,
            comment: commentText,
        });
        return this.commentRepository.save(comment);
    }
}
