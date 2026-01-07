export interface LoginDto{
    email: string;
    password: string;
}

export interface Usuario {
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
    genero: string; // <--- TIENE QUE SER STRING para que el Enum.Parse funcione
}