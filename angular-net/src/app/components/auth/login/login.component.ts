import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserLogin, AuthResponse } from '../../../models/auth.model';
import { RoutePaths } from '../../../config/route-paths';
import { NotificationMessages } from '../../../constants/notification-messages';
import { NotificationService } from '../../../services/notification.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string | null = null;
  errorMessage: string = '';
  public routePaths = RoutePaths;

  constructor(private authService: AuthService, private router: Router, private notification: NotificationService, private cookieService: CookieService) {}

  validateEmail() {
    if (!this.email) {
      this.errorMessage = 'You must enter a value';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

  onSubmit() {
    this.validateEmail();
    if (!this.email || !this.password || this.errorMessage) return;
    const credentials: UserLogin = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe({
      next: (res: AuthResponse) => {
        //Here is where we use cookies
        this.cookieService.set('token', res.token, 7);
        this.error = null;
        this.notification.success(NotificationMessages.auth.loginSuccess);
        this.router.navigate([`/${RoutePaths.home}`]);
      },
      error: (err: any) => {
        this.error = err.error ? err.error : 'Login failed.';
        this.notification.error(NotificationMessages.auth.loginError);
      }
    });
  }
}
