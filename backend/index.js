const express = require('express');
const cors = require('cors');
const pool = require('./database/db.js');
const { routerEmpleados } = require('./routes/empleados.js');
const { crearTablaEmpleados } = require('./controllers/empleados.js');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/empleados", routerEmpleados)

app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

app.get('/a', (req, res) => {
    res.send('Bienvenido a la ruta /a');
});
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});




// pool.getConnection()
//     .then(conn => {
//         conn.query('SELECT DATABASE() AS baseDatos', (err, result) => {
//             if (!err) {
//                 //    console.log('Conectado a MariaDB');            
//                 console.log('Base de datos:', result[0].baseDatos);
//             }
//             conn.release();
//         });
//     })
//     .catch(err => {
//         console.log('Error de conexión');
//         console.log(err);
//     });


    pool.getConnection()
    .then(async conn => {
        const [result] = await conn.query('SELECT DATABASE() AS baseDatos');
        console.log('Conectado a MariaDB');
        console.log('DDBB:', result[0].baseDatos);
        conn.release();
    })
    .catch(err => {
        console.log('Error de conexión');
        console.log(err);
    });