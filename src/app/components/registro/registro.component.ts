import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CrearUsuario } from '../../Interfaces/Login';
import { UsuarioService } from '../../services/usuario.service';
import { Route, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  Usuario : CrearUsuario = {

    nombre: "",
    apellido : "",
    correoElectronico: "",
    contrasena : "",
    edad : null,
    genero : ""

  }

constructor (
  private usuarioService : UsuarioService,
  private router : Router
) {}


CrearCuenta(){

  if(this.Usuario.nombre == "" ||
    this.Usuario.apellido == ""||
    this.Usuario.correoElectronico == "" ||
    this.Usuario.contrasena == ""||
    this.Usuario.edad == null ||
    this.Usuario.genero == ""
  )
  {
   alert("⚠️ Por favor, completa todos los campos.");
      return; // Detenemos la función aquí si falta algo
  }

  this.usuarioService.registrar(this.Usuario as any).subscribe({
    next: () => {

      Swal.fire({
         title: '¡Cuenta Creada Exitosamente!',
              text: `Bienvenido ${this.Usuario.nombre}?`,
              icon: 'success'
      });
        
        // 3. REDIRECCIÓN: Lo mandamos al Login
        this.router.navigate(['/login']);
      },
      error: () => {
         Swal.fire({
                      title: 'Error',
                      text: '❌ Ocurrió un error al registrarse. ',
                      icon: 'error'
                    });
    
      }
    });
  }

  Volver() {
    this.router.navigate(['/login']);
  }

}
