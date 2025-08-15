import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlaylistDto } from '../../../models/playlists.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-playlists-search',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './playlists-search.component.html',
  styleUrls: ['./playlists-search.component.scss']
})
export class PlaylistsSearchComponent {
  today = new Date();
  @Input() searchName: string = '';
  @Input() searchResults: PlaylistDto[] = [];
  @Input() loading: boolean = false;

  @Output() searchNameChange = new EventEmitter<string>();
  @Output() searchByName = new EventEmitter<void>();

  onSearchNameChange(value: string) {
    this.searchNameChange.emit(value);
  }

  onSearchByName() {
    this.searchByName.emit();
  }
} 