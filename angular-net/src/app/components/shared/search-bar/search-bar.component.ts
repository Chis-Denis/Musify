import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RoutePaths } from '../../../config/route-paths';
import { SearchService } from '../../../services/search.service';
import { BriefSongDTO } from '../../../models/song.model';
import { Album } from '../../../models/albums.model';
import { Artist } from '../../../models/artist.model';
import { PlaylistDto } from '../../../models/playlists.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  routePaths = RoutePaths;
  query: string = '';

  songs: BriefSongDTO[] = [];
  albums: Album[] = [];
  artists: Artist[] = [];
  playlists: PlaylistDto[] = [];

  @Output() search = new EventEmitter<string>();

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
    });
  }

  onSearch(): void {
    if (this.query.trim()) {
      this.router.navigate([`/${RoutePaths.home}/${RoutePaths.search}`], {
        queryParams: { q: this.query.trim() }
      });
    }
  }
}
