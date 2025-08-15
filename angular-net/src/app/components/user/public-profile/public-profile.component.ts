import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { PlaylistDto } from '../../../models/playlists.model';
import { PlaylistService } from '../../../services/playlists.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RoutePaths } from '../../../config/route-paths';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
  imports: [CommonModule, MatCardModule, MatIconModule]
})
export class PublicProfileComponent implements OnInit {
  user: User | null = null;
  playlists: PlaylistDto[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private playlistsService: PlaylistService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getById(+userId).subscribe((user: User | null) => {
        if (user != null) {
          this.user = user;
          this.playlistsService.getPublicPlaylists().subscribe((playlists: PlaylistDto[]) => {
            this.playlists = playlists.filter(p => p.userId === +userId);
          });
        } else {
          // ... handle unknown user
        }
        this.user = user;
        this.playlistsService.getPublicPlaylists().subscribe((playlists: PlaylistDto[]) => {
          this.playlists = playlists.filter(p => p.userId === +userId);
        });
      });
    }
  }

  viewPlaylist(id: number){
      //this.router.navigate([`/${RoutePaths.home}/${RoutePaths.artists}`, id]);
  }
}
