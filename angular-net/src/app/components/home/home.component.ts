import { Component, OnInit, ViewChild }    from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule }                      from '@angular/forms';
import { RouterModule }                     from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule }    from '@angular/material/icon';
import { MatButtonModule }  from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }   from '@angular/material/input';
import { MatCardModule }    from '@angular/material/card';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule }    from '@angular/material/list';
import { CookieService } from 'ngx-cookie-service';
import { MusicComponent } from './music/music.component';

import { NavbarComponent }        from '../shared/navbar/navbar.component';
import { TrendingSongsComponent } from '../shared/trending-songs/trending-songs.component';
import { UserService }            from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { User }                   from '../../models/user.model';
import { Router } from '@angular/router';
import { RoutePaths } from '../../config/route-paths';
import { NotificationMessages } from '../../constants/notification-messages';
import { ArtistsComponent } from '../artists/artists.component'
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MusicComponent,

    NavbarComponent,
    TrendingSongsComponent,
    ArtistsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  user: User | null = null;
  searchQuery = '';
  showExtras = true;

  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: u   => (this.user = u),
      error: err =>  this.notificationService.error(NotificationMessages.user.notFound)
    });

    const hasToken = this.cookieService.check('token');
    if (!hasToken) {
      this.router.navigate([RoutePaths.login]);
    }

    this.router.events.pipe(
    filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
    this.showExtras = (event.url === '/home');});
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  onSearch(query: string) {
    console.log('Search term:', query);
  }
}
