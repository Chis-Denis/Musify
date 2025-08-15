import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-music',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent {
  isPlaying = false;
  audio = new Audio('assets/music/trackHome.mp3');

  constructor() {
    this.audio.loop = true;
  }

  toggleMusic(): void {
    this.isPlaying = !this.isPlaying;
    this.isPlaying ? this.audio.play() : this.audio.pause();
  }
}
