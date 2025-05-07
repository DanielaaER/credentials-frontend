import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CursosService } from 'src/app/services/cursos/cursos.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { Curso } from 'src/app/models/curso';
import { EstudianteClase, Estudiante } from 'src/app/models/estudiante';
import { Horario, Asistencia, HorarioNew, HorarioUpdate } from 'src/app/models/horario';

@Component({
  selector: 'app-clases-info',
  templateUrl: './clases-info.component.html',
  styleUrls: ['./clases-info.component.css']
})
export class ClasesInfoComponent  {
  cursoId!: number;
  horarios: Horario[] = [];
  estudiantes: EstudianteClase[] = [];
  curso!: Curso;
  role = AuthService.getUserType();

  asistencia: Asistencia[] = [];
  isLoading = true;
  errorMsg = '';
  today = new Date().toISOString().split('T')[0]; // yyyy-MM-dd
  showAddHorarioForm = false;
  nuevoHorario: HorarioNew = {
    id_clase: 0,
    dia: '',
    hora_inicio: '',
    hora_fin: ''
  };
  diasDisponibles: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  updateHorarioForm: boolean = false;
  selectedHorario: Partial<HorarioUpdate> = {};

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
    this.cursoId = id;
    this.nuevoHorario.id_clase = id;
    this.loadHorario();
    this.loadEstudiantes();
    this.loadCurso();
  }

  loadHorario() {
    this.cursosService.getHorarioPorClase(this.cursoId).subscribe({
      next: (data) => {
        this.horarios = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error cargando horario';
        this.isLoading = false;
        console.error(err);
      }
    });
  }


toggleUpdateHorario(horario: Horario) {
  this.selectedHorario = { ...horario };
  this.updateHorarioForm = true;
  this.showAddHorarioForm = false;
}

updateHorario() {
  if (!this.selectedHorario.dia || !this.selectedHorario.hora_inicio || !this.selectedHorario.hora_fin) {
    alert('Por favor, completa todos los campos');
    return;
  }

  // Verificar que el día no esté repetido, excluyendo el mismo horario
  const diaRepetido = this.horarios.some(h => 
    h.dia === this.selectedHorario.dia && h.id !== this.selectedHorario.id
  );

  if (diaRepetido) {
    alert('Ya existe otro horario para el día seleccionado');
    return;
  }

  this.cursosService.updateHorario(this.selectedHorario.id!, this.selectedHorario).subscribe(() => {
    alert('Horario actualizado correctamente');
    this.loadHorario();
    this.toggleUpdateHorarioForm();
  }, (err) => {
    console.error('Error al actualizar horario', err);
    alert('Error al actualizar el horario');
  });
}

deleteHorario(id: number) {
  if (confirm('¿Estás seguro de que deseas eliminar este horario?')) {
    this.cursosService.deleteHorario(id).subscribe(() => {
      alert('Horario eliminado correctamente');
      this.loadHorario();
      this.toggleUpdateHorarioForm();
    }, (err) => {
      console.error('Error al eliminar horario', err);
      alert('Error al eliminar el horario');
    });
  }
}

toggleUpdateHorarioForm() {
  this.updateHorarioForm = !this.updateHorarioForm;
}


  
  toggleAddHorario() {
    this.showAddHorarioForm = !this.showAddHorarioForm;
  }

  agregarHorario() {
    if (!this.nuevoHorario.dia || !this.nuevoHorario.hora_inicio || !this.nuevoHorario.hora_fin) {
      alert('Por favor, completa todos los campos');
      return;
    }

    // Verificar que el día no esté repetido
    const diaRepetido = this.horarios.some(h => h.dia === this.nuevoHorario.dia);
    if (diaRepetido) {
      alert('Ya existe un horario para el día seleccionado');
      return;
    }

    this.cursosService.createHorario(this.nuevoHorario).subscribe(() => {
      alert('Horario agregado correctamente');
      this.loadHorario();
      this.toggleAddHorario();
    }, (err) => {
      console.error('Error al agregar horario', err);
      alert('Error al agregar el horario');
    });
  }


  loadEstudiantes() {
    this.cursosService.getEstudiantesPorClase(this.cursoId).subscribe({
      next: (data) => {
        this.estudiantes = data;
      },
      error: (err) => {
        console.error('Error cargando estudiantes', err);
      }
    });
  }

  loadCurso() {
    this.cursosService.getCursoById(this.cursoId).subscribe({
      next: (data) => {
        console.log("load curso");
        console.log(data);
        this.curso = data;
      },
      error: (err) => {
        console.error('Error cargando curso', err);
      }
    });
      }


  // Nuevas variables
showAddEstudianteForm = false;
estudiantesNoInscritos: Estudiante[] = [];
selectedEstudianteId: number = 0;

  // Método para cargar todos los estudiantes no inscritos en la clase
  loadEstudiantesNoInscritos() {
    this.estudianteService.getEstudiantes().subscribe((todosEstudiantes) => {
      // Filtrar solo los estudiantes que no están en la clase actual
      this.estudiantesNoInscritos = todosEstudiantes.filter(e => 
        !this.estudiantes.some(est => est.num_control === e.num_control)
      );
    }, (err) => {
      console.error('Error cargando estudiantes no inscritos', err);
    });
  }

  // Método para asignar un estudiante a la clase
  asignarEstudiante() {
    if (this.selectedEstudianteId === 0) {
      alert('Por favor, selecciona un estudiante');
      return;
    }

    this.cursosService.asignarUsuario(this.selectedEstudianteId, this.cursoId).subscribe(() => {
      alert('Estudiante agregado correctamente');
      this.loadEstudiantes();
      this.toggleAddEstudiante();
    }, (err) => {
      console.error('Error al asignar estudiante', err);
      alert('Error al agregar el estudiante');
    });
  }

  // Método para abrir o cerrar el formulario
  toggleAddEstudiante() {
    this.showAddEstudianteForm = !this.showAddEstudianteForm;
    if (this.showAddEstudianteForm) {
      this.loadEstudiantesNoInscritos();
    }
  }


  goBack() {
    this.location.back();
  }




}
