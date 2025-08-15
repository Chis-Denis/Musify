import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';
import { ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { UserRole } from '../../../models/user-role.enum';
import { NotificationService } from '../../../services/notification.service';
import { NotificationMessages } from '../../../constants/notification-messages';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['email', 'role', 'actions'];
  UserRole = UserRole;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('editFormSection') editFormSection!: ElementRef;

  newUser: Partial<User> = {
    email: '',
    passwordHash: '',
    firstName: '',
    lastName: '',
    country: '',
    role: UserRole.User,
    isActive: true,
    isDeleted: false
  };

  editingUser: User | null = null;
  editUserData: User = {
    id: 0,
    email: '',
    passwordHash: '',
    firstName: '',
    lastName: '',
    country: '',
    role: UserRole.User,
    isActive: true,
    isDeleted: false,
    token: ''
  };

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    this.dataSource.filterPredicate = (data: User, filter: string) =>
      data.email.toLowerCase().includes(filter);
  }

  loadUsers(): void {
    this.userService.getAll().subscribe(users => {
      this.dataSource.data = users;
      this.dataSource.paginator = this.paginator;
    });
  }

  resetForm(): void {
    this.newUser = {
      email: '',
      passwordHash: '',
      firstName: '',
      lastName: '',
      country: '',
      role: UserRole.User,
      isActive: true,
      isDeleted: false
    };
  }

  createUser(): void {
    const userToSend = {
      ...this.newUser,
      password: this.newUser.passwordHash
    };
    delete userToSend.passwordHash;

    this.userService.create(userToSend).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.user.createSuccess);
        this.loadUsers();
        this.resetForm();
      },
      error: (error) => {
        console.error('Create user error:', error);

        const errorMsg = typeof error.error === 'string'
          ? error.error
          : error.error?.message || NotificationMessages.user.createError;

        this.notificationService.error(errorMsg);
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false,
      panelClass: 'user-edit-dialog',
      data: { ...user }
    });

    dialogRef.afterClosed().subscribe((result: User | undefined) => {
      if (result) {
        this.userService.update(result).subscribe({
          next: () => {
            this.notificationService.success(NotificationMessages.user.updateSuccess);
            this.loadUsers();
          },
          error: () => {
            this.notificationService.error(NotificationMessages.user.notFound);
          }
        });
      }
    });
  }

  submitUserEdit(): void {
    if (!this.editingUser) return;

    const updatedUser: User = {
      ...this.editUserData,
      id: this.editingUser.id
    };

    this.userService.update(updatedUser).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.user.updateSuccess);
        this.editingUser = null;
        this.loadUsers();
      },
      error: () => {
        this.notificationService.error(NotificationMessages.user.notFound);
      }
    });
  }

  deleteUser(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this user?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.delete(id).subscribe(() => {
          this.notificationService.success(NotificationMessages.user.deleteSuccess);
          this.loadUsers();
        });
      }
    });
  }

  changeRole(user: User): void {
    const newRole = user.role === UserRole.Admin ? UserRole.User : UserRole.Admin;

    this.userService.changeUserRole(user.id, newRole).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.admin.changeRoleSuccess);
        this.loadUsers();
      },
      error: () => {
        this.notificationService.error(NotificationMessages.admin.changeRoleError);
      }
    });
  }

  deactivate(user: User): void {
    this.userService.deactivateUser(user.id).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.admin.deactivateSuccess);
        this.loadUsers();
      },
      error: () => {
        this.notificationService.error(NotificationMessages.admin.deactivateError);
      }
    });
  }

  activate(user: User): void {
    this.userService.activateUser(user.id).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.admin.activateSuccess);
        this.loadUsers();
      },
      error: () => {
        this.notificationService.error(NotificationMessages.admin.activateError);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
