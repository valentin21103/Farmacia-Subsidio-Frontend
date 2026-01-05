import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medicamento } from '../Interfaces/medicamento';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  // Asegúrate de que el puerto sea el correcto (7245 o el que use tu API)
  private apiUrl = 'https://localhost:7245/api/Medicamentos';

  constructor(private http: HttpClient) { }

  // Retorna un "Flujo" (Observable) que contendrá un Array de Medicamentos
   getMedicamentos(): Observable<Medicamento[]> {

    return this.http.get<Medicamento[]>(this.apiUrl);

  }
}