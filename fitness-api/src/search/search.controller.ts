import { Controller, Get, Query } from '@nestjs/common';
import { ExerciseService } from '../exercise/exercise.service';
import { WorkoutService } from '../workout/workout.service';

@Controller('search')
export class SearchController {
    constructor(
        private readonly exerciseService: ExerciseService,
        private readonly workoutService: WorkoutService,
    ) { }

    @Get()
    async globalSearch(@Query('q') query: string) {
        if (!query || query.length < 2) return { exercises: [], workouts: [] };

        // Grouping results by type as requested
        const [exercises, workouts] = await Promise.all([
            this.exerciseService.findAll({ name: query }),
            this.workoutService.findAll({ title: query })
        ]);


        return {
            exercises,
            workouts,
            yoga: workouts.filter(w => w.zone?.name === 'Yoga Flow')
        };

    }
}
