import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ChangePasswordRequest } from '../../../models/change-password.model';
import { NotificationService } from '../../../services/notification.service';
import { NotificationMessages } from '../../../constants/notification-messages';
import { RoutePaths } from '../../../config/route-paths';
import { Router, RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../shared/back-button/back-button.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    BackButtonComponent
  ],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  routePaths = RoutePaths;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.notificationService.error('Passwords do not match.');
      return;
    }

    const payload: ChangePasswordRequest = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.userService.changePassword(payload).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.user.changePasswordSuccess);

        setTimeout(() => {
          this.router.navigate([this.routePaths.home]);
        }, 1000);
      },
      error: (err) => {
        this.notificationService.error(
          typeof err.error === 'string'
            ? err.error
            : NotificationMessages.user.changePasswordError
        );
      }
    });
  }
}
