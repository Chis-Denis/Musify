import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar ) { }

  success(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['toast-success']
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['toast-error']
    });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['toast-info']
    });
  }

  warn(message: string, action: string = 'Close', duration: number = 3000): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration,
      panelClass: ['toast-warn']
    });
  }
}
