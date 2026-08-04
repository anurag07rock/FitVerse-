import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Zone } from './zone.entity';

@Entity('workouts')
export class Workout {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'uuid' })
    zone_id!: string;

    @ManyToOne(() => Zone)
    @JoinColumn({ name: 'zone_id' })
    zone!: Zone;

    @Column({ type: 'jsonb', nullable: true })
    exercise_order?: string[];

    @Column({ type: 'int', nullable: true })
    total_duration_min?: number;

    @Column({ type: 'int', nullable: true })
    estimated_calories?: number;

    @Column({ nullable: true })
    hero_thumbnail_url?: string;

    @Column({
        type: 'enum',
        enum: ['strength', 'cardio', 'yoga', 'zumba', 'home', 'stretching'],
        default: 'strength'
    })
    category!: string;

    @Column({ type: 'text', nullable: true })
    equipment_required?: string;

    @Column({ nullable: true })
    difficulty?: string; // Beginner, Intermediate, Advanced - Focus on beginner guidance as per requirement.

    @CreateDateColumn()
    created_at!: Date;
}
