import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Medicamento } from '../../Interfaces/medicamento';
import { MedicamentoService } from '../../services/medicamento.service';
import { SolicitudService } from '../../services/solicitud.service';
import { UsuarioService } from '../../services/usuario.service'; // 👈 1. IMPORTAMOS EL USUARIO SERVICE
import { CrearSolicitud, Solicitud } from '../../Interfaces/CrearSolicitud';

@Component({
  selector: 'app-lista-medicamentos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-medicamentos.component.html',
  styleUrls: ['./lista-medicamentos.component.css']
})
export class ListaMedicamentosComponent implements OnInit {

  // --- LISTAS DE DATOS ORIGINALES ---
  misMedicamentos: Medicamento[] = [];          
  medicamentosParaSolicitar: Medicamento[] = []; 
  solicitudesPendientes: Solicitud[] = [];  

  // --- VARIABLES DE BÚSQUEDA ---
  busquedaPrincipal: string = ''; 
  busquedaLateral: string = '';   

  // --- DATOS USUARIO ---
  usuarioNombre: string = '';
  usuarioRol: string = '';
  usuarioId: number = 0;

  // 👇 VARIABLES PARA EL TICKET / MODAL 👇
  mostrarModalTicket: boolean = false; 
  
  datosTicket: any = {
    fecha: new Date(),
    solicitante: '',
    medicamento: '',
    precioOriginal: 0,
    precioFinal: 0,
    codigoQR: ''
  };

  constructor(
    private medicamentoService: MedicamentoService,
    private solicitudService: SolicitudService,
    private usuarioService: UsuarioService, // 👈 2. INYECTAMOS EL SERVICIO AQUÍ
    private router: Router
  ) { }

  ngOnInit(): void {
    // Recuperamos datos del localStorage
    this.usuarioNombre = sessionStorage.getItem('usuarioNombre') || '';
    this.usuarioRol = sessionStorage.getItem('usuarioRol') || '';
    const idGuardado = sessionStorage.getItem('usuarioId');
    
    if (idGuardado) {
      this.usuarioId = parseInt(idGuardado);

      // Preguntamos al Backend si este ID todavía existe en la base de datos
      this.usuarioService.getUsuarioPorId(this.usuarioId).subscribe({
        next: (data) => {
          // ✅ SI EXISTE: Procedemos a cargar todo normal
          this.cargarDatos();
        },
        error: (error) => {
          // ❌ NO EXISTE (Error 404): El admin lo borró
          console.warn("Usuario no encontrado en BD. Cerrando sesión...");
          alert("Tu usuario ha sido eliminado o la sesión expiró.");
          this.cerrarSesion(); // Lo pateamos al login
        }
      });

    } else {
      // Si no hay ID en el navegador, directo al login
      this.router.navigate(['/login']);
    }
  }

  cargarDatos() {
    forkJoin({
      medicamentos: this.medicamentoService.getMedicamentos(),
      solicitudes: this.solicitudService.getSolicitudesPorUsuario(this.usuarioId)
    }).subscribe({
      next: ({ medicamentos, solicitudes }) => {
        
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

  // --- GETTERS ---
  get misMedicamentosFiltrados() {
    const term = this.busquedaPrincipal.toLowerCase();
    return this.misMedicamentos.filter(item => 
      item.nombre.toLowerCase().includes(term)
    );
  }

  get catalogoFiltrado() {
    const term = this.busquedaLateral.toLowerCase();
    return this.medicamentosParaSolicitar.filter(sol => 
      sol.nombre.toLowerCase().includes(term)
    );
  }

  // LÓGICA DE SOLICITUD CON TICKET
  PedirSubsidio(medicamento: Medicamento) {
    
    if (!confirm(`¿Confirmar solicitud para ${medicamento.nombre}?`)) return;

   

        // 1. Datos del Ticket
        this.datosTicket = {
          fecha: new Date(),
          solicitante: this.usuarioNombre,
          medicamento: medicamento.nombre,
          precioOriginal: medicamento.precio,
          precioFinal: medicamento.precio * 0.40, 
          codigoQR: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Subsidio-${this.usuarioId}-${medicamento.id}`
        };

        // 2. Abrir Modal
        this.mostrarModalTicket = true;

     
  }

  cerrarModal() {
    this.mostrarModalTicket = false;
  }

  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}