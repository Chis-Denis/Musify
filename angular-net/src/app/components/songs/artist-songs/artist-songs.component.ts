import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';

import { ArtistsService } from '../../../services/artist.service';
import { SongService } from '../../../services/song.service';
import { Artist } from '../../../models/artist.model';
import { BriefSongDTO } from '../../../models/song.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artist-songs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatListModule,
  ],
  templateUrl: './artist-songs.component.html',
  styleUrls: ['./artist-songs.component.scss']
})
export class ArtistSongsComponent implements OnInit {
  artists: Artist[] = [];
  selectedArtistId: number | null = null;
  artistSongs: BriefSongDTO[] = [];


constructor(
  private artistsService: ArtistsService,
  private songService: SongService,
  private router: Router
) {}


  ngOnInit(): void {
    this.artistsService.getAll().subscribe(artists => this.artists = artists);
  }

  onArtistSelected() {
    if (this.selectedArtistId !== null) {
      this.songService.getSongsByArtistId(this.selectedArtistId).subscribe(songs => {
        this.artistSongs = songs;
      });
    }
  }

  goToSongDetails(songId: number) {
  this.router.navigate(['/songs', songId]);
}

}
