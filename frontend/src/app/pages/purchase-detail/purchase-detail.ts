import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlicePipe } from '@angular/common';
import { PurchaseService } from '../../services/purchase.service';
import { SlotService } from '../../services/slot.service';
import { MessageService } from '../../services/message.service';
import { ArtworkService } from '../../services/artwork.service';
import { ReviewService } from '../../services/review.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Purchase, PurchaseStatus } from '../../models/purchase.model';
import { Slot } from '../../models/slot.model';
import { Message } from '../../models/message.model';
import { API_BASE_URL } from '../../config';

@Component({
  selector: 'app-purchase-detail',
  imports: [RouterLink, FormsModule, SlicePipe],
  templateUrl: './purchase-detail.html',
  styleUrl: './purchase-detail.scss',
})
export class PurchaseDetail implements OnInit {

  readonly apiBaseUrl = API_BASE_URL;

  purchase = signal<Purchase | null>(null);
  slot = signal<Slot | null>(null);
  messages = signal<Message[]>([]);

  counterpartName = signal<string | null>(null);
  counterpartId = signal<number | null>(null);

  loading = signal(true);
  errorMessage = signal('');

  newMessageText = '';
  sendingMessage = signal(false);

  selectedArtworkFile: File | null = null;
  uploadingArtwork = signal(false);

  completing = signal(false);

  reviewRating = 5;
  reviewComment = '';
  submittingReview = signal(false);

  currentUserId = computed(() => this.authService.currentUserId());

  isBuyer = computed(() => this.currentUserId() !== null && this.currentUserId() === this.purchase()?.buyerId);
  isArtist = computed(() => this.currentUserId() !== null && this.currentUserId() === this.slot()?.artistId);
  hasAccess = computed(() => this.isBuyer() || this.isArtist());

  readonly PurchaseStatus = PurchaseStatus;

  private purchaseId!: number;

  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private slotService: SlotService,
    private messageService: MessageService,
    private artworkService: ArtworkService,
    private reviewService: ReviewService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.purchaseId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.purchaseId) {
      this.loadAll();
    }
  }

  private loadAll(): void {
    this.loading.set(true);
    this.purchaseService.getPurchase(this.purchaseId).subscribe({
      next: (purchase) => {
        this.purchase.set(purchase);
        this.slotService.getSlotById(purchase.slotId).subscribe({
          next: (slot) => {
            this.slot.set(slot);
            this.loading.set(false);
            this.loadCounterpart(purchase, slot);
          },
          error: () => this.loading.set(false)
        });
      },
      error: () => {
        this.errorMessage.set('Commissione non trovata.');
        this.loading.set(false);
      }
    });

    this.messageService.getMessageByPurchase(this.purchaseId).subscribe({
      next: (messages) => this.messages.set(messages),
      error: () => { /* la chat non è essenziale al caricamento della pagina */ }
    });
  }

  private loadCounterpart(purchase: Purchase, slot: Slot): void {
    const myId = this.currentUserId();
    const counterpartId = myId === purchase.buyerId ? slot.artistId : purchase.buyerId;

    this.counterpartId.set(counterpartId);
    this.userService.getUserById(counterpartId).subscribe({
      next: (user) => this.counterpartName.set(`${user.name} ${user.surname}`),
      error: () => this.counterpartName.set(null)
    });
  }

  sendMessage(): void {
    const senderId = this.currentUserId();
    if (!senderId) return;

    if (!this.newMessageText.trim()) {
      this.errorMessage.set('Scrivi qualcosa prima di inviare il messaggio.');
      return;
    }

    this.errorMessage.set('');
    this.sendingMessage.set(true);
    this.messageService.sendMessage(this.purchaseId, senderId, this.newMessageText.trim()).subscribe({
      next: () => {
        this.newMessageText = '';
        this.sendingMessage.set(false);
        this.messageService.getMessageByPurchase(this.purchaseId).subscribe(m => this.messages.set(m));
      },
      error: () => {
        this.sendingMessage.set(false);
        this.errorMessage.set('Messaggio non inviato: riprova.');
      }
    });
  }

  onArtworkFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedArtworkFile = input.files?.[0] ?? null;
  }

  uploadArtwork(): void {
    if (!this.selectedArtworkFile) {
      this.errorMessage.set('Scegli il file da consegnare.');
      return;
    }

    this.errorMessage.set('');
    this.uploadingArtwork.set(true);
    this.artworkService.uploadArtwork(this.purchaseId, this.selectedArtworkFile).subscribe({
      next: () => {
        this.uploadingArtwork.set(false);
        this.selectedArtworkFile = null;
        this.loadAll();
      },
      error: () => {
        this.uploadingArtwork.set(false);
        this.errorMessage.set('Non è stato possibile caricare il lavoro.');
      }
    });
  }

  completePurchase(): void {
    this.errorMessage.set('');
    this.completing.set(true);
    this.purchaseService.completePurchase(this.purchaseId).subscribe({
      next: () => {
        this.completing.set(false);
        this.loadAll();
      },
      error: () => {
        this.completing.set(false);
        this.errorMessage.set('Non è stato possibile completare la commissione.');
      }
    });
  }

  submitReview(): void {
    if (!this.reviewRating || this.reviewRating < 1 || this.reviewRating > 5) {
      this.errorMessage.set('Seleziona un voto da 1 a 5.');
      return;
    }

    this.errorMessage.set('');
    this.submittingReview.set(true);
    this.reviewService.addReview(this.purchaseId, this.reviewRating, this.reviewComment.trim()).subscribe({
      next: () => {
        this.submittingReview.set(false);
        this.loadAll();
      },
      error: () => {
        this.submittingReview.set(false);
        this.errorMessage.set('Non è stato possibile inviare la recensione.');
      }
    });
  }
}
