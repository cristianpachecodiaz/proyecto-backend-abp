import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreando __dirname y __filename en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, '../logs/log.txt');

const requestLogger = (req, res, next) => {
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toTimeString().split(' ')[0];
    
    const logEntry = `[${formattedDate} ${formattedTime}] Ruta accedida: ${req.method} ${req.originalUrl}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de log:', err);
        }
    });

    next();
};

export default requestLogger;

