import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WorkoutService } from '../workout/workout.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('yoga')
@UseGuards(JwtAuthGuard)
export class YogaController {
    constructor(private readonly workoutService: WorkoutService) { }

    @Get('flows')
    async getAllFlows() {
        // Use the new category system for consistent filtering
        return this.workoutService.findAll({ category: 'yoga' });
    }

    @Get('flows/:id')
    async getFlowById(@Param('id') id: string) {
        const flow = await this.workoutService.findOne(id);
        // Add sequencing metadata for transition logic
        return {
            ...flow,
            transitions: {
                type: 'smooth',
                duration: 3000 // 3 seconds transition between poses
            }
        };
    }
}
