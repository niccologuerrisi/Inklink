import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Profile } from './pages/profile/profile';
import { ArtistList } from './pages/artist-list/artist-list';
import { ArtistProfile } from './pages/artist-profile/artist-profile';
import { PurchaseDetail } from './pages/purchase-detail/purchase-detail';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path: '', component: Home, title: 'Inklink'},
  {path: 'login', component: Login, title: 'Accedi | Inklink'},
  {path: 'profile', component: Profile, title: 'Il mio profilo | Inklink', canActivate: [authGuard]},
  {path: 'artists', component: ArtistList, title: 'Artisti | Inklink'},
  {path: 'artists/:id', component: ArtistProfile, title: 'Profilo artista | Inklink'},
  {path: 'purchases/:id', component: PurchaseDetail, title: 'Commissione | Inklink', canActivate: [authGuard]},
  {path: '**', redirectTo: ''},
];
