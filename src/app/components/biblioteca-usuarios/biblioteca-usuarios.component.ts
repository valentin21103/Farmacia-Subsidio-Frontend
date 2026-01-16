import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- 1. IMPORTAR ESTO
import { FormsModule } from '@angular/forms';   // <--- 1. IMPORTAR ESTO
import { Router } from '@angular/router';       // (Corregí el import de Route que sobraba)
import { Usuario } from '../../Interfaces/Login';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-biblioteca-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule], // <--- 2. AGREGARLOS AQUÍ
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

  // 👇 3. AGREGAR ESTE GET PARA QUE EL BUSCADOR FUNCIONE
  get usuariosFiltrados() {
    const term = this.busqueda.toLowerCase();
    return this.listaUsuarios.filter(u => 
      u.nombre.toLowerCase().includes(term) 
    );
  }

  borrarUsuario(id: number) {
    // 👇 4. CORREGIDO EL MENSAJE
    if (confirm("¿Estás seguro de eliminar este USUARIO? Esta acción es irreversible.")) {
      this.usuarioService.eliminarUsuario(id).subscribe({
        next: () => {
          alert("🗑️ Usuario eliminado correctamente");
          this.cargarUsuarios(); 
        },
        error: (e) => alert("Error al eliminar: " + e.message)
      });
    }
  }

  volver() {
    this.router.navigate(['/inicioAdmin']); // Asumo que esta ruta existe en tu app.routes
  }
}