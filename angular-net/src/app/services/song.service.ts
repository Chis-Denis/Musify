import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConnectionService } from './api-connection.service';
import { BriefSongCreationDTO, BriefSongDTO, BriefSongUpdateDTO, SongWithAlternativeTitlesDTO } from '../models/song.model';
import { ApiRoutes, RoutePaths } from '../config/route-paths';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  constructor(private api: ApiConnectionService) {}

  getAll(): Observable<BriefSongDTO[]> {
    return this.api.get<BriefSongDTO[]>(ApiRoutes.song, true);
  }

  getById(id: number): Observable<BriefSongDTO> {
    return this.api.get<BriefSongDTO>(`${ApiRoutes.song}/${id}`, true);
  }

  createSong(song: BriefSongCreationDTO): Observable<BriefSongDTO> {
    return this.api.post<BriefSongDTO>(ApiRoutes.song, song);
  }

  updateSong(id: number, song: BriefSongUpdateDTO): Observable<BriefSongDTO> {
  return this.api.put<BriefSongDTO>(`${ApiRoutes.song}/${id}`, song);
  }

  deleteSong(id: number): Observable<void> {
  return this.api.delete<void>(`${ApiRoutes.song}/${id}`, true);
  }

  getTrending(): Observable<BriefSongDTO[]> {
    return this.api.get<BriefSongDTO[]>(`${ApiRoutes.song}/trending`, true);
  }

  getSongsByArtistId(artistId: number): Observable<BriefSongDTO[]> {
    return this.api.get<BriefSongDTO[]>(`${ApiRoutes.song}/artist/${artistId}`, true);
  }

  search(name: string): Observable<SongWithAlternativeTitlesDTO[]> {
    return this.api.get<SongWithAlternativeTitlesDTO[]>(`${ApiRoutes.song}/search`, true, { name });
  }
}

