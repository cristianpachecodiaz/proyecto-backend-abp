import {DataTypes} from 'sequelize';
import sequelize from '../config/database.js';

const Tarea = sequelize.define('Tarea',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    completada:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'tareas',
    timestamps: true
});

export default Tarea;