import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SongService } from './song.service';
import { AlbumsService } from './albums.service';
import { ArtistsService } from './artist.service';
import { PlaylistService } from './playlists.service';
import { UserService } from './user.service';

import { BriefSongDTO } from '../models/song.model';
import { Album } from '../models/albums.model';
import { Artist } from '../models/artist.model';
import { PlaylistDto } from '../models/playlists.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(
    private songService: SongService,
    private albumService: AlbumsService,
    private artistService: ArtistsService,
    private playlistService: PlaylistService,
    private userService: UserService
  ) {}

  search(query: string): Observable<{
    songs: BriefSongDTO[];
    albums: Album[];
    artists: Artist[];
    playlists: PlaylistDto[];
    users: User[];
  }> {
    return forkJoin({
      songs: this.songService.getAll().pipe(
        map(songs => songs.filter(song =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          (song.artistsStageName && song.artistsStageName.join(', ').toLowerCase().includes(query.toLowerCase()))
        )),
        catchError(err => {
          console.error('Songs error', err);
          return of([]);
        })
      ),
      albums: this.albumService.searchAlbum(query).pipe(
        catchError(err => {
          console.error('Albums error', err);
          return of([]);
        })
      ),
      artists: this.artistService.search(query).pipe(
        catchError(err => {
          console.error('Artists error', err);
          return of([]);
        })
      ),
      playlists: this.playlistService.searchPlaylistsByName(query).pipe(
        catchError(err => {
          console.error('Playlists error', err);
          return of([]);
        })
      ),
      users: this.userService.searchUsers(query).pipe(
        catchError(err => {
          console.error('Users error', err);
          return of([]);
        })
      )
    }).pipe(
      map(results => ({
        songs: results.songs || [],
        albums: results.albums || [],
        artists: results.artists || [],
        playlists: results.playlists || [],
        users: results.users || []
      }))
    );
  }
}
