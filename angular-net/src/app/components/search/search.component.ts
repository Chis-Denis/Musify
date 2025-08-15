import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RoutePaths } from '../../config/route-paths';
import { SearchService } from '../../services/search.service';
import { BriefSongDTO } from '../../models/song.model';
import { Album } from '../../models/albums.model';
import { Artist } from '../../models/artist.model';
import { PlaylistDto } from '../../models/playlists.model';
import { User } from '../../models/user.model';
import { Paginator } from './paginator';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  routePaths = RoutePaths;
  query: string = '';
  songs = new Paginator<BriefSongDTO>();
  albums = new Paginator<Album>();
  artists = new Paginator<Artist>();
  playlists = new Paginator<PlaylistDto>();
  users = new Paginator<User>();

  constructor(private route: ActivatedRoute, private searchService: SearchService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
    this.query = params['q'] || '';

    if (this.query.trim()) {
      this.searchService.search(this.query).subscribe(results => {
        this.songs.items = results.songs;
        this.albums.items = results.albums;
        this.artists.items = results.artists;
        this.playlists.items = results.playlists.filter(p => p.type === 'public');
        this.users.items = results.users;
      });
    }
    });
  }

  hasResults(): boolean {
    return (
      this.songs.items.length > 0 ||
      this.albums.items.length > 0 ||
      this.artists.items.length > 0 ||
      this.playlists.items.length > 0 ||
      this.users.items.length > 0
    );
  }


  viewSong(id: number){
    this.router.navigate([`/${RoutePaths.home}/${RoutePaths.songs}`, id]);
  }

  viewAlbum(id: number){
    this.router.navigate([`/${RoutePaths.home}/${RoutePaths.albums}`, id]);
  }

  viewArtist(id: number){
    this.router.navigate([`/${RoutePaths.home}/${RoutePaths.artists}`, id]);
  }

  viewUser(id: number){
    this.router.navigate([`/${RoutePaths.home}/${RoutePaths.publicProfile}`, id]);
  }

  viewPlaylist(id: number){
    this.router.navigate([`/${RoutePaths.home}/${RoutePaths.playlists}`, id]);
  }
}
