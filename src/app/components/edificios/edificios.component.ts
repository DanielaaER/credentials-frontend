import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  EdificioResponse, EdificioNew } from 'src/app/models/edificio';

import { Location } from '@angular/common';
import { EdificioService } from 'src/app/services/edificio/edificio.service';

@Component({
  selector: 'app-edificios',
  templateUrl: './edificios.component.html',
  styleUrls: ['./edificios.component.css']
})
export class EdificiosComponent implements OnInit {
  edificios: EdificioResponse[] = [];
  selectedEdificio: Partial<EdificioResponse> = {};
  newEdificio: Partial<EdificioNew> = {};
  showForm = false;
  isUpdate = false;
  errorMsg = '';
  
  constructor(
    private edificioService: EdificioService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getEdificios();
    this.getEdificios();

    
  }

  goBack() {
    this.location.back();
  }


  onSelectEdificio(event: any) {
    const idEdificio = Number(event.target.value);
  }


  toggleForm(edificio?: EdificioResponse) {
    this.showForm = !this.showForm;
    if (edificio) {
      this.selectedEdificio = { ...edificio };
      this.isUpdate = true;
    } else {
      this.resetForm();
      this.isUpdate = false;
    }
  }

  resetForm() {
    this.selectedEdificio = {};
    this.newEdificio = {};
    this.errorMsg = '';
  }

  getEdificios() {

  this.edificioService.getEdificios().subscribe(data => {
    this.edificios = data;
  });
}


  createOrUpdateEdificio() {
    if (this.isUpdate) {
      this.updateEdificio();
    } else {
      this.createEdificio();
    }
  }

  createEdificio() {
    if (!this.newEdificio.nombre_edificio) {
      this.errorMsg = 'Por favor, ingresa un nombre.';
      return;
    }

    this.edificioService.createEdificio(this.newEdificio as EdificioNew).subscribe(() => {
      this.getEdificios();
      this.toggleForm();
    });
  }

  updateEdificio() {
    this.edificioService.updateEdificio(this.selectedEdificio.id!, this.selectedEdificio).subscribe(
      (updatedEdificio) => {
        const index = this.edificios.findIndex(doc => doc.id === updatedEdificio.id);
        if (index !== -1) {
          this.edificios[index] = updatedEdificio;
        }
        this.getEdificios();
        this.toggleForm();
      },
      (error) => {
        this.errorMsg = 'No se pudo actualizar la edificio.';
      }
    );
  }

  deleteEdificio(id: number) {
    this.edificioService.deleteEdificio(id).subscribe(
      () => {
        this.getEdificios();
      },
      (error) => {
        this.errorMsg = 'Error al eliminar el edificio.';
        alert(this.errorMsg);
      }
    );
  }

  verDetalles(id: number) {
    this.router.navigate(['/edificio-info', id]);
  }

}
