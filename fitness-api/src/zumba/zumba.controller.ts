import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WorkoutService } from '../workout/workout.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('zumba')
@UseGuards(JwtAuthGuard)
export class ZumbaController {
    constructor(private readonly workoutService: WorkoutService) { }

    @Get('routines')
    async getAllRoutines() {
        return this.workoutService.findAll({ category: 'zumba' });
    }

    @Get('routines/:id')
    async getRoutineById(@Param('id') id: string) {
        const routine = await this.workoutService.findOne(id);
        return {
            ...routine,
            music_sync: true,
            vibe: 'high-energy'
        };
    }
}
