import User from '../models/User.js';
import Tarea from '../models/Tarea.js';
import sequelize from '../config/database.js';

// Crear un nuevo usuario (POST)
export const crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const nuevoUsuario = await User.create({ nombre, email, password });
        
        res.status(201).json({
            status: "success",
            message: "Usuario creado exitosamente",
            data: nuevoUsuario
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al crear el usuario",
            error: error.message
        });
    }
};

// Obtener todos los usuarios (GET)
export const obtenerUsuarios = async (req, res) => {
    try {
        // attributes.exclude procesa los resultados para evitar enviar contraseñas
        const usuarios = await User.findAll({
            attributes: { exclude: ['password'] } 
        });

        res.status(200).json({
            status: "success",
            data: usuarios
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener los usuarios",
            error: error.message
        });
    }
};


// Modificar un usuario (PUT)
export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email } = req.body; 

        // Validación 1: Verificar que el usuario exista
        const usuario = await User.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                status: "error",
                message: `No se encontró un usuario con el ID ${id}`
            });
        }

        // Actualización: Solo permitimos modificar nombre y email
        await usuario.update({ nombre, email });

        res.status(200).json({
            status: "success",
            message: "Usuario actualizado correctamente",
            data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

// Eliminar un usuario (DELETE)
export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        // Validación previa de existencia
        const usuario = await User.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                status: "error",
                message: `El usuario con ID ${id} no existe, no se puede eliminar.`
            });
        }

        // Eliminación del registro
        await usuario.destroy();

        res.status(200).json({
            status: "success",
            message: `Usuario con ID ${id} eliminado correctamente`
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al eliminar el usuario",
            error: error.message
        });
    }
};


// Transacción: Crear un usuario y asignarle una tarea inicial al mismo tiempo
export const crearUsuarioConTarea = async (req, res) => {
    // Iniciamos la transacción
    const t = await sequelize.transaction();

    try {
        const { nombre, email, password, tituloTarea } = req.body;

        // Crear el usuario (pasando la transacción)
        const nuevoUsuario = await User.create(
            { nombre, email, password }, 
            { transaction: t }
        );
        
        // Crear la tarea asociada al ID del nuevo usuario (pasando la transacción)
        const nuevaTarea = await Tarea.create(
            { titulo: tituloTarea, usuarioId: nuevoUsuario.id }, 
            { transaction: t }
        );

        // Si ambas operaciones tienen éxito, confirmamos los cambios en la BD
        await t.commit();

        res.status(201).json({
            status: "success",
            message: "Usuario y tarea inicial creados exitosamente mediante transacción",
            data: { usuario: nuevoUsuario, tarea: nuevaTarea }
        });
    } catch (error) {
        // Si CUALQUIER operación falla, revertimos todo para mantener la consistencia
        await t.rollback();
        res.status(500).json({
            status: "error",
            message: "Transacción fallida. Se aplicó rollback.",
            error: error.message
        });
    }
};

// Relaciones: Obtener todos los usuarios incluyendo sus tareas
export const obtenerUsuariosConTareas = async (req, res) => {
    try {
        const usuarios = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: Tarea,
                as: 'tareas', // Debe coincidir con el alias definido en app.js
                attributes: ['id', 'titulo', 'completada'] // Campos de la tarea a mostrar
            }]
        });

        res.status(200).json({
            status: "success",
            data: usuarios
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error al obtener usuarios y sus tareas",
            error: error.message
        });
    }
};