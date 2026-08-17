## Proyecto Módulo 6: Node & Express Web App - ABP

**Módulo 6: DESARROLLO DE APLICACIONES WEB NODE EXPRESS
**Autor: Cristian Pacheco Díaz

Este repositorio contiene la primera fase del desarrollo de una aplicación web robusta orientada al backend. El objetivo de esta etapa es establecer las bases del servidor, gestionar rutas, servir contenido y aplicar persistencia básica mediante archivos planos.

---

## 1. Conociendo Node y Express (Marco Teórico)

### El ecosistema Node.js y su utilidad
Node.js es un entorno de ejecución multiplataforma que permite utilizar JavaScript del lado del servidor. Destaca por su modelo asíncrono y orientado a eventos, lo que lo hace ideal para desarrollar APIs RESTful escalables, aplicaciones de tiempo real y microservicios sin bloquear el hilo principal de ejecución. Además, cuenta con `npm`, el gestor de paquetes más grande del ecosistema de desarrollo.

### ¿Qué aporta Express sobre Node.js puro?
Mientras que Node.js proporciona las herramientas base (como el módulo `http`), Express es un framework minimalista que simplifica la creación de servidores. Sus principales aportes son:
* **Enrutamiento estructurado:** Facilita la creación y lectura de rutas (endpoints).
* **Middlewares:** Permite interceptar peticiones para ejecutar código intermedio (ej. validaciones o logs) de forma limpia.
* **Manejo eficiente de HTTP:** Simplifica la manipulación de cabeceras, respuestas JSON y el servicio de archivos estáticos.

### Esquema Visual del Flujo Servidor-Cliente
A continuación, se presenta el flujo básico implementado en esta aplicación:

    Cliente (Navegador)
    Servidor Express (Node.js)
    Middleware (Logger)
    Controlador/ Rutas
    
    Cliente->>+Express: 1. Petición HTTP GET (/api/status)
    Express->>+Middleware: 2. Intercepta la petición
    Middleware-->>Middleware: Registra log en log.txt
    Middleware->>+Controlador: 3. Pasa el control con next()
    Controlador-->>-Express: 4. Genera respuesta JSON (Status 200)
    Express-->>-Cliente: 5. Envía la respuesta al usuario


## 2. Requisitos del Sistema
Node.js (v18 o superior recomendada).

npm (Node Package Manager).

## 3. Instrucciones de Instalación
Clonar el repositorio localmente.

Abrir una terminal en el directorio del proyecto.

Ejecutar npm install para instalar todas las dependencias (express, dotenv).

Crear un archivo llamado .env en la raíz del proyecto y definir el puerto: PORT=3000

## 4. Ejemplos de Uso y Scripts
Los scripts de ejecución fueron configurados en el archivo package.json para facilitar el flujo de trabajo:

Para entorno de producción: npm start

Justificación: Se utiliza node app.js para levantar el servidor de forma estándar, siendo el comando convencional para despliegues.

Para entorno de desarrollo: npm run dev

Justificación: Utiliza la dependencia de desarrollo nodemon para monitorear cambios en los archivos y reiniciar el servidor automáticamente, agilizando la escritura de código.

## 5. Arquitectura y Decisiones Técnicas
Para cumplir con los estándares de un desarrollo modular y prepararnos para la integración con bases de datos y APIs seguras, se tomaron las siguientes decisiones de arquitectura:

Archivo Principal (app.js):
Se eligió el nombre app.js (en lugar de index.js) porque semánticamente representa el punto de entrada que inicializa y configura la "aplicación" de Express, sus middlewares y la conexión global de rutas.

Estructura de Carpetas:
Se implementó el patrón de diseño MVC (Modelo-Vista-Controlador) parcial:

/routes: Define hacia dónde va el tráfico.

/controllers: Contiene la lógica de negocio (qué hace cada ruta), manteniendo el código limpio.

/middlewares: Aloja funciones intermedias, como nuestro logger.

/logs: Directorio exclusivo para evitar que los archivos de texto planos ensucien la raíz.

Servicio de Contenido Web (/public):
Se utilizó express.static para servir contenido estático (HTML puro) desde la carpeta /public. Se prefirió este enfoque sobre un motor de plantillas (como EJS) ya que en las siguientes fases el backend actuará estrictamente como una API RESTful entregando JSON para que sea consumido por un frontend independiente 

Persistencia en Archivos Planos (fs):
Se implementó un middleware que registra cada visita a las rutas en el archivo logs/log.txt. Se eligió rastrear el evento de "Ruta accedida" (incluyendo fecha, hora, método y URL) porque proporciona una métrica real del tráfico de la API y es un estándar en auditoría de servidores backend, resultando más útil que registrar simplemente el inicio del servidor. Todo esto mediante fs.appendFile nativo para no bloquear el hilo de ejecución principal.

Estándar ES Modules:
El proyecto completo fue configurado utilizando "type": "module" para utilizar la sintaxis moderna de import/export en lug