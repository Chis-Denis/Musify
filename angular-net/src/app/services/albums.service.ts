import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Album, AlbumSong } from '../models/albums.model';
import { Observable } from 'rxjs';
import { ApiRoutes } from '../config/route-paths';
import { ApiConnectionService } from './api-connection.service';
import { BriefSongDTO } from '../models/song.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  constructor(private apiConnectionService: ApiConnectionService) { }

  getAll(): Observable<Album[]> {
    return this.apiConnectionService.get<Album[]>(`${ApiRoutes.albums}`);
  }

  getById(id: number): Observable<Album>{
    return this.apiConnectionService.get<Album>(`${ApiRoutes.albums}/${id}`);
  }

  searchAlbumGenre(query : string): Observable<Album[]>{
    return this.apiConnectionService.get<Album[]>(`${ApiRoutes.albums}/searchGenre`, false, { query: query });  
  }

  searchAlbum(query : string): Observable<Album[]>{
      return this.apiConnectionService.get<Album[]>(`${ApiRoutes.albums}/search`, false, { query: query }).pipe(
        map(albums => albums.map(a => new Album(a)))
      );
  }

  getArtistAlbums(id:number): Observable<Album[]>{
    return this.apiConnectionService.get<Album[]>(`${ApiRoutes.albums}/artist/${id}`);
  }

  getAlbumSongs(id: number): Observable<BriefSongDTO[]> {
    return this.apiConnectionService.get<BriefSongDTO[]>(`${ApiRoutes.albums}/${id}/songs`);
  }

  createAlbum(album: Album){
    return this.apiConnectionService.post(`${ApiRoutes.albums}`, album);
  }

  deleteAlbum(id: number){
    return this.apiConnectionService.delete(`${ApiRoutes.albums}/${id}`);
  }

  updateAlbum(album: Album){
    return this.apiConnectionService.put(`${ApiRoutes.albums}`, album);
  }

  addAlbumSong(albumSong: AlbumSong){
    return this.apiConnectionService.post(`${ApiRoutes.albums}/addSong`,
      {
        AlbumId: albumSong.albumId,
        SongId: albumSong.songId,
        Position: albumSong.position 
        
      }
    )
  }

  deleteAlbumSong(albumSong: AlbumSong){
    return this.apiConnectionService.delete(`${ApiRoutes.albums}/deleteSong`,  true, {
        AlbumId: albumSong.albumId,
         SongId: albumSong.songId 
        });
  }

  updateAlbumSong(albumSong: AlbumSong){
    return this.apiConnectionService.put(`${ApiRoutes.albums}/updateSong`,  {
        AlbumId: albumSong.albumId,
         SongId: albumSong.songId,
        Position: albumSong.position },
    );
  }

  getAlbumSongPosition(albumId: number, songId: number): Observable<number> {
    return this.apiConnectionService.get<number>(`${ApiRoutes.albums}/${albumId}/${songId}`, false);
  }
}
