import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   
import { Router } from '@angular/router';       
import { Usuario } from '../../Interfaces/Login';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-biblioteca-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './biblioteca-usuarios.component.html',
  styleUrl: './biblioteca-usuarios.component.css'
})
export class BibliotecaUsuariosComponent implements OnInit {

  listaUsuarios: Usuario[] = [];
  busqueda: string = "";
  usuarioId: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idGuardado = sessionStorage.getItem('usuarioId');
    
    if (idGuardado) {
      this.usuarioId = parseInt(idGuardado);
      this.cargarUsuarios();
    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.listaUsuarios = data;
        console.log("Se cargaron usuarios: ", data);
      },
      error: (e) => console.error("error al cargar: ", e)
    });
  }

  get usuariosFiltrados() {
    const term = this.busqueda.toLowerCase();
    return this.listaUsuarios.filter(u => 
      u.nombre.toLowerCase().includes(term) 
    );
  }

  borrarUsuario(id: number) {
    
    // 1. PRIMERA ADVERTENCIA 
    Swal.fire({
      title: '¿ESTÁS SEGURO?',
      text: "⚠️ Estás a punto de eliminar este usuario y TODOS sus datos (historial, solicitudes, etc). Esta acción es IRREVERSIBLE.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, quiero eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      
      // 2. SEGUNDA ADVERTENCIA 
      if (result.isConfirmed) {
        
        Swal.fire({
          title: 'CONFIRMACIÓN FINAL',
          text: 'Por seguridad, escribe la palabra "ELIMINAR" abajo para confirmar.',
          input: 'text',
          icon: 'warning',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'CONFIRMAR BORRADO',
          confirmButtonColor: '#d33',
          showLoaderOnConfirm: true,
          
          preConfirm: (palabraEscrita) => {
            if (palabraEscrita !== 'ELIMINAR') {
              Swal.showValidationMessage('Debes escribir "ELIMINAR" exactamente.')
            }
          }
        }).then((segundoResult) => {
          
          // 3. SI PASÓ LA DOBLE SEGURIDAD, EJECUTAMOS
          if (segundoResult.isConfirmed) {
            
            this.usuarioService.eliminarUsuario(id).subscribe({
              next: () => {
                Swal.fire(
                  '¡Eliminado!',
                  'El usuario ha sido borrado del sistema.',
                  'success'
                );
                this.cargarUsuarios(); // Recargamos la lista
              },
              error: (e) => {
                Swal.fire('Error', 'No se pudo eliminar: ' + e.message, 'error');
              }
            });

          }
        });
      }
    });
  }

  volver() {
    this.router.navigate(['/inicioAdmin']); 
  }
}