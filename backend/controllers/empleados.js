const pool = require("../database/db.js");
const bcrypt = require('bcrypt');

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


// const crearTablaEmpleados = async (req, res) => {
//     try {
//         await pool.query(`
//             CREATE TABLE IF NOT EXISTS empleados (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 nombre VARCHAR(100) NOT NULL,
//                 apellido VARCHAR(100) NOT NULL,
//                 apodo VARCHAR(20),
//                 flota VARCHAR(20),
//                 cargo VARCHAR(100),
//                 departamento VARCHAR(100),
//                 estatus ENUM('activo','inactivo','suspendido') DEFAULT 'activo',
//                 usuario VARCHAR(50),
//                 password_hash VARCHAR(255),
//                 fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             )
//         `);

//         res.json({
//             mensaje: 'Tabla empleados creada exitosamente'
//         });

//     } catch (error) {
//         console.log(error);

//         res.status(500).json({
//             mensaje: 'Error al crear tabla empleados'
//         });
//     }
// };


const crearTablaEmpleados = async (req, res) => {
    try {
        // 1. Verificar si la tabla existe
        const [tabla] = await pool.query(`
            SELECT COUNT(*) AS existe
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
            AND table_name = 'empleados'
        `);

        if (tabla[0].existe > 0) {
            return res.json({
                mensaje: 'Se encontro una tabla con el nombre -> Empleados'
            });
        }

        // 2. Crear la tabla si no existe
        await pool.query(`
    CREATE TABLE empleados (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        apodo VARCHAR(20),
        flota VARCHAR(20),
        cargo VARCHAR(100),
        departamento VARCHAR(100),
        estatus ENUM('activo','inactivo','suspendido') DEFAULT 'activo',
        usuario VARCHAR(50) NOT NULL UNIQUE,
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
        apodo,
        flota,
        cargo,
        departamento,
        estatus,
        usuario,
        password
    } = req.body;

    if (!nombre || !apellido || !password) {
        return res.status(400).json({
            mensaje: 'Nombre, apellido y contraseña son requeridos'
        });
    }

    const estatusValidos = ['activo', 'inactivo', 'suspendido'];
    const estatusFinal = estatusValidos.includes(estatus) ? estatus : 'activo';

    try {
        // 3. Cifrar la contraseña usando un factor de costo (saltRounds) de 10
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // 4. Insertar en la base de datos pasándole la contraseña ya encriptada
        const [resultado] = await pool.query(
            `INSERT INTO empleados
            (
                nombre,
                apellido,
                apodo,
                flota,
                cargo,
                departamento,
                estatus,
                usuario,
                password_hash
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                apellido,
                apodo,
                flota,
                cargo,
                departamento,
                estatusFinal,
                usuario,
                password_hash
            ]
        );

        return res.json({
            mensaje: 'Empleado creado exitosamente',
            id: resultado.insertId
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
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
        apodo,
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
        nombre = COALESCE(?, nombre),
        apellido = COALESCE(?, apellido),
        apodo = COALESCE(?, apodo),
        flota = COALESCE(?, flota),
        cargo = COALESCE(?, cargo),
        departamento = COALESCE(?, departamento),
        estatus = COALESCE(?, estatus),
        usuario = COALESCE(?, usuario),
        password_hash = COALESCE(?, password_hash)
     WHERE id = ?`,
    [nombre, apellido, apodo, flota, cargo, departamento, estatus, usuario, password_hash, id]
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
    crearTablaEmpleados
};


