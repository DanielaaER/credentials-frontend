

export interface Administrador {
  id: number;
  num_control: string;
  nombre: string;
  apellido_pat: string;
  apellido_mat: string;
  telefono: string;
  direccion: string;
  email: string;
  puesto_admin: string;
}

export interface AdministradorNew {
  num_control: string;
  nombre: string;
  apellido_pat: string;
  apellido_mat: string;
  telefono: string;
  direccion: string;
  email: string;
  password: string;
  puesto_admin: string;
}

