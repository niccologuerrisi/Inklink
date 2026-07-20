import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PurchaseService } from '../../services/purchase.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Slot, SlotStatus } from '../../models/slot.model';
import { API_BASE_URL } from '../../config';

@Component({
  selector: 'app-artist-profile',
  imports: [],
  templateUrl: './artist-profile.html',
  styleUrl: './artist-profile.scss',
})
export class ArtistProfile implements OnInit {

  readonly apiBaseUrl = API_BASE_URL;

  artist = signal<User | null>(null);
  loading = signal(true);
  errorMessage = signal('');
  buyingSlotId = signal<number | null>(null);

  currentUserId = computed(() => this.authService.currentUserId());
  isOwnProfile = computed(() => this.currentUserId() === this.artist()?.id);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private purchaseService: PurchaseService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadArtist(id);
      }
    });
  }

  private loadArtist(id: number): void {
    this.loading.set(true);
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.artist.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Artista non trovato.');
        this.loading.set(false);
      }
    });
  }

  isOpen(slot: Slot): boolean {
    return slot.status === SlotStatus.OPEN;
  }

  buySlot(slot: Slot): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.buyingSlotId.set(slot.id);
    this.errorMessage.set('');

    this.purchaseService.buySlot(slot.id).subscribe({
      next: (purchase) => {
        this.buyingSlotId.set(null);
        this.router.navigate(['/purchases', purchase.id]);
      },
      error: () => {
        this.buyingSlotId.set(null);
        this.errorMessage.set('Non è stato possibile completare l\'acquisto: riprova.');
      }
    });
  }
}
