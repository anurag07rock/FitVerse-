import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Exercise } from './entities/exercise.entity';

@Controller('exercises')
export class ExerciseController {
    constructor(private exerciseService: ExerciseService) { }

    @Get()
    async findAll(
        @Query('name') name?: string,
        @Query('zone_id') zone_id?: string,
        @Query('difficulty') difficulty?: string,
    ) {
        return this.exerciseService.findAll({ name, zone_id, difficulty });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.exerciseService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() body: Partial<Exercise>) {
        return this.exerciseService.create(body);
    }
}
