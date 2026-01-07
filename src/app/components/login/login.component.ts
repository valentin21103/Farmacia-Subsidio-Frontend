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
        // Guardamos el Rol para saber si es Admin o Usuario después
        localStorage.setItem('usuarioNombre', usuario.nombre);
        localStorage.setItem('usuarioRol', usuario.roll);

            this.router.navigate(['/inicio']); // SI ACCECEDE A LA CUENTA ENTRA AL INICIO
        // Aquí redirigiremos a la lista de medicamentos (cuando configuremos rutas)
        // this.router.navigate(['/lista-medicamentos']);
      },
      error: (err) => {
        console.error(err);
        this.mensajeError = 'Usuario o contraseña incorrecto';
        }
      })
    }

}
