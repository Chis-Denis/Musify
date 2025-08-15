import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { RoutePaths } from '../../../config/route-paths';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../models/user-role.enum';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  @Input() user: User | null = null;
  routePaths = RoutePaths;
  userRole = UserRole;

  constructor(private router: Router, private cookieService: CookieService) {}

  logout() {
    localStorage.clear();
    this.cookieService.delete('token', '/');
    this.cookieService.deleteAll();// aci papa cookies
    this.router.navigate([this.routePaths.login]);
  }
}