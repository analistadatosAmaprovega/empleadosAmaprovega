const express = require('express');
const empleadosController = require('../controllers/empleados.js');
const { iniciarSesion, cerrarSesion, verificarSesion } = require('../controllers/Login.js');

const routerLogin = express.Router()

routerLogin.post('/inicioSession', iniciarSesion);
routerLogin.post('/cerrarSession', cerrarSesion);
routerLogin.get('/verificarSession', verificarSesion);



module.exports = { routerLogin};
