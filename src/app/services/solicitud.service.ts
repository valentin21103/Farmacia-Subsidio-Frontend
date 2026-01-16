import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearSolicitud, Solicitud } from '../Interfaces/CrearSolicitud'; // <--- 1. IMPORTAR 'Solicitud'

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private apiUrl = 'https://localhost:7245/api/Solicitud'; // (Ojo con tu puerto)

  constructor(private http: HttpClient) { }

  // Crear solicitud (Esta queda igual)
  crearSolicitud(request: CrearSolicitud): Observable<any> {
    return this.http.post(this.apiUrl, request);
  }

  // Obtener por usuario (Usa la interfaz Solicitud)
  getSolicitudesPorUsuario(usuarioId: number): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  // ✅ ESTA ES LA IMPORTANTE PARA EL ADMIN
  // Antes devolvía 'any[]', ahora devuelve 'Solicitud[]'
  getSolicitudesPendientes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/pendientes`);
  }

  // Aprobar (Admin)
  aprobarSolicitud(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/aprobar`, {});
  }

  // Rechazar (Admin)
  rechazarSolicitud(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/rechazar`, {});
  }
}