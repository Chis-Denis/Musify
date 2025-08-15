import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PlaylistService } from '../../../../services/playlists.service';
import { PlaylistDto } from '../../../../models/playlists.model';
import { AlbumsService } from '../../../../services/albums.service';
import { Album } from '../../../../models/albums.model';
import { SongService } from '../../../../services/song.service';
import { BriefSongDTO } from '../../../../models/song.model';
import { PlaylistSongInPlaylist } from '../../../../services/playlists.service';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { PlaylistDetailsAddSongDialogComponent } from '../playlist-details-add-song-dialog/playlist-details-add-song-dialog.component';
import { PlaylistDetailsAddAlbumDialogComponent } from '../playlist-details-add-album-dialog/playlist-details-add-album-dialog.component';
import { PlaylistAlbumInPlaylist } from '../../../../services/playlists.service';
import { Router } from '@angular/router';
import { RoutePaths } from '../../../../config/route-paths';
import { ArtistsService } from '../../../../services/artist.service';
import { forkJoin } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatMenuModule,
    DragDropModule
  ],
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.scss']
})
export class PlaylistDetailsComponent implements OnInit {
  playlistName: string = '';
  creatorName: string = '';
  genre: string = 'Pop';
  description: string = 'Second release';
  releaseDate: Date = new Date();
  copyright: string = 'ElectroBeat';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  songs: Array<{
    songId: number;
    title: string;
    albumTitle?: string;
    artistName?: string;
    duration?: string;
  }> = [];
  today = new Date();
  albumSongMap: { [songId: number]: string } = {};
  artistMap: { [songId: number]: string } = {};
  playlistSongs: PlaylistSongInPlaylist[] = [];
  durationMap: { [songId: number]: string } = {};
  albums: any[] = [];
  albumsDetailed: Array<{ albumId: number, albumTitle: string, artistName: string }> = [];
  playlistOwnerId: number | null = null;
  currentUserId: number | null = null;
  showAlbumsView: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private albumsService: AlbumsService,
    private songService: SongService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private artistsService: ArtistsService,
    private cdr: ChangeDetectorRef
  ) {}

  formatDuration(duration?: any): string {
    if (!duration) return 'Unknown';
    if (typeof duration === 'string') return duration;
    const minutes = duration.minutes || 0;
    const seconds = duration.seconds || 0;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  updateSongsDisplay() {
    this.songs = this.playlistSongs.map(s => ({
      songId: s.songId,
      title: s.songTitle || 'Unknown Title',
      albumTitle: this.albumSongMap[s.songId] || '',
      artistName: this.artistMap[s.songId] || 'Unknown Artist',
      duration: this.durationMap[s.songId] || 'Unknown'
    }));
  }

  openAddSongDialog() {
    const playlistId = Number(this.route.snapshot.paramMap.get('id'));
    const dialogRef = this.dialog.open(PlaylistDetailsAddSongDialogComponent, {
      width: '400px',
      panelClass: 'dark-dialog',
    });
    dialogRef.afterClosed().subscribe((selectedSong) => {
      if (selectedSong && selectedSong.id) {
        this.playlistService.addSongToPlaylist(playlistId, selectedSong.id).subscribe(() => {
          this.playlistSongs.push({
            songId: selectedSong.id,
            position: this.playlistSongs.length + 1,
            songTitle: selectedSong.title
          });
          this.songService.getById(selectedSong.id).subscribe((songDetails: BriefSongDTO) => {
            this.artistMap[selectedSong.id] = songDetails.artistsStageName?.join(', ') || 'Unknown Artist';
            this.durationMap[selectedSong.id] = this.formatDuration(songDetails.duration);
            this.updateSongsDisplay();
          });
        });
      }
    });
  }

  openAddAlbumDialog() {
    const playlistId = Number(this.route.snapshot.paramMap.get('id'));
    const dialogRef = this.dialog.open(PlaylistDetailsAddAlbumDialogComponent, {
      width: '400px',
      panelClass: 'dark-dialog',
    });
    dialogRef.afterClosed().subscribe((selectedAlbum) => {
      if (selectedAlbum && selectedAlbum.id) {
        this.playlistService.addAlbumToPlaylist(playlistId, selectedAlbum.id).subscribe(() => {
          this.playlistService.getSongsInPlaylist(playlistId).subscribe(songs => {
            this.playlistSongs = songs;
            songs.forEach(song => {
              this.songService.getById(song.songId).subscribe((songDetails: BriefSongDTO) => {
                this.artistMap[song.songId] = songDetails.artistsStageName?.join(', ') || 'Unknown Artist';
                this.durationMap[song.songId] = this.formatDuration(songDetails.duration);
                this.updateSongsDisplay();
              });
            });
          });
          this.fetchAlbumsDetailed(playlistId); 
        });
      }
    });
  }

  removeSong(song: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to remove this song from the playlist?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const playlistId = Number(this.route.snapshot.paramMap.get('id'));
        if (!song || !song.songId) return;
        this.playlistService.removeSongFromPlaylist(playlistId, song.songId).subscribe(() => {
          this.playlistService.getSongsInPlaylist(playlistId).subscribe(songs => {
            this.playlistSongs = songs;
            this.updateSongsDisplay();
            setTimeout(() => {
              this.fetchAlbumsDetailed(playlistId);
            }, 0);
          });
        });
      }
    });
  }

  removeAlbum(album: any) {
  }

  isOwner(): boolean {
    return this.currentUserId !== null && this.playlistOwnerId !== null && this.currentUserId === this.playlistOwnerId;
  }

  onSongClick(song: any) {
    if (song && song.songId) {
      this.router.navigate([`/${RoutePaths.home}/${RoutePaths.songs}/${song.songId}`]);
    }
  }

  onAlbumClick(album: any) {
    if (album && album.albumId) {
      this.router.navigate([`/${RoutePaths.home}/${RoutePaths.albums}/${album.albumId}`]);
    }
  }

  toggleAlbumsView() {
    this.showAlbumsView = !this.showAlbumsView;
  }

  fetchAlbumsDetailed(playlistId: number) {
    this.playlistService.getAlbumsInPlaylist(playlistId).subscribe(albums => {
      this.albums = albums;
      if (!albums || albums.length === 0) {
        this.albumsDetailed = [];
        return;
      }
      const playlistSongIds = new Set(this.playlistSongs.map(s => s.songId));
      const albumSongChecks = albums
        .filter(album => album.id)
        .map(album =>
          this.albumsService.getAlbumSongs(album.id!).toPromise().then(albumSongs => {
            if (!albumSongs) return null;
            const albumSongIds = albumSongs.map(song => song.id);
            const allSongsInPlaylist = albumSongIds.length > 0 && albumSongIds.every(id => playlistSongIds.has(id));
            return allSongsInPlaylist ? album : null;
          })
        );
      Promise.all(albumSongChecks).then(albumsWithAllSongs => {
        const filteredAlbums = albumsWithAllSongs.filter((a): a is typeof albums[0] => !!a);
        const albumDetailObservables = filteredAlbums
          .map(album => this.albumsService.getById(album.id!));
        forkJoin(albumDetailObservables).subscribe(albumDetailsArr => {
          const artistObservables = albumDetailsArr.map(albumDetails =>
            this.artistsService.getById(albumDetails.artistId!)
          );
          forkJoin(artistObservables).subscribe(artistDetailsArr => {
            this.albumsDetailed = albumDetailsArr.map((albumDetails, idx) => {
              const artistDetails = artistDetailsArr[idx];
              const artistName = artistDetails.stageName || artistDetails.bandName || (artistDetails.firstName + ' ' + artistDetails.lastName) || 'Unknown Artist';
              return {
                id: albumDetails.id,
                title: albumDetails.title,
                artistId: albumDetails.artistId,
                albumId: albumDetails.id,
                albumTitle: albumDetails.title,
                artistName
              };
            });
            this.cdr.detectChanges(); 
          });
        });
      });
    });
  }

  removeAlbumFromPlaylist(album: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to remove this album from the playlist?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const playlistId = Number(this.route.snapshot.paramMap.get('id'));
        this.playlistService.removeAlbumFromPlaylist(playlistId, album.albumId).subscribe(() => {
          this.fetchAlbumsDetailed(playlistId);
          this.playlistService.getSongsInPlaylist(playlistId).subscribe(songs => {
            this.playlistSongs = songs;
            this.updateSongsDisplay();
          });
        });
      }
    });
  }

  onDropSong(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.songs, event.previousIndex, event.currentIndex);
    this.updateSongOrderOnBackend();
  }

  updateSongOrderOnBackend() {
    const playlistId = Number(this.route.snapshot.paramMap.get('id'));
    const songIdsInOrder = this.songs.map(s => s.songId);
    this.playlistService.updatePlaylistSongsOrder(playlistId, songIdsInOrder).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  ngOnInit() {
    const playlistId = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getProfile().subscribe(profile => {
      this.currentUserId = profile.id;
    });
    this.playlistService.getPlaylistById(playlistId).subscribe((playlist: PlaylistDto) => {
      this.playlistName = playlist.name;
      this.createdAt = new Date(playlist.createdAt);
      this.updatedAt = new Date(playlist.updatedAt);
      this.playlistOwnerId = playlist.userId;
      this.userService.getById(playlist.userId).subscribe((user: User | null) => {
        if (user != null) {
          this.creatorName = `${user.firstName} ${user.lastName}`;
        } else {
          this.creatorName = 'Unknown';
        }
      });
    });
    this.playlistService.getSongsInPlaylist(playlistId).subscribe(songs => {
      this.playlistSongs = songs;
      this.updateSongsDisplay();
      songs.forEach(song => {
        this.songService.getById(song.songId).subscribe((songDetails: BriefSongDTO) => {
          this.artistMap[song.songId] = songDetails.artistsStageName?.join(', ') || 'Unknown Artist';
          this.durationMap[song.songId] = this.formatDuration(songDetails.duration);
          this.updateSongsDisplay();
        });
      });
    });
    this.fetchAlbumsDetailed(playlistId);
  }
}
