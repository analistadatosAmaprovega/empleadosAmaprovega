const pool = require("../database/db.js");

const motrarTodasTablas = async (req, res) => {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        res.json(rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error obteniendo tablas'
        });

    }

};



// CREATE TABLE empleados (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     nombre VARCHAR(100) NOT NULL,
//     apellido VARCHAR(100) NOT NULL,
//     flota VARCHAR(20),
//     cargo VARCHAR(100),
//     departamento VARCHAR(100),
//     estatus ENUM('activo','inactivo','suspendido') DEFAULT 'activo',
//     usuario VARCHAR(50),
//     password_hash VARCHAR(255),
//     fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

const crearTablaEmpleados = async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS empleados (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                flota VARCHAR(20),
                cargo VARCHAR(100),
                departamento VARCHAR(100),
                estatus ENUM('activo','inactivo','suspendido') DEFAULT 'activo',
                usuario VARCHAR(50),
                password_hash VARCHAR(255),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        res.json({
            mensaje: 'Tabla empleados creada exitosamente'
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            mensaje: 'Error al crear tabla empleados'
        });
    }
};

const crearEmpleado = async (req, res) => {

    const {
        nombre,
        apellido,
        flota,
        cargo,
        departamento,
        estatus,
        usuario,
        password_hash
    } = req.body;

    if (!nombre || !apellido) {
        return res.status(400).json({
            mensaje: 'Nombre y apellido son requeridos'
        });
    }

    const estatusValidos = [
        'activo',
        'inactivo',
        'suspendido'
    ];

    const estatusFinal =
        estatusValidos.includes(estatus)
            ? estatus
            : 'activo';

    try {

        const [resultado] = await pool.query(
            `INSERT INTO empleados
            (
                nombre,
                apellido,
                flota,
                cargo,
                departamento,
                estatus,
                usuario,
                password_hash
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                apellido,
                flota,
                cargo,
                departamento,
                estatusFinal,
                usuario,
                password_hash
            ]
        );

        res.json({
            mensaje: 'Empleado creado exitosamente',
            id: resultado.insertId
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            mensaje: 'Error al crear empleado'
        });
    }
};


const obtenerEmpleados = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT *
            FROM empleados
            ORDER BY nombre
        `);

        res.json(rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error al obtener empleados'
        });
    }
};

const obtenerUnEmpleado = async (req, res) => {

    const { id } = req.params;

    try {

        const [rows] = await pool.query(
            `SELECT *
             FROM empleados
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Empleado no encontrado'
            });
        }

        res.json(rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error al obtener empleado'
        });
    }
};

const actualizarEmpleado = async (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        apellido,
        flota,
        cargo,
        departamento,
        estatus,
        usuario,
        password_hash
    } = req.body;

    try {

        const [resultado] = await pool.query(
            `UPDATE empleados
             SET
                nombre = ?,
                apellido = ?,
                flota = ?,
                cargo = ?,
                departamento = ?,
                estatus = ?,
                usuario = ?,
                password_hash = ?
             WHERE id = ?`,
            [
                nombre,
                apellido,
                flota,
                cargo,
                departamento,
                estatus,
                usuario,
                password_hash,
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Empleado no encontrado'
            });
        }

        res.json({
            mensaje: 'Empleado actualizado correctamente'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error al actualizar empleado'
        });
    }
};

const eliminarEmpleado = async (req, res) => {

    const { id } = req.params;

    try {

        const [resultado] = await pool.query(
            `DELETE FROM empleados
             WHERE id = ?`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Empleado no encontrado'
            });
        }

        res.json({
            mensaje: 'Empleado eliminado correctamente'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error al eliminar empleado'
        });
    }
};


const cambiarEstatusEmpleado = async (req, res) => {

    const { id } = req.params;

    try {

        const [rows] = await pool.query(
            `SELECT estatus
             FROM empleados
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Empleado no encontrado'
            });
        }

        let nuevoEstatus;

        switch (rows[0].estatus) {
            case 'activo':
                nuevoEstatus = 'inactivo';
                break;

            case 'inactivo':
                nuevoEstatus = 'suspendido';
                break;

            default:
                nuevoEstatus = 'activo';
        }

        await pool.query(
            `UPDATE empleados
             SET estatus = ?
             WHERE id = ?`,
            [nuevoEstatus, id]
        );

        res.json({
            mensaje: 'Estatus actualizado correctamente',
            estatus: nuevoEstatus
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error al cambiar estatus'
        });
    }
};


module.exports = {
    cambiarEstatusEmpleado,
    crearEmpleado,
    obtenerUnEmpleado,
    obtenerUnEmpleado,
    actualizarEmpleado,
    eliminarEmpleado,
    motrarTodasTablas,
    crearTablaEmpleados,
    crearEmpleado
};


