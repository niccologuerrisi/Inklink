import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Slot, SlotStatus } from '../models/slot.model';

@Injectable({providedIn: 'root'})
export class SlotService {

  private apiUrl = 'http://localhost:8080/api/slots';

  constructor(private http: HttpClient) { }

  getSlotById(id: number): Observable<Slot> {
    return this.http.get<Slot>(`${this.apiUrl}/${id}`);
  }

  getSlotByArtist(artistId: number): Observable<Slot[]>{
    return this.http.get<Slot[]>(`${this.apiUrl}/artist/${artistId}`);
  }

  getSlotByArtistAndStatus(artistId: number, status: SlotStatus): Observable<Slot[]>{
    return this.http.get<Slot[]>(`${this.apiUrl}/artist/${artistId}/status/${status}`);
  }

  updatePrice(slotId: number, newPrice: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${slotId}/price?newPrice=${newPrice}`, {});
  }
}
