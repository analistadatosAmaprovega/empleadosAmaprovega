
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const { mariadb, postgres } = require("./database/db");
const { routerEmpleados } = require('./routes/empleados.js');
const { crearTablaEmpleados } = require('./controllers/empleados.js');
const { routerLlegadaEmpleados } = require('./routes/llegadaInicial.js');
const cookieParser = require('cookie-parser');
const { routerLogin } = require('./routes/login.js');

const app = express();

const origenesPermitidos = [
  process.env.ORIGIN1,
  process.env.ORIGIN2, 
  process.env.ORIGIN3,  
];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || origenesPermitidos.includes(origin)) {
//       callback(null, origin);
//     } else {
//       callback(new Error("No permitido por CORS"));
//     }
//   },
//   credentials: true
// }));


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

console.log(process.env.FRONTEND_URL);


app.use(express.json());
app.use(cookieParser());



app.use("/empleados", routerEmpleados)
app.use("/registroLlegada", routerLlegadaEmpleados)
app.use("/login", routerLogin)

app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

app.get('/a', (req, res) => {
    res.send('Bienvenido a la ruta /a');
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto -> ${process.env.PORT}`);
});




mariadb.getConnection()
    .then(async conn => {
        const [result] = await conn.query('SELECT DATABASE() AS baseDatos');
        console.log('Conectado a MariaDB', 'DDBB:', result[0].baseDatos);
        // console.log('DDBB:', result[0].baseDatos);
        conn.release();
    })
    .catch(err => {
        console.log('Error de conexión');
        console.log(err);
    });

postgres.connect()
    .then(async client => {

        const result = await client.query(
            "SELECT current_database() AS baseDatos"
        );

        console.log("Conectado a PostgreSQL", "DDBB:", result.rows[0].basedatos);
        // console.log("Conectado a PostgreSQL", "DDBB:", result);
        // console.log("DDBB:", result.rows[0].basedatos);

        client.release();

    })
    .catch(err => {
        console.log(err);
    });

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        mensaje: "Error interno"
    });
});