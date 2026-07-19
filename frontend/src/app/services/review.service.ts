import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';

@Injectable({providedIn: 'root'})
export class ReviewService {

  private apiUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) { }

  addReview(purchaseId: number, rating: number, comment: string): Observable<Review>{
    return this.http.post<Review>(`${this.apiUrl}/add?purchaseId=${purchaseId}&rating=${rating}&comment=${comment}`, {});
  }
}
