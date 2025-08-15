import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';

import { SongService } from '../../../services/song.service';
import { BriefSongDTO } from '../../../models/song.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-song-delete',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './song-delete.component.html',
  styleUrls: ['./song-delete.component.scss']
})
export class SongDeleteComponent implements OnInit {
  allSongs: BriefSongDTO[] = [];
  filteredSongs: BriefSongDTO[] = [];
  currentSongSearch = '';
  selectedSongId: number | null = null;

  successMessage = '';
  errorMessage = '';

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.songService.getAll().subscribe(songs => {
      this.allSongs = songs;
      this.filteredSongs = songs;
    });
  }

  filterSongs() {
  const value = typeof this.currentSongSearch === 'string'
    ? this.currentSongSearch.toLowerCase()
    : '';

  this.filteredSongs = this.allSongs.filter(s =>
    s.title.toLowerCase().includes(value)
  );
}


  selectSong(song: BriefSongDTO): void {
    this.selectedSongId = song.id;
    this.currentSongSearch = song.title;
  }

  onDelete(): void {
    if (!this.selectedSongId) return;

    this.songService.deleteSong(this.selectedSongId).pipe(
      catchError(error => {
        const errorMsg = error?.error?.join?.('<br>') || 'Failed to delete song.';
        this.errorMessage = errorMsg;
        this.successMessage = '';
        return of(null);
      })
    ).subscribe(() => {
      this.successMessage = 'The song has been successfully deleted.';
      this.errorMessage = '';
      this.allSongs = this.allSongs.filter(s => s.id !== this.selectedSongId);
      this.filteredSongs = this.allSongs;
      this.currentSongSearch = '';
      this.selectedSongId = null;
    });
  }
}
