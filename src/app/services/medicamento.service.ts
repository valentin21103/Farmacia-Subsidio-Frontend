import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medicamento } from '../Interfaces/medicamento';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {

  // OJO: Tu controlador dice [Route("api/[controller]")], y la clase es MedicamentosController.
  // Por lo tanto, la URL termina en "Medicamentos" (plural).
  private apiUrl = 'https://localhost:7245/api/Medicamentos';

  constructor(private http: HttpClient) { }

  // 1. GET (Obtener todos)
  getMedicamentos(): Observable<Medicamento[]> {
    return this.http.get<Medicamento[]>(this.apiUrl);
  }

  // 2. POST (Crear nuevo)
  // Nota: Aunque enviamos un objeto, el backend lo recibe como DTO.
  // Angular es inteligente y envía solo el JSON.
  agregarMedicamento(medicamento: any): Observable<Medicamento> {
    return this.http.post<Medicamento>(this.apiUrl, medicamento);
  }

  // 3. DELETE (Borrar)
  eliminarMedicamento(id: number): Observable<any> {
    // La ruta queda: .../api/Medicamentos/5
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}