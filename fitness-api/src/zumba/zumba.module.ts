import { Module } from '@nestjs/common';
import { ZumbaController } from './zumba.controller';
import { WorkoutModule } from '../workout/workout.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [WorkoutModule, AuthModule],
    controllers: [ZumbaController],
})
export class ZumbaModule { }
