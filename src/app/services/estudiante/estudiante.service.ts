import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Estudiante, EstudianteNew } from 'src/app/models/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'http://20.161.24.92:8000/api/usuarios';

  constructor(private http: HttpClient) {}

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/estudiante`).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response.map((estudiante: any) => this.mapEstudiante(estudiante));
        } else if (response && response.length) {
          return response[0].map((estudiante: any) => this.mapEstudiante(estudiante));
        } else {
          return [this.mapEstudiante(response)];
        }
      })
    );
  }

  // Mapeo de los datos recibidos
  private mapEstudiante(estudiante: any): Estudiante {
    
    return {
      id: estudiante.id || estudiante.id_usuario,
      num_control: estudiante.num_control || '',
      nombre: estudiante.nombre || '',
      apellido_pat: estudiante.apellido_pat || '',
      apellido_mat: estudiante.apellido_mat || '',
      telefono: estudiante.telefono || '',
      direccion: estudiante.direccion || '',
      email: estudiante.email || '',
      semestre: estudiante.semestre || 0,
      carrera: estudiante.carrera || '',
    };
  }

  // Crear un nuevo estudiante
  createEstudiante(estudiante: Partial<EstudianteNew>): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${this.apiUrl}/estudiante`, estudiante);
  }

  // Actualizar un estudiante existente
  updateEstudiante(id: number, estudiante: Partial<Estudiante>): Observable<Estudiante> {
    const { id: _, ...payload } = estudiante;
    console.log("Actualizando estudiante:", payload);
    return this.http.patch<Estudiante>(`${this.apiUrl}/update/estudiante/${id}`, payload).pipe(
      map((response: any) => {
        console.log("Respuesta del servidor:", response);
        return this.mapEstudiante(response);
      })
    );
  }

  // Eliminar un estudiante
  deleteEstudiante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/estudiante/${id}`);
  }
}
