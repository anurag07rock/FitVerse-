import { Module } from '@nestjs/common';
import { YogaController } from './yoga.controller';
import { WorkoutModule } from '../workout/workout.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [WorkoutModule, AuthModule],
    controllers: [YogaController],
})
export class YogaModule { }
