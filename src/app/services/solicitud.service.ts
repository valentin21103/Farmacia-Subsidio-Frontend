import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearSolicitud } from '../Interfaces/CrearSolicitud';
import { Solicitud } from '../Interfaces/CrearSolicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private apiUrl = 'https://localhost:7245/api/Solicitud';

  constructor(private http: HttpClient) { }

  // ✅ Crear solicitud
  crearSolicitud(request: CrearSolicitud): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  // ✅ Obtener solicitudes del usuario
  getSolicitudesPorUsuario(usuarioId: number): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(
      `${this.apiUrl}/usuario/${usuarioId}`
    );
  }

  // ✅ Obtener solicitudes pendientes (ADMIN)
  getSolicitudesPendientes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(
      `${this.apiUrl}/pendientes`
    );
  }
}
