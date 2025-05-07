import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curso, CursoNew } from 'src/app/models/curso';
import { Location } from '@angular/common';
import { CursosService } from 'src/app/services/cursos/cursos.service';
import { DocenteService } from 'src/app/services/docente/docente.service';
import { Edificio } from 'src/app/models/edificio';
import { Aula } from 'src/app/models/aula';
import { Docente } from 'src/app/models/docente';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {
  clases: Curso[] = [];
  edificios: Edificio[] = [];
  aulas: Aula[] = [];
  selectedClase: Partial<Curso> = {};
  newClase: Partial<CursoNew> = {};
  showForm = false;
  isUpdate = false;
  errorMsg = '';
  phoneError = '';
  emailError = '';

  constructor(
    private claseService: CursosService,
    private router: Router,
    private location: Location,
    private docenteService: DocenteService 
  ) {}

  ngOnInit(): void {
    this.getClases();
    this.getEdificios();

    
  }

  goBack() {
    this.location.back();
  }

  getEdificios() {
    this.claseService.getEdificios().subscribe(data => {
      this.edificios = data;
      console.log('Edificios cargados:', this.edificios);
    });
  }

  onSelectEdificio(event: any) {
    const idEdificio = Number(event.target.value);
    if (idEdificio) {
      this.getAulas(idEdificio);
    }
  }

  getAulas(idEdificio: number) {
    this.claseService.getAulasPorEdificio(idEdificio).subscribe(data => {
      this.aulas = data.aulas;  // Ahora el tipo es reconocido correctamente
      console.log('Aulas cargadas:', this.aulas);
    });
  }

  toggleForm(clase?: Curso) {
    this.showForm = !this.showForm;
    if (clase) {
      this.selectedClase = { ...clase };
      this.isUpdate = true;
    } else {
      this.resetForm();
      this.isUpdate = false;
    }
  }

  resetForm() {
    this.selectedClase = {};
    this.newClase = {};
    this.phoneError = '';
    this.emailError = '';
    this.errorMsg = '';
  }
getClases() {
  this.clases = [];

  this.claseService.getClases().subscribe(
    data => {
      for (const clase of data) {
        this.claseService.getDocenteClase(clase.id!).subscribe(
          docente => {
            if (docente) {
              clase.docente = docente;
              console.log('Docente asignado:', docente);
            } else {
              console.log('No se encontró docente para la clase:', clase.id);
              clase.docente = null;
            }
            this.clases.push(clase);
          },
          error => {
            if (error.status === 404) {
              console.warn(`Clase ${clase.id} no tiene docente asignado.`);
              clase.docente = null; // Asignar null si no hay docente
            } else {
              console.error('Error al obtener el docente:', error);
            }
            // En ambos casos, agregar la clase
            this.clases.push(clase);
          }
        );
      }
      console.log('Clases cargadas:', this.clases);
    },
    error => {
      console.error('Error al obtener las clases:', error);
      alert('Error al cargar las clases. Por favor, intenta más tarde.');
    }
  );
}


  createOrUpdateClase() {
    if (this.isUpdate) {
      this.updateClase();
    } else {
      this.createClase();
    }
  }

  createClase() {
    if (!this.newClase.id_aula) {
      this.errorMsg = 'Por favor, selecciona un aula.';
      return;
    }

    this.claseService.createCurso(this.newClase as CursoNew).subscribe(() => {
      this.getClases();
      this.toggleForm();
    });
  }

  updateClase() {
    this.claseService.updateCurso(this.selectedClase.id!, this.selectedClase).subscribe(
      (updatedClase) => {
        const index = this.clases.findIndex(doc => doc.id === updatedClase.id);
        if (index !== -1) {
          this.clases[index] = updatedClase;
        }
        this.getClases();
        this.toggleForm();
      },
      (error) => {
        this.errorMsg = 'No se pudo actualizar la clase.';
      }
    );
  }

  deleteClase(id: number) {
    this.claseService.deleteCurso(id).subscribe(
      () => {
        this.getClases();
      },
      (error) => {
        this.errorMsg = 'Error al eliminar la clase.';
        alert(this.errorMsg);
      }
    );
  }

  verDetalles(id: number) {
    this.router.navigate(['/clase-info', id]);
  }


  abrirAsignacionDocente(clase: Curso) {
    this.selectedClase = clase;
    this.obtenerDocentes(); // Cargar docentes disponibles
    
    console.log('Docentes cargados:', this.docentes);
    this.showAsignacionDocente = true;
  }


  showAsignacionDocente = false;
  selectedDocente: number = 0;
  docentes: Docente[] = [];

  obtenerDocentes() {
    this.docenteService.getDocentes().subscribe(data => {
      this.docentes = data;
      console.log('Docentes cargados:', this.docentes);
    });
  }

  asignarDocente() {
    if (!this.selectedDocente) {
      alert('Por favor selecciona un docente.');
      return;
    }

    this.claseService.asignarUsuario(this.selectedDocente, this.selectedClase.id!).subscribe(
      (data) => {
        console.log('Docente asignado:', data);
        this.claseService.getDocenteClase(this.selectedClase.id!).subscribe(
          docente => {
            this.selectedClase.docente = docente;
            console.log('Docente actualizado:', docente);
            this.getClases(); // Actualizar lista de clases
            this.cerrarAsignacionDocente();
          },
          error => {
            console.error('Error al obtener el docente:', error);
            if (error.status === 404) {
              alert('Debes asignar un horario antes de asignar un docente.');
            } 
            else if (error.status === 500) {
              alert('Error interno del servidor. Por favor, intenta más tarde.');
            }
            else if (error.status === 0) {
              alert('Error de conexión. Por favor, verifica tu conexión a Internet.');
            }
            else if (error.status === 409) {
              alert('Conflicto al asignar docente por traslape de horarios.');
            }

            else {
              alert('Error al obtener el docente. Por favor, intenta más tarde.');
            }
          }
        );
      },
      error => {
        if (error.status === 404) {
          alert('Debes asignar un horario antes de asignar un docente.');
        } else {
          alert('Error al asignar el docente. Por favor, intenta más tarde.');
        }
        console.error('Error al asignar el docente:', error);
      }
    );
  }


  cerrarAsignacionDocente() {
    this.showAsignacionDocente = false;
    this.selectedDocente = 0;
  }

}
