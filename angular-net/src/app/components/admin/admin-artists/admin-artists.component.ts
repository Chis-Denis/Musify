import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ArtistsService } from '../../../services/artist.service';
import { Artist, ArtistDetails } from '../../../models/artist.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { NotificationMessages } from '.././../../constants/notification-messages';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatDivider } from "@angular/material/divider";
import { MatDialog } from '@angular/material/dialog';
import { EditArtistDialogComponent } from '../admin-artists/artist-edit-dialog/artist-edit-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-artists',
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
    MatPaginatorModule,
    MatDivider
],
  templateUrl: './admin-artists.component.html',
  styleUrl: './admin-artists.component.scss'
})
export class AdminArtistsComponent {
  artists: Artist[] = [];
  bands: Artist[] = [];
  persons: Artist[] = [];

  searchName: string = '';
  selectedBandId?: number;
  selectedMemberId?: number;
  selectedArtistId: number = 0;

  selectedArtist: ArtistDetails = new ArtistDetails();
  showArtists: boolean = true;
  showArtistForm = false;
  newArtist: any = {
    type: 'person',
    stageName: '',
    firstName: '',
    lastName: '',
    bandName: '',
    location: '',
    activeStart: '',
    activeEnd: '',
    birthday: ''
  };
  editingArtist: Artist | null = null;

  dataSource = new MatTableDataSource<Artist>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  editArtistData: Artist = {
    id: 0,
    stageName: '',
    firstName: '',
    lastName: '',
    birthday: '',
    location: '',
    activeStart: '',
    activeEnd: '',
    type: 'person',
  };

  constructor(
    private router: Router,
    private artistService: ArtistsService,
    private snackBar: MatSnackBar,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {
      this.artistService.getAll().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.artists = data;
    });
    this.loadBands();
    this.loadPersons();
  }

  loadData(): void {
    this.artistService.getAll().subscribe(data => {
      this.artists = data;
      this.dataSource.data = data;
    });
    this.loadBands();
    this.loadPersons();
  }

  loadBands() {
    this.artistService.getAll('band').subscribe({
      next: data => this.bands = data,
    });
  }

  loadPersons() {
    this.artistService.getAll('person').subscribe({
      next: data => this.persons = data,
    });
  }

  addMember() {
    if (!this.selectedBandId || !this.selectedMemberId) return;
    console.log(this.selectedBandId + " " + this.selectedArtistId)

    const dto = {
      bandId: this.selectedBandId,
      memberId: this.selectedMemberId
    };

    this.artistService.addBandMember(dto).subscribe({
      next: () => {
        this.notificationService.error(NotificationMessages.artist.addMemberSuccess)
        this.selectedBandId = undefined;
        this.selectedMemberId = undefined;
      },
      error: err => {
        this.notificationService.error(NotificationMessages.artist.addMemberError)
        this.selectedBandId = undefined;
        this.selectedMemberId = undefined;
      }
    });
  }

  removeMember() {
    if (!this.selectedBandId || !this.selectedMemberId) return;
    console.log(this.selectedBandId + " " + this.selectedArtistId)

    const dto = {
      bandId: this.selectedBandId,
      memberId: this.selectedMemberId
    };

    this.artistService.removeBandMember(dto).subscribe({
      next: () => {
        this.notificationService.error(NotificationMessages.artist.removeMemberSuccess)
        this.selectedBandId = undefined;
        this.selectedMemberId = undefined;
      },
      error: err => {
        this.notificationService.error(NotificationMessages.artist.removeMemberError)
        this.selectedBandId = undefined;
        this.selectedMemberId = undefined;
      }
    });
  }

  createArtist(): void {
    if (!this.newArtist) return;

    const artistToSend: any = {
      type: this.newArtist.type,
      activeStart: this.newArtist.activeStart,
      activeEnd: this.newArtist.activeEnd
    };

    if (this.newArtist.type === 'person') {
      artistToSend.stageName = this.newArtist.stageName;
      artistToSend.firstName = this.newArtist.firstName;
      artistToSend.lastName = this.newArtist.lastName;
      artistToSend.birthday = this.newArtist.birthday;
    } else if (this.newArtist.type === 'band') {
      artistToSend.bandName = this.newArtist.bandName;
      artistToSend.location = this.newArtist.location;
    }

    this.artistService.create(artistToSend).subscribe({
      next: () => {
        this.notificationService.error(NotificationMessages.artist.createSuccess)
        this.showArtistForm = false;
        this.loadData();
      },
      error: (err) => {
        this.notificationService.error(NotificationMessages.artist.createError)
        this.snackBar.open('Artist creation failed', 'Close', { duration: 3000 });
      }
    });
  }


  editArtist(artist: Artist): void {
    const dialogRef = this.dialog.open(EditArtistDialogComponent, {
      width: '600px',
      data: artist,
      panelClass: 'artist-edit-dialog', // Add this class for consistency
      disableClose: false,
      autoFocus: true,
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe((result: Artist | undefined) => {
      if (result) {
        this.artistService.update(result).subscribe({
          next: () => {
            this.notificationService.success(NotificationMessages.artist.updateSuccess);
            this.loadData();
          },
          error: () => {
            this.notificationService.error(NotificationMessages.artist.updateError);
          }
        });
      }
    });
  }


  submitArtistEdit(): void {
    if (!this.editingArtist) return;

    const updatedArtist: Artist = {
      ...this.editArtistData,
      id: this.editingArtist.id
    };

    this.artistService.update(updatedArtist).subscribe(() => {
      this.notificationService.error(NotificationMessages.artist.updateSuccess)
      this.editingArtist = null;
      this.loadData();
    });
  }

  deleteArtist(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this artist?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
    this.artistService.delete(id).subscribe(() => {
      this.notificationService.error(NotificationMessages.artist.deleteSuccess)
      this.loadData();
    });
      }
    });
  }

  search() {
    this.selectedArtist = new ArtistDetails();

    if (!this.searchName.trim()){
      this.loadData();
      return;
    }

    this.artistService.search(this.searchName).subscribe({
      next: (results) => {
        this.dataSource.data = results.filter(a => a.type === 'person');
      },
      error: () => {
        this.notificationService.error(NotificationMessages.artist.searchNoResults)
        this.persons = [];
        this.bands = [];
      }
    })
  }

    openConfirmDialog(message: string): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: { message },
        panelClass: 'confirm-dialog', 
        disableClose: false,
        autoFocus: true,
        restoreFocus: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.artistService.delete(this.selectedArtistId).subscribe({
            next: () => {
              this.notificationService.success(NotificationMessages.artist.deleteSuccess);
              this.loadData();
            },
            error: () => {
              this.notificationService.error(NotificationMessages.artist.deleteError);
            }
          });
        }
      });
    }
}
