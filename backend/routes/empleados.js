const express = require('express');
const empleadosController = require('../controllers/empleados.js');

const routerEmpleados = express.Router()


routerEmpleados.post('/creartablaPG', empleadosController.crearTablaEmpleadosPG);








routerEmpleados.post('/creartabla', empleadosController.crearTablaEmpleados);
routerEmpleados.post('/nuevo', empleadosController.crearEmpleado);
routerEmpleados.get('/', empleadosController.obtenerUnEmpleado);
routerEmpleados.get('/:id', empleadosController.obtenerUnEmpleado);
routerEmpleados.post('/', empleadosController.crearEmpleado);
routerEmpleados.put('/:id', empleadosController.actualizarEmpleado);
routerEmpleados.delete('/:id', empleadosController.eliminarEmpleado);
routerEmpleados.patch('/:id', empleadosController.cambiarEstatusEmpleado);


module.exports = { routerEmpleados: routerEmpleados };