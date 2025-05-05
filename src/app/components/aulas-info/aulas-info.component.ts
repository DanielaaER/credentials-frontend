import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CursosService } from 'src/app/services/cursos/cursos.service';
import { Curso } from 'src/app/models/curso';
import { Horario } from 'src/app/models/horario';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-aulas-info',
  templateUrl: './aulas-info.component.html',
  styleUrls: ['./aulas-info.component.css']
})
export class AulasInfoComponent implements OnInit {
  horarios: Horario[] = [];
  horariosFiltrados: Horario[] = [];
  curso!: Curso;
  role = AuthService.getUserType();
  isLoading = true;
  errorMsg = '';
  today = new Date().toISOString().split('T')[0]; // yyyy-MM-dd
  diasDisponibles: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  diaSeleccionado: string = 'Lunes';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private cursosService: CursosService,
    private estudianteService: EstudianteService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.errorMsg = 'ID de curso inválido';
      this.isLoading = false;
      return;
    }
    this.loadHorario(id);
  }

  loadHorario(idAula: number) {
    this.cursosService.getHorarioPorAula(idAula).subscribe({
      next: (data) => {
        this.horarios = data;
        this.filtrarPorDia(this.diaSeleccionado);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error cargando horario';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  filtrarPorDia(dia: string) {
    this.diaSeleccionado = dia;
    this.horariosFiltrados = this.horarios.filter(h => h.dia === dia);
  }

  goBack() {
    this.location.back();
  }
}
