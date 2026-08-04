import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('community_likes')
@Unique(['post_id', 'user_id'])
export class CommunityLike {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    post_id: string;

    @ManyToOne(() => Post)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @Column({ type: 'uuid' })
    user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn()
    created_at: Date;
}
