import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExerciseService {
    constructor(
        @InjectRepository(Exercise)
        private exerciseRepository: Repository<Exercise>,
    ) { }

    async findAll(query?: { name?: string; zone_id?: string; difficulty?: string; ids?: string[] }) {
        if (query?.ids && query.ids.length > 0) {
            return this.exerciseRepository.find({
                where: { id: In(query.ids) },
                relations: ['zone']
            });
        }

        const where: any = {};
        if (query?.name) where.name = ILike(`%${query.name}%`);
        if (query?.zone_id) where.zone_id = query.zone_id;
        if (query?.difficulty) where.difficulty = query.difficulty;

        return this.exerciseRepository.find({
            where,
            relations: ['zone'],
            order: { name: 'ASC' }
        });
    }

    async findOne(id: string) {
        const exercise = await this.exerciseRepository.findOne({
            where: { id },
            relations: ['zone']
        });
        if (!exercise) throw new NotFoundException('Exercise not found');
        return exercise;
    }

    async create(data: Partial<Exercise>) {
        const exercise = this.exerciseRepository.create(data);
        return this.exerciseRepository.save(exercise);
    }
}
