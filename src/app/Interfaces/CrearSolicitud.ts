export interface CrearSolicitud {
    UsuarioId: number;
    MedicamentoId: number;
}

export interface Solicitud {
  solicitudId: number;
  usuarioId: number;
  usuarioNombre: string ;
  medicamentoNombre: string; 
  medicamentoPrecio: number;  
  estado: string;             
  fechaSolicitud: string;
}