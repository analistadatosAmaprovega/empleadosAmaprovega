const bcrypt = require('bcrypt');
const { mariadb, postgres } = require("../database/db.js");

const iniciarSesion = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' });
        }

        const [usuarios] = await mariadb.query(
            'SELECT * FROM empleados WHERE usuario = ?',
            [usuario]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas (Usuario no existe)' });
        }

        const empleado = usuarios[0];

        if (empleado.estatus !== 'activo') {
            return res.status(403).json({ mensaje: 'El usuario no está activo en el sistema' });
        }

        const passwordCorrecto = await bcrypt.compare(password, empleado.password_hash);

        if (!passwordCorrecto) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas (Contraseña inválida)' });
        }

        const datosSesion = {
            id: empleado.id,
            nombre: empleado.nombre,
            usuario: empleado.usuario,
            cargo: empleado.cargo
        };

        res.cookie('sesion_empleado', JSON.stringify(datosSesion), {
            httpOnly: true,
            secure: false, 
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'lax'
        });

        return res.json({
            mensaje: 'Inicio de sesión exitoso',
            empleado: datosSesion
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al iniciar sesión' });
    }
};

const iniciarSesionPG = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || !password) {
            return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' });
        }

        // 1. Cambiamos "?" por "$1" y usamos la conexión "postgres"
        const resultado = await postgres.query(
            'SELECT * FROM empleados WHERE usuario = $1',
            [usuario]
        );

        // 2. En PostgreSQL las filas se encuentran en resultado.rows
        if (resultado.rows.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas (Usuario no existe)' });
        }

        // Tomamos el primer empleado de la lista
        const empleado = resultado.rows[0];

        if (empleado.estatus !== 'activo') {
            return res.status(403).json({ mensaje: 'El usuario no está activo en el sistema' });
        }

        const passwordCorrecto = await bcrypt.compare(password, empleado.password_hash);

        if (!passwordCorrecto) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas (Contraseña inválida)' });
        }

        const datosSesion = {
            id: empleado.id,
            nombre: empleado.nombre,
            usuario: empleado.usuario,
            cargo: empleado.cargo
        };

        res.cookie('sesion_empleado', JSON.stringify(datosSesion), {
    httpOnly: true,
            secure: false, 
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'lax'
        });

        return res.json({
            mensaje: 'Inicio de sesión exitoso',
            empleado: datosSesion
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error interno del servidor al iniciar sesión' });
    }
};




const verificarSesion = (req, res, next) => {
    const cookieSesion = req.cookies.sesion_empleado;

    if (!cookieSesion) {
        return res.status(401).json({ mensaje: 'No autorizado. Por favor, inicia sesión.' });
    }

    try {
        req.empleadoLogueado = JSON.parse(cookieSesion);
        next();
    } catch (error) {
        return res.status(400).json({ mensaje: 'Cookie de sesión inválida o corrupta' });
    }
};


const verificarUsuario = (req, res) => {

    const cookieSesion = req.cookies.sesion_empleado;

    // No existe sesión
    if (!cookieSesion) {
        return res.status(400).json({
            autenticado: false,
            mensaje: "No existe una sesión activa."
        });
    }

    try {

        const empleado = JSON.parse(cookieSesion);

        return res.status(200).json({
            autenticado: true,
            empleado: {
                id: empleado.id,
                nombre: empleado.nombre,
                usuario: empleado.usuario,
                cargo: empleado.cargo
            }
        });

    } catch (error) {

        return res.status(400).json({
            autenticado: false,
            mensaje: "La cookie de sesión es inválida."
        });

    }

};


const cerrarSesion = async (req, res) => {

    // const cookieSesion = req.cookies.sesion_empleado;

    const data = req.cookies.sesion_empleado
    if (!data) return res.status(200).json({
        mensaje: 'No existe session disponible para cerrar',
        datosEliminados: "No hay datos para mostrar"
    });

    const datosEmpleado = JSON.parse(req.cookies.sesion_empleado);


    try {
        res.clearCookie('sesion_empleado', {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });


        return res.status(200).json({
            mensaje: 'Sesión cerrada correctamente. Cookie eliminada del navegador.',
            datosEliminados: datosEmpleado
        }); 

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return res.status(500).json({
            mensaje: 'Error interno del servidor al intentar cerrar la sesión'
        });
    }
};




module.exports = {
    iniciarSesion,
    iniciarSesionPG,
    verificarSesion,
    cerrarSesion, 
    verificarUsuario
};


