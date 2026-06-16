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



const crearTablaRepartidores = async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS repartidores (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                apellido VARCHAR(100) NOT NULL,
                apodo VARCHAR(100),
                estatus ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo'
            )
        `);

        res.json({
            mensaje: 'Tabla repartidores creada exitosamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al crear la tabla repartidores'
        });
    }
};

const crearRepartidor = async (req, res) => {
    const { nombre, estatus, apodo, apellido} = req.body;

    // Validar que el nombre no esté vacío
    if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre es requerido' });
    }

    // Validar que el estatus sea válido (si se proporciona)
    const estatusValidos = ['activo', 'inactivo'];
    const estatusFinal = estatus && estatusValidos.includes(estatus) ? estatus : 'activo';


    try {
        const [resultado] = await pool.query(
            `INSERT INTO repartidores (nombre, estatus, apellido, apodo) VALUES (?, ?, ?, ?)`,
            [nombre, estatusFinal, apellido, apodo]
        );

        res.json({
            mensaje: 'Repartidor creado exitosamente',
            id: resultado.insertId,
            nombre,
            apellido,
            apodo,
            estatus: estatusFinal
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al crear el repartidor'
        });
    }
};


const obtenerRepartidores = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM repartidores ORDER BY nombre`
        );

        res.json(rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al obtener repartidores'
        });
    }
};


const obtenerRepartidor = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(
            `SELECT * FROM repartidores WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Repartidor no encontrado'
            });
        }

        res.json(rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al obtener repartidor'
        });
    }
};


const actualizarRepartidor = async (req, res) => {
    const { id } = req.params;
    const { nombre, estatus, apodo, apellido } = req.body;

    try {
        const [resultado] = await pool.query(
            `UPDATE repartidores
             SET nombre = ?, estatus = ?, apodo = ?, apellido = ?
             WHERE id = ?`,
            [nombre, estatus, apodo, apellido, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Repartidor no encontrado'
            });
        }

        res.json({
            mensaje: 'Repartidor actualizado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al actualizar repartidor'
        });
    }
};


const eliminarRepartidor = async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await pool.query(
            `DELETE FROM repartidores WHERE id = ?`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Repartidor no encontrado'
            });
        }

        res.json({
            mensaje: 'Repartidor eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al eliminar repartidor'
        });
    }
};


const cambiarEstatusRepartidor = async (req, res) => {
    const { id } = req.params;

    try {

        const [rows] = await pool.query(
            `SELECT estatus
             FROM repartidores
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Repartidor no encontrado'
            });
        }

        const nuevoEstatus =
            rows[0].estatus === 'activo'
                ? 'inactivo'
                : 'activo';

        await pool.query(
            `UPDATE repartidores
             SET estatus = ?
             WHERE id = ?`,
            [nuevoEstatus, id]
        );

        res.json({
            mensaje: 'Estatus actualizado correctamente',
            id,
            estatus: nuevoEstatus
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al cambiar el estatus'
        });
    }
};


module.exports = {
    cambiarEstatusRepartidor,
    crearRepartidor,
    obtenerRepartidores,
    obtenerRepartidor,
    actualizarRepartidor,
    eliminarRepartidor,
    motrarTodasTablas,
    crearTablaRepartidores,
    crearRepartidor
};


