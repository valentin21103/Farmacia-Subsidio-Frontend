import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDto, Usuario } from '../Interfaces/Login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private apiUrl = 'https://localhost:7245/api/Usuario';

  constructor(private http: HttpClient) { }

  login(credenciales : LoginDto): Observable<Usuario> {
    // Llamamos al endpoint /Login que arreglamos en el backend
    return this.http.post<Usuario>(`${this.apiUrl}/Login`,credenciales);
  }
}
