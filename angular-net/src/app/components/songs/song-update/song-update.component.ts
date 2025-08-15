import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { SongService } from '../../../services/song.service';
import { BriefSongDTO, BriefSongUpdateDTO } from '../../../models/song.model';
import { Artist } from '../../../models/artist.model';
import { ArtistsService } from '../../../services/artist.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-song-update',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './song-update.component.html',
  styleUrls: ['./song-update.component.scss']
})
export class SongUpdateComponent implements OnInit {
  allSongs: BriefSongDTO[] = [];
  selectedSongId: number | null = null;

  song: BriefSongUpdateDTO = {
    title: '',
    artistIds: []
  };

  allArtists: Artist[] = [];
  filteredArtists: Artist[] = [];
  currentArtist: string = '';

  successMessage = '';
  errorMessage = '';

  constructor(private songService: SongService, private artistsService: ArtistsService) {}

  ngOnInit() {
    this.songService.getAll().subscribe(songs => {
      this.allSongs = songs;
    });

    this.artistsService.getAll().subscribe(artists => {
      this.allArtists = artists;
      this.filteredArtists = artists;
    });
  }

  onSongSelect(id: number) {
    this.selectedSongId = id;
    const selected = this.allSongs.find(s => s.id === id);
    if (selected) {
      this.song.title = selected.title;
    }
  }

  getDisplayName(artist?: Artist): string {
    if (!artist) return '(unknown)';
    return artist.stageName || artist.bandName || `${artist.firstName ?? ''} ${artist.lastName ?? ''}`.trim();
  }

  getArtistById(id: number): Artist | undefined {
    return this.allArtists.find(a => a.id === id);
  }

  filterArtists() {
    if (typeof this.currentArtist !== 'string') {
      this.currentArtist = '';
      this.filteredArtists = this.allArtists;
      return;
    }

    const value = this.currentArtist.toLowerCase();
    this.filteredArtists = this.allArtists.filter(a =>
      this.getDisplayName(a).toLowerCase().includes(value)
    );
  }

  addArtist(artist: Artist) {
    if (!this.song.artistIds) {
      this.song.artistIds = [];
    }

    if (artist.id && !this.song.artistIds.includes(artist.id)) {
      this.song.artistIds.push(artist.id);
    }

    this.currentArtist = '';
    this.filteredArtists = this.allArtists;
  }

  removeArtist(id: number) {
    if (this.song.artistIds) {
      this.song.artistIds = this.song.artistIds.filter(aid => aid !== id);
    }
  }

  onSubmit() {
    if (!this.selectedSongId) return;

    this.songService.updateSong(this.selectedSongId, this.song).pipe(
      catchError(error => {
        const errorMsg = error?.error?.join?.('<br>') || 'Unknown error while updating.';
        this.errorMessage = errorMsg;
        this.successMessage = '';
        return of(null);
      })
    ).subscribe(() => {
  this.successMessage = `The song has been successfully updated!`;
  this.errorMessage = '';
    });
  }
}
