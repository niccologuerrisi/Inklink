import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioItem } from '../models/portfolio-item.model';

@Injectable({providedIn: 'root'})
export class PortfolioItemService {

  private apiUrl = 'http://localhost:8080/api/portfolioItems';

  constructor(private http: HttpClient) { }

  addPortfolioItem(ownerId: number, fileUrl: string, title: string, description: string): Observable<PortfolioItem>{
    return this.http.post<PortfolioItem>(`${this.apiUrl}/add?ownerId=${ownerId}&fileUrl=${fileUrl}&title=${title}&description=${description}`, {});
  }

  getPortfolioByOwner(ownerId: number): Observable<PortfolioItem[]>{
    return this.http.get<PortfolioItem[]>(`${this.apiUrl}/owner/${ownerId}`);
  }
}
