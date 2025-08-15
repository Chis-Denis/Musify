import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Album } from '../../../models/albums.model';
import { AlbumsService } from '../../../services/albums.service';
import { RoutePaths } from '../../../config/route-paths';
import { ArtistsService } from '../../../services/artist.service';
import { switchMap } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { BriefSongDTO } from '../../../models/song.model';
import { MatTableModule } from '@angular/material/table';
import { NotificationMessages } from '../../../constants/notification-messages';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatTableModule
  ],
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {
  album: Album | null = null;
  albumId: string | null = null;
  isLoading = false;
  isDeleting = false;
  artist: string | null = null;
  albumSongs: BriefSongDTO[] = [];
  displayedColumns: string[] = ['position', 'title', 'duration'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumsService,
    private artistService: ArtistsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.albumId = params.get('id');
      if (this.albumId) {
        this.loadAlbumDetails();
        this.loadAlbumSongs();
      }
    });
  }
  loadAlbumSongs() {
    if (!this.albumId) return;

    this.albumService.getAlbumSongs(Number(this.albumId)).subscribe({
      next: (songs) => {
        this.albumSongs = songs;
      },
      error: (error) => {
        if (error.status === 404) {
          this.notificationService.error(NotificationMessages.album.songNotFound);
        } else {
          this.notificationService.error(NotificationMessages.album.songLoadError);
        }
      }
    });
  }

   getArtistsDisplay(artists?: string[]): string {
    if (!artists || artists.length === 0) {
      return 'Unknown Artist';
    }

    return artists.join(', ');

  }

  getArtistName(artistId: number): void {
        this.artistService.getById(artistId).subscribe({
          next: (artist) => {
            this.artist = artist.type === 'band' ? artist.bandName! : artist.stageName!;
          },
          error: (err) => {
            this.notificationService.error(NotificationMessages.album.artistLoadError);
            this.artist = 'Unknown';
          }
        });
  }

  private loadAlbumDetails() {
    if (!this.albumId) return;

    this.isLoading = true;
    this.albumService.getById(Number(this.albumId)).pipe(
    switchMap((data: any) => {
      this.album = new Album(data);
      return this.artistService.getById(this.album.artistId);
    })
  ).subscribe({
    next: (artist) => {
      this.artist = artist.type === 'band' ? artist.bandName! : artist.stageName!;
      this.isLoading = false;
    },
    error: (error) => {
      this.notificationService.error(NotificationMessages.album.detailsLoadError);
      this.router.navigate([RoutePaths.albums]);
      this.isLoading = false;
    }
  });
  }

  onBackToAlbums() {
    this.router.navigate([RoutePaths.home, RoutePaths.albums]);
  }

  viewSong(id: number | string) {
    console.log('ID-ul selectat:', id);
    this.router.navigate([ `/${RoutePaths.home}/${RoutePaths.songs}`, id]);
  }

}
