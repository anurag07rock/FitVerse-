import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Modules
import { AuthModule } from './auth/auth.module';
import { WorkoutModule } from './workout/workout.module';
import { ExerciseModule } from './exercise/exercise.module';
import { MusicModule } from './services/music/music.module';
import { CommunityModule } from './community/community.module';
import { SearchModule } from './search/search.module';
import { YogaModule } from './yoga/yoga.module';
import { ZumbaModule } from './zumba/zumba.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: false, // Production safety: use migrations
        }),
        AuthModule,
        WorkoutModule,
        ExerciseModule,
        MusicModule,
        CommunityModule,
        SearchModule,
        YogaModule,
        ZumbaModule,
    ],
})

export class AppModule { }

