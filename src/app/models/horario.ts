export interface Horario {
  id: number;
  dia: string;
  hora_inicio: string; 
  hora_fin: string;    
  nombre_clase: string;
  clave_clase: string;
  nombre_aula: string;
}

export interface HorarioUpdate {
  id: number;
  id_clase: number;
  dia: string;
  hora_inicio: string; 
  hora_fin: string;    
}

export interface HorarioNew {
  id_clase: number;
  dia: string;
  hora_inicio: string; 
  hora_fin: string;    
}



export interface Asistencia {
  num_control: string;
  nombre: string;
  apellido_pat: string;
  apellido_mat: string;
  hora_ingreso: string;
  tipo: string;
}
