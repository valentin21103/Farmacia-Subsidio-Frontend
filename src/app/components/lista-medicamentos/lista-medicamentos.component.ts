import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

// Importa tus interfaces y servicios
import { Medicamento } from '../../Interfaces/medicamento';
import { MedicamentoService } from '../../services/medicamento.service';
import { SolicitudService } from '../../services/solicitud.service';
import { CrearSolicitud, Solicitud } from '../../Interfaces/CrearSolicitud';

@Component({
  selector: 'app-lista-medicamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-medicamentos.component.html',
  styleUrls: ['./lista-medicamentos.component.css']
})
export class ListaMedicamentosComponent implements OnInit {

  // --- LISTAS DE DATOS ---
  misMedicamentos: Medicamento[] = [];      // Izquierda: Aprobados
  medicamentosParaSolicitar: Medicamento[] = []; // Derecha: Catálogo completo
  solicitudesPendientes: Solicitud[] = [];  // Derecha: Historial Pendiente

  // --- BUSCADOR (Derecha) ---
  busqueda: string = '';

  // --- DATOS USUARIO ---
  usuarioNombre: string = '';
  usuarioRol: string = '';
  usuarioId: number = 0;

  constructor(
    private medicamentoService: MedicamentoService,
    private solicitudService: SolicitudService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 1. Recuperar Usuario
    this.usuarioNombre = localStorage.getItem('usuarioNombre') || '';
    this.usuarioRol = localStorage.getItem('usuarioRol') || '';
    const idGuardado = localStorage.getItem('usuarioId');
    
    if (idGuardado) {
      this.usuarioId = parseInt(idGuardado);
      // 2. Cargar todo
      this.cargarDatos();
    } else {
      this.router.navigate(['/login']);
    }
  }

cargarDatos() {
    forkJoin({
      medicamentos: this.medicamentoService.getMedicamentos(),
      solicitudes: this.solicitudService.getSolicitudesPorUsuario(this.usuarioId)
    }).subscribe({
      next: ({ medicamentos, solicitudes }) => {
        
        console.log("Datos listos:", solicitudes);

        const aprobadas = solicitudes.filter(s => 
            s.estado === 'Aprobado' || s.estado === 'Aprobada' || s.estado == '1'
        );
        
        this.misMedicamentos = medicamentos.filter(med => 
          aprobadas.some(s => s.medicamentoNombre === med.nombre)
        );

      
        this.solicitudesPendientes = solicitudes.filter(s => 
          s.estado === 'Pendiente' || 
          s.estado === 'Rechazada' || s.estado === 'Rechazado'
        );

        const nombresAprobados = aprobadas.map(s => s.medicamentoNombre);
        const nombresPendientes = this.solicitudesPendientes.map(s => s.medicamentoNombre);
        
        this.medicamentosParaSolicitar = medicamentos.filter(med => 
          !nombresAprobados.includes(med.nombre) && 
          !nombresPendientes.includes(med.nombre)
        );

      },
      error: (e) => console.error('Error cargando datos:', e)
    });
  }
  // Getter para filtrar en tiempo real el buscador de la derecha
  get listaSolicitarFiltrada() {
    return this.medicamentosParaSolicitar.filter(m => 
      m.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  PedirSubcidio(medicamentoId: number) {
    if (!confirm('¿Solicitar este medicamento?')) return;

    const solicitud: CrearSolicitud = {
      UsuarioId: this.usuarioId,
      MedicamentoId: medicamentoId
    };

    this.solicitudService.crearSolicitud(solicitud).subscribe({
      next: () => {
        alert('✅ Solicitud enviada');
        this.cargarDatos(); // Recargar listas para mover el item de "Solicitar" a "Pendiente"
        this.busqueda = ''; // Limpiar buscador
      },
      error: () => alert('❌ Error al solicitar')
    });
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '';
    try {
      const date = new Date(fecha);
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                     'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const dia = date.getDate();
      const mes = meses[date.getMonth()];
      const mesCorto = date.toLocaleDateString('es-ES', { month: 'short' });
      return `${dia} ${mes} - ${dia} ${mesCorto}.`;
    } catch {
      return fecha;
    }
  }
}