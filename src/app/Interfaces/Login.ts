export interface LoginDto {
    email: string;
    password: string;
}

export interface Usuario {
    id: number; 
    nombre: string;
    apellido: string;
    correoElectronico: string;
    roll: string;
    genero: string;
}

export interface LoginResponse {
    token: string;
}

export interface CrearUsuario {
    nombre: string;
    apellido: string;
    correoElectronico: string;
    contrasena: string;
    edad: number | null;
    genero: string; 
}