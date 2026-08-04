import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('community_comments')
export class CommunityComment {
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

    @Column('text')
    comment: string;

    @CreateDateColumn()
    created_at: Date;
}
