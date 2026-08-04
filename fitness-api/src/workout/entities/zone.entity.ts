import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Workout } from './workout.entity';

@Entity('zones')
export class Zone {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    theme_color: string;

    @OneToMany(() => Workout, workout => workout.zone)
    workouts: Workout[];
}
