import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artwork } from '../models/artwork.model';

@Injectable({providedIn: 'root'})
export class ArtworkService {

  private apiUrl = 'http://localhost:8080/api/artworks';

  constructor(private http: HttpClient) { }

  uploadArtwork(purchaseId: number, file: File): Observable<Artwork> {
    const formData = new FormData();
    formData.append('purchaseId', purchaseId.toString());
    formData.append('file', file);
    return this.http.post<Artwork>(`${this.apiUrl}/upload`, formData);
  }
}
