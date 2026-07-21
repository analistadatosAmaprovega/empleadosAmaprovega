import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import BienvenidaQR from "./pages/Bienvenida";
import ReciboConfirmacion from "./pages/ComprobanteAprobacionDieta";
import ReciboError from "./pages/ErrorVerificacion";
import ListadoSeguridad from "./pages/ListadoEmpeladosSeguridad";
import ListadoClientes from "./pages/ListadoEmpleados";
import CerrarSesion from "./pages/LogOut";

function App() {

  const [loading, setLoading] = useState(true);
  const [empleado, setEmpleado] = useState(null);

  useEffect(() => {

    const verificarSesion = async () => {

      try {

        const respuesta = await fetch(
          "http://localhost:3000/login/verificarUsuario",
          {
            method: "GET",
            credentials: "include"
          }
        );

        console.log(respuesta, "desde el BSKCEND"
        );

        if (!respuesta.ok) {
          setEmpleado(null);
          return;
        }
        const datos = await respuesta.json();
        if (datos.autenticado) {
          setEmpleado(datos.empleado);
        } else {
          setEmpleado(null);
        }

      } catch (error) {
        console.log(error);
        setEmpleado(null);

      } finally {
        setLoading(false);
      }

    };

    verificarSesion();

    // console.log(empleado, "DENTRO DEL EFECCT");


  }, []);

  if (loading) {
    return <h2>Cargando...</h2>;
  }
  console.log(empleado, "FUERA DEL EFECCT");

  return (

    <Routes>

      <Route
        path="/"
        element={
          empleado
            ? <BienvenidaQR empleado={empleado} />
            : <Login />
        }
      />

  <Route
        path="/cerrar"
        element={
          empleado
          
            ?<CerrarSesion empleado={empleado} />
            : <Login />
        }
      />
      
  
      <Route
        path="/registro"
        element={<ReciboConfirmacion />}
      />


      <Route
        path="/error"
        element={<ReciboError />}
      />

      <Route
        path="/seguridad"
        element={<ListadoSeguridad />}
      />

      <Route
        path="/empleados"
        element={<ListadoClientes />}
      />

    </Routes>

  );

}

export default App;