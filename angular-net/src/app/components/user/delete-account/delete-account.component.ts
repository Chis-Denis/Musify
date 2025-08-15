import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { NotificationMessages } from '../../../constants/notification-messages';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule,
    MatIconModule 
  ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {
  @Input() disabled = false;
  showConfirmDialog = false;

  constructor(
    private userService: UserService,
    private notification: NotificationService,
    private router: Router
  ) {}

  showConfirmation(): void {
    this.showConfirmDialog = true;
  }

  cancelDelete(): void {
    this.showConfirmDialog = false;
  }

  confirmDelete(): void {
    this.showConfirmDialog = false;
    this.deleteAccount();
  }

  private deleteAccount(): void {
    this.userService.softDelete().subscribe({
      next: () => {
        this.notification.success(NotificationMessages.user.deleteSuccess);
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: { message: any; }) => {
        this.notification.error(err.message || 'Failed to delete account.');
      }
    });
  }
}