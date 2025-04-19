import { Docente } from "./docente";

export interface Curso {
  id: number;
  id_aula: number;
  clave_clase: string;
  nombre_clase: string;
  docente: Docente;
}

export interface CursoNew {
  id_aula: number;
  clave_clase: string;
  nombre_clase: string;
}


