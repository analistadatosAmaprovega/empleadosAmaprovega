const pool = require("../database/db.js");
const bcrypt = require('bcrypt');


const crearTablaLlegadaInicial = async (req, res) => {
    try {
        const [tabla] = await pool.query(`
            SELECT COUNT(*) AS existe
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
            AND table_name = 'llegada_inicial'
        `);

        if (tabla[0].existe > 0) {
            return res.json({
                mensaje: 'Se encontró una tabla con el nombre -> llegada_inicial'
            });
        }

        await pool.query(`
            CREATE TABLE llegada_inicial (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_empleado INT NOT NULL,
                nombre VARCHAR(100) NOT NULL,
                fecha DATE NOT NULL,
                hora TIME NOT NULL,
                location VARCHAR(255) NOT NULL,
                CONSTRAINT fk_llegada_empleado
                    FOREIGN KEY (id_empleado) REFERENCES empleados(id)
            )
        `);

        return res.status(201).json({
            mensaje: 'Tabla llegada_inicial creada correctamente'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: 'Error al crear la tabla llegada_inicial'
        });
    }
};

const registrarLlegada = async (req, res) => {
    try {
        const { id_empleado, nombre, location } = req.body;

        const ahora = new Date();
        const fecha = ahora.toISOString().split('T')[0]; 
        const hora = ahora.toTimeString().split(' ')[0];  

        const [resultado] = await pool.query(
            `INSERT INTO llegada_inicial (id_empleado, nombre, fecha, hora, location)
             VALUES (?, ?, ?, ?, ?)`,
            [id_empleado, nombre, fecha, hora, location]
        );

        return res.status(201).json({
            mensaje: 'Llegada registrada correctamente',
            id: resultado.insertId,
            fecha,
            hora
        });

    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ mensaje: 'El empleado no existe' });
        }
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al registrar la llegada' });
    }
};


module.exports = { crearTablaLlegadaInicial, registrarLlegada };


