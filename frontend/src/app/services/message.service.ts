import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({providedIn: 'root'})
export class MessageService {

  private apiUrl = 'http://localhost:8080/api/messages';

  constructor(private http: HttpClient) { }

  sendMessage(purchaseId: number, senderId: number, text: string): Observable<Message>{
    return this.http.post<Message>(`${this.apiUrl}/send?purchaseId=${purchaseId}&senderId=${senderId}&text=${text}`, {});
  }

  getMessageByPurchase(purchaseId: number): Observable<Message[]>{
    return this.http.get<Message[]>(`${this.apiUrl}/purchase/${purchaseId}`)
  }
}
