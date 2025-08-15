import { Routes } from '@angular/router';
import { LoginComponent } from '../components/auth/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { RegisterComponent } from '../components/auth/register/register.component';
import { SongDetailComponent } from '../components/songs/song-detail/song-detail.component';
import { RoutePaths } from './route-paths';
import { ProfileComponent } from '../components/profile/profile.component';
import { AlbumsComponent } from '../components/albums/albums.component';
import { AlbumDetailComponent } from '../components/albums/album-detail/album-detail.component';
import { ArtistsComponent } from '../components/artists/artists.component';
import { ArtistsProfileComponent } from '../components/artists/artists-profile/artists-profile.component';
import { SongManagerComponent } from '../components/songs/song-manager/song-manager.component';
import { ChangePasswordComponent } from '../components/user/change-password/change-password.component';
import { ForgotPasswordComponent } from '../components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../components/auth/reset-password/reset-password.component';
import { AuthGuard } from '../guards/auth.guard';
import { PlaylistsComponent } from '../components/playlists/playlists.component';
import { SearchComponent } from '../components/search/search.component';
import { AdminDashboardComponent } from '../components/admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateProfileComponent } from '../components/user/update-profile/update-profile.component';
import { PublicProfileComponent } from '../components/user/public-profile/public-profile.component';
import { PlaylistDetailsComponent } from '../components/playlists/details/playlist-details/playlist-details.component';

export const routes: Routes = [
  { path: RoutePaths.login, component: LoginComponent },
  { path: RoutePaths.register, component: RegisterComponent },
  { path: RoutePaths.forgotPassword, component: ForgotPasswordComponent },
  { path: RoutePaths.resetPassword, component: ResetPasswordComponent },
  { path: RoutePaths.changePassword, component: ChangePasswordComponent },
  { path: RoutePaths.updateProfile, component: UpdateProfileComponent, canActivate: [AuthGuard] },
  { path: RoutePaths.search, component: SearchComponent },

  {
    path: RoutePaths.home,
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: `${RoutePaths.publicProfile}/:id`, component: PublicProfileComponent },
      { path: `${RoutePaths.artists}/:id`, component: ArtistsProfileComponent },
      { path: RoutePaths.artists, component: ArtistsComponent },
      { path: RoutePaths.songs, component: SongManagerComponent },
      { path: RoutePaths.playlists, component: PlaylistsComponent },
      { path: RoutePaths.albums, component: AlbumsComponent },
      { path: `${RoutePaths.albumDetail}/:id`, component: AlbumDetailComponent },
      { path: RoutePaths.search, component: SearchComponent },
      { path: `${RoutePaths.songs}/:id`, component: SongDetailComponent },
      { path: `${RoutePaths.playlists}/:id`, component: PlaylistDetailsComponent },
      { path: `${RoutePaths.albums}/:id`, component: AlbumDetailComponent },
    ],
  },
  {
    path: RoutePaths.profile,
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },

  // Redirect base path to login or home
  { path: '', redirectTo: `/${RoutePaths.login}`, pathMatch: 'full' },

  // Admin dashboard
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard]
  }
];

