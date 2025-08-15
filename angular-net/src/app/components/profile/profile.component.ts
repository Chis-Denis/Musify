import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserRole } from '../../models/user-role.enum';
import { RoutePaths } from '../../config/route-paths';
import { Router, RouterModule } from '@angular/router';
import { UpdateProfileComponent } from '../user/update-profile/update-profile.component';
import { DeleteAccountComponent } from '../user/delete-account/delete-account.component';
import { BackButtonComponent } from '../shared/back-button/back-button.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule,
    RouterModule,
    UpdateProfileComponent,
    DeleteAccountComponent,
    BackButtonComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  routePaths = RoutePaths;
  user: User | null = null;
  isUpdateDialogOpen = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (err) => console.error('Failed to fetch profile', err)
    });
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case UserRole.Admin:
        return 'Administrator';
      case UserRole.User:
        return 'Regular User';
      default:
        return role;
    }
  }

  onUpdateDialogOpen() {
    this.isUpdateDialogOpen = true;
  }

  onUpdateDialogClose() {
    this.isUpdateDialogOpen = false;
  }

  onProfileUpdated(updateData: {updatedUser: User, changedFields: Partial<User>}) {
    if (!this.user) return;

    if (updateData.changedFields.firstName !== undefined) {
      this.user.firstName = updateData.changedFields.firstName;
    }
    if (updateData.changedFields.lastName !== undefined) {
      this.user.lastName = updateData.changedFields.lastName;
    }
    if (updateData.changedFields.email !== undefined) {
      this.user.email = updateData.changedFields.email;
    }
    if (updateData.changedFields.country !== undefined) {
      this.user.country = updateData.changedFields.country;
    }
    this.isUpdateDialogOpen = false;
  }
}
