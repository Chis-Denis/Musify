import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordRequest } from '../../../models/auth.model';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { NotificationMessages } from '../../../constants/notification-messages';
import { Router, RouterModule } from '@angular/router';
import { RoutePaths } from '../../../config/route-paths';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule 
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  routePaths = RoutePaths;
  email: string = '';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  submit(): void {
    const request = new ForgotPasswordRequest({ email: this.email });

    this.authService.forgotPassword(request).subscribe({
      next: (res) => {
        this.notificationService.success(NotificationMessages.auth.forgotPasswordSuccess);
        console.log('Token (dev only):', res.token); // for dev/test only
      },
      error: (err) => {
        const msg =
          typeof err.error === 'string' && err.status === 404
            ? NotificationMessages.auth.forgotPasswordError
            : NotificationMessages.user.notFound;
        this.notificationService.error(msg);
      }
    });
  }
}
