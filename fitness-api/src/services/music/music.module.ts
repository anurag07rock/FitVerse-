import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicController } from './music.controller';
import { SpotifyService } from './spotify.service';
import { JamendoService } from './jamendo.service';
import { User } from '../../auth/entities/user.entity';
import { Playlist } from './entities/playlist.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Playlist]),
        AuthModule,
    ],
    controllers: [MusicController],
    providers: [SpotifyService, JamendoService],
    exports: [SpotifyService],
})
export class MusicModule { }
