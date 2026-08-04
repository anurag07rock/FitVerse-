import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutController } from './workout.controller';
import { WorkoutService } from './workout.service';
import { Workout } from './entities/workout.entity';
import { WorkoutProgress } from './entities/progress.entity';
import { Zone } from './entities/zone.entity';
import { AuthModule } from '../auth/auth.module';
import { ExerciseModule } from '../exercise/exercise.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Workout, WorkoutProgress, Zone]),
        AuthModule,
        ExerciseModule,
    ],
    controllers: [WorkoutController],
    providers: [WorkoutService],
    exports: [WorkoutService],
})
export class WorkoutModule { }
