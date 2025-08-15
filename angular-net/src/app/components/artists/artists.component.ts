import { NotificationMessages } from './../../constants/notification-messages';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Artist, ArtistDetails } from '../../models/artist.model';
import { ArtistsService } from '../../services/artist.service';
import { RoutePaths } from '../../config/route-paths';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService } from '../../services/notification.service';
import { Paginator } from '../search/paginator';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})

export class ArtistsComponent implements OnInit {
  persons = new Paginator<Artist>([],10);
  bands = new Paginator<Artist>([],10);
  routePaths = RoutePaths;
  selectedArtist: ArtistDetails = new ArtistDetails();

  constructor(private router: Router,private artistService: ArtistsService, private notificationService: NotificationService) {}

   ngOnInit() {
    this.loadArtists();
  }

  private formatDate(dateString?: string): string {
    return dateString ? dateString.split('T')[0] : '';
  }

  loadArtists() {
    this.artistService.getAll('person').subscribe({
      next: (data) => {
        this.persons.items = data.map(a => ({
          ...a,
          birthday: this.formatDate(a.birthday),
          activeStart: this.formatDate(a.activeStart),
          activeEnd: this.formatDate(a.activeEnd),
        }));
      },
      error: () => this.notificationService.error(NotificationMessages.artist.loadError)
    });

    this.artistService.getAll('band').subscribe({
      next: (data) => {
        this.bands.items = data.map(a => ({
          ...a,
          activeStart: this.formatDate(a.activeStart),
          activeEnd: this.formatDate(a.activeEnd),
        }));
      },
      error: () => this.notificationService.error(NotificationMessages.artist.loadError)
    });
  }

  viewProfile(id?: number){
    this.router.navigate([ `/${RoutePaths.home}/${RoutePaths.artists}`, id]);
  }
}
