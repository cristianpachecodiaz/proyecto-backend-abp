import express from 'express';

import { login, uploadFile, crearUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario, crearUsuarioConTarea, obtenerUsuariosConTareas } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/status', (req, res) => {
    res.json({
        status: "success",
        message: "La API está funcionando correctamente.",
        timestamp: new Date()
    });
});


// Rutas Públicas (Nuevas - Módulo 8)
router.post('/login', login);
router.post('/upload', upload.single('archivo'), uploadFile);

// Rutas Públicas de Gestión de Datos
router.post('/usuarios', crearUsuario);
router.get('/usuarios', obtenerUsuarios);
router.post('/usuarios/transaccion', crearUsuarioConTarea);
router.get('/usuarios/tareas', obtenerUsuariosConTareas);

// Rutas Privadas Protegidas con JWT
router.put('/usuarios/:id', verifyToken, actualizarUsuario);
router.delete('/usuarios/:id', verifyToken, eliminarUsuario);

export default router;