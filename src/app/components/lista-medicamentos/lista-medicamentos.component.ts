import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Medicamento } from '../../Interfaces/medicamento';
import { MedicamentoService } from '../../services/medicamento.service';
import { SolicitudService } from '../../services/solicitud.service';
import { CrearSolicitud } from '../../Interfaces/CrearSolicitud';

@Component({
  selector: 'app-lista-medicamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-medicamentos.component.html',
  styleUrl: './lista-medicamentos.component.css'
})
export class ListaMedicamentosComponent implements OnInit {

  lista: Medicamento[] = [];

  constructor(
    private medicamentoService: MedicamentoService,
    private solicitudService : SolicitudService
  ) { }

  ngOnInit(): void {
    this.obtenerMedicamentos();
  }

  obtenerMedicamentos() {
    this.medicamentoService.getMedicamentos().subscribe({
      next: (datos) => {
        this.lista = datos;
        console.log('Datos recibidos:', datos);
      },
      error: (e) => {
        console.error('Error al llamar a la API:', e);
      }
    });
  }

  // --- AQUÍ ESTABA EL ERROR ---
  PedirSubcidio(medicamentoId: number ) {
    
    if(!confirm('¿Estás seguro de solicitar este medicamento?')) return;

    // OJO: Verifica si en tu interfaz CrearSolicitud pusiste mayúsculas o minúsculas.
    // En TypeScript lo estándar es minúscula (usuarioId), si te marca rojo cámbialo.
    const solicitud : CrearSolicitud = {
        UsuarioId : 1, 
        MedicamentoId: medicamentoId
    };

    // EL CÓDIGO DEBE SEGUIR AQUÍ DENTRO
    this.solicitudService.CrearSolicitud(solicitud).subscribe({
        next: (respuesta) => {
          alert('¡Solicitud enviada con éxito!');
          console.log(respuesta);
        },
        error: (error) => {
          alert('Ocurrió un error al solicitar.');
          console.error(error);
        }
    });

  } // <--- ¡AQUÍ ES DONDE DEBE CERRARSE LA FUNCIÓN!

}