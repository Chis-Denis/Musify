import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { SongService } from '../../../services/song.service';
import { BriefSongDTO, BriefSongCreationDTO, BriefSongUpdateDTO } from '../../../models/song.model';
import { ArtistsService } from '../../../services/artist.service';
import { Artist } from '../../../models/artist.model';
import { SongEditDialogComponent } from './song-edit-dialog/song-edit-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../services/notification.service';
import { NotificationMessages } from '../../../constants/notification-messages';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-songs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDialogModule,
    ConfirmDialogComponent,
    SongEditDialogComponent
  ],
  templateUrl: './admin-songs.component.html',
  styleUrls: ['./admin-songs.component.scss']
})
export class AdminSongsComponent implements OnInit {
  dataSource = new MatTableDataSource<BriefSongDTO>([]);
  displayedColumns: string[] = ['title', 'artists', 'creationDate', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  artists: Artist[] = [];
  newSong: BriefSongCreationDTO = { title: '', artistIds: [], creationDate: '' };
  filterValue = '';

  constructor(
    private songService: SongService,
    private artistService: ArtistsService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.dataSource.filterPredicate = (data: BriefSongDTO, filter: string) =>
      data.title.toLowerCase().includes(filter);
  }

  loadData(): void {
    this.songService.getAll().subscribe(songs => {
      this.dataSource.data = songs;
      this.dataSource.paginator = this.paginator;
    });

    this.artistService.getAll().subscribe(artists => {
      this.artists = artists;
    });
  }

  createSong(): void {
    if (!this.newSong.title || !this.newSong.artistIds?.length) return;

    this.songService.createSong(this.newSong).subscribe(() => {
      this.notification.success(NotificationMessages.song.createSuccess);
      this.newSong = { title: '', artistIds: [], creationDate: '' };
      this.loadData();
    }, () => {
      this.notification.error(NotificationMessages.song.createError);
    });
  }

  editSong(song: BriefSongDTO): void {
    const dialogRef = this.dialog.open(SongEditDialogComponent, {
      width: '400px',
      data: {
        ...song,
        artistIds: song.artistIds || [],
        artists: this.artists
      }
    });

    dialogRef.afterClosed().subscribe((result: BriefSongUpdateDTO | undefined) => {
      if (result) {
        this.songService.updateSong(song.id, result).subscribe(() => {
          this.notification.success(NotificationMessages.song.updateSuccess);
          this.loadData();
        }, () => {
          this.notification.error(NotificationMessages.song.updateError);
        });
      }
    });
  }

  deleteSong(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this song?' }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.songService.deleteSong(id).subscribe(() => {
          this.notification.success(NotificationMessages.song.deleteSuccess);
          this.loadData();
        }, () => {
          this.notification.error(NotificationMessages.song.deleteError);
        });
      }
    });
  }

  getArtistNames(ids: number[] = []): string {
    return this.artists
      .filter(artist => typeof artist.id === 'number' && ids.includes(artist.id))
      .map(artist => artist.stageName || `${artist.firstName} ${artist.lastName}`)
      .join(', ');
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterValue = value.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }
}
