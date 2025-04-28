import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Docente, DocenteNew } from 'src/app/models/docente';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private apiUrl = 'http://20.161.24.92:8000/api/usuarios';

  constructor(private http: HttpClient) { }

  // Obtener todos los docentes
  getDocentes(): Observable<Docente[]> {
    return this.http.get<Docente[]>(`${this.apiUrl}/docente`).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response.map((docente: any) => this.mapDocente(docente));
        } else if (response && response.length) {
          return response[0].map((docente: any) => this.mapDocente(docente));
        } else {
          return [this.mapDocente(response)];
        }
      })
    );
  }

  // Mapeo de los datos recibidos
  private mapDocente(docente: any): Docente {
    return {
      id: docente.id || docente.id_usuario,
      num_control: docente.num_control || '',
      nombre: docente.nombre || '',
      apellido_pat: docente.apellido_pat || '',
      apellido_mat: docente.apellido_mat || '',
      telefono: docente.telefono || '',
      direccion: docente.direccion || '',
      email: docente.email || '',
      periodo: docente.periodo || '',
    };
  }

  // Crear un nuevo docente
  createDocente(docente: Partial<DocenteNew>): Observable<Docente> {
    return this.http.post<Docente>(`${this.apiUrl}/docente`, docente);
  }

  // Actualizar un docente existente
  updateDocente(id: number, docente: Partial<Docente>): Observable<Docente> {
    const { id: _, ...payload } = docente;
    console.log("Actualizando docente:", payload);
    return this.http.patch<Docente>(`${this.apiUrl}/update/docente/${id}`, payload).pipe(
      map((response: any) => {
        console.log("Respuesta del servidor:", response);
        return this.mapDocente(response);
      })
    );
  }

  // Eliminar un docente
  deleteDocente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/docente/${id}`);
  }
}
