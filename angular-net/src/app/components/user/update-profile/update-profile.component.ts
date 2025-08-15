import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../models/user-role.enum';
import { Router, RouterModule } from '@angular/router';
import { RoutePaths } from '../../../config/route-paths';
import { NotificationMessages } from '../../../constants/notification-messages';
import { NotificationService } from '../../../services/notification.service';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  @Input() currentUser: User | null = null; 
  @Output() dialogOpen = new EventEmitter<void>();
  @Output() dialogClose = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<{updatedUser: User, changedFields: Partial<User>}>(); 
  routePaths = RoutePaths;
  showUpdateDialogFlag = false;

  originalUser: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    role: UserRole.User,
    isActive: true,
    isDeleted: false
  };

  user: User = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    role: UserRole.User,
    isActive: true,
    isDeleted: false
  };

  constructor(
    private userService: UserService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.originalUser = res; 
        this.resetForm(); 
      },
      error: () => this.notification.error(NotificationMessages.user.notFound)
    });
  }

  updateProfile(): void {
    const changedFields: Partial<User> = {};
    
    if (this.user.firstName !== this.originalUser.firstName) {
      changedFields.firstName = this.user.firstName;
    }
    if (this.user.lastName !== this.originalUser.lastName) {
      changedFields.lastName = this.user.lastName;
    }
    if (this.user.email !== this.originalUser.email) {
      changedFields.email = this.user.email;
    }
    if (this.user.country !== this.originalUser.country) {
      changedFields.country = this.user.country;
    }

    this.userService.updateProfile(this.user.id, this.user).subscribe({
      next: (updatedUser) => {
        this.originalUser = updatedUser;
        this.profileUpdated.emit({ updatedUser, changedFields });
        this.notification.success(NotificationMessages.user.updateSuccess);
        this.showUpdateDialogFlag = false;
        this.dialogClose.emit();
      },
      error: () => {
        this.notification.error(NotificationMessages.user.createError);
      }
    });
  }

  showUpdateDialog(): void {
    if (this.currentUser) {
      this.originalUser = { ...this.currentUser };
      this.resetForm();
    }
    this.showUpdateDialogFlag = true;
    this.dialogOpen.emit();
  }

  cancelUpdate(): void {
    this.resetForm(); 
    this.showUpdateDialogFlag = false;
    this.dialogClose.emit();
  }

  private resetForm(): void {
    this.user = { ...this.originalUser };
  }
}
