import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SongService } from '../../../../services/song.service';
import { BriefSongDTO } from '../../../../models/song.model';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-playlist-details-add-song-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatListModule, MatButtonModule, MatIconModule, FormsModule, MatRadioModule],
  templateUrl: './playlist-details-add-song-dialog.component.html',
  styleUrls: ['./playlist-details-add-song-dialog.component.scss']
})
export class PlaylistDetailsAddSongDialogComponent implements OnInit {
  search = '';
  songs: BriefSongDTO[] = [];
  selectedSong: BriefSongDTO | null = null;

  constructor(
    public dialogRef: MatDialogRef<PlaylistDetailsAddSongDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private songService: SongService
  ) {}

  ngOnInit() {
    this.songService.getAll().subscribe(songs => {
      this.songs = songs;
    });
  }

  filteredSongs(): BriefSongDTO[] {
    if (!this.search) return this.songs;
    return this.songs.filter(song =>
      song.title.toLowerCase().includes(this.search.toLowerCase()) ||
      (song.artistsStageName && song.artistsStageName.join(', ').toLowerCase().includes(this.search.toLowerCase()))
    );
  }

  onCancel() {
    this.dialogRef.close();
  }

  onAdd() {
    if (this.selectedSong) {
      this.dialogRef.close(this.selectedSong);
    }
  }
} 