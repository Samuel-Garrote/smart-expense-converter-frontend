import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
//Manda el texto al backend por HTTP y devuelve un Observable con la respuesta —
// es el equivalente en frontend a lo que hace ExpenseController en backend,
// pero en dirección contraria: aquí no recibimos la petición, la hacemos.
export interface ExpenseResponse {
  message: string;
}
@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  convert(text: string): Observable<ExpenseResponse> {
    return this.http.post<ExpenseResponse>(`${this.apiUrl}/convert`, { text });
  }
}
