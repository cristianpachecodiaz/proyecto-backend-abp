## Proyecto Módulo 7: Node & Express con PostgreSQL y Sequelize - ABP (Final)

**Módulo 7: ACCESO A DATOS EN APLICACIONES NODE**
**Autor:** Cristian Pacheco Díaz

Este repositorio contiene la segunda fase del desarrollo de una aplicación web orientada al backend. El objetivo de esta etapa es conectar el servidor Express establecido en el módulo anterior a una base de datos relacional (PostgreSQL), implementar un CRUD completo utilizando el ORM Sequelize, y gestionar la persistencia avanzada mediante relaciones entre tablas y operaciones transaccionales.

---

## 1. Persistencia de Datos, ORM, Transacciones y Relaciones

### ¿Por qué PostgreSQL y Sequelize?
Evolucionamos de la persistencia básica en archivos a un sistema de gestión de bases de datos relacional robusto. Para interactuar con PostgreSQL de manera eficiente, implementamos **Sequelize**, un ORM (Object-Relational Mapper) para Node.js.

**Nuevas características y ventajas implementadas:**
* **Abstracción y Seguridad:** Permite interactuar con la base de datos utilizando objetos de JavaScript, previniendo vulnerabilidades como la inyección SQL.
* **Manejo de Relaciones (1:N):** Se implementó una relación de Uno a Muchos entre los modelos `User` y `Tarea`. La ventaja de usar el ORM aquí es que se evita la escritura de sentencias `JOIN` complejas; en su lugar, se utiliza la propiedad `include` de Sequelize para traer datos relacionados anidados de manera natural.
* **Transaccionalidad (ACID):** Se incorporó el uso de transacciones (`sequelize.transaction()`). Esto garantiza que operaciones compuestas (como crear un usuario y su tarea inicial al mismo tiempo) se ejecuten "todo o nada". Si una parte falla, se ejecuta un `rollback` para revertir los cambios y mantener la consistencia de la base de datos.

## 2. Requisitos del Sistema
* Node.js (v18 o superior recomendada).
* npm (Node Package Manager).
* **PostgreSQL** (instalado localmente junto con una herramienta de gestión como pgAdmin).

## 3. Instrucciones de Instalación
1. Clonar el repositorio localmente.
2. Ejecutar `npm install` para instalar todas las dependencias (`express`, `dotenv`, `sequelize`, `pg`, `pg-hstore`).
3. Crear una base de datos vacía en PostgreSQL llamada `proyecto_backend_db`.
4. Crear un archivo `.env` en la raíz del proyecto y definir las variables:
   ```env
   PORT=3000
   DATABASE_URL=postgres://tu_usuario:tu_clave@localhost:5432/proyecto_backend_db
   ```
5. Levantar el servidor con `npm run dev`. Sequelize sincronizará automáticamente las tablas `usuarios` y `tareas` basándose en los modelos.

## 4. Ejemplos de Uso y Rutas (API REST)

* **Rutas Estándar de Usuarios:**
  * `POST /api/usuarios` - Crea un usuario.
  * `GET /api/usuarios` - Obtiene usuarios (sin contraseña por seguridad).
  * `PUT /api/usuarios/:id` - Actualiza campos permitidos (nombre y email).
  * `DELETE /api/usuarios/:id` - Elimina un usuario.
* **Rutas Avanzadas (Relaciones y Transacciones):**
  * `POST /api/usuarios/transaccion` - Requiere `nombre`, `email`, `password` y `tituloTarea`. Crea ambas entidades bajo un commit/rollback seguro.
  * `GET /api/usuarios/tareas` - Devuelve el listado de usuarios con el arreglo de sus tareas correspondientes anidadas.

## 5. Arquitectura y Justificaciones Técnicas

* **Modelos Separados (`/models/User.js` y `/models/Tarea.js`):** Cada entidad cuenta con su propia configuración y reglas, conectadas en el punto de entrada principal (`app.js`) a través de `hasMany` y `belongsTo`.
* **Actualización Restringida (PUT):** Se decidió actualizar únicamente los campos `nombre` y `email` en la modificación estándar para evitar brechas de seguridad con la manipulación directa de contraseñas.
* **Validación Previa por PK:** Operaciones críticas como eliminar o actualizar verifican siempre mediante `findByPk(id)` que el registro exista antes de solicitar una alteración a la base de datos, interceptando errores tempranamente con estados HTTP 404 controlados.

<br>
<br>

---

# 🗄️ Historial del Proyecto (Entregas Anteriores)

## Proyecto Módulo 6: Node & Express Web App - ABP

**Módulo 6: DESARROLLO DE APLICACIONES WEB NODE EXPRESS**
**Autor:** Cristian Pacheco Díaz

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

## 5. Arquitectura y Decisiones Técnicas (Fase 1)
Para cumplir con los estándares de un desarrollo modular y prepararnos para la integración con bases de datos y APIs seguras, se tomaron las siguientes decisiones de arquitectura:

* **Archivo Principal (app.js):** Se eligió el nombre app.js (en lugar de index.js) porque semánticamente representa el punto de entrada que inicializa y configura la "aplicación" de Express, sus middlewares y la conexión global de rutas.
* **Estructura de Carpetas:** Se implementó el patrón de diseño MVC (Modelo-Vista-Controlador) parcial:
  * `/routes`: Define hacia dónde va el tráfico.
  * `/controllers`: Contiene la lógica de negocio (qué hace cada ruta), manteniendo el código limpio.
  * `/middlewares`: Aloja funciones intermedias, como nuestro logger.
  * `/logs`: Directorio exclusivo para evitar que los archivos de texto planos ensucien la raíz.
* **Servicio de Contenido Web (/public):** Se utilizó `express.static` para servir contenido estático (HTML puro) desde la carpeta `/public`. Se prefirió este enfoque sobre un motor de plantillas (como EJS) ya que en las siguientes fases el backend actuará estrictamente como una API RESTful entregando JSON para que sea consumido por un frontend independiente.
* **Persistencia en Archivos Planos (fs):** Se implementó un middleware que registra cada visita a las rutas en el archivo `logs/log.txt`. Se eligió rastrear el evento de "Ruta accedida" (incluyendo fecha, hora, método y URL) porque proporciona una métrica real del tráfico de la API y es un estándar en auditoría de servidores backend, resultando más útil que registrar simplemente el inicio del servidor. Todo esto mediante `fs.appendFile` nativo para no bloquear el hilo de ejecución principal.
* **Estándar ES Modules:** El proyecto completo fue configurado utilizando `"type": "module"` para utilizar la sintaxis moderna de import/export.
