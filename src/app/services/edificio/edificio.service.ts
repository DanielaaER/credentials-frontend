import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Edificio, EdificioNew, EdificioResponse } from 'src/app/models/edificio';

@Injectable({
  providedIn: 'root'
})
export class EdificioService {
  private apiUrl = 'http://20.161.24.92:8000/api/instituciones';

  constructor(private http: HttpClient) {}

  // Obtener todos los edificios
  getEdificios(): Observable<EdificioResponse[]> {
    return this.http.get<EdificioResponse[]>(`${this.apiUrl}/edificios`).pipe(
      map((response: any) => {
        console.log("Respuesta del servidor:", response);
        if (Array.isArray(response)) {
          return response.map((edificio: any) => this.mapEdificio(edificio));
        } else if (response && response.length) {
          return response[0].map((edificio: any) => this.mapEdificio(edificio));
        } else {
          return [this.mapEdificio(response)];
        }
      })
    );
  }

  // Mapeo de los datos recibidos
  private mapEdificio(edificio: any): EdificioResponse {
    return {
      id: edificio.id || edificio.id,
      nombre_edificio: edificio.nombre_edificio || edificio.nombre_edificio,
      ubicacion_edificio: edificio.ubicacion_edificio || edificio.ubicacion_edificio,
      id_institucion: edificio.id_institucion || edificio.id_institucion
    };
  }

  // Crear un nuevo edificio
  createEdificio(edificio: Partial<EdificioNew>): Observable<EdificioResponse> {
    edificio.id_institucion = 1;
   
    return this.http.post<EdificioResponse>(`${this.apiUrl}/edificios`, edificio);
  }

  // Actualizar un edificio existente
  updateEdificio(id: number, edificio: Partial<EdificioResponse>): Observable<EdificioResponse> {
    const { id: _, ...payload } = edificio;
    console.log("Actualizando edificio:", payload);
    return this.http.patch<EdificioResponse>(`${this.apiUrl}/edificios/${id}`, payload).pipe(
      map((response: any) => {
        console.log("Respuesta del servidor:", response);
        return this.mapEdificio(response);
      })
    );
  }

  // Eliminar un edificio
  deleteEdificio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/edificios/${id}`);
  }
}
