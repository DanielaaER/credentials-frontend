import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Administrador, AdministradorNew } from 'src/app/models/administrador';
import { AdministradorService } from 'src/app/services/administrador/administrador.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent implements OnInit {
  administradores: Administrador[] = [];
  selectedAdministrador: Partial<Administrador> = {};
  newAdministrador: Partial<AdministradorNew> = {};
  showForm = false;
  isUpdate = false;
  errorMsg = '';
  phoneError = '';
  emailError = '';

  constructor(private administradorService: AdministradorService, private router: Router, private location: Location) {}

  ngOnInit(): void {
    this.getAdministradores();
  }

  goBack() {
    this.location.back();
  }

  toggleForm(administrador?: Administrador) {
    this.showForm = !this.showForm;
    if (administrador) {
      this.selectedAdministrador = { ...administrador };
      this.isUpdate = true;
    } else {
      this.resetForm();
      this.isUpdate = false;
    }
  }

  resetForm() {
    this.selectedAdministrador = {};
    this.newAdministrador = {};
    this.phoneError = '';
    this.emailError = '';
    this.errorMsg = '';
  }

  getAdministradores() {
    this.administradorService.getAdministradores().subscribe(data => {
      console.log(data);
      this.administradores = data;
    });
  }


  createOrUpdateAdministrador() {
    if (this.isUpdate) {
      this.updateAdministrador();
    } else {
      this.createAdministrador();
    }
  }

  createAdministrador() {
    if (!this.newAdministrador.num_control) {
      this.newAdministrador.num_control = "";
    }
    if (this.isFormValid()) {
      this.administradorService.createAdministrador(this.newAdministrador).subscribe(() => {
        this.getAdministradores();
        this.toggleForm();
      });
    }
  }

  updateAdministrador() {
    if (this.isFormValid()) {
      console.log("Actualizando administrador:", this.selectedAdministrador);
      this.administradorService.updateAdministrador(this.selectedAdministrador.id!, this.selectedAdministrador).subscribe(
        (updatedAdministrador) => {
          console.log("Administrador actualizado:", updatedAdministrador);

          // Actualizar el administrador en la lista actual
          const index = this.administradores.findIndex(adm => adm.id === updatedAdministrador.id);
          if (index !== -1) {
            this.administradores[index] = updatedAdministrador;
          }

          this.getAdministradores();
          this.toggleForm();
        },
        (error) => {
          console.error("Error al actualizar el administrador:", error);
          this.errorMsg = 'No se pudo actualizar el administrador.';
        }
      );
    }
  }


  deleteAdministrador(id: number) {
    this.administradorService.deleteAdministrador(id).subscribe(
      () => {
        this.getAdministradores();
      },
      (error) => {
        if (error.status === 500) {
          this.errorMsg = 'No se puede eliminar el administrador porque tiene clases asignadas.';
          alert(this.errorMsg);
        } else {
          this.errorMsg = 'Error al eliminar el administrador.';
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
    const phone = this.isUpdate ? this.selectedAdministrador.telefono : this.newAdministrador.telefono;
    if (phone && !phonePattern.test(phone)) {
      this.phoneError = 'El teléfono debe tener exactamente 10 dígitos numéricos.';
      return false;
    }

    // Validación del correo: formato correcto
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = this.isUpdate ? this.selectedAdministrador.email : this.newAdministrador.email;
    if (email && !emailPattern.test(email)) {
      this.emailError = 'El correo no tiene un formato válido.';
      return false;
    }

    return true;
  }
}
