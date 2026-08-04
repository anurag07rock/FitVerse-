import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Zone } from '../../../workout/entities/zone.entity';

@Entity('playlists')
export class Playlist {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    spotify_playlist_id: string;

    @Column({ type: 'uuid', nullable: true })
    zone_id: string;

    @ManyToOne(() => Zone)
    @JoinColumn({ name: 'zone_id' })
    zone: Zone;

    @Column({ nullable: true })
    thumbnail_url: string;

    @CreateDateColumn()
    created_at: Date;
}
