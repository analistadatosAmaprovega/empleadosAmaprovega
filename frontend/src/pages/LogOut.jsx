import { useState } from "react";
import { Building2, LogOut } from "lucide-react";

function CerrarSesion({empleado}) {
  const [mensaje, setMensaje] = useState("");

  const cerrarSesion = async () => {
    try {
      const respuesta = await fetch(
        "http://localhost:3000/login/cerrarSession",
        {
          method: "POST",
          credentials: "include",
        }
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensaje("Sesión cerrada correctamente.");

        // Recarga la aplicación para volver al Login
        window.location.reload();
      } else {
        setMensaje(datos.mensaje || "No fue posible cerrar la sesión.");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-600 px-2">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-8">

        <div className="flex justify-center mb-4">
          <div className="w-32 h-16 flex items-center justify-center">
            <img src="/icono.png" alt="Logo" />
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
        </div>
{/* 
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Cerrar Sesión
        </h2>

        <p className="mt-4 text-center text-gray-600">
          ¿Deseas finalizar la sesión actual?
        </p> */}
<div className="text-center">
  <h2 className="text-2xl md:text-4xl font-bold text-slate-800">
    {empleado.nombre} {empleado.apellido}
  </h2>

  {empleado.apodo && (
    <p className="mt-1 text-base md:text-lg italic text-slate-500">
      ({empleado.apodo})
    </p>
  )}
</div>
        <button
          onClick={cerrarSesion}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>

        {mensaje && (
          <p className="mt-5 text-center text-sm text-red-600">
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}

export default CerrarSesion;