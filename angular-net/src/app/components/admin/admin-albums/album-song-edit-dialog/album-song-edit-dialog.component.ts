import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Album, AlbumSong } from '../../../../models/albums.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BriefSongDTO } from '../../../../models/song.model';
import { SongService } from '../../../../services/song.service';
import { NotificationService } from '../../../../services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { AlbumsService } from '../../../../services/albums.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { NotificationMessages } from '../../../../constants/notification-messages';

@Component({
  selector: 'app-album-song-edit-dialog',
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule, 
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule,
    DragDropModule, 
    MatDialogModule
  ],
  templateUrl: './album-song-edit-dialog.component.html',
  styleUrls: ['./album-song-edit-dialog.component.scss']
})
export class AlbumSongEditDialogComponent {
  albumId!: number;
  albumTitle: string = '';
  songsInAlbum: BriefSongDTO[] = [];
  songPositions: Record<number, number> = {};
  newSongId: number = 0;
  selectedSongId: number = 0;
  newPosition: number = 1;
  editPosition: number = 1;
  error: string = '';
  songs: BriefSongDTO[] = [];
  hasChanges: boolean = false;
  originalOrder: BriefSongDTO[] = [];

  constructor(
      public dialogRef: MatDialogRef<AlbumSongEditDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Album,
      private albumService: AlbumsService,
      private route: ActivatedRoute,
      private notificationService: NotificationService,
      private songService: SongService,
    ) {}


    ngOnInit(): void {
    this.albumId = this.data.id;
    this.loadSongsInAlbum();
    this.loadSongs();
  }

  loadSongs() {
    this.songService.getAll().subscribe(songs => {
      this.songs = songs;
    });
  }

  loadSongsInAlbum() {
  this.albumService.getAlbumSongs(this.albumId).subscribe(songs => {
    this.songsInAlbum = songs;
    this.originalOrder = [...songs]; 

    for (let song of songs) {
      this.albumService.getAlbumSongPosition(this.albumId, song.id).subscribe(
        pos => {
          this.songPositions[song.id] = pos;
        },
        err => {
          this.notificationService.error(NotificationMessages.album.songNotFound);
          this.songPositions[song.id] = 0;
        }
      );
    }
    });
        this.hasChanges = false;

  }

  drop(event: CdkDragDrop<BriefSongDTO[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.songsInAlbum, event.previousIndex, event.currentIndex);
      this.hasChanges = true;
    }
  }

  addSongToAlbum() {
    const maxPosition = Math.max(...Object.values(this.songPositions), 0);
    const position = maxPosition + 1;
    const albumSong: AlbumSong = {
      albumId: this.albumId,
      songId: this.newSongId,
      position: position,
    };

    this.albumService.addAlbumSong(albumSong).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.album.songAddedToAlbum);
        this.loadSongsInAlbum();
        this.newSongId = 0;
      },
      error: (err) => this.notificationService.error(NotificationMessages.album.songAddError)
    });
  }

   cancelChanges() {
    this.songsInAlbum = [...this.originalOrder];
    this.hasChanges = false;
  }
  
  async saveChangesWithTempPositions() {
  try {
    const tempPositionStart = 1000;
    const tempUpdatePromises = this.songsInAlbum.map((song, index) => {
      const tempPosition = tempPositionStart + index;
      const albumSong: AlbumSong = {
        albumId: this.albumId,
        songId: song.id,
        position: tempPosition,
      };
      return this.albumService.updateAlbumSong(albumSong).toPromise();
    });

    await Promise.all(tempUpdatePromises);

    const finalUpdatePromises = this.songsInAlbum.map((song, index) => {
      const finalPosition = index + 1;
      const albumSong: AlbumSong = {
        albumId: this.albumId,
        songId: song.id,
        position: finalPosition,
      };
      return this.albumService.updateAlbumSong(albumSong).toPromise();
    });

    await Promise.all(finalUpdatePromises);

    this.notificationService.success(NotificationMessages.album.songOrderUpdated);
    this.hasChanges = false;
    this.loadSongsInAlbum();

  } catch (err: any) {
    this.notificationService.error(NotificationMessages.album.songOrderUpdateError);
  }
}

  deleteSongFromAlbum(songId: number) {
    const albumSong: AlbumSong = {
      albumId: this.albumId,
      songId,
    };

    this.albumService.deleteAlbumSong(albumSong).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.album.songRemoved);
        this.loadSongsInAlbum();
      },
      error: (err) => this.notificationService.error(NotificationMessages.album.songRemoveError)
    });
  }

  getSongDisplayPosition(songId: number): number {
    const currentIndex = this.songsInAlbum.findIndex(s => s.id === songId);
    return currentIndex + 1;
  }

  showError(message: string) {
    this.error = message;
    this.notificationService.error(message);
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.data);
  }
}
