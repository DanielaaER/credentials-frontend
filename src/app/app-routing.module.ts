import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { CursoComponent } from './components/cursos/curso/curso.component';


import { authGuard } from './guards/auth.guard';
import { DocentesComponent } from './components/usuarios/docentes/docentes.component';
import { AdministradoresComponent } from './components/usuarios/administradores/administradores.component';
import { EstudiantesComponent } from './components/usuarios/estudiantes/estudiantes.component';
import { ClasesComponent } from './components/clases/clases.component';
import { ClasesInfoComponent } from './components/clases-info/clases-info.component';
import { EdificiosComponent } from './components/edificios/edificios.component';
import { AulasComponent } from './components/aulas/aulas.component';
import { AulasInfoComponent } from './components/aulas-info/aulas-info.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'cursos', component: CursosComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'curso/:id', component: CursoComponent, canActivate: [authGuard] },
  { path: 'docentes', component: DocentesComponent, canActivate: [authGuard] },
  { path: 'administradores', component: AdministradoresComponent, canActivate: [authGuard] },
  { path: 'estudiantes', component: EstudiantesComponent, canActivate: [authGuard] },
  { path: 'clases', component: ClasesComponent, canActivate: [authGuard] },
  { path: 'clase-info/:id', component: ClasesInfoComponent, canActivate: [authGuard] },
  { path: 'edificios', component: EdificiosComponent, canActivate: [authGuard] },
  { path: 'aulas', component: AulasComponent, canActivate: [authGuard] },
  { path: 'aulas-info/:id', component: AulasInfoComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
