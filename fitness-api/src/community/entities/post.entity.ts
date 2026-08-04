import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { CommunityComment } from './comment.entity';
import { CommunityLike } from './like.entity';

@Entity('community_posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    user_id!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column('text')
    content!: string;

    @Column({ nullable: true })
    image_url?: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany(() => CommunityComment, comment => comment.post)
    comments!: CommunityComment[];

    @OneToMany(() => CommunityLike, like => like.post)
    likes!: CommunityLike[];
}
