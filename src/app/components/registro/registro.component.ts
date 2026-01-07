import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CrearUsuario } from '../../Interfaces/Login';
import { UsuarioService } from '../../services/usuario.service';
import { Route, Router } from '@angular/router';

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
   alert("✅ ¡Cuenta creada con éxito! Ahora inicia sesión.");
        
        // 3. REDIRECCIÓN: Lo mandamos al Login
        this.router.navigate(['/login']);
      },
      error: () => {
        
        alert("❌ Ocurrió un error al registrarse. Verifica la consola.");
      }
    });
  }

  Volver() {
    this.router.navigate(['/login']);
  }

}
