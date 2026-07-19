export interface Review {
  id: number;
  purchaseId: number;
  rating: number;
  comment?: string; //? significa che in review.java il commento è nullable = true
  ratingDate: string;
}
