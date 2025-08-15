import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-playlist-create-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  templateUrl: './playlist-create-dialog.component.html',
  styleUrls: ['./playlist-create-dialog.component.scss']
})
export class PlaylistCreateDialogComponent {
  name = '';
  type: 'public' | 'private' = 'public';

  constructor(
    public dialogRef: MatDialogRef<PlaylistCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.name && this.type) {
      this.dialogRef.close({ name: this.name, type: this.type });
    }
  }
} 