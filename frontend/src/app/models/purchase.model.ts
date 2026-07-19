import { Message } from './message.model';
import { Artwork } from './artwork.model';
import { Review } from './review.model';

export enum PurchaseStatus {
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED'
}

export interface Purchase {
  id: number;
  slotId: number;
  buyerId: number;
  purchaseDate: string;
  paidPrice: number;
  status: PurchaseStatus;
  messages?: Message[];
  artwork?: Artwork;
  review?: Review;
}
