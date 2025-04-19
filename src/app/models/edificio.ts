import { Aula } from "./aula";

export interface Edificio {
  id: number;
  nombre_edificio: string;
  id_institucion: number;
  ubicacion_edificio: string;
  aulas: Aula[];
}

export interface EdificioResponse {
  id: number;
  nombre_edificio: string;
  ubicacion_edificio: string;
  id_institucion: number;
}

export interface EdificioNew {
  id_institucion: number;
  nombre_edificio: string;
  ubicacion_edificio: string;
}
