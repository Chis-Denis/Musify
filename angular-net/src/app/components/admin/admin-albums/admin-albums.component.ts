import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Album } from '../../../models/albums.model';
import { BriefSongDTO } from '../../../models/song.model';
import { Artist } from '../../../models/artist.model';
import { SongService } from '../../../services/song.service';
import { ArtistsService } from '../../../services/artist.service';
import { AlbumsService } from '../../../services/albums.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { AlbumEditDialogComponent } from './album-edit-dialog/album-edit-dialog.component';
import { AlbumSongEditDialogComponent } from './album-song-edit-dialog/album-song-edit-dialog.component';
import { NotificationMessages } from '../../../constants/notification-messages';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-albums',
  standalone: true,
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatOption,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatOptionModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './admin-albums.component.html',
  styleUrl: './admin-albums.component.scss'
})
export class AdminAlbumsComponent implements OnInit {
  albums: Album[] = [];
  filteredAlbums: Album[] = [];
  paginatedAlbums: Album[] = [];
  artists: Artist[] = [];
  artistNames: Record<number, string> = {};
  songs: BriefSongDTO[] = [];
  dataSource = new MatTableDataSource<Album>([]);
  
  selectedArtistId: number = 0;

  showAlbums: boolean = true;
  showAlbumForm = false;
  today = new Date();
  error: string | null = null;

  newAlbum = { title: '', genre: '', artistId: 0, releaseDate: new Date(), label: '', description: '' };
  editingField: { [albumId: number]: 'artist' | 'releaseDate' | null } = {};

  editingAlbum: Album | null = null;
  editAlbumData: Album = new Album();

  genreFilter: string = '';
  titleFilter: string = '';
  isLoading: boolean = false;

  private currentEditingAlbumId: number | null = null;

  constructor(
    private albumService: AlbumsService,
    private artistService: ArtistsService,
    private songService: SongService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
  ) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    if (this.currentEditingAlbumId !== null) {
      const isClickInsideEditField = target.closest('.mat-mdc-form-field') || 
                                    target.closest('.mat-datepicker-popup') ||
                                    target.closest('.mat-mdc-select-panel') ||
                                    target.closest('button[mat-icon-button]');
      
      if (!isClickInsideEditField) {
        this.clearEditingField();
      }
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.albumService.getAll().subscribe(data => {
      this.albums = data;
      this.filteredAlbums = data;
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
    
    this.artistService.getAll().subscribe(data => {
      this.artists = data;
      this.artists.forEach(artist => {
        this.artistNames[artist.id!] = artist.type === 'band' ? artist.bandName! : artist.stageName!;
      });
    });
    
    this.songService.getAll().subscribe(data => this.songs = data);
  }

  private clearEditingField(): void {
    if (this.currentEditingAlbumId !== null) {
      this.editingField[this.currentEditingAlbumId] = null;
      this.currentEditingAlbumId = null;
    }
  }

  setEditingField(albumId: number, field: 'artist' | 'releaseDate'): void {
    this.clearEditingField();
    
    this.editingField[albumId] = field;
    this.currentEditingAlbumId = albumId;
  }

  editAlbum(album: Album): void {
    const dialogRef = this.dialog.open(AlbumEditDialogComponent, {
      width: '400px',
      data: { ...album } 
    });

    dialogRef.afterClosed().subscribe((result: Album | undefined) => {
      if (result) {
        this.albumService.updateAlbum(result).subscribe({
          next: () => {
            this.notificationService.success(NotificationMessages.album.updateSuccess);
            this.loadData();
          },
          error: () => {
            this.notificationService.error(NotificationMessages.album.updateError);
          }
        });
      }
    });
  }

  editAlbumSongs(album: Album): void {
    const dialogRef = this.dialog.open(AlbumSongEditDialogComponent, {
      width: '600px',
      data: album
    });

    dialogRef.afterClosed().subscribe((result: Album | undefined) => {
      if (result) {
        this.notificationService.success(NotificationMessages.album.updateSuccess);
        this.loadData();
      }
    });
  }

  applyFilters() {
    if (!this.genreFilter && !this.titleFilter) {
      this.dataSource.data = [...this.albums];
      return;
    }

    if (this.genreFilter) {
      this.isLoading = true;
      this.albumService.searchAlbumGenre(this.genreFilter).pipe(
        catchError(err => {
          this.notificationService.error(NotificationMessages.album.genreSearchNoResults);
          this.dataSource.data = []; 
          return of([]);
        })
      ).subscribe({
        next: (data: any[]) => {
          this.dataSource.data = data.map(item => new Album(item));
        }
      });
    }

    if (this.titleFilter) {
      this.isLoading = true;
      this.albumService.searchAlbum(this.titleFilter).pipe(
        catchError(err => {
          this.notificationService.error(NotificationMessages.album.searchNoResults);
          this.dataSource.data = [];
          return of([]);
        })
      ).subscribe({
        next: (data: any[]) => {
          this.dataSource.data = data.map(item => new Album(item));
        }
      });
    }
  }

  createAlbum(): void {
    if (!this.newAlbum.title || !this.newAlbum.artistId || !this.newAlbum.label || !this.newAlbum.genre || !this.newAlbum.releaseDate) return;
    
    const album = new Album(this.newAlbum);
    this.albumService.createAlbum(album).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.album.createSuccess);
        this.loadData();
        this.newAlbum = { title: '', genre: '', artistId: 0, releaseDate: new Date(), label: '', description: '' };
        this.showAlbumForm = false;
      },
      error: () => {
        this.notificationService.error(NotificationMessages.album.createError);
      }
    });
  }

  editPartialAlbum(album: Album): void {
    const date = new Date(album.releaseDate);
    date.setHours(12, 0, 0, 0);
    album.releaseDate = date;
    
    this.albumService.updateAlbum(album).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.album.updateSuccess);
        this.loadData();
        this.clearEditingField();
      },
      error: () => {
        this.notificationService.error(NotificationMessages.album.updateError);
      }
    });
  }

  submitAlbumEdit(): void {
    if (!this.editingAlbum) return;

    const updatedAlbum: Album = new Album({
      ...this.editAlbumData,
      id: this.editingAlbum.id
    });

    this.albumService.updateAlbum(updatedAlbum).subscribe({
      next: () => {
        this.notificationService.success(NotificationMessages.album.updateSuccess);
        this.editingAlbum = null;
        this.loadData();
      },
      error: () => {
        this.notificationService.error(NotificationMessages.album.updateError);
      }
    });
  }

  deleteAlbum(id: number): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: { message: 'Are you sure you want to delete this album?' }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.albumService.deleteAlbum(id).subscribe(() => {
            this.notificationService.success(NotificationMessages.album.deleteSuccess);
            this.loadData();
          });
        }
      });
    }
}