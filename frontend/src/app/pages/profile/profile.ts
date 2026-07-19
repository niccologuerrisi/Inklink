import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { SlotService } from '../../services/slot.service';
import { PortfolioItemService } from '../../services/portfolio-item.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Slot } from '../../models/slot.model';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, FormsModule, SlicePipe, MatFormFieldModule, MatInputModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  user = signal<User | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  activating = signal(false);

  // prezzo in fase di modifica per ciascuno slot: { [slotId]: valore }
  priceDrafts: Record<number, number> = {};
  savingSlotId = signal<number | null>(null);

  newPortfolioItem = { fileURL: '', title: '', description: '' };
  addingPortfolioItem = signal(false);

  isArtist = computed(() => (this.user()?.slots?.length ?? 0) > 0);

  activePurchases = computed(() =>
    (this.user()?.purchases ?? [])
      .slice()
      .sort((a, b) => b.id - a.id)
  );

  constructor(
    private userService: UserService,
    private slotService: SlotService,
    private portfolioItemService: PortfolioItemService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.authService.currentUserId();
    if (!id) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUser(id);
  }

  private loadUser(id: number): void {
    this.loading.set(true);
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.priceDrafts = {};
        for (const slot of user.slots ?? []) {
          this.priceDrafts[slot.id] = slot.price;
        }
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Non è stato possibile caricare il profilo.');
        this.loading.set(false);
      }
    });
  }

  becomeArtist(): void {
    const id = this.user()?.id;
    if (!id) return;
    this.activating.set(true);
    this.userService.activateArtist(id).subscribe({
      next: () => {
        this.activating.set(false);
        this.loadUser(id);
      },
      error: () => {
        this.activating.set(false);
        this.errorMessage.set('Non è stato possibile attivare il profilo artista.');
      }
    });
  }

  savePrice(slot: Slot): void {
    const id = this.user()?.id;
    if (!id) return;

    const newPrice = this.priceDrafts[slot.id];
    if (newPrice == null || isNaN(newPrice) || newPrice < 0) {
      this.errorMessage.set('Inserisci un prezzo valido (maggiore o uguale a 0).');
      return;
    }

    this.errorMessage.set('');
    this.savingSlotId.set(slot.id);
    this.slotService.updatePrice(slot.id, newPrice).subscribe({
      next: () => {
        this.savingSlotId.set(null);
        this.loadUser(id);
      },
      error: () => {
        this.savingSlotId.set(null);
        this.errorMessage.set('Non è stato possibile aggiornare il prezzo.');
      }
    });
  }

  addPortfolioItem(): void {
    const id = this.user()?.id;
    if (!id) return;

    if (!this.newPortfolioItem.fileURL.trim()) {
      this.errorMessage.set("Inserisci l'URL di un'immagine per aggiungerla al portfolio.");
      return;
    }

    this.errorMessage.set('');
    this.addingPortfolioItem.set(true);
    this.portfolioItemService.addPortfolioItem(
      id,
      this.newPortfolioItem.fileURL.trim(),
      this.newPortfolioItem.title.trim(),
      this.newPortfolioItem.description.trim()
    ).subscribe({
      next: () => {
        this.addingPortfolioItem.set(false);
        this.newPortfolioItem = { fileURL: '', title: '', description: '' };
        this.loadUser(id);
      },
      error: () => {
        this.addingPortfolioItem.set(false);
        this.errorMessage.set("Non è stato possibile aggiungere l'opera al portfolio.");
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
