
export const crearTablaRepartidores = (req,res) => {
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


export const mostrarTablas = (req, res) => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS repartidores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apodo VARCHAR(100),
        estatus ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo'
      )
    `);

        res.json({ mensaje: 'Tabla repartidores creada exitosamente' });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al crear la tabla repartidores'
        });
    }
};


app.post('/crear-repartidor', async (req, res) => {
    const { nombre, estatus, apodo } = req.body;

    // Validar que el nombre no esté vacío
    if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre es requerido' });
    }

    // Validar que el estatus sea válido (si se proporciona)
    const estatusValidos = ['activo', 'inactivo'];
    const estatusFinal = estatus && estatusValidos.includes(estatus) ? estatus : 'activo';


   try {
    const [resultado] = await pool.query(
        `INSERT INTO repartidores (nombre, estatus, apodo) VALUES (?, ?, ?)`,
        [nombre, estatusFinal, apodo]
    );

        res.json({
            mensaje: 'Repartidor creado exitosamente',
            id: resultado.insertId,
            nombre,
            apodo, 
            estatus: estatusFinal
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Error al crear el repartidor'
        });
    }
});

