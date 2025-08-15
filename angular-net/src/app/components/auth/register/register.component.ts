import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRegister, AuthResponse } from '../../../models/auth.model';
import { RoutePaths } from '../../../config/route-paths';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../services/notification.service';
import { NotificationMessages } from '../../../constants/notification-messages';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  newUser: UserRegister = new UserRegister();
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router, private notification: NotificationService) {}

  validateEmail() {
    if (!this.newUser.email) {
      this.notification.error(NotificationMessages.auth.emailRequired);
      return false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.newUser.email)) {
      this.notification.error(NotificationMessages.auth.emailInvalid);
      return false;
    } else {
      return true;
    }
  }

  onSubmit() {
    this.error = null;
    if (!this.newUser.firstName || !this.newUser.lastName || !this.newUser.email || !this.newUser.password || !this.newUser.country) {
      this.notification.error(NotificationMessages.auth.allFieldsRequired);
      return;
    }
    if(!this.validateEmail()) return;
    const user = new UserRegister(this.newUser);

    this.authService.register(user).subscribe({
      next: () => {
        this.error = null;
        this.notification.success(NotificationMessages.auth.registerSuccess);
        setTimeout(() => {
          this.router.navigate([`/${RoutePaths.login}`]);
        }, 1500);
      },
      error: (err: any) => {
        let errorMsg = 'Registration failed.';
        if (err && err.error) {
          if (typeof err.error === 'string') {
            errorMsg = err.error;
          } else if (err.error.detail) {
            errorMsg = err.error.detail;
          }
        }
        this.error = errorMsg;
      }
    });
  }
}
