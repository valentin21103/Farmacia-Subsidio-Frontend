import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrearUsuario, LoginDto, Usuario } from '../Interfaces/Login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Asegúrate de que este puerto sea el correcto (donde corre tu Swagger)
  private apiUrl = 'https://localhost:7245/api/Usuario';

  constructor(private http: HttpClient) { }

  login(credenciales: LoginDto): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/Login`, credenciales);
  }

  registrar(datos: CrearUsuario): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }
}