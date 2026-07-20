const express = require('express');
const llegadaInicial = require('../controllers/llegadaInicial.js');
const { verifyToken } = require('../middlewares/auth.js');

const routerLlegadaEmpleados = express.Router()

routerLlegadaEmpleados.post('/creartabla', llegadaInicial.crearTablaLlegadaInicial);

routerLlegadaEmpleados.post('/nuevo', verifyToken, llegadaInicial.registrarLlegada);


routerLlegadaEmpleados.post('/creartablaPG', llegadaInicial.crearTablaLlegadaInicialPG
);

routerLlegadaEmpleados.post('/nuevoPG', verifyToken, llegadaInicial.registrarLlegadaPG);

routerLlegadaEmpleados.get('/verHoyPG', verifyToken, llegadaInicial.verLlegadasHoyPG);

// routerLlegadaEmpleados.get('/', empleadosController.obtenerUnEmpleado);
// routerLlegadaEmpleados.get('/:id', empleadosController.obtenerUnEmpleado);
// routerLlegadaEmpleados.post('/', empleadosController.crearEmpleado);
// routerLlegadaEmpleados.put('/:id', empleadosController.actualizarEmpleado);
// routerLlegadaEmpleados.delete('/:id', empleadosController.eliminarEmpleado);
// routerLlegadaEmpleados.patch('/:id', empleadosController.cambiarEstatusEmpleado);


module.exports = { routerLlegadaEmpleados: routerLlegadaEmpleados };
