import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioItem } from '../models/portfolio-item.model';

@Injectable({providedIn: 'root'})
export class PortfolioItemService {

  private apiUrl = 'http://localhost:8080/api/portfolioItems';

  constructor(private http: HttpClient) { }

  // invia il file vero tramite FormData (multipart/form-data) invece di un
  // semplice URL testuale; il backend lo salva su disco e restituisce
  // l'oggetto creato con il percorso dell'immagine appena salvata
  addPortfolioItem(file: File, title: string, description: string): Observable<PortfolioItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    return this.http.post<PortfolioItem>(`${this.apiUrl}/upload`, formData);
  }

  getPortfolioByOwner(ownerId: number): Observable<PortfolioItem[]>{
    return this.http.get<PortfolioItem[]>(`${this.apiUrl}/owner/${ownerId}`);
  }
}
