import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { Post } from './entities/post.entity';
import { Professional } from './entities/professional.entity';
import { CommunityLike } from './entities/like.entity';
import { CommunityComment } from './entities/comment.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, Professional, CommunityLike, CommunityComment]),
        AuthModule,
    ],
    controllers: [CommunityController],
    providers: [CommunityService],
    exports: [CommunityService],
})
export class CommunityModule { }
