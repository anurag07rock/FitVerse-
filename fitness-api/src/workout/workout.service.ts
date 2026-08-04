import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workout } from './entities/workout.entity';
import { WorkoutProgress } from './entities/progress.entity';
import { ExerciseService } from '../exercise/exercise.service';
import { In } from 'typeorm';

@Injectable()
export class WorkoutService {
    constructor(
        @InjectRepository(Workout)
        private workoutRepository: Repository<Workout>,
        @InjectRepository(WorkoutProgress)
        private progressRepository: Repository<WorkoutProgress>,
        private exerciseService: ExerciseService,
    ) { }

    async findAll(params: { zoneName?: string, category?: string, title?: string }) {
        const query = this.workoutRepository.createQueryBuilder('workout')
            .leftJoinAndSelect('workout.zone', 'zone');

        if (params.zoneName && params.zoneName !== 'All Access') {
            query.andWhere('zone.name = :zoneName', { zoneName: params.zoneName });
        }

        if (params.category) {
            query.andWhere('workout.category = :category', { category: params.category });
        }

        if (params.title) {
            query.andWhere('workout.title ILIKE :title', { title: `%${params.title}%` });
        }

        return query.getMany();
    }


    async findOne(id: string) {
        const workout = await this.workoutRepository.findOne({
            where: { id },
            relations: ['zone']
        });

        if (!workout) {
            throw new NotFoundException(`Workout with ID ${id} not found`);
        }

        // Hydrate exercises if they exist
        if (workout.exercise_order && workout.exercise_order.length > 0) {
            const allExercises = await this.exerciseService.findAll({
                ids: workout.exercise_order
            });

            // Re-order exercises based on exercise_order array
            (workout as any).exercises = workout.exercise_order.map(exId =>
                allExercises.find(f => f.id === exId)
            ).filter(Boolean);
        } else {
            (workout as any).exercises = [];
        }

        return workout;
    }

    async logStart(userId: string, workoutId: string) {
        console.log(`User ${userId} started workout ${workoutId}`);
        return { status: 'session_initiated', timestamp: new Date() };
    }

    async logCompletion(userId: string, workoutId: string, data: { duration: number; calories: number }) {
        const progress = this.progressRepository.create({
            user_id: userId,
            workout_id: workoutId,
            duration_completed_min: data.duration,
            calories_burned: data.calories,
        });

        await this.progressRepository.save(progress);

        return { status: 'success', progressId: progress.id };
    }
}

