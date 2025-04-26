import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Administrador, AdministradorNew } from 'src/app/models/administrador';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
private apiUrl = 'http://20.161.24.92:8000/api/usuarios';

  constructor(private http: HttpClient) {}

  getAdministradores(): Observable<Administrador[]> {
  return this.http.get<Administrador[]>(`${this.apiUrl}/administrador`).pipe(
    map((response: any) => {
      // Verificar si la respuesta es un array o un objeto
      if (Array.isArray(response)) {
        return response.map((administrador: any) => this.mapAdministrador(administrador));
      } else if (response && response.length) {
        // Si es un objeto que contiene un array
        return response[0].map((administrador: any) => this.mapAdministrador(administrador));
      } else {
        // Si es un objeto individual
        return [this.mapAdministrador(response)];
      }
    })
  );
}

  private mapAdministrador(administrador: any): Administrador {
    return {
      id: administrador.id || administrador.id_usuario || administrador.id_1,
      num_control: administrador.num_control || '',
      nombre: administrador.nombre || '',
      apellido_pat: administrador.apellido_pat || '',
      apellido_mat: administrador.apellido_mat || '',
      telefono: administrador.telefono || '',
      direccion: administrador.direccion || '',
      email: administrador.email || '',
      puesto_admin: administrador.puesto_admin || '',
    };
  }

  // Crear un nuevo administrador
  createAdministrador(administrador: Partial<AdministradorNew>): Observable<Administrador> {
    return this.http.post<Administrador>(`${this.apiUrl}/administrador`, administrador
    );
  }

  // Actualizar un administrador existente
  // Actualizar un administrador existente
  updateAdministrador(id: number, administrador: Partial<Administrador>): Observable<Administrador> {
    // Eliminar el campo 'id' antes de enviar al backend
    const { id: _, ...payload } = administrador;
    console.log("Datos enviados al backend:", payload);
    return this.http.patch<Administrador>(`${this.apiUrl}/update/administrador/${id}`, payload).pipe(
      map((response: any) => {
        console.log("Respuesta del servidor:", response);
        return this.mapAdministrador(response);
      })
    );
  }


  // Eliminar un administrador
  deleteAdministrador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/administrador/${id}`);
  }
}