import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { SlotService } from '../../services/slot.service';
import { PortfolioItemService } from '../../services/portfolio-item.service';
import { PurchaseService } from '../../services/purchase.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Slot } from '../../models/slot.model';
import { Purchase } from '../../models/purchase.model';
import { API_BASE_URL } from '../../config';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, FormsModule, SlicePipe, MatFormFieldModule, MatInputModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  readonly apiBaseUrl = API_BASE_URL;

  user = signal<User | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  activating = signal(false);

  priceDrafts: Record<number, number> = {};
  savingSlotId = signal<number | null>(null);

  selectedFile: File | null = null;
  selectedFilePreviewUrl = signal<string | null>(null);
  newPortfolioTitle = '';
  newPortfolioDescription = '';
  addingPortfolioItem = signal(false);

  // commissioni ricevute come artista (diverse da "user.purchases", che sono
  // gli acquisti fatti come cliente)
  receivedPurchases = signal<Purchase[]>([]);

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
    private purchaseService: PurchaseService,
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

        // se è artista, carica anche le commissioni ricevute
        if ((user.slots?.length ?? 0) > 0) {
          this.purchaseService.getPurchasesAsArtist().subscribe({
            next: (purchases) => this.receivedPurchases.set(
              purchases.slice().sort((a, b) => b.id - a.id)
            ),
            error: () => { /* non blocca il resto della pagina */ }
          });
        }
      },
      error: () => {
        this.errorMessage.set('Non è stato possibile caricare il profilo.');
        this.loading.set(false);
      }
    });
  }

  becomeArtist(): void {
    this.activating.set(true);
    this.userService.activateArtist().subscribe({
      next: () => {
        this.activating.set(false);
        const id = this.user()?.id;
        if (id) this.loadUser(id);
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.selectedFile = file;

    if (this.selectedFilePreviewUrl()) {
      URL.revokeObjectURL(this.selectedFilePreviewUrl()!);
    }
    this.selectedFilePreviewUrl.set(file ? URL.createObjectURL(file) : null);
  }

  addPortfolioItem(): void {
    const id = this.user()?.id;
    if (!id) return;

    if (!this.selectedFile) {
      this.errorMessage.set("Scegli un'immagine da aggiungere al portfolio.");
      return;
    }

    this.errorMessage.set('');
    this.addingPortfolioItem.set(true);
    this.portfolioItemService.addPortfolioItem(
      this.selectedFile,
      this.newPortfolioTitle.trim(),
      this.newPortfolioDescription.trim()
    ).subscribe({
      next: () => {
        this.addingPortfolioItem.set(false);
        this.selectedFile = null;
        this.selectedFilePreviewUrl.set(null);
        this.newPortfolioTitle = '';
        this.newPortfolioDescription = '';
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
