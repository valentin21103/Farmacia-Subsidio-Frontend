import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import Swal from 'sweetalert2';

import { Solicitud } from '../../Interfaces/CrearSolicitud';
import { Medicamento } from '../../Interfaces/medicamento';
import { MedicamentoService } from '../../services/medicamento.service';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, 
  imports: [CommonModule, FormsModule, RouterLink], 
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  listaSolicitudes: Solicitud[] = [];
  listaMedicamentos: Medicamento[] = [];

  busquedaSolicitud: string = "";
  busquedaInventario: string = "";  

  mostrarFormulario: boolean = false; 
  
  nuevoMedicamento: any = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
  };

  constructor(
    private medicamentoService: MedicamentoService,
    private solicitudService: SolicitudService
  ){}

  ngOnInit(): void {
    this.cargarSolicitudes();
    this.cargarMedicamentos(); 
  }

  cargarSolicitudes() {
      this.solicitudService.getSolicitudesPendientes().subscribe({
        next: (data) => {
          this.listaSolicitudes = data;
          console.log("Lista solicitudes cargada", data)
        },
        error: (e) => console.error("error al cargar: ", e)
      });
  }

  cargarMedicamentos() {
    this.medicamentoService.getMedicamentos().subscribe({
      next: (data) => {
        this.listaMedicamentos = data;
        console.log("medicamentos cargados:", data);
      },
      error: (e) => console.error("error al cargar", e)
    });
  }

  get solicitudesFiltradas() {
    const term = this.busquedaSolicitud.toLowerCase();
    
    return this.listaSolicitudes.filter(s => 
      s.usuarioNombre.toLowerCase().includes(term) ||      
      s.medicamentoNombre.toLowerCase().includes(term)     
    );
  }

  get inventarioFiltrado() {
    const term = this.busquedaInventario.toLowerCase();
    return this.listaMedicamentos.filter(m => 
      m.nombre.toLowerCase().includes(term)
    );
  }

  // --- APROBAR (CON SWAL) ---
  aprobar(sol: Solicitud) {
    Swal.fire({
      title: `¿Aprobar a ${sol.usuarioNombre}?`,
      text: `Se aprobará el subsidio para ${sol.medicamentoNombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService.aprobarSolicitud(sol.solicitudId).subscribe({
          next: () => {
            Swal.fire('¡Aprobada!', 'La solicitud ha sido procesada.', 'success');
            this.cargarSolicitudes();
          },
          error: (e) => Swal.fire('Error', e.message, 'error')
        });
      }
    });
  }

  // --- RECHAZAR (CON SWAL) ---
  rechazar(sol: Solicitud) {
    Swal.fire({
      title: `¿Rechazar a ${sol.usuarioNombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService.rechazarSolicitud(sol.solicitudId).subscribe({
          next: () => {
            Swal.fire('Rechazada', 'La solicitud fue denegada.', 'success');
            this.cargarSolicitudes();
          },
          error: (e) => Swal.fire('Error', e.message, 'error')
        });
      }
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  guardarMedicamento() {
    // Validación con Swal
    if (!this.nuevoMedicamento.nombre || this.nuevoMedicamento.precio <= 0) {
      Swal.fire('Atención', 'Por favor completa el nombre y el precio.', 'warning');
      return;
    }

    this.medicamentoService.agregarMedicamento(this.nuevoMedicamento).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Agregado!',
          text: 'Medicamento guardado correctamente',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        this.cargarMedicamentos(); 
        this.toggleFormulario();   
        this.nuevoMedicamento = { nombre: '', descripcion: '', precio: 0, stock: 0, imagenUrl: '' };
      },
      error: (e) => {
        Swal.fire('Error', 'No se pudo guardar: ' + e.message, 'error');
      }
    });
  }

  // --- BORRAR (CON SWAL) ---
  borrarMedicamento(id: number) {
    Swal.fire({
      title: '¿Eliminar medicamento?',
      text: "Se borrará del inventario permanentemente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicamentoService.eliminarMedicamento(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El medicamento ha sido borrado.', 'success');
            this.cargarMedicamentos();
          },
          error: (e) => Swal.fire('Error', 'No se pudo eliminar: ' + e.message, 'error')
        });
      }
    });
  }
}