import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule }    from '@angular/common';
import { RouterModule, Router }    from '@angular/router';
import { FormsModule }     from '@angular/forms';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatListModule }     from '@angular/material/list';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';
import { MatFormFieldModule }from '@angular/material/form-field';
import { MatInputModule }    from '@angular/material/input';
import { MatCardModule }     from '@angular/material/card';
import { SearchBarComponent }     from '../search-bar/search-bar.component';
import { UserProfileComponent }   from '../user-profile/user-profile.component';
import { RoutePaths }             from '../../../config/route-paths';
import { User }                   from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    SearchBarComponent,
    UserProfileComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() user: User | null = null;
  @Output() search = new EventEmitter<string>();

  constructor(private router: Router) {}

  menuItems = [
    { label: 'My albums', route: RoutePaths.albums },
    { label: 'My playlists', route: `/${RoutePaths.home}/${RoutePaths.playlists}` }
  ];

  onSearch(query: string) {
    if (query.trim()) {
      this.router.navigate([`/${RoutePaths.home}/${RoutePaths.search}`], {
        queryParams: { q: query.trim() }
      });
    }
  }
}
