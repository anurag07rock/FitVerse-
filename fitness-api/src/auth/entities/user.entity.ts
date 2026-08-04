import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password_hash: string;

    @Column({ nullable: true })
    full_name: string;

    @Column({ nullable: true })
    spotify_id: string;

    @Column({ type: 'text', nullable: true })
    spotify_refresh_token: string;

    @Column({ default: 0 })
    current_streak: number;

    @CreateDateColumn()
    created_at: Date;
}
