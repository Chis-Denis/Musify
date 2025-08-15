import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-playlists-follow',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './playlists-follow.component.html',
  styleUrls: ['./playlists-follow.component.scss']
})
export class PlaylistsFollowComponent {
  @Input() followUserId: number | null = null;
  @Input() followPlaylistId: number | null = null;

  @Output() followUserIdChange = new EventEmitter<number | null>();
  @Output() followPlaylistIdChange = new EventEmitter<number | null>();
  @Output() follow = new EventEmitter<void>();

  onUserIdChange(value: string) {
    const num = value ? Number(value) : null;
    this.followUserIdChange.emit(num);
  }
  onPlaylistIdChange(value: string) {
    const num = value ? Number(value) : null;
    this.followPlaylistIdChange.emit(num);
  }
  onFollow() {
    this.follow.emit();
  }
} 