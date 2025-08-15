import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { PlaylistDto } from '../../../models/playlists.model';
import { SongService } from '../../../services/song.service';
import { BriefSongDTO } from '../../../models/song.model';
import { PlaylistService, PlaylistSongInPlaylist } from '../../../services/playlists.service';
import { NotificationService } from '../../../services/notification.service';
import { NotificationMessages } from '../../../constants/notification-messages';
import { Album } from '../../../models/albums.model';
import { PlaylistAlbumInPlaylist } from '../../../services/playlists.service';
import { AlbumsService } from '../../../services/albums.service';
import { PlaylistCreateDialogComponent } from './playlist-create-dialog/playlist-create-dialog.component';
import { PlaylistEditDialogComponent } from './playlist-edit-dialog/playlist-edit-dialog.component';

@Component({
  selector: 'app-playlist-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatListModule
  ],
  templateUrl: './playlist-management.component.html',
  styleUrls: ['./playlist-management.component.scss']
})
export class PlaylistManagementComponent implements OnChanges {
  @Input() selected: PlaylistDto | null = null;
  @Input() allSongs: BriefSongDTO[] = [];
  @Input() playlistSongsInPlaylist: PlaylistSongInPlaylist[] = [];
  @Input() userNames: { [userId: number]: string } = {};

  @Output() create = new EventEmitter<{ name: string; type: string }>();
  @Output() update = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  newName: string = '';
  newType: string = 'public';
  updatedName: string = '';

  selectedSongId: number | null = null;
  allAlbums: Album[] = [];
  selectedAlbumId: number | null = null;
  playlistAlbumsInPlaylist: PlaylistAlbumInPlaylist[] = [];

  constructor(
    private songService: SongService,
    private playlistService: PlaylistService,
    private notification: NotificationService,
    private albumsService: AlbumsService
  ) {
    this.songService.getAll().subscribe(songs => this.allSongs = songs);
    this.albumsService.getAll().subscribe((albums: Album[]) => this.allAlbums = albums);
  }

  private filterAlbumsWithAllSongsPresent() {
    const songIdsInPlaylist = new Set(this.playlistSongsInPlaylist.map(s => s.songId));
    const albumSongPromises = this.playlistAlbumsInPlaylist.map(album =>
      album.albumId != null ? this.albumsService.getById(album.albumId).toPromise().then((albumData: Album | undefined) => {
        if (!albumData || !Array.isArray((albumData as any).songs)) {
          return { albumId: album.albumId, allSongsPresent: false };
        }
        const albumSongIds = ((albumData as any).songs as Array<{ id: number }>).map((s) => s.id);
        return { albumId: album.albumId, allSongsPresent: albumSongIds.every((id: number) => songIdsInPlaylist.has(id)) };
      }) : Promise.resolve({ albumId: album.albumId, allSongsPresent: false })
    );
    Promise.all(albumSongPromises).then((results: any[]) => {
      const albumIdsToShow = new Set(results.filter(r => r.allSongsPresent).map(r => r.albumId));
      this.playlistAlbumsInPlaylist = this.playlistAlbumsInPlaylist.filter(album => albumIdsToShow.has(album.albumId));
    });
  }

  fetchAlbumsInPlaylist() {
    if (!this.selected) return;
    this.playlistService.getAlbumsInPlaylist(this.selected.id).subscribe((albums: PlaylistAlbumInPlaylist[]) => {
      this.playlistAlbumsInPlaylist = Array.isArray(albums)
        ? albums.map((a: any) => ({
            albumId: a.id ?? a.albumId,
            albumTitle: a.title ?? a.albumTitle ?? '',
            position: a.position ?? 0
          }))
        : [];
      
    });
  }

