
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const { mariadb, postgres } = require("./database/db");
const { routerEmpleados } = require('./routes/empleados.js');
const { routerLlegadaEmpleados } = require('./routes/llegadaInicial.js');
const cookieParser = require('cookie-parser');
const { routerLogin } = require('./routes/login.js');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();


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

const origenesPermitidos = [
    process.env.ORIGIN1,
    process.env.ORIGIN2,
    process.env.ORIGIN3,
];



// app.use(helmet());
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: { mensaje: "Demasiadas solicitudes, intenta más tarde" }
// }));

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

app.use((req, res, next) => {

    console.log(`ruta INGRESADA: ${req.method} ${req.originalUrl}`);
next()
    // res.status(200).json({
    //     mensaje: "Ruta 17082026", 
    //     ruta: `${req.method} ${req.originalUrl}`
    // });

});

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


app.use((err, req, res, next) => {
    console.error(err); F

    res.status(500).json({
        mensaje: "Error interno"
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto -> ${process.env.PORT}`);
});
