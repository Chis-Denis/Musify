import { Component } from '@angular/core';
import { Album } from '../../models/albums.model';
import { FormsModule } from '@angular/forms';
import { AlbumsService } from '../../services/albums.service';
import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RoutePaths } from '../../config/route-paths';
import { ArtistsService } from '../../services/artist.service';
import { NotificationService } from '../../services/notification.service';
import { Paginator } from '../search/paginator';import { NotificationMessages } from '../../constants/notification-messages';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent {
    albums: Album[] = [];
    filteredAlbums = new Paginator<Album>([],5);
    selectedAlbum: Album | null = null;
    paginatedAlbums: Album[] = [];
    artists: Record<number, string> = {};

    currentPage = 0;
    pageSize = 10;

    isLoading = false;

    genreFilter: string = '';
    titleFilter: string = '';

    constructor(private albumService:AlbumsService, private router: Router, private artistService: ArtistsService, private notificationService: NotificationService){ }

    ngOnInit() {
      this.loadAlbums();
    }

    getArtistName(artistId: number): void {
        this.artistService.getById(artistId).subscribe({
          next: (artist) => {
            this.artists[artistId] = artist.type === 'band' ? artist.bandName! : artist.stageName!;
          },
          error: (err) => {
            this.notificationService.error(NotificationMessages.album.artistLoadError);
            this.artists[artistId] = 'Unknown';
          }
        });
    }

    private loadAlbums() {
      this.isLoading = true;

      this.albumService.getAll().subscribe({
        next: (data: any[]) => {
          this.albums = data.map(item => new Album(item));

          this.filteredAlbums.items = data.map(item => new Album(item));

          const uniqueArtistIds = new Set(this.albums.map(artist => artist.artistId));
          uniqueArtistIds.forEach(id => this.getArtistName(id));

          this.isLoading = false;
        },
        error: (err) => {
          this.notificationService.error(NotificationMessages.album.loadError);
          this.isLoading = false;
        }
      });
  }


    applyFilters() {
      if (!this.genreFilter && !this.titleFilter) {
            this.filteredAlbums.items = [...this.albums];
            this.currentPage = 0;
            return;
        }
      if (this.genreFilter) {
        this.isLoading = true;
        this.albumService.searchAlbumGenre(this.genreFilter).pipe(
      catchError(err => {
        this.notificationService.error('Failed to search albums by genre');
        this.filteredAlbums.items = [];
        return of([]);
      })).subscribe((data: any[]) => {
          this.filteredAlbums.items = data.map(item => new Album(item));
          this.currentPage = 0;
          this.isLoading = false;
        }, error => {
        this.notificationService.error('Failed to search albums by genre');
          this.isLoading = false;
        });
      }
      if (this.titleFilter) {
        this.isLoading = true;
        this.albumService.searchAlbum(this.titleFilter)
        .pipe(
      catchError(err => {
        this.notificationService.error('Failed to search albums by title');
        this.filteredAlbums.items = [];
        return of([]);
      })
    ).subscribe((data: any[]) => {
          this.filteredAlbums.items = data.map(item => new Album(item));
          this.currentPage = 0;
          this.isLoading = false;
        }, error => {
        this.notificationService.error('Failed to search albums by title');
        this.isLoading = false;
        });
      }
    }

    selectAlbum(album: Album) {
      this.router.navigate([`/${RoutePaths.home}/${RoutePaths.albums}`, album.id]);
    }
}
