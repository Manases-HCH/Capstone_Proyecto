export interface User {
  idUsuario: number;
  correo: string;
  rol: 'student' | 'teacher' | 'admin' | string;
  nombre: string;
}
