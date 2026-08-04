import { Controller, Get, Post, Param, Body, UseGuards, Query, Req } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workouts')
export class WorkoutController {
    constructor(private readonly workoutService: WorkoutService) { }

    @Get()
    async getAllWorkouts(@Query('zone') zone?: string, @Query('category') category?: string) {
        return this.workoutService.findAll({ zoneName: zone, category });
    }

    @Get(':id')
    async getWorkoutById(@Param('id') id: string) {
        return this.workoutService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/start')
    async startWorkout(@Param('id') id: string, @Req() req: any) {
        return this.workoutService.logStart(req.user.sub, id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/complete')
    async completeWorkout(
        @Param('id') id: string,
        @Req() req: any,
        @Body() completionData: { duration: number; calories: number }
    ) {
        return this.workoutService.logCompletion(req.user.sub, id, completionData);
    }
}

