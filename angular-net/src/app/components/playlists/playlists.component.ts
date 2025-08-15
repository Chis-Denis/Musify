import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { PlaylistService } from '../../services/playlists.service';
import { PlaylistDto, CreatePlaylistDto } from '../../models/playlists.model';
import { Subject, takeUntil } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationMessages } from '../../constants/notification-messages';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { RoutePaths } from '../../config/route-paths';
import { MatDialog } from '@angular/material/dialog';
import { PlaylistsCategoriesComponent } from './playlists-categories/playlists-categories.component';
import { PlaylistsMyPlaylistsComponent } from './playlists-my-playlists/playlists-my-playlists.component';
import { PlaylistCreateDialogComponent } from './playlist-management/playlist-create-dialog/playlist-create-dialog.component';
import { PlaylistEditDialogComponent } from './playlist-management/playlist-edit-dialog/playlist-edit-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatListModule,
    PlaylistsMyPlaylistsComponent,
    PlaylistsCategoriesComponent,
    PlaylistCreateDialogComponent,
    PlaylistEditDialogComponent
  ],
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  playlists: PlaylistDto[] = [];
  followedPlaylists: PlaylistDto[] = [];
  selectedPlaylist: PlaylistDto | null = null;
  searchResults: PlaylistDto[] = [];
  loading = false;
  playlistFilter: 'public' | 'private' | 'followed' | '' = '';
  followUserId: number | null = null;
  myPlaylistsView: 'followed' | 'created' = 'followed';
  searchName = '';
  userNames: { [userId: number]: string } = {};

  constructor(
    private playlistService: PlaylistService,
    private cookieService: CookieService,
    private userService: UserService,
    private notification: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.followUserId = user.id;
        this.loadAllData();
      },
      error: () => {
        this.notification.error(NotificationMessages.auth.forgotPasswordError);
      }
    });

    console.log(this.followUserId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAllData(): void {
    this.getAllPlaylists();
    if (this.followUserId) {
      this.getFollowedPlaylists();
    }
  }

  getAllPlaylists(): void {
    this.loading = true;
    this.playlistService.getAllPlaylists()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.playlists = data;
          this.loading = false;
        
          data.forEach(p => {
            if (p.userId && p.userId > 0 && this.userNames[p.userId] !== 'Deleted User') {
              this.loadUserName(p.userId);
            }
          });
        },
        error: () => {
          this.loading = false;
          if (this.playlistFilter === 'public') {
            this.notification.error(NotificationMessages.playlist.publicLoadError);
          } else if (this.playlistFilter === 'private') {
            this.notification.error(NotificationMessages.playlist.privateLoadError);
          } else {
            this.notification.error(NotificationMessages.playlist.publicLoadError);
          }
        }
      });
  }

  getFollowedPlaylists(): void {
    if (!this.followUserId) return;
    this.loading = true;
    this.playlistService.getFollowedPlaylists(this.followUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.followedPlaylists = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.notification.error(NotificationMessages.playlist.privateLoadError);
        }
      });
  }

  onCreatePlaylist(event: { name: string; type: string }) {
    this.loading = true;
    const dto: CreatePlaylistDto = {
      name: event.name,
      userId: this.followUserId!,
      type: event.type
    };
    this.playlistService.createPlaylist(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created) => {
          setTimeout(() => {
            this.playlistService.followPlaylist(created.id, this.followUserId!).pipe(takeUntil(this.destroy$)).subscribe({
              next: () => {},
              error: () => {}
            });
            this.loadAllData();
            this.loading = false;
            this.notification.success(NotificationMessages.playlist.createSuccess);
          });
        },
        error: () => {
          this.loading = false;
          this.notification.error(NotificationMessages.playlist.createError);
        }
      });
  }

  onUpdatePlaylistName(newName: string) {
    if (!this.selectedPlaylist) return;
    this.loading = true;
    this.playlistService.updatePlaylistName(this.selectedPlaylist.id, newName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.selectedPlaylist = null;
          this.loadAllData();
          this.loading = false;
          this.notification.success(NotificationMessages.playlist.updateNameSuccess);
        },
        error: () => {
          this.loading = false;
          this.notification.error(NotificationMessages.playlist.updateNameError);
        }
      });
  }

  onCancelEdit() {
    this.selectedPlaylist = null;
  }

  deletePlaylist(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this playlist?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loading = true;
        this.playlistService.deletePlaylist(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              if (this.selectedPlaylist?.id === id) {
                this.selectedPlaylist = null;
              }
              this.loadAllData();
              this.loading = false;
              this.notification.success(NotificationMessages.playlist.deleteSuccess);
            },
            error: () => {
              this.loading = false;
              this.notification.error(NotificationMessages.playlist.deleteError);
            }
          });
      }
    });
  }

  selectPlaylist(playlist: PlaylistDto): void {
    this.selectedPlaylist = playlist;
  }

  setPlaylistFilter(type: 'public' | 'private' | 'followed' | ''): void {
    this.playlistFilter = type;
  }

  get filteredPlaylists(): PlaylistDto[] {
    if (!this.followUserId) return [];
    let list: PlaylistDto[] = [];
    if (this.playlistFilter === 'public') {
      list = this.playlists.filter(p => p.type === 'public');
    } else if (this.playlistFilter === 'private') {
      list = this.playlists.filter(p => p.type === 'private' && p.userId === this.followUserId);
    } else if (this.playlistFilter === 'followed') {
      list = this.playlists.filter(p => this.followedPlaylists.some(f => f.id === p.id));
    } else {
      list = this.playlists.filter(p => p.type === 'public' || (p.type === 'private' && p.userId === this.followUserId));
    }
    if (this.searchName && this.searchName.trim().length > 0) {
      list = list.filter(p => p.name.toLowerCase().includes(this.searchName.trim().toLowerCase()));
    }
    return list;
  }

  getFollowColor(playlist: PlaylistDto): 'warn' | null {
    return this.followedPlaylists.some(f => f.id === playlist.id) ? 'warn' : null;
  }

  getFollowIcon(playlist: PlaylistDto): string {
    return this.followedPlaylists.some(f => f.id === playlist.id) ? 'favorite' : 'favorite_border';
  }

  get createdPlaylists(): PlaylistDto[] {
    return this.playlists.filter(p => p.userId === this.followUserId);
  }

  onMyPlaylistsViewChange(view: 'followed' | 'created') {
    this.myPlaylistsView = view;
  }
  onMyPlaylistsUserIdChange(userId: number | null) {
    this.followUserId = userId;
  }

  toggleFollowPlaylist(playlist: PlaylistDto): void {
    if (!this.followUserId) return;

    const isFollowed = this.followedPlaylists.some(f => f.id === playlist.id);

    if (isFollowed) {
      this.followedPlaylists = this.followedPlaylists.filter(f => f.id !== playlist.id);
      this.unfollowPlaylist(playlist.id);
    } else {
      this.followedPlaylists = [...this.followedPlaylists, playlist];
      this.followPlaylist(playlist.id);
    }
  }

  private followPlaylist(playlistId: number): void {
    if (!this.followUserId) return;

    this.playlistService.followPlaylist(playlistId, this.followUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.success(NotificationMessages.playlist.followSuccess);
        },
        error: (err) => {
          if (err?.error && typeof err.error === 'string' && err.error.toLowerCase().includes('already')) {
            this.notification.success(NotificationMessages.playlist.alreadyFollowing);
          } else {
            this.followedPlaylists = this.followedPlaylists.filter(f => f.id !== playlistId);
            this.notification.error(NotificationMessages.playlist.followError);
          }
        }
      });
  }

  private unfollowPlaylist(playlistId: number): void {
    if (!this.followUserId) return;

    this.playlistService.unfollowPlaylist(playlistId, this.followUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notification.success(NotificationMessages.playlist.unfollowSuccess);
        },
        error: () => {
          const playlist = this.playlists.find(p => p.id === playlistId);
          if (playlist) {
            this.followedPlaylists = [...this.followedPlaylists, playlist];
          }
          this.notification.error(NotificationMessages.playlist.unfollowError);
        }
      });
  }

  onSearchNameChange(value: string) {
    this.searchName = value;
   
  }

  loadUserName(userId: number): void {
    if (!userId || userId <= 0) return; 
    this.userService.getById(userId).subscribe((user: User | null) => {
      if (user != null) {
        this.userNames[userId] = `${user.firstName} ${user.lastName}`;
      } else {
        this.userNames[userId] = 'Unknown';
      }
    }, () => {
      this.userNames[userId] = 'Unknown';
    });
  }


  onViewPlaylist(playlist: PlaylistDto): void {
    this.router.navigate([RoutePaths.home, RoutePaths.playlists, playlist.id]);
  }

  openCreatePlaylistDialog() {
    const dialogRef = this.dialog.open(PlaylistCreateDialogComponent, {
      width: '350px',
      panelClass: ['dark-dialog', 'playlist-create-dialog-panel'],
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name && result.type) {
        this.onCreatePlaylist(result);
      }
    });
  }

  openEditPlaylistDialog(playlist: PlaylistDto) {
    const dialogRef = this.dialog.open(PlaylistEditDialogComponent, {
      width: '350px',
      panelClass: 'dark-dialog',
      data: { name: playlist.name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name && result.name !== playlist.name) {
        this.onUpdatePlaylistNameForDialog(playlist, result.name);
      }
    });
  }

  onUpdatePlaylistNameForDialog(playlist: PlaylistDto, newName: string) {
    this.loading = true;
    this.playlistService.updatePlaylistName(playlist.id, newName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          playlist.name = newName;
          this.loading = false;
          this.notification.success(NotificationMessages.playlist.updateNameSuccess);
        },
        error: () => {
          this.loading = false;
          this.notification.error(NotificationMessages.playlist.updateNameError);
        }
      });
  }
}
