export interface LoginDto {
    email: string;
    password: string;
}

export interface Usuario {
    id: number; // <--- ¡AGREGA ESTO! Sin esto Angular ignora el ID
    nombre: string;
    apellido: string;
    correoElectronico: string;
    roll: string;
    genero: string;
}

export interface CrearUsuario {
    nombre: string;
    apellido: string;
    correoElectronico: string;
    contrasena: string;
    edad: number | null;
    genero: string; 
}