  onRemoveAlbum(albumId: number) {
    if (!this.selected) return;
    this.playlistService.removeAlbumFromPlaylist(this.selected.id, albumId).subscribe({
      next: () => {
        
        this.playlistAlbumsInPlaylist = this.playlistAlbumsInPlaylist.filter(a => a.albumId !== albumId);
        
        if (this.selected) {
          this.loadPlaylistSongs(this.selected.id);
        }
        this.notification.success(NotificationMessages.playlist.songRemoved);
      },
      error: (err: any) => {
        this.notification.error(NotificationMessages.playlist.deleteError);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected']) {
      if (this.selected) {
        this.updatedName = this.selected.name;
        this.loadPlaylistSongs(this.selected.id);
        this.fetchAlbumsInPlaylist();
      } else {
        this.playlistSongsInPlaylist = [];
        this.playlistAlbumsInPlaylist = [];
      }
    }
  }

  loadPlaylistSongs(playlistId: number) {
    if (!playlistId) return;
    this.playlistService.getSongsInPlaylist(playlistId).subscribe(songs => {
      this.playlistSongsInPlaylist = Array.isArray(songs) ? songs : [];
      
      console.log('Loaded playlistSongsInPlaylist:', this.playlistSongsInPlaylist);
    });
  }

  onSelect(playlist: PlaylistDto) {
    this.selected = playlist;
    this.loadPlaylistSongs(this.selected.id);
  }

  get isCreateFormValid(): boolean {
    return this.newName.trim().length > 0;
  }

  get isUpdateFormValid(): boolean {
    return this.selected !== null && this.updatedName.trim().length > 0;
  }

  onCreate() {
    if (this.isCreateFormValid) {
      this.create.emit({ name: this.newName.trim(), type: this.newType });
      this.newName = '';
      this.newType = 'public';
    }
  }

  onUpdate() {
    if (this.isUpdateFormValid) {
      this.update.emit(this.updatedName.trim());
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  onAddSong() {
    if (this.selected && this.selectedSongId) {
      this.playlistService.addSongToPlaylist(this.selected.id, this.selectedSongId).subscribe({
        next: () => {
          this.loadPlaylistSongs(this.selected!.id);
          this.selectedSongId = null;
          this.notification.success(NotificationMessages.playlist.songAdded);
        },
        error: (err: any) => {
          if (err?.error && typeof err.error === 'string' && err.error.toLowerCase().includes('already')) {
            this.notification.error(NotificationMessages.playlist.duplicateAlternative);
          } else {
            this.notification.error(NotificationMessages.playlist.createError || 'Failed to add song.');
          }
        }
      });
    }
  }

  onRemoveSong(songId: number) {
    if (this.selected) {
      this.playlistService.removeSongFromPlaylist(this.selected.id, songId).subscribe({
        next: () => {
          this.loadPlaylistSongs(this.selected!.id);
         
          setTimeout(() => this.filterAlbumsWithAllSongsPresent(), 0);
          this.fetchAlbumsInPlaylist();
          this.notification.success(NotificationMessages.playlist.songRemoved);
        },
        error: (err: any) => {
          this.notification.error(NotificationMessages.playlist.deleteError || 'Failed to remove song.');
        }
      });
    }
  }

  onAddAlbum() {
    if (this.selected && this.selectedAlbumId) {
      this.playlistService.addAlbumToPlaylist(this.selected.id, this.selectedAlbumId).subscribe({
        next: () => {
          const addedAlbum = this.allAlbums.find(a => a.id === this.selectedAlbumId);
          if (addedAlbum) {
            this.playlistAlbumsInPlaylist.push({
              albumId: addedAlbum.id,
              albumTitle: addedAlbum.title,
              position: 0 
            });
          }

          if (this.selected) {
            this.loadPlaylistSongs(this.selected.id);
          }

          this.notification.success(NotificationMessages.playlist.albumAdded);
          this.selectedAlbumId = null;
        },
        error: (err: any) => {
          const fallback = NotificationMessages.playlist.addAlbumError || 'Failed to add album to playlist.';
          let message = fallback;

          if (err?.error) {
            if (typeof err.error === 'string') {
              message = err.error;
            } else if (err.error.message) {
              message = err.error.message;
            }
          }

          this.notification.error(message);
        }
      });
    }
  }
} 