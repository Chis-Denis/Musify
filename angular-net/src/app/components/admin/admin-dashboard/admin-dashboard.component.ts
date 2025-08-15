import { AdminSongsComponent } from './../admin-songs/admin-songs.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { RoutePaths } from '../../../config/route-paths';

import { AdminAlbumsComponent } from '../admin-albums/admin-albums.component';
import { AdminArtistsComponent } from '../admin-artists/admin-artists.component'
import { AdminUsersComponent } from '../admin-users/admin-users.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    AdminUsersComponent,
    AdminSongsComponent,
    AdminArtistsComponent,
    AdminAlbumsComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  showSongs: boolean = true;
  showAlbums: boolean = true;
  showArtists: boolean = true;
  showUsers: boolean = true;

  showSongForm = false;
  showAlbumForm = false;
  showArtistForm = false;
  showUserForm = false;

  constructor(
    private router: Router
  ) {}

  goBack(): void {
    this.router.navigate([RoutePaths.home]);
  }

  ngOnInit(): void {}
}
