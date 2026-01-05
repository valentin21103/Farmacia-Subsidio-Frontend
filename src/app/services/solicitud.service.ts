import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrearSolicitud } from '../Interfaces/CrearSolicitud';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private apiUrl  ='https://localhost:7245/api/SolicitudSubsidio';

  constructor(private http: HttpClient) { }

  CrearSolicitud(request : CrearSolicitud): Observable<any>           // al hacer request : CrearSolicitud le decimos que la variable request es de tipo de la interfaz CrearSolicitud
  {
      return this.http.post(this.apiUrl, request);
  }
}
