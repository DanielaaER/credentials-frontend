import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
 role: string = AuthService.getUserType();

  constructor(private router: Router) {}

  ngOnInit() {
    this.role = AuthService.getUserType();
    console.log('User role:', this.role);
  }

  verCursos() {
    this.router.navigate(['/cursos']);
  }

  verDocentes() {
    this.router.navigate(['/docentes']);
  }
  verAdministradores() {
    this.router.navigate(['/administradores']);
  }

  verEstudiantes() {
    this.router.navigate(['/estudiantes']);
  }

  verClases() {
    this.router.navigate(['/clases']);
  }

  verEdificios() {
    this.router.navigate(['/edificios']);
  }

  verAulas() {
    this.router.navigate(['/aulas']);
  }
}
