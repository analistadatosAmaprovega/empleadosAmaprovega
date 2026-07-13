import { useState } from "react";
import { Eye, EyeOff, Building2 } from "lucide-react";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario,
          password,
        }),

      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensaje("Inicio de sesión exitoso");
        console.log(datos);

  

        




      } else {
        setMensaje(datos.mensaje);
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-600 px-2">
      <div className="login-container w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        
        <div className="flex justify-center mb-0">
          <div className="w-32 h-16 rounded-full  flex items-center justify-center">
             <img src="/icono.png" />
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Iniciar Sesión
        </h2>

        <form onSubmit={iniciarSesion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {mostrarPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ingresar
          </button>
        </form>

        {mensaje && (
          <p className="mt-4 text-sm text-center text-red-600">{mensaje}</p>
        )}
      </div>
    </div>
  );
}

export default Login;