import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-playlist-edit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './playlist-edit-dialog.component.html',
  styleUrls: ['./playlist-edit-dialog.component.scss']
})
export class PlaylistEditDialogComponent {
  name = '';

  constructor(
    public dialogRef: MatDialogRef<PlaylistEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string }
  ) {
    this.name = data.name;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.name) {
      this.dialogRef.close({ name: this.name });
    }
  }
} 