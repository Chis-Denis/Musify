import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Artist } from '../../../../models/artist.model';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
@Component({
  selector: 'app-edit-artist-dialog',
    imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatPaginatorModule
],
  templateUrl: './artist-edit-dialog.component.html',
  styleUrls: ['./artist-edit-dialog.component.scss']
})
export class EditArtistDialogComponent {
  editArtistData: Artist;

  constructor(
    public dialogRef: MatDialogRef<EditArtistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Artist
  ) {
    this.editArtistData = { ...data };
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.editArtistData);
  }
}
