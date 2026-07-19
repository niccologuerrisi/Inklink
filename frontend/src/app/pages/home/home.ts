import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ArtistCard } from '../../components/artist-card/artist-card';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ArtistCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {

  featuredArtists = signal<User[]>([]);
  loading = signal(true);

  isLoggedIn = computed(() => this.authService.currentUserId() !== null);

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const artists = users.filter(u => (u.slots?.length ?? 0) > 0);
        this.featuredArtists.set(artists.slice(0, 4));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
