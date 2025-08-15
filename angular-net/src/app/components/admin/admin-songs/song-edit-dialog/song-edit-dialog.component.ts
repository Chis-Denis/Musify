// File: src/app/admin/admin-songs/song-edit-dialog/song-edit-dialog.component.ts

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { BriefSongUpdateDTO } from '../../../../models/song.model';
import { Artist } from '../../../../models/artist.model';

@Component({
  selector: 'app-song-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './song-edit-dialog.component.html',
  styleUrls: ['./song-edit-dialog.component.scss']
})
export class SongEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SongEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BriefSongUpdateDTO & { artists: Artist[] }
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      title: this.data.title,
      artistIds: this.data.artistIds
    });
  }
}
