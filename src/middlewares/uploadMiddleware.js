import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
};

export const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB
    fileFilter
});