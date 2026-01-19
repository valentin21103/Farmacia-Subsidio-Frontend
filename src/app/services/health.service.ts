import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthService {

  // Ajusta el puerto si el tuyo es diferente (ej: 7245)
  private apiUrl = 'https://localhost:7245/api/Health/ping';

  constructor(private http: HttpClient) { }

  checkBackend(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}