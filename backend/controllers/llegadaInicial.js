// const mariadb = require("../database/db.js");
const { mariadb, postgres } = require("../database/db.js");
// const bcrypt = require('bcrypt');


const crearTablaLlegadaInicial = async (req, res) => {
    try {
        const [tabla] = await mariadb.query(`
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


        await mariadb.query(`
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


const crearTablaLlegadaInicialPG = async (req, res) => {
    try {
        const resultado = await postgres.query(`
            SELECT COUNT(*)::INT AS existe
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_catalog = current_database()
            AND table_name = 'llegada_inicial'
        `);

        if (resultado.rows[0].existe > 0) {
            return res.json({
                mensaje: 'Se encontró una tabla con el nombre -> llegada_inicial'
            });
        }

        await postgres.query(`
            CREATE TABLE llegada_inicial (
                id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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

    const datosEmpleadoLOG = req.cookies.sesion_empleado
    const datosEmpleado = JSON.parse(req.cookies.sesion_empleado);

    console.log(datosEmpleado, 'PARSEADO');
    console.log(datosEmpleadoLOG, 'DIRECTO DE LA COOKIE');


    try {

        const ahora = new Date();
        const fecha = ahora.toISOString().split('T')[0];
        const hora = ahora.toTimeString().split(' ')[0];

        const [resultado] = await mariadb.query(
            `INSERT INTO llegada_inicial (id_empleado, nombre, fecha, hora, location)
             VALUES (?, ?, ?, ?, ?)`,
            [datosEmpleado.id, datosEmpleado.nombre, fecha, hora, "La Vega, R.D."]
        );

        return res.status(201).json({
            mensaje: 'Llegada registrada correctamente',
            usuario_ID: datosEmpleado.id,
            Nombre: datosEmpleado.nombre,
            fecha,
            hora,
            Lugar: "La Vega, R.D."
        });

    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ mensaje: 'El empleado no existe' });
        }
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al registrar la llegada' });
    }
};

// const registrarLlegadaPG = async (req, res) => {

//     const datosEmpleadoLOG = req.cookies.sesion_empleado;
//     const datosEmpleado = JSON.parse(req.cookies.sesion_empleado);

//     console.log(datosEmpleado, 'PARSEADO');
//     console.log(datosEmpleadoLOG, 'DIRECTO DE LA COOKIE');

//     try {
//         const ahora = new Date();
//         const fecha = ahora.toISOString().split('T')[0];
//         const hora = ahora.toTimeString().split(' ')[0];

//         // 1. Cambiamos "?" por "$1, $2..." y usamos la conexión "postgres"
//         await postgres.query(
//             `INSERT INTO llegada_inicial (id_empleado, nombre, fecha, hora, location)
//              VALUES ($1, $2, $3, $4, $5)`,
//             [datosEmpleado.id, datosEmpleado.nombre, fecha, hora, "La Vega, R.D."]
//         );

//         return res.status(201).json({
//             mensaje: 'Llegada registrada correctamente',
//             usuario_ID: datosEmpleado.id,
//             Nombre: datosEmpleado.nombre,
//             fecha,
//             hora,
//             Lugar: "La Vega, R.D."
//         });

//     } catch (error) {
//         // 2. En PostgreSQL el código de error para violación de llave foránea es '23503'
//         if (error.code === '23503') {
//             return res.status(400).json({ mensaje: 'El empleado no existe' });
//         }

//         console.error(error);
//         return res.status(500).json({ mensaje: 'Error al registrar la llegada' });
//     }
// };



const registrarLlegadaPG = async (req, res) => {

    const datosEmpleadoLOG = req.cookies.sesion_empleado;
    const datosEmpleado = JSON.parse(req.cookies.sesion_empleado);

    console.log(datosEmpleado, 'PARSEADO');
    console.log(datosEmpleadoLOG, 'DIRECTO DE LA COOKIE');

    try {

        const ahora = new Date();
        const fecha = ahora.toISOString().split('T')[0];
        const hora = ahora.toTimeString().split(' ')[0];

        // Verificar si el empleado ya registró su llegada hoy
        const { rows } = await postgres.query(
            `SELECT id
             FROM llegada_inicial
             WHERE id_empleado = $1
               AND fecha = CURRENT_DATE`,
            [datosEmpleado.id]
        );

        if (rows.length > 0) {
            return res.status(409).json({
                mensaje: "El empleado ya registró su llegada el día de hoy."
            });
        }

        // Registrar la llegada
        await postgres.query(
            `INSERT INTO llegada_inicial
                (id_empleado, nombre, fecha, hora, location)
             VALUES
                ($1, $2, $3, $4, $5)`,
            [
                datosEmpleado.id,
                datosEmpleado.nombre,
                fecha,
                hora,
                "La Vega, R.D."
            ]
        );

        return res.status(201).json({
            mensaje: "Llegada registrada correctamente",
            usuario_ID: datosEmpleado.id,
            Nombre: datosEmpleado.nombre,
            fecha,
            hora,
            Lugar: "La Vega, R.D."
        });

    } catch (error) {

        if (error.code === '23503') {
            return res.status(400).json({
                mensaje: "El empleado no existe"
            });
        }

        console.error(error);

        return res.status(500).json({
            mensaje: "Error al registrar la llegada"
        });
    }
};

const verLlegadasHoyPG = async (req, res) => {

    try {

        const { rows } = await postgres.query(
            `SELECT
                id,
                id_empleado,
                nombre,
                fecha,
                hora,
                location
             FROM llegada_inicial
             WHERE fecha = CURRENT_DATE
             ORDER BY hora DESC`
        );

        return res.status(200).json({
            mensaje: "Registros de hoy obtenidos correctamente",
            total: rows.length,
            registros: rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensaje: "Error al obtener los registros de hoy"
        });
    }
};



module.exports = { crearTablaLlegadaInicial, crearTablaLlegadaInicialPG, registrarLlegada, registrarLlegadaPG, verLlegadasHoyPG};


