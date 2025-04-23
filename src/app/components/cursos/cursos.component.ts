import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CursosService } from 'src/app/services/cursos/cursos.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Curso } from 'src/app/models/curso';


@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  cursos: Curso[] = [];
  role = '';
  idUser: number = 0;

  constructor(private cursosService: CursosService,
    private router: Router, private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    this.role = AuthService.getUserType();
  
    this.route.queryParams.subscribe(params => {
      this.idUser = +params['idUser'] || AuthService.getUserId() || 0;
    });
    this.loadCursos();
    console.log(this.idUser);
    console.log(this.role);
    console.log(this.cursos);
    }

  loadCursos() {
    let id: number;
    if (this.role === 'administrador') {
      id = this.idUser;
    } else {
      id = AuthService.getUserId() ?? 0; 
    }
    if (id !== null) {
      this.cursosService.getCursos(id).subscribe(
        (data: Curso[]) => {
          this.cursos = data;
        },
        (error) => {
          console.error('Error fetching cursos:', error);
        }
      );
    } else {
      console.error('User ID is null. Cannot fetch cursos.');
    }
  }

  goBack() {
    this.location.back();
  }


  verCurso(id: number) {
    this.router.navigate(['/curso', id]);
  }
}
