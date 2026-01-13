# BingoAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
# bingo-angular

# Bingo Digital Institucional

Aplicación web desarrollada en **Angular** para la gestión y visualización de un tablero de bingo.
Está pensada para **instituciones educativas**, eventos y actividades recreativas donde se necesita un tablero claro, visible y confiable.

La aplicación permite trabajar tanto con **ingreso manual de números** (bolillero físico) como con un **bolillero digital automático**, cubriendo ambos escenarios habituales.

---

## Demo

Aplicación online disponible en:

https://bingo-institucional.netlify.app/

---

## Descripción general

Bingo Digital Institucional es una aplicación de una sola página (SPA) que muestra un tablero del **00 al 99**, permitiendo marcar números, visualizar el último número salido y mantener un historial persistente durante el evento.

Toda la configuración se realiza desde un **menú hamburguesa**, manteniendo la pantalla principal limpia y optimizada para proyección en pantallas grandes.

---

## Funcionalidades principales

- Tablero de bingo del **00 al 99**
- Marcado visual automático de números ya salidos
- Visualización del **último número** y del **historial completo**
- Interfaz optimizada para pantallas grandes
- Modo pantalla completa
- Persistencia de estado mediante `localStorage`
- Configuración accesible desde menú lateral

---

## Modos de juego

### Modo Analógico
- Los números se ingresan manualmente
- Pensado para bolillero físico tradicional
- El operador controla qué número se marca
- Ideal para eventos donde el sorteo se realiza fuera de la aplicación

### Modo Bolillero Digital
- Generación automática de números **sin repetir**
- Animación visual tipo bolillero
- Marcado automático en el tablero
- Desactiva el ingreso manual para evitar errores
- Puede activarse mediante botón o atajo de teclado

---

## Tecnologías utilizadas

- Angular
- TypeScript
- HTML
- CSS
- Netlify (deploy)

---

## Instalación y uso local

Clonar el repositorio:

```bash
git clone https://github.com/lucasjcordoba/bingo-angular
```

Ingresar al directorio del proyecto:

```bash
cd bingo-angular
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en modo desarrollo:

```bash
ng serve
```

Abrir la aplicación en el navegador:

```
http://localhost:4200
```

---

## Build de producción

Para generar la versión de producción:

```bash
npm run build
```

Los archivos generados se ubican en la carpeta `dist/`.

---

## Deploy

El proyecto está preparado para deploy como **Single Page Application (SPA)**.

Configuración utilizada en Netlify:

- **Build command:** `npm run build`
- **Publish directory:** `dist/`

---

## Autor

Lucas Jesús Córdoba

---

## Licencia

Este proyecto se distribuye bajo licencia MIT.