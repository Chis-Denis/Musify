import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Album } from '../../../../models/albums.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Artist } from '../../../../models/artist.model';
import { ArtistsService } from '../../../../services/artist.service';

@Component({
  selector: 'app-album-edit-dialog',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './album-edit-dialog.component.html',
  styleUrls: ['./album-edit-dialog.component.scss']
})
export class AlbumEditDialogComponent {

  today = new Date();
  artists: Artist[] = [];

  constructor(
    public dialogRef: MatDialogRef<AlbumEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Album,
    private artistService: ArtistsService
  ) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  loadArtists(): void {
    this.artistService.getAll().subscribe(artists => this.artists = artists);
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.data);
  }
}
