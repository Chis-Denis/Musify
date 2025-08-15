import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RoutePaths } from '../../../config/route-paths';
import { MatMenuModule } from '@angular/material/menu';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import { AudioService } from '../../../services/audio.service';

import { BriefSongDTO } from '../../../models/song.model';
import { SongService } from '../../../services/song.service';
import { Artist } from '../../../models/artist.model';
import { ArtistsService } from '../../../services/artist.service';
import { PlaylistDto } from '../../../models/playlists.model';
import { PlaylistService } from '../../../services/playlists.service';

import { NotificationService } from '../../../services/notification.service';
import { NotificationMessages } from '../../../constants/notification-messages';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-song-detail',
  standalone: true,
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    ClipboardModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class SongDetailComponent implements OnInit {
  song: BriefSongDTO | null = null;
  artistDetails: Artist[] = [];
  playlists: PlaylistDto[] = [];
  selectedPlaylistId: number | null = null;
  showPlaylistDropdown = false;
  errorMessage = '';
  routePaths = RoutePaths;
  userLogged: number | null = null;
  isPlaying = false;

  constructor(
    private clipboard: Clipboard,
    private route: ActivatedRoute,
    private router: Router,
    private songService: SongService,
    private artistService: ArtistsService,
    private playlistService: PlaylistService,
    private userService: UserService,
    private audioService: AudioService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.userService.getProfile().subscribe({
      next: (user) => {
        this.userLogged = user.id;
        this.loadPlaylists();
      },
      error: () => {
        this.notification.error(NotificationMessages.user.notFound);
      }
    });

    this.songService.getById(Number(id)).subscribe({
      next: song => {
        this.song = song;
        this.loadArtistDetails(song.artistIds || []);
      },
      error: () => {
        this.notification.error(NotificationMessages.song.notFound);
      }
    });
  }

  loadArtistDetails(artistIds: number[]) {
    const requests = artistIds.map(id => this.artistService.getById(id));
    forkJoin(requests).subscribe({
      next: (artists) => this.artistDetails = artists,
      error: () => this.notification.error(NotificationMessages.artist.loadError)
    });
  }

  loadPlaylists(): void {
    this.playlistService.getAllPlaylists().subscribe({
      next: playlists => {
        this.playlists = playlists.filter(p => p.userId === this.userLogged);
      },
      error: () => this.notification.error(NotificationMessages.playlist.publicLoadError)
    });
  }

  addToPlaylist(): void {
    if (this.song?.id && this.selectedPlaylistId !== null) {
      this.playlistService.addSongToPlaylist(this.selectedPlaylistId, this.song.id).subscribe({
        next: () => {
          this.notification.success(NotificationMessages.playlist.songAdded);
          this.showPlaylistDropdown = false;
        },
        error: () => this.notification.error(NotificationMessages.playlist.songAddError)
      });
    }
  }

copySongLink(): void {
  const id = this.song?.id;
  if (id) {
    const link = `${location.origin}/${RoutePaths.songs}/${id}`;
    this.clipboard.copy(link);
    this.notification.success(NotificationMessages.song.linkCopied);
  }
}


  playSong(): void {
    if (!this.song?.title) return;

    const safeTitle = this.song.title.trim().replace(/\s+/g, '');
    const url = `assets/music/${safeTitle}.mp3`;

    this.audioService.play(url);
    this.isPlaying = this.audioService.isPlaying(url);
  }

  cancel(): void {
    this.router.navigate([RoutePaths.songs]);
  }

  viewProfile(id?: number): void {
    if (id) {
      this.router.navigate([RoutePaths.home, RoutePaths.artists, id]);
    }
  }
}
