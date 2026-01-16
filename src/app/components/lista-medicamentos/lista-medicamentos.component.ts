import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

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


  // 👇👇👇 [NUEVO] VARIABLES PARA EL TICKET / MODAL 👇👇👇
  mostrarModalTicket: boolean = false; // Controla si se ve o no el modal
  
  // Objeto para guardar la info que mostraremos en el ticket
  datosTicket: any = {
    fecha: new Date(),
    solicitante: '',
    medicamento: '',
    precioOriginal: 0,
    precioFinal: 0,
    codigoQR: ''
  };
  // 👆👆👆 FIN DE LO NUEVO 👆👆👆


  constructor(
    private medicamentoService: MedicamentoService,
    private solicitudService: SolicitudService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioNombre = localStorage.getItem('usuarioNombre') || '';
    this.usuarioRol = localStorage.getItem('usuarioRol') || '';
    const idGuardado = localStorage.getItem('usuarioId');
    
    if (idGuardado) {
      this.usuarioId = parseInt(idGuardado);
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


  // 👇👇👇 [MODIFICADO] LÓGICA DE SOLICITUD CON TICKET 👇👇👇
  
  // OJO: Ahora recibe el objeto 'Medicamento' completo, no solo el ID
  PedirSubsidio(medicamento: Medicamento) {
    
    if (!confirm(`¿Confirmar solicitud para ${medicamento.nombre}?`)) return;

    const solicitud: CrearSolicitud = {
      UsuarioId: this.usuarioId,
      MedicamentoId: medicamento.id // Sacamos el ID del objeto
    };

    this.solicitudService.crearSolicitud(solicitud).subscribe({
      next: () => {
        
        // 1. GENERAMOS LOS DATOS DEL TICKET (Todo Fake visual)
        this.datosTicket = {
          fecha: new Date(),
          solicitante: this.usuarioNombre,
          medicamento: medicamento.nombre,
          precioOriginal: medicamento.precio,
          // Calculamos el precio con 60% OFF (el usuario paga el 40%)
          precioFinal: medicamento.precio * 0.40, 
          // Generamos un QR falso usando una API pública gratuita
          codigoQR: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Subsidio-${this.usuarioId}-${medicamento.id}`
        };

        // 2. ABRIMOS EL MODAL
        this.mostrarModalTicket = true;

        // 3. Recargamos los datos de fondo
        this.cargarDatos(); 
        this.busquedaLateral = ''; // Limpiamos el buscador derecho
      },
      error: () => alert('❌ Error al solicitar el subsidio')
    });
  }

  // Función para cerrar el modal desde el botón "Entendido"
  cerrarModal() {
    this.mostrarModalTicket = false;
  }
  // 👆👆👆 FIN DE LO NUEVO 👆👆👆


  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}