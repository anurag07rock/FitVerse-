import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('workout_progress')
export class WorkoutProgress {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'uuid' })
    workout_id: string;

    @Column({ type: 'int' })
    duration_completed_min: number;

    @Column({ type: 'int' })
    calories_burned: number;

    @CreateDateColumn()
    completed_at: Date;
}
