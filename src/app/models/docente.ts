export interface Docente {
  id: number;
  num_control: string;
  nombre: string;
  apellido_pat: string;
  apellido_mat: string;
  telefono: string;
  direccion: string;
  email: string;
  periodo: string;
}

export interface DocenteNew {
  num_control: string;
  nombre: string;
  apellido_pat: string;
  apellido_mat: string;
  telefono: string;
  direccion: string;
  email: string;
  password: string;
  periodo: string;
}


