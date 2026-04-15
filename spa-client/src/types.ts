// Types dominio principales SPA
export interface GalleryImage {
  src: string;
  alt?: string;
}

export interface Reserva {
  id: number;
  paciente: User;
  fecha_hora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  nota?: string;
  creado: string;
  actualizado: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
