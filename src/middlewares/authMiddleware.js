import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Se espera el token en el formato: "Bearer <token>"
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'mi_secreto_super_seguro');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Token inválido o expirado.' });
    }
};