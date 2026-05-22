const express = require('express');
const cors = require('cors');
const pool = require('./database/db.js');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});


pool.getConnection()
    .then(conn => {
        console.log('Conectado a MariaDB');
        conn.release();
    })
    .catch(err => {
        console.log('Error de conexión');
        console.log(err);
    });