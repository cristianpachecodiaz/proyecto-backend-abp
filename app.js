import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Conexión a Base de Datos y Modelos
import sequelize from './config/database.js';
import User from './models/User.js';
import Tarea from './models/Tarea.js';

// Definicion de relaciones
User.hasMany(Tarea, { foreignKey: 'usuarioId', as: 'tareas'});
Tarea.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario'});


// Rutas y Middlewares
import apiRoutes from './routes/index.js';
import requestLogger from './middlewares/logger.js'; 

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(requestLogger); 

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);

// Inicialización
const iniciarServidor = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos PostgreSQL establecida con éxito.');
        
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados correctamente.');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor iniciado y escuchando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor o conectar a la BD:', error);
    }
};

iniciarServidor();