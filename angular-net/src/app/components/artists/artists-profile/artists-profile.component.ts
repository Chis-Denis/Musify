import { Component, OnInit } from '@angular/core';
import { Artist, ArtistDetails } from '../../../models/artist.model';
import { ArtistsService } from '../../../services/artist.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RoutePaths } from '../../../config/route-paths';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSpinner } from '@angular/material/progress-spinner';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-artists-profile',
  imports: [CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSpinner,
    ClipboardModule,
    MatMenuModule,
  ],
  templateUrl: './artists-profile.component.html',
  styleUrl: './artists-profile.component.scss'
})
export class ArtistsProfileComponent implements OnInit {
  selectedArtist?: ArtistDetails;
  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private artistService: ArtistsService
  ) {}

  private formatDate(dateString?: string): string {
    return dateString ? dateString.split('T')[0] : '';
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.isLoading = true;
      const id = Number(params['id']);
      this.artistService.getById(id).subscribe({
        next: (details) => {
          this.selectedArtist = new ArtistDetails(details);
          this.selectedArtist.birthday = this.formatDate(this.selectedArtist.birthday)
          this.selectedArtist.activeStart = this.formatDate(this.selectedArtist.activeStart)
          this.selectedArtist.activeEnd = this.formatDate(this.selectedArtist.activeEnd)
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    });
  }

  viewSong(id: number){
    this.router.navigate([`/${RoutePaths.home}/${RoutePaths.songs}`, id]);
  }

  viewAlbum(id: number){
    this.router.navigate([`/${RoutePaths.home}/${RoutePaths.albumDetail}`, id]);
  }

  viewArtist(id: number){
    this.router.navigate([`/${RoutePaths.home}/${RoutePaths.artists}`, id]);
  }

}
