import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { ExerciseModule } from '../exercise/exercise.module';
import { WorkoutModule } from '../workout/workout.module';

@Module({
    imports: [ExerciseModule, WorkoutModule],
    controllers: [SearchController],
})
export class SearchModule { }
