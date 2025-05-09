import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';  // <-- IMPORTA ESTO
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { CursoComponent } from './components/cursos/curso/curso.component';
import { FormsModule } from '@angular/forms';
import { DocentesComponent } from './components/usuarios/docentes/docentes.component';
import { AdministradoresComponent } from './components/usuarios/administradores/administradores.component';
import { EstudiantesComponent } from './components/usuarios/estudiantes/estudiantes.component';
import { ClasesComponent } from './components/clases/clases.component';
import { ClasesInfoComponent } from './components/clases-info/clases-info.component';
import { AuthInterceptor } from './guards/auth.interceptor';
import { EdificiosComponent } from './components/edificios/edificios.component';
import { AulasComponent } from './components/aulas/aulas.component';
import { AulasInfoComponent } from './components/aulas-info/aulas-info.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CursosComponent,
    CursoComponent,
    DocentesComponent,
    AdministradoresComponent,
    EstudiantesComponent,
    ClasesComponent,
    ClasesInfoComponent,
    EdificiosComponent,
    AulasComponent,
    AulasInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,  
    HttpClientModule,  
    FormsModule  
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
