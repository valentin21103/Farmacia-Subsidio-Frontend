export interface CrearSolicitud {
    UsuarioId: number;
    MedicamentoId: number;
}

export interface Solicitud {
  solicitudId: number;
  usuarioId: number;
  medicamentoNombre: string;  // <--- ¡Esto es lo que queríamos!
  medicamentoPrecio: number;  // <--- Nuevo dato
  estado: string;             // Ahora llega directo como texto del backend
  fechaSolicitud: string;
}