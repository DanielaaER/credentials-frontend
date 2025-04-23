import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import {
  Curso,
  CursoNew
} from 'src/app/models/curso';
import { Edificio } from 'src/app/models/edificio';
import { Estudiante } from 'src/app/models/estudiante';
import { Horario, HorarioNew, Asistencia } from 'src/app/models/horario';


@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private apiUrl = 'http://20.161.24.92:8000/api';

  constructor(private http: HttpClient) { }

  getCursos(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/horarios/clase/usuario/${id}`);
  }

  getHorarioPorClase(idClase: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios/clase/${idClase}`);
  }

  getHorarioPorAula(idAula: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/horarios/aula/${idAula}`);
  }

  createHorario(horario: HorarioNew): Observable<HorarioNew> {
    return this.http.post<HorarioNew>(`${this.apiUrl}/horarios/`, horario);
  }
  updateHorario(
    id: number,
    horario: Partial<HorarioNew>
  ): Observable<HorarioNew> {
    return this.http.patch<HorarioNew>(
      `${this.apiUrl}/horarios/${id}`,
      horario
    );
  }

  asignarUsuario(id_usuario: number, id_clase: number): Observable<any> {
    const body = { id_usuario, id_clase };
    return this.http.post<any>(`${this.apiUrl}/horarios/asignar-usuario`, body);
  }

  getDocenteClase(idClase: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/horarios/docente/clase/${idClase}`
    );
  }

  deleteHorario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/horarios/${id}`);
  }

  getEstudiantesPorClase(idClase: number): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(
      `${this.apiUrl}/horarios/usuario/clase/${idClase}`
    );
  }

  getAsistenciaPorFecha(
    idClase: number,
    fecha: string
  ): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(
      `${this.apiUrl}/qr/asistencia/clase/${idClase}?fecha=${fecha}`
    );
  }

  getClases(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/instituciones/edificios/aulas/clase/all`
    );
  }

  getCursoById(id: number): Observable<Curso> {
    return this.http.get<any>(
      `${this.apiUrl}/instituciones/edificios/aulas/clase/${id}`
    );
  }

  createCurso(curso: CursoNew): Observable<Curso> {
    curso.clave_clase = '';
    console.log('curso', curso);
    return this.http.post<Curso>(
      `${this.apiUrl}/instituciones/edificios/aulas/clase`,
      curso
    );
  }
  updateCurso(id: number, curso: Partial<Curso>): Observable<Curso> {
    return this.http.patch<Curso>(
      `${this.apiUrl}/instituciones/edificios/aulas/clase/${id}`,
      curso
    );
  }
  deleteCurso(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/instituciones/edificios/aulas/clase/${id}`
    );
  }

  getEdificios(): Observable<Edificio[]> {
    return this.http.get<Edificio[]>(`${this.apiUrl}/instituciones/edificios`);
  }

  getAulasPorEdificio(idEdificio: number): Observable<Edificio> {
    return this.http.get<Edificio>(
      `${this.apiUrl}/instituciones/edificios/${idEdificio}`
    );
  }
}
