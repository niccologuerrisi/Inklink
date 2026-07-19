import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artwork} from '../models/artwork.model';

@Injectable({providedIn: 'root'})
export class ArtworkService {

  private apiUrl = 'http://localhost:8080/api/artworks';

  constructor(private http: HttpClient) { }

  uploadArtwork(purchaseId: number, fileUrl: string): Observable<Artwork>{
    return this.http.post<Artwork>(`${this.apiUrl}/upload?purchaseId=${purchaseId}&fileUrl=${fileUrl}`, {});
  }
}
