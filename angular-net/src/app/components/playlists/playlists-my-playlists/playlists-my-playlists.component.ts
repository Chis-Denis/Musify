import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlaylistDto } from '../../../models/playlists.model';

@Component({
  selector: 'app-playlists-my-playlists',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './playlists-my-playlists.component.html',
  styleUrls: ['./playlists-my-playlists.component.scss']
})
export class PlaylistsMyPlaylistsComponent {
  @Input() followUserId!: number | null;
  @Input() myPlaylistsView!: 'followed' | 'created';
  @Input() followedPlaylists: any[] = [];
  @Input() createdPlaylists: any[] = [];
  @Input() loading: boolean = false;
  @Input() userNames: { [userId: number]: string } = {};

  @Output() viewChange = new EventEmitter<'followed' | 'created'>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();
  @Output() toggleFollow = new EventEmitter<any>();
  @Output() viewPlaylist = new EventEmitter<any>();

  onViewChange(view: 'followed' | 'created') {
    this.viewChange.emit(view);
  }

  onEdit(playlist: any) {
    this.edit.emit(playlist);
  }
  onDelete(id: number) {
    this.delete.emit(id);
  }
  onToggleFollow(playlist: any) {
    this.toggleFollow.emit(playlist);
  }
  onViewPlaylist(playlist: any) {
    this.viewPlaylist.emit(playlist);
  }
  isFollowed(playlist: any): boolean {
    return this.followedPlaylists.some(f => f.id === playlist.id);
  }
} 