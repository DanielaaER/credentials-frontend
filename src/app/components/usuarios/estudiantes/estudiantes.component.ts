import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Estudiante, EstudianteNew } from 'src/app/models/estudiante';
import { Location } from '@angular/common';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-estudiantes',
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css']
})
export class EstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  selectedEstudiante: Partial<Estudiante> = {};
  newEstudiante: Partial<EstudianteNew> = {};
  showForm = false;
  isUpdate = false;
  errorMsg = '';
  phoneError = '';
  emailError = '';

  constructor(private estudianteService: EstudianteService, private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.getEstudiantes();
    console.log("Estudiantes:", this.estudiantes);
    this.estudiantes = [
      { id: 1, num_control: 'ES12345', nombre: 'Carlos', apellido_pat: 'López', apellido_mat: 'Martínez', telefono: '1234567890', direccion:'asa', email: 'carlos@example.com', semestre: '3', carrera: 'Ingeniería' },
      { id: 2, num_control: 'ES67890', nombre: 'Ana', apellido_pat: 'García', apellido_mat: 'Hernández', telefono: '0987654321', direccion:'asa', email: 'ana@example.com', semestre: '2', carrera: 'Matemáticas' }
    ];

  }

  goBack() {
    this.location.back();
  }

  toggleForm(estudiante?: Estudiante) {
    this.showForm = !this.showForm;
    if (estudiante) {
      this.selectedEstudiante = { ...estudiante };
      this.isUpdate = true;
    } else {
      this.resetForm();
      this.isUpdate = false;
    }
  }

  resetForm() {
    this.selectedEstudiante = {};
    this.newEstudiante = {};
    this.phoneError = '';
    this.emailError = '';
    this.errorMsg = '';
  }

  getEstudiantes() {
    this.estudianteService.getEstudiantes().subscribe(data => {
      this.estudiantes = data;
    });
  }


   verCursos(id: number) {
    this.router.navigate(['/cursos'], { queryParams: { idUser: id } });
  }

  createOrUpdateEstudiante() {
    if (this.isUpdate) {
      this.updateEstudiante();
    } else {
      this.createEstudiante();
    }
  }

  createEstudiante() {
    if (!this.newEstudiante.num_control) {
      this.newEstudiante.num_control = "";
    }
    if (this.isFormValid()) {
      this.estudianteService.createEstudiante(this.newEstudiante).subscribe(() => {
        this.getEstudiantes();
        this.toggleForm();
      });
    }
  }

  updateEstudiante() {
    if (this.isFormValid()) {
      console.log("Actualizando estudiante:", this.selectedEstudiante);
      this.estudianteService.updateEstudiante(this.selectedEstudiante.id!, this.selectedEstudiante).subscribe(
        (updatedEstudiante) => {
          console.log("Estudiante actualizado:", updatedEstudiante);

          // Actualizar el estudiante en la lista actual
          const index = this.estudiantes.findIndex(doc => doc.id === updatedEstudiante.id);
          if (index !== -1) {
            this.estudiantes[index] = updatedEstudiante;
          }

          this.getEstudiantes();
          this.toggleForm();
        },
        (error) => {
          console.error("Error al actualizar el estudiante:", error);
          this.errorMsg = 'No se pudo actualizar el estudiante.';
        }
      );
    }
  }

  deleteEstudiante(id: number) {
    this.estudianteService.deleteEstudiante(id).subscribe(
      () => {
        this.getEstudiantes();
      },
      (error) => {
        if (error.status === 500) {
          this.errorMsg = 'No se puede eliminar el estudiante porque tiene clases asignadas.';
          alert(this.errorMsg);
        } else {
          this.errorMsg = 'Error al eliminar el estudiante.';
          alert(this.errorMsg);
        }
      }
    );
  }

  isFormValid(): boolean {
    this.phoneError = '';
    this.emailError = '';

    // Validación del teléfono: 10 dígitos numéricos
    const phonePattern = /^[0-9]{10}$/;
    const phone = this.isUpdate ? this.selectedEstudiante.telefono : this.newEstudiante.telefono;
    if (phone && !phonePattern.test(phone)) {
      this.phoneError = 'El teléfono debe tener exactamente 10 dígitos numéricos.';
      return false;
    }

    // Validación del correo: formato correcto
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = this.isUpdate ? this.selectedEstudiante.email : this.newEstudiante.email;
    if (email && !emailPattern.test(email)) {
      this.emailError = 'El correo no tiene un formato válido.';
      return false;
    }

    return true;
  }
}
