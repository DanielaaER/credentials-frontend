export interface Estudiante {
  id: number;
  num_control: string;
  nombre: string;
  apellido_pat: string;
  apellido_mat: string;
  telefono: string;
  direccion: string;
  email: string;
  semestre: string;
  carrera: string;
}


export interface EstudianteNew {
  num_control: string;
  nombre: string;
  apellido_pat: string;
  apellido_mat: string;
  telefono: string;
  direccion: string;
  email: string;
  password: string;
  semestre: number;
  carrera: string;
}



export interface EstudianteClase {
  num_control: string;
  nombre: string;
  apellido_pat: string;
  apellido_mat: string;
}