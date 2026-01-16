import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- ESTA ES LA CLAVE
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Tus servicios e interfaces
import { MedicamentoService } from '../../services/medicamento.service';
import { Medicamento } from '../../Interfaces/medicamento';
import { SolicitudService } from '../../services/solicitud.service';
import { CrearSolicitud } from '../../Interfaces/CrearSolicitud';

@Component({
  selector: 'app-biblioteca-medicamentos',
  imports: [ CommonModule, FormsModule],
  templateUrl: './biblioteca-medicamentos.component.html',
  styleUrl: './biblioteca-medicamentos.component.css'
})
export class BibliotecaMedicamentosComponent implements OnInit {



  listaMedicamentos : Medicamento[] = []
  usuarioId :number = 0;
  busqueda: string = "";


constructor(
    private medicamentoService: MedicamentoService,
    private solicitudService: SolicitudService,
    private router: Router
  ) {}

  // --- AL INICIAR (Arranca el motor) ---
  ngOnInit(): void {
    // 1. Verificamos quién está logueado
    const idGuardado = sessionStorage.getItem('usuarioId');
    
    if (idGuardado) {
      this.usuarioId = parseInt(idGuardado);
      this.cargarCatalogo(); // Si hay usuario, cargamos los remedios
    } else {
      this.router.navigate(['/login']); // Si no, patada al login
    }
  }

  cargarCatalogo() {
    this.medicamentoService.getMedicamentos().subscribe({
      next: (data) => {
        this.listaMedicamentos = data;
        console.log("medicamento cargado: ",data);
      },
      error: (e) => console.error("Error al cargar:", e)
    });
  }

  pedirSubsidio(med: Medicamento) 
  {
     if(!confirm(`¿Seguro que quieres solicitar ${med.nombre}?`)) return;

     const nuevaSolicitud: CrearSolicitud ={
        UsuarioId : this.usuarioId,
        MedicamentoId : med.id
        
     }


   this.solicitudService.crearSolicitud(nuevaSolicitud).subscribe({
      next: () => {
        alert("✅ Solicitud enviada con éxito!");
        this.router.navigate(['/inicio']); // Te devuelve a la pantalla principal
      },
      error: (e) => alert("❌ Error al solicitar: " + e.message)
    });
  }

    get medicamentosFiltrados() {
    const term = this.busqueda.toLowerCase();
    return this.listaMedicamentos.filter(u => 
      u.nombre.toLowerCase().includes(term) 
    );
  }


volver() {
    this.router.navigate(['/inicio']);
  }





  }

  


  

