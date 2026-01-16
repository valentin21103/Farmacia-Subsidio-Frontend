import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Solicitud } from '../../Interfaces/CrearSolicitud';
import { Medicamento } from '../../Interfaces/medicamento';
import { MedicamentoService } from '../../services/medicamento.service';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  listaSolicitudes: Solicitud[] = [];
  listaMedicamentos: Medicamento[] = [];

  busquedaSolicitud: string = "";
  busquedaInventario: string = "";  

  mostrarFormulario: boolean = false; // Para abrir/cerrar el form
  
  // Objeto temporal para el formulario (sin ID, porque es nuevo)
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

  aprobar(sol: Solicitud) {
    if (!confirm(`¿Aprobar subsidio para ${sol.usuarioNombre}?`)) return;

    this.solicitudService.aprobarSolicitud(sol.solicitudId).subscribe({
      next: () => {
        alert("✅ Aprobada");
        this.cargarSolicitudes();
      },
      error: (e) => alert("Error: " + e.message)
    });
  }

  rechazar(sol: Solicitud) {
    if (!confirm(`¿Rechazar a ${sol.usuarioNombre}?`)) return;

    this.solicitudService.rechazarSolicitud(sol.solicitudId).subscribe({
      next: () => {
        alert("❌ Rechazada");
        this.cargarSolicitudes();
      },
      error: (e) => alert("Error: " + e.message)
    });

  }

  // Función para mostrar/ocultar el formulario
  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  // Función AGREGAR
  guardarMedicamento() {
    // Validación básica
    if (!this.nuevoMedicamento.nombre || this.nuevoMedicamento.precio <= 0) {
      alert("Por favor completa el nombre y el precio.");
      return;
    }

    this.medicamentoService.agregarMedicamento(this.nuevoMedicamento).subscribe({
      next: () => {
        alert("✅ Medicamento Agregado!");
        this.cargarMedicamentos(); // Recargamos la lista
        this.toggleFormulario();   // Cerramos el form
        
        // Limpiamos los campos
        this.nuevoMedicamento = { nombre: '', descripcion: '', precio: 0, stock: 0, imagenUrl: '' };
      },
      error: (e) => alert("Error al guardar: " + e.message)
    });
  }

  // Función BORRAR
  borrarMedicamento(id: number) {
    if (confirm("¿Estás seguro de eliminar este medicamento?")) {
      this.medicamentoService.eliminarMedicamento(id).subscribe({
        next: () => {
          alert("🗑️ Eliminado correctamente");
          this.cargarMedicamentos(); // Recargamos la lista
        },
        error: (e) => alert("Error al eliminar: " + e.message)
      });
    }
  }
}
