import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginDto } from '../../Interfaces/Login';
import { UsuarioService } from '../../services/usuario.service';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


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
      next: (data) => {
        console.log('Token exitoso:', data.token);


        sessionStorage.setItem('authToken' , data.token)

        const decoded: any =  jwtDecode(data.token);

        console.log("Token Abierto:" ,decoded);

       // 3. Mapeamos los datos
        // .NET a veces usa nombres largos para los claims o nombres cortos.
        // Con este código cubrimos ambas opciones por si acaso.
        const userId = decoded.nameid || decoded.sub || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        const userName = decoded.unique_name || decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        const userRole = decoded.role || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        // 4. Guardamos en SessionStorage (Para que el resto de tu app siga funcionando igual)
        sessionStorage.setItem('usuarioId', userId);
        sessionStorage.setItem('usuarioNombre', userName);
        sessionStorage.setItem('usuarioRol', userRole);

        console.log("Rol detectado:", userRole);

     // 5. Redirección según el rol
        if (userRole === "Administrador" || userRole === "administrador") {
            this.router.navigate(['/inicioAdmin']);
        } else {
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
