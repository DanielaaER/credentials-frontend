import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface LoginResponse {
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://20.161.24.92:8000/api';
  
  
  static getUserId() {
    const userId = localStorage.getItem('user_id');
    return userId ? parseInt(userId, 10) : null;
  }

  static getUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  static getAcessToken() {
    const accessToken = localStorage.getItem('access_token');
    return accessToken ? accessToken : null;
    }

  static getUserType() {
    const userData = localStorage.getItem('user_data');
    console.log('User data:', userData);
    if (!userData) {
      return "invitado";
    }
    const data = JSON.parse(userData);
    console.log("Data:", data);

    if (data.hasOwnProperty("semestre") && data.semestre) {
      return "estudiante";
    } else if (data.hasOwnProperty("periodo") && data.periodo) {
      return "docente";
    }
    return "administrador";
  }


  constructor(private http: HttpClient) { }

  login(num_control: string, password: string): Observable<boolean> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { num_control, password }).pipe(
      map(res => {
        console.log('Login response:', res);
        
        localStorage.setItem('access_token', res.data.access_token);
        localStorage.setItem('user_id', res.data.user.toString());
        
        return true;
      })
    );
  }


  getUserData(): Observable<any> {
    const id = localStorage.getItem('user_id');
    return this.http.get<any>(`${this.apiUrl}/usuario/${id}`,
      { headers: { Authorization: `Bearer ${this.getToken()}` } }
    ).pipe(
      map(res => {
        localStorage.setItem('user_data', JSON.stringify(res.data));
        return res;
      }));
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    window.location.href = '/login';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

 
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }



}
