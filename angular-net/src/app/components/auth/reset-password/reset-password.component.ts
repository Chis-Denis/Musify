import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResetPasswordRequest } from '../../../models/auth.model';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { NotificationMessages } from '../../../constants/notification-messages';
import { Router, RouterModule  } from '@angular/router';
import { RoutePaths } from '../../../config/route-paths';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule 
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  routePaths = RoutePaths;
  token: string = '';
  newPassword: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  submit(): void {
    const request = new ResetPasswordRequest({
      token: this.token,
      newPassword: this.newPassword
    });

    this.authService.resetPassword(request).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.auth.resetPasswordSuccess);

        setTimeout(() => {
          this.router.navigate([this.routePaths.login]);
        }, 1500);
      },
      error: (err) => {
        const msg =
          typeof err.error === 'string'
            ? err.error
            : NotificationMessages.auth.resetPasswordError;

        this.notificationService.error(msg);
      }
    });
  }
}
