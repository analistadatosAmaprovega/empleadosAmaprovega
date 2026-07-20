const express = require('express');
const empleadosController = require('../controllers/empleados.js');
const { iniciarSesion, cerrarSesion, verificarSesion, iniciarSesionPG, verificarUsuario } = require('../controllers/Login.js');

const routerLogin = express.Router()

routerLogin.post('/inicioSession', iniciarSesion);
routerLogin.post('/inicioSessionPG', iniciarSesionPG);


routerLogin.post('/cerrarSession', cerrarSesion);
routerLogin.get('/verificarUsuario', verificarUsuario);



module.exports = { routerLogin};
