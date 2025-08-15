import { Injectable } from '@angular/core';
import { ApiConnectionService } from '../services/api-connection.service';
import { Observable, catchError, of } from 'rxjs';
import { PlaylistDto, CreatePlaylistDto, UpdatePlaylistDto } from '../models/playlists.model';
import { environment } from '../../environments/environment';
import { ApiRoutes } from '../config/route-paths';
import { BriefSongDTO } from '../models/song.model';
import { AlbumsService } from './albums.service';
import { NotificationService } from './notification.service';
import { NotificationMessages } from '../constants/notification-messages';

export interface PlaylistSongInPlaylist {
  songId: number;
  position: number;
  songTitle: string;
}

export interface PlaylistAlbumInPlaylist {
  id?: number;
  title?: string;
  artistId?: number;
  albumId?: number;
  albumTitle?: string;
  position?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private readonly apiUrl = environment.apiUrl;

  constructor(private apiConnection: ApiConnectionService, private albumsService: AlbumsService, private notification: NotificationService) {}

  getAllPlaylists(): Observable<PlaylistDto[]> {
    return this.apiConnection.get<PlaylistDto[]>(`${ApiRoutes.playlists}`);
  }

  getPlaylistById(id: number): Observable<PlaylistDto> {
    return this.apiConnection.get<PlaylistDto>(`${ApiRoutes.playlists}/${id}`);
  }

  createPlaylist(dto: CreatePlaylistDto): Observable<PlaylistDto> {
    return this.apiConnection.post<PlaylistDto>(`${ApiRoutes.playlists}`, dto);
  }

  updatePlaylistName(id: number, newName: string): Observable<void> {
   return this.apiConnection.put<void>(`${ApiRoutes.playlists}/${id}/name`, `"${newName}"`, true);
  }

  deletePlaylist(id: number): Observable<void> {
    return this.apiConnection.delete<void>(`${ApiRoutes.playlists}/${id}`);
  }

  getPublicPlaylists(): Observable<PlaylistDto[]> {
    return this.apiConnection.get<PlaylistDto[]>(`${ApiRoutes.playlists}/public`);
  }

  getPrivatePlaylists(): Observable<PlaylistDto[]> {
    return this.apiConnection.get<PlaylistDto[]>(`${ApiRoutes.playlists}/private`);
  }
  
  getFollowedPlaylists(userId: number): Observable<PlaylistDto[]> {
    return this.apiConnection.get<PlaylistDto[]>(`${ApiRoutes.playlists}/followed/${userId}`, true);
  }

  followPlaylist(playlistId: number, userId: number): Observable<any> {
    return this.apiConnection.post<any>(`${ApiRoutes.playlists}/${playlistId}/follow/${userId}`, null, true).pipe(
      catchError((error) => {
        this.notification.error(NotificationMessages.playlist.followError);
        return of();
      })
    );
  }

  unfollowPlaylist(playlistId: number, userId: number): Observable<any> {
    return this.apiConnection.post<any>(`${ApiRoutes.playlists}/${playlistId}/unfollow/${userId}`, null, true).pipe(
      catchError((error) => {
        this.notification.error(NotificationMessages.playlist.unfollowError);
        return of();
      })
    );
  }

  searchPlaylistsByName(name: string): Observable<PlaylistDto[]> {
    return this.apiConnection.get<PlaylistDto[]>(`${ApiRoutes.playlists}/search`, true, { name });
  }

  getPublicPlaylistsByUser(userId: number): Observable<PlaylistDto[]> {
    return this.apiConnection.get<PlaylistDto[]>(`${ApiRoutes.playlists}/public/user/${userId}`);
  }
 

  addSongToPlaylist(playlistId: number, songId: number): Observable<void> {
    return this.apiConnection.post<void>(`${ApiRoutes.playlists}/${playlistId}/songs`, songId, true);
  }
  removeSongFromPlaylist(playlistId: number, songId: number): Observable<void> {
    return this.apiConnection.delete<void>(`${ApiRoutes.playlists}/${playlistId}/songs/${songId}`, true);
  }
  getSongsInPlaylist(playlistId: number): Observable<PlaylistSongInPlaylist[]> {
    return this.apiConnection.get<PlaylistSongInPlaylist[]>(`${ApiRoutes.playlists}/${playlistId}/songs`, true);
  }

  addAlbumToPlaylist(playlistId: number, albumId: number): Observable<void> {
    return this.apiConnection.post<void>(`${ApiRoutes.playlists}/${playlistId}/albums/${albumId}`, {}, true).pipe(
      catchError((error) => {
        if (error.status === 400) {
          alert(error.error?.error || 'Failed to add album to playlist');
        }
        return of();
      })
    );
  }

  removeAlbumFromPlaylist(playlistId: number, albumId: number): Observable<void> {
    return this.apiConnection.delete<void>(`${ApiRoutes.playlists}/${playlistId}/albums/${albumId}`, true).pipe(
      catchError((error) => {
        if (error.status === 400) {
          alert(error.error?.error || 'Failed to remove album from playlist');
        }
        return of();
      })
    );
  }

  getAlbumsInPlaylist(playlistId: number): Observable<PlaylistAlbumInPlaylist[]> {
    return this.apiConnection.get<PlaylistAlbumInPlaylist[]>(`${ApiRoutes.playlists}/${playlistId}/albums`, true).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of([]); // treat as empty
        }
        if (error.status === 400) {
          alert(error.error?.error || 'Failed to load albums in playlist');
          return of([]);
        }
        return of([]);
      })
    );
  }

  updatePlaylistSongsOrder(playlistId: number, songIdsInOrder: number[]): Observable<void> {
    return this.apiConnection.post<void>(`${ApiRoutes.playlists}/${playlistId}/songs/order`, songIdsInOrder, true);
  }
}
