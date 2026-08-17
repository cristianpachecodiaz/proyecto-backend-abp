import express from 'express';
const router = express.Router();

// Ruta pública que devuelve JSON
router.get('/status', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'La API está funcionando correctamente.',
        timestamp: new Date()
    });
});

export default router;