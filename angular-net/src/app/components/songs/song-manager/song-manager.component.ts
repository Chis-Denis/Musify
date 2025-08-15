import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongCreateComponent } from '../song-create/song-create.component';
import { SongUpdateComponent } from '../song-update/song-update.component';
import { SongDeleteComponent } from '../song-delete/song-delete.component';
import { ArtistSongsComponent } from '../artist-songs/artist-songs.component';

@Component({
  selector: 'app-song-manager',
  standalone: true,
  imports: [
    CommonModule,
    SongCreateComponent,
    SongUpdateComponent,
    SongDeleteComponent,
    ArtistSongsComponent
  ],
  templateUrl: './song-manager.component.html',
  styleUrls: ['./song-manager.component.scss']
})
export class SongManagerComponent {}
