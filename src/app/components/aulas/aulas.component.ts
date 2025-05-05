import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DocenteService } from 'src/app/services/docente/docente.service';
import { AulasService } from 'src/app/services/aula/aula.service';
import { EdificioService } from 'src/app/services/edificio/edificio.service';
import { Aula, AulaNew } from 'src/app/models/aula';
import { EdificioResponse } from 'src/app/models/edificio';

@Component({
  selector: 'app-aulas',
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  aulas: Aula[] = [];
  selectedAula: Partial<Aula> = {};
  newAula: Partial<AulaNew> = {};
  edificios: EdificioResponse[] = [];
  showForm = false;
  isUpdate = false;
  errorMsg = '';
  phoneError = '';
  emailError = '';

  constructor(
    private aulaService: AulasService,
    private router: Router,
    private location: Location,
    private edificiosService: EdificioService
  ) {}

  ngOnInit(): void {
    this.getAulas();
    this.getEdificios();

    
  }

  goBack() {
    this.location.back();
  }

  getEdificios() {
    this.edificiosService.getEdificios().subscribe(data => {
      this.edificios = data;
      console.log('Edificios cargados:', this.edificios);
    });
  }

  
  

  getAulas() {
    this.aulaService.getAulas().subscribe(data => {
      this.aulas = data;  // Ahora el tipo es reconocido correctamente
      console.log('Aulas cargadas:', this.aulas);
    });
  }

  toggleForm(aula?: Aula) {
    this.showForm = !this.showForm;
    if (aula) {
      this.selectedAula = { ...aula };
      this.isUpdate = true;
    } else {
      this.resetForm();
      this.isUpdate = false;
    }
  }

  resetForm() {
    this.selectedAula = {};
    this.newAula = {};
    this.phoneError = '';
    this.emailError = '';
    this.errorMsg = '';
  }



  createOrUpdateAula() {
    if (this.isUpdate) {
      this.updateAula();
    } else {
      this.createAula();
    }
  }

  createAula() {
    if (!this.newAula.id_edificio) {
      this.errorMsg = 'Por favor, selecciona un edificio.';
      return;
    }

    this.aulaService.createAula(this.newAula as AulaNew).subscribe(() => {
      this.getAulas();
      this.toggleForm();
    });
  }

  updateAula() {
    this.aulaService.updateAula(this.selectedAula.id!, this.selectedAula).subscribe(
      (updatedAula) => {
        const index = this.aulas.findIndex(doc => doc.id === updatedAula.id);
        if (index !== -1) {
          this.aulas[index] = updatedAula;
        }
        this.getAulas();
        this.toggleForm();
      },
      (error) => {
        this.errorMsg = 'No se pudo actualizar la aula.';
      }
    );
  }

  deleteAula(id: number) {
    this.aulaService.deleteAula(id).subscribe(
      () => {
        this.getAulas();
      },
      (error) => {
        this.errorMsg = 'Error al eliminar la aula.';
        alert(this.errorMsg);
      }
    );
  }

  verDetalles(id: number) {
    this.router.navigate(['/aulas-info', id]);
  }

}
