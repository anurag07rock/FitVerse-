import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Zone } from '../../workout/entities/zone.entity';

@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'uuid', nullable: true })
    zone_id: string;

    @ManyToOne(() => Zone)
    @JoinColumn({ name: 'zone_id' })
    zone: Zone;

    @Column({ nullable: true })
    primary_muscle: string;

    @Column({ nullable: true })
    secondary_muscle: string;

    @Column({ nullable: true })
    equipment: string;

    @Column({
        type: 'enum',
        enum: ['beginner', 'intermediate', 'advanced'],
        nullable: true
    })
    difficulty: string;

    @Column({
        type: 'enum',
        enum: ['home', 'gym', 'both'],
        nullable: true
    })
    environment: string;

    @Column({ type: 'text', nullable: true })
    thumbnail_url: string;

    @Column({ type: 'text', nullable: true })
    preview_video_url: string;

    @Column({ type: 'int', nullable: true })
    calories_per_10min: number;

    @Column({ type: 'int', nullable: true })
    avg_duration_min: number;

    @Column({ default: false })
    is_compound: boolean;

    @Column({ default: false })
    is_injury_friendly: boolean;

    @Column({ type: 'text', nullable: true })
    demo_video_url: string;

    @Column({ type: 'jsonb', nullable: true })
    steps: {
        step_1_start: string;
        step_2_execution: string;
        step_3_breathing: string;
        step_4_completion: string;
    };

    @Column({ type: 'text', nullable: true })
    common_mistakes: string;

    @Column({ type: 'text', nullable: true })
    safety_tips: string;

    @Column({ type: 'text', nullable: true })
    trainer_advice: string;

    @CreateDateColumn()
    created_at: Date;
}
