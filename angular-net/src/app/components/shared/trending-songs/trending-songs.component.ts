import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SongService } from '../../../services/song.service';
import { BriefSongDTO } from '../../../models/song.model';
import { RoutePaths } from '../../../config/route-paths';

@Component({
  selector: 'app-trending-songs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule
  ],
  templateUrl: './trending-songs.component.html',
  styleUrls: ['./trending-songs.component.scss']
})
export class TrendingSongsComponent implements OnInit {
  trendingSongs: BriefSongDTO[] = [];
  errorMessage = '';

  constructor(
    private songService: SongService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.songService.getTrending().subscribe({
      next: songs => this.trendingSongs = songs,
      error: err    => this.errorMessage = err.message
    });
  }

  viewDetails(id: number): void {
    this.router.navigate([`/${RoutePaths.home}/${RoutePaths.songs}`, id]);
  }

  getArtistsDisplay(artists?: string[]): string {
    if (!artists || artists.length === 0) {
      return 'Unknown Artist';
    }
    
    if (artists.length === 1) {
      return artists[0];
    }
    
    if (artists.length === 2) {
      return `${artists[0]} & ${artists[1]}`;
    }
    
    return `${artists[0]} & ${artists.length - 1} others`;
  }
}