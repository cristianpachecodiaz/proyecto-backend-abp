import 'dotenv/config'; // Forma directa de inicializar dotenv en ES Modules
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// IMPORTANTE: En ES Modules es obligatorio colocar la extensión .js en archivos locales
import requestLogger from './middlewares/logger.js';
import routes from './routes/index.js';

// Recreando __dirname en el archivo principal
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(requestLogger);

// Servir contenido web estático
app.use(express.static(path.join(__dirname, 'public')));

// Enrutador modularizado
app.use('/api', routes);

// Inicialización del servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado y escuchando en el puerto ${PORT}`);
});
