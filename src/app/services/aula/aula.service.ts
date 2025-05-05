import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Aula, AulaNew } from 'src/app/models/aula';

@Injectable({
  providedIn: 'root'
})
export class AulasService {
  private apiUrl = 'http://20.161.24.92:8000/api/instituciones';

  constructor(private http: HttpClient) {}

  // Obtener todos los aulas
  getAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.apiUrl}/edificios/aulas/all`).pipe(
      map((response: any) => {
        console.log("Respuesta del servidor:", response);
        if (Array.isArray(response)) {
          return response.map((aula: any) => this.mapAula(aula));
        } else if (response && response.length) {
          return response[0].map((aula: any) => this.mapAula(aula));
        } else {
          return [this.mapAula(response)];
        }
      })
    );
  }

  // Mapeo de los datos recibidos
  private mapAula(aula: any): Aula {
    return {
      id: aula.id || aula.id,
      nombre_aula: aula.nombre_aula || aula.nombre_aula,
      id_edificio: aula.id_edificio || aula.id_edificio,

    };
  }

  // Crear un nuevo aula
  createAula(aula: Partial<AulaNew>): Observable<Aula> {
 
    return this.http.post<Aula>(`${this.apiUrl}/edificios/aulas`, aula);
  }

  // Actualizar un aula existente
  updateAula(id: number, aula: Partial<Aula>): Observable<Aula> {
    const { id: _, ...payload } = aula;
    console.log("Actualizando aula:", payload);
    return this.http.patch<Aula>(`${this.apiUrl}/edificios/aulas/${id}`, payload).pipe(
      map((response: any) => {
        console.log("Respuesta del servidor:", response);
        return this.mapAula(response);
      })
    );
  }

  // Eliminar un aula
  deleteAula(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/edificios/aulas/${id}`);
  }
}
