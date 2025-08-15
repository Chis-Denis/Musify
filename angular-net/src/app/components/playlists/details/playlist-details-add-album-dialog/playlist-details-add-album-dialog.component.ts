import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { AlbumsService } from '../../../../services/albums.service';
import { Album } from '../../../../models/albums.model';

@Component({
  selector: 'app-playlist-details-add-album-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatListModule, MatButtonModule, MatIconModule, FormsModule, MatRadioModule],
  templateUrl: './playlist-details-add-album-dialog.component.html',
  styleUrls: ['./playlist-details-add-album-dialog.component.scss']
})
export class PlaylistDetailsAddAlbumDialogComponent implements OnInit {
  search = '';
  albums: Album[] = [];
  selectedAlbum: Album | null = null;

  constructor(
    public dialogRef: MatDialogRef<PlaylistDetailsAddAlbumDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private albumsService: AlbumsService
  ) {}

  ngOnInit() {
    this.albumsService.getAll().subscribe(albums => {
      this.albums = albums;
    });
  }

  filteredAlbums(): Album[] {
    if (!this.search) return this.albums;
    return this.albums.filter(album =>
      album.title.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  onCancel() {
    this.dialogRef.close();
  }

  onAdd() {
    if (this.selectedAlbum) {
      this.dialogRef.close(this.selectedAlbum);
    }
  }
} 