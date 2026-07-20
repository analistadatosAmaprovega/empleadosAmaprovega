const express = require('express');
const cors = require('cors');
const { mariadb, postgres } = require("./database/db");
const { routerEmpleados } = require('./routes/empleados.js');
const { crearTablaEmpleados } = require('./controllers/empleados.js');
const { routerLlegadaEmpleados } = require('./routes/llegadaInicial.js');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { routerLogin } = require('./routes/login.js');

const app = express();
const origenesPermitidos = [
  "http://localhost:5173",
  "http://10.0.0.11:5173",   // IP de tu compu en la red local
  "http://10.0.0.11:5173/",  // otra IP si aplica
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite peticiones sin origin (Postman, curl, apps móviles nativas)
    if (!origin || origenesPermitidos.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));
// app.use(cors({
//     origin: "http://localhost:5173",

//         origin: "*",

//     credentials: true
// }));
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

// app.listen(process.env.PORT, () => {
//     console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
// });

app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor corriendo en el puerto 3000");
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