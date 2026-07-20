import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase, PurchaseStatus } from '../models/purchase.model';

@Injectable({providedIn: 'root'})
export class PurchaseService {

  private apiUrl = 'http://localhost:8080/api/purchases';

  constructor(private http: HttpClient) { }

  buySlot(slotId: number): Observable<Purchase> {
    return this.http.post<Purchase>(`${this.apiUrl}/buy?slotId=${slotId}`, {});
  }

  completePurchase(purchaseId: number): Observable<Purchase>{
    return this.http.post<Purchase>(`${this.apiUrl}/${purchaseId}/complete`, {})
  }

  getPurchase(id: number): Observable<Purchase>{
    return this.http.get<Purchase>(`${this.apiUrl}/${id}`);
  }

  getPurchasesAsArtist(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/as-artist`);
  }
}
