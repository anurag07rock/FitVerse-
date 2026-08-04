import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('professionals')
export class Professional {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: true })
    user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    name: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ type: 'int', nullable: true })
    experience_years: number;

    @Column({ nullable: true })
    specialization: string;

    @Column({ nullable: true })
    profile_image_url: string;

    @Column({ default: false })
    verified_status: boolean;

    @Column({ type: 'decimal', precision: 3, scale: 2, default: 5.0 })
    rating: number;

    @CreateDateColumn()
    created_at: Date;
}
