import express from 'express';

import { crearUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario, crearUsuarioConTarea, obtenerUsuariosConTareas } from '../controllers/userController.js';

const router = express.Router();

router.get('/status', (req, res) => {
    res.json({
        status: "success",
        message: "La API está funcionando correctamente.",
        timestamp: new Date()
    });
});

router.post('/usuarios', crearUsuario);
router.get('/usuarios', obtenerUsuarios);
router.put('/usuarios/:id', actualizarUsuario);
router.delete('/usuarios/:id', eliminarUsuario);
router.post('/usuarios/transaccion', crearUsuarioConTarea);
router.get('/usuarios/tareas', obtenerUsuariosConTareas);

export default router;