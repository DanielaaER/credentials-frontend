import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CursosService } from 'src/app/services/cursos/cursos.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Asistencia, Horario } from 'src/app/models/horario';
import { Curso } from 'src/app/models/curso';
import { EstudianteClase } from 'src/app/models/estudiante';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {
  cursoId!: number;
  horarios: Horario[] = [];
  estudiantes: EstudianteClase[] = [];
  curso!: Curso;
  role = AuthService.getUserType();

  asistencia: Asistencia[] = [];
  isLoading = true;
  errorMsg = '';
  fechaSeleccionada!: string;
  today = new Date().toISOString().split('T')[0]; // yyyy-MM-dd


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private cursosService: CursosService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      this.errorMsg = 'ID de curso inválido';
      this.isLoading = false;
      return;
    }
    this.cursoId = id;
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

  buscarAsistencia() {
    if (!this.fechaSeleccionada) {
      alert('Por favor selecciona una fecha');
      return;
    }

    this.cursosService.getAsistenciaPorFecha(this.cursoId, this.fechaSeleccionada).subscribe({
      next: (data) => {
        console.log("Asistencia");
        console.log(data);
        this.asistencia = data;
      },
      error: (err) => {
        console.error('Error cargando asistencia', err);
        this.asistencia = [];
      }
    });
  }


  goBack() {
    this.location.back();
  }
  onFechaChange(): void {
    this.buscarAsistencia();
  }

  descargarPDF() {
    if (!this.fechaSeleccionada) {
      alert('Selecciona una fecha primero');
      return;
    }

    const doc = new jsPDF();

    // Encabezado principal
    doc.setFontSize(24);
    doc.setTextColor(157, 141, 241); // Lila pastel
    doc.setFont('helvetica', 'bold');
    doc.text('Instituto QR - Lista de Asistencia', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Subtítulo con fecha
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60); // Gris oscuro
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${this.fechaSeleccionada}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

    // Información del curso centrada
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60); // Gris oscuro
    doc.text(`Curso: ${this.curso.nombre_clase || 'No especificado'}`, 14, 45);
    doc.text(`Clave: ${this.curso.clave_clase || 'No especificado'}`, 14, 55);
    doc.text(`Aula: ${this.horarios[0]?.nombre_aula || 'No especificado'}`, 14, 65);

    // Línea divisoria
    doc.setDrawColor(157, 141, 241);
    doc.setLineWidth(0.5);
    doc.line(14, 70, 196, 70);

    // Espacio antes de la tabla
    let y = 80;

    // Tabla con asistencia
    autoTable(doc, {
      startY: y,
      margin: { top: 80 },
      theme: 'striped',
      headStyles: {
        fillColor: [157, 141, 241], // Lila pastel
        textColor: [255, 255, 255], // Blanco
        fontSize: 12,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 255], // Lila muy claro
      },
      tableLineColor: [157, 141, 241],
      tableLineWidth: 0.2,
      bodyStyles: {
        textColor: [50, 50, 50], // Gris oscuro
        fontSize: 11,
      },
      head: [['Número de Control', 'Nombre Completo', 'Hora de Ingreso', 'Tipo']],
      body: this.asistencia.map(a => [
        a.num_control,
        `${a.nombre} ${a.apellido_pat} ${a.apellido_mat}`,
        new Date(a.hora_ingreso).toLocaleTimeString(),
        a.tipo,
      ]),
    });

    // Pie de página
    const fechaGeneracion = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado automáticamente con Instituto QR - ${fechaGeneracion}`, 14, doc.internal.pageSize.getHeight() - 10);

    // Abrir en una nueva pestaña
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  }



}
