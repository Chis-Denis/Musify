import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { PlaylistDto } from '../../../models/playlists.model';
import { RouterModule } from '@angular/router';
import { NotificationMessages } from '../../../constants/notification-messages';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-playlists-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './playlists-categories.component.html',
  styleUrls: ['./playlists-categories.component.scss']
})
export class PlaylistsCategoriesComponent {
  @Input() filteredPlaylists: PlaylistDto[] = [];
  @Input() playlistFilter: 'public' | 'private' | 'followed' | '' = '';
  @Input() followedPlaylists: PlaylistDto[] = [];
  @Input() getFollowColor!: (playlist: PlaylistDto) => 'warn' | null;
  @Input() getFollowIcon!: (playlist: PlaylistDto) => string;
  @Input() followUserId!: number | null;
  @Input() userNames!: { [userId: number]: string };
  @Input() errorMessage: string = ''; 
  @Input() searchName: string = '';
  @Input() searchResults: PlaylistDto[] = [];
  @Input() loading: boolean = false;
  @Output() searchNameChange = new EventEmitter<string>();
  @Output() searchByName = new EventEmitter<void>();

  @Output() filterChange = new EventEmitter<'public' | 'private' | 'followed' | ''>();
  @Output() edit = new EventEmitter<PlaylistDto>();
  @Output() delete = new EventEmitter<number>();
  @Output() toggleFollow = new EventEmitter<PlaylistDto>();
  @Output() viewPlaylist = new EventEmitter<PlaylistDto>(); 
  @Output() createPlaylist = new EventEmitter<void>();

  infoMsg = NotificationMessages.playlist.searchNoResults;

  constructor(private notification: NotificationService) {}

  onFilterChange(type: 'public' | 'private' | 'followed' | '') {
    this.filterChange.emit(type);
  }

  ngOnInit(): void {
    if (this.errorMessage) {
      this.notification.error(this.errorMessage || NotificationMessages.playlist.searchNoResults);
    }
  }

  ngOnChanges(): void {
    if (this.errorMessage) {
      this.notification.error(this.errorMessage || NotificationMessages.playlist.searchNoResults);
    }

    if (
      !this.loading && 
      this.filteredPlaylists.length === 0 &&
      this.searchName.trim().length > 0
    ) {
      this.notification.info(NotificationMessages.playlist.searchNoResults);
    }
  }

  onEdit(playlist: PlaylistDto) {
    this.edit.emit(playlist);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }

  onToggleFollow(playlist: PlaylistDto) {
    this.toggleFollow.emit(playlist);
  }

  onViewPlaylist(playlist: PlaylistDto) {
    this.viewPlaylist.emit(playlist);
  }

  onCreatePlaylist() {
    this.createPlaylist.emit();
  }

  onSearchNameChange(value: string) {
    this.searchName = value;
    this.searchNameChange.emit(value);
  }

  onSearchByName() {
    this.searchNameChange.emit(this.searchName);
  }
}