import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement | null = null;
  private currentUrl = '';

  play(url: string): void {
    // Same song already loaded
    if (this.audio && this.currentUrl === url) {
      if (this.audio.paused) {
        this.audio.play().catch(err => {
          console.error('Audio resume error:', err);
        });
      } else {
        this.audio.pause();
      }
      return;
    }

    // New song, stop previous one
    if (this.audio) {
      this.audio.pause();
    }

    this.audio = new Audio(url);
    this.currentUrl = url;

    this.audio.play().catch(err => {
      console.error('Audio play error:', err);
    });

    this.audio.addEventListener('ended', () => {
      this.currentUrl = '';
    });
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.currentUrl = '';
    }
  }

  isPlaying(url: string): boolean {
    return !!this.audio && this.audio.src.includes(url) && !this.audio.paused;
  }
}
