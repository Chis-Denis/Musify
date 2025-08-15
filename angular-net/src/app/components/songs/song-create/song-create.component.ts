import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

import { BriefSongCreationDTO } from '../../../models/song.model';
import { SongService } from '../../../services/song.service';
import { ArtistsService } from '../../../services/artist.service';
import { Artist } from '../../../models/artist.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-song-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  templateUrl: './song-create.component.html',
  styleUrls: ['./song-create.component.scss']
})
export class SongCreateComponent implements OnInit {
  newSong: BriefSongCreationDTO = {
    title: '',
    creationDate: '',
    artistIds: []
  };

  successMessage = '';
  errorMessage = '';

  allArtists: Artist[] = [];
  filteredArtists: Artist[] = [];
  currentArtist: string = '';

  constructor(private songService: SongService, private artistsService: ArtistsService) {}

  ngOnInit() {
    this.artistsService.getAll().subscribe(artists => {
      this.allArtists = artists;
      this.filteredArtists = artists;
    });
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
    if (!this.newSong.artistIds) {
      this.newSong.artistIds = [];
    }

    if (artist.id && !this.newSong.artistIds.includes(artist.id)) {
      this.newSong.artistIds.push(artist.id);
    }

    this.currentArtist = '';
    this.filteredArtists = this.allArtists;
  }

  removeArtist(id: number) {
    if (this.newSong.artistIds) {
      this.newSong.artistIds = this.newSong.artistIds.filter(aid => aid !== id);
    }
  }

  onSubmit() {
    this.songService.createSong(this.newSong).pipe(
      catchError(error => {
        const errorMsg = error?.error?.join?.('<br>') || 'Unknown error while creating.';
        this.errorMessage = errorMsg;
        this.successMessage = '';
        return of(null);
      })
    ).subscribe(result => {
      if (result) {
        this.successMessage = `The song "${result.title}" was successfully created!`;
        this.errorMessage = '';
        this.newSong = { title: '', creationDate: '', artistIds: [] };
      }
    });
  }
}
