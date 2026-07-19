import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { SlotStatus } from '../../models/slot.model';

@Component({
  selector: 'app-artist-card',
  imports: [RouterLink],
  templateUrl: './artist-card.html',
  styleUrl: './artist-card.scss'
})
export class ArtistCard {

  @Input({ required: true }) user!: User;

  imageFailed = signal(false);

  get initials(): string {
    return `${this.user.name?.[0] ?? ''}${this.user.surname?.[0] ?? ''}`.toUpperCase();
  }

  get previewImage(): string | null {
    const first = this.user.portfolioItems?.[0];
    return first?.fileURL ?? null;
  }

  get openSlotsCount(): number {
    return this.user.slots?.filter(s => s.status === SlotStatus.OPEN).length ?? 0;
  }
}
