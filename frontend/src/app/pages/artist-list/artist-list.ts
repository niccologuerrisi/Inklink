import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ArtistCard } from '../../components/artist-card/artist-card';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-artist-list',
  imports: [FormsModule, ArtistCard],
  templateUrl: './artist-list.html',
  styleUrl: './artist-list.scss',
})
export class ArtistList implements OnInit {

  artists = signal<User[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  query = '';

  filteredArtists = computed(() => {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.artists();
    return this.artists().filter(a =>
      `${a.name} ${a.surname}`.toLowerCase().includes(q) ||
      (a.bio ?? '').toLowerCase().includes(q)
    );
  });

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.artists.set(users.filter(u => (u.slots?.length ?? 0) > 0));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Non è stato possibile caricare gli artisti.');
        this.loading.set(false);
      }
    });
  }
}
