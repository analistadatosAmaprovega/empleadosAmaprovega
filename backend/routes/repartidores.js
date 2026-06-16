const express = require('express');
const routerRepartidores = express.Router();

const repartidorController = require('../controllers/repartidores.js');
routerRepartidores.post('/creartabla', repartidorController.crearTablaRepartidores);
routerRepartidores.post('/nuevo', repartidorController.crearRepartidor);
routerRepartidores.get('/', repartidorController.obtenerRepartidores);
routerRepartidores.get('/:id', repartidorController.obtenerRepartidor);
routerRepartidores.post('/', repartidorController.crearRepartidor);
routerRepartidores.put('/:id', repartidorController.actualizarRepartidor);
routerRepartidores.delete('/:id', repartidorController.eliminarRepartidor);
routerRepartidores.patch('/:id', repartidorController.cambiarEstatusRepartidor);


module.exports = { routerRepartidores };