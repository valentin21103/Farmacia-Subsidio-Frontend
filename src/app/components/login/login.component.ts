import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '../../Interfaces/Login';
import { UsuarioService } from '../../services/usuario.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

    credenciales: LoginDto = {
      email:"",
      password:  ""

    };

    mensajeError :string = "";


    constructor(
      private usuarioService : UsuarioService,
      private router : Router
    ) {}


    IniciarSesion() {
    this.usuarioService.login(this.credenciales).subscribe({
      next: (usuario) => {
        console.log('Login exitoso:', usuario);

        // --- GUARDADO DE SEGURIDAD EN EL NAVEGADOR ---
        sessionStorage.setItem('usuarioNombre', usuario.nombre);
        sessionStorage.setItem('usuarioRol', usuario.roll);
        // Sin esto, la pantalla de inicio no te deja pasar
        sessionStorage.setItem('usuarioId', usuario.id.toString()); 

     // En el método IniciarSesion...

      if (usuario.roll == "Administrador" || usuario.roll == "administrador") {
    this.router.navigate(['/inicioAdmin']); 
    } 
     else if (usuario.roll == "Usuario" || usuario.roll == "usuario") {
    this.router.navigate(['/inicio']); 
      }
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'Usuario o contraseña incorrecto';
      }
    })
  }

}
