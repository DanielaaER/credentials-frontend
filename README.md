# Virtual Credentials Frontend

## Descripción

Este es el frontend de la plataforma **Virtual Credentials**, una aplicación web que permite gestionar credenciales virtuales para instituciones educativas. Esta interfaz de usuario está construida con Angular y se conecta a una API desarrollada en FastAPI.

### Funcionalidades Principales

* Autenticación de usuarios mediante JWT
* Gestión de cursos y clases
* Asignación de horarios
* Registro y visualización de aulas
* Gestión de docentes y estudiantes
* Escaneo y validación de códigos QR
* Interfaz diferenciada por tipo de usuario (docente, administrador)

## Tecnologías Utilizadas

* Angular 17
* TypeScript
* RxJS
* Angular Router
* Tailwind CSS (opcional)
* Angular Material (si se usa)
* JWT para autenticación
* Consumo de API REST con `HttpClient`

## Instalación

### Clonar el repositorio

```bash
git clone https://github.com/DanielaaER/credentials-frontend
cd credentials-frontend
```

### Instalar dependencias

```bash
npm install
```

## Ejecución

### Servidor de desarrollo

```bash
ng serve
```

La aplicación estará disponible en [http://localhost:4200](http://localhost:4200)


## Roles y Accesos

* **Administrador**: Gestión de clases, aulas, horarios y usuarios
* **Docente**: Visualiza sus clases, horario y lista de entradas

---

Este proyecto forma parte del sistema de gestión de credenciales virtuales para instituciones educativas.
