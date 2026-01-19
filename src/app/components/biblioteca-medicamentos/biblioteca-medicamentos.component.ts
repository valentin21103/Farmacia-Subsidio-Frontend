import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

 pedirSubsidio(med: Medicamento) {
    
    Swal.fire({
      title: `¿Pedir ${med.nombre}?`,
      text: "Se generará una solicitud a tu nombre",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',   
      confirmButtonText: 'Sí, solicitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      
      if (result.isConfirmed) {
        
        const nuevaSolicitud: CrearSolicitud = {
          UsuarioId: this.usuarioId,
          MedicamentoId: med.id
        }

        this.solicitudService.crearSolicitud(nuevaSolicitud).subscribe({
          next: () => {

            Swal.fire({
              title: '¡Solicitado!',
              text: 'Tu solicitud ha sido enviada correctamente.',
              icon: 'success'
            });
            this.router.navigate(['/inicio']);
          },
          error: (e) => {
            // Modal de Error
            Swal.fire({
              title: 'Error',
              text: 'No se pudo crear la solicitud.',
              icon: 'error'
            });
          }
        });
      }
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

  


  

