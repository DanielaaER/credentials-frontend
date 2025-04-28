import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Docente, DocenteNew } from 'src/app/models/docente';
import { DocenteService } from 'src/app/services/docente/docente.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-docentes',
  templateUrl: './docentes.component.html',
  styleUrls: ['./docentes.component.css']
})
export class DocentesComponent implements OnInit {
  docentes: Docente[] = [];
  selectedDocente: Partial<Docente> = {};
  newDocente: Partial<DocenteNew> = {};
  showForm = false;
  isUpdate = false;
  errorMsg = '';
  phoneError = '';
  emailError = '';

  constructor(private docenteService: DocenteService, private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.getDocentes();
  }

  goBack() {
    this.location.back();
  }

  toggleForm(docente?: Docente) {
    this.showForm = !this.showForm;
    if (docente) {
      this.selectedDocente = { ...docente };
      this.isUpdate = true;
    } else {
      this.resetForm();
      this.isUpdate = false;
    }
  }

  resetForm() {
    this.selectedDocente = {};
    this.newDocente = {};
    this.phoneError = '';
    this.emailError = '';
    this.errorMsg = '';
  }

  getDocentes() {
    this.docenteService.getDocentes().subscribe(data => {
      this.docentes = data;
    });
  }

   verCursos(id: number) {
    this.router.navigate(['/cursos'], { queryParams: { idUser: id } });
  }

  createOrUpdateDocente() {
    if (this.isUpdate) {
      this.updateDocente();
    } else {
      this.createDocente();
    }
  }

  createDocente() {
    if (!this.newDocente.num_control) {
      this.newDocente.num_control = "";
    }
    if (this.isFormValid()) {
      this.docenteService.createDocente(this.newDocente).subscribe(() => {
        this.getDocentes();
        this.toggleForm();
      });
    }
  }

  updateDocente() {
    if (this.isFormValid()) {
      console.log("Actualizando docente:", this.selectedDocente);
      this.docenteService.updateDocente(this.selectedDocente.id!, this.selectedDocente).subscribe(
        (updatedDocente) => {
          console.log("Docente actualizado:", updatedDocente);

          // Actualizar el docente en la lista actual
          const index = this.docentes.findIndex(doc => doc.id === updatedDocente.id);
          if (index !== -1) {
            this.docentes[index] = updatedDocente;
          }

          this.getDocentes();
          this.toggleForm();
        },
        (error) => {
          console.error("Error al actualizar el docente:", error);
          this.errorMsg = 'No se pudo actualizar el docente.';
        }
      );
    }
  }

  deleteDocente(id: number) {
    this.docenteService.deleteDocente(id).subscribe(
      () => {
        this.getDocentes();
      },
      (error) => {
        if (error.status === 500) {
          this.errorMsg = 'No se puede eliminar el docente porque tiene clases asignadas.';
          alert(this.errorMsg);
        } else {
          this.errorMsg = 'Error al eliminar el docente.';
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
    const phone = this.isUpdate ? this.selectedDocente.telefono : this.newDocente.telefono;
    if (phone && !phonePattern.test(phone)) {
      this.phoneError = 'El teléfono debe tener exactamente 10 dígitos numéricos.';
      return false;
    }

    // Validación del correo: formato correcto
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = this.isUpdate ? this.selectedDocente.email : this.newDocente.email;
    if (email && !emailPattern.test(email)) {
      this.emailError = 'El correo no tiene un formato válido.';
      return false;
    }

    return true;
  }
}
