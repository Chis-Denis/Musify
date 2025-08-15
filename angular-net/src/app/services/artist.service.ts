import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Artist, ArtistDetails } from '../models/artist.model';
import { environment } from '../../environments/environment';
import { ApiRoutes } from '../config/route-paths';
import { ApiConnectionService } from './api-connection.service';
import { routes } from '../config/app.routes';

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {
  private baseUrl = ApiRoutes.artists;

  constructor(private api: ApiConnectionService) {}

  getAll(type?: string): Observable<Artist[]> {
    const queryParams = type ? { type } : undefined;
    return this.api.get<Artist[]>(this.baseUrl, true, queryParams).pipe(
      map(artists => this.sortArtistsAlphabetically(artists))
    );
  }

  getById(id: number): Observable<ArtistDetails> {
    return this.api.get<ArtistDetails>(`${this.baseUrl}/${id}`, true).pipe(
      map(artistDetails => {
        if (artistDetails.members) {
          artistDetails.members = this.sortArtistsAlphabetically(artistDetails.members);
        }
        if (artistDetails.bands) {
          artistDetails.bands = this.sortArtistsAlphabetically(artistDetails.bands);
        }
        return artistDetails;
      })
    );
  }

  create(artist: Artist): Observable<any> {
    return this.api.post(this.baseUrl, artist, true);
  }

  update(artist: Artist): Observable<Artist> {
    return this.api.put<Artist>(this.baseUrl, artist, true);
  }

  delete(id: number): Observable<any> {
    return this.api.delete(`${this.baseUrl}?id=${id}`, true);
  }

  search(name: string): Observable<Artist[]> {
    const queryParams = name ? { name } : undefined;
    return this.api.get<Artist[]>(`${this.baseUrl}/search`, true, queryParams).pipe(
      map(artists => this.sortArtistsAlphabetically(artists))
    );
  }

  addBandMember(dto: { bandId: number, memberId: number }) {
    return this.api.post(`${this.baseUrl}/members`, dto, true);
  }

  removeBandMember(dto: { bandId: number, memberId: number }) {
    return this.api.delete(`${this.baseUrl}/members`, true, dto);
  }

  private sortArtistsAlphabetically(artists: Artist[]): Artist[] {
    return artists.sort((a, b) => {
      const nameA = this.getDisplayName(a).toLowerCase();
      const nameB = this.getDisplayName(b).toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  private getDisplayName(artist: Artist): string {
    if (artist.type === 'band') {
      return artist.bandName || artist.stageName || 'Unknown Band';
    } else {
      return artist.stageName || 
             (artist.firstName && artist.lastName ? `${artist.firstName} ${artist.lastName}` : '') ||
             artist.firstName || 
             artist.lastName || 
             'Unknown Artist';
    }
  }

  public getArtistDisplayName(artist: Artist): string {
    return this.getDisplayName(artist);
  }
}

