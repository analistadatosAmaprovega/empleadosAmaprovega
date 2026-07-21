import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DATOS_PRUEBA = {
    fecha: "15 de julio, 2026",
    hora: "08:03 AM",
    idSolicitud: "SOL-2026-004821",
    nombreColaborador: "María Rodríguez",
    estatus: "Confirmado",
};

function IconoCheck() {
    return (
        <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
        >
        const [visible] = useState(true);    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}

function Fila({ etiqueta, valor, destacado }) {
    return (
        <div className="flex items-center justify-between py-3">
            <span className="text-sm text-slate-500">{etiqueta}</span>
            <span
                className={
                    destacado
                        ? "text-sm font-semibold text-green-600"
                        : "text-sm font-semibold text-slate-800"
                }
            >
                {valor}
            </span>
        </div>
    );
}

export default function ReciboConfirmacion() {
 const [visible] = useState(true);
    const [empleado, setEmpleado] = useState(null);
    const [cargando, setCargando] = useState(true);
const navigate = useNavigate();
    useEffect(() => {
        const obtenerEmpleado = async () => {
            try {
                const respuesta = await fetch(
                    "http://localhost:3000/registroLlegada/nuevoPG",
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );
   if (respuesta.status === 401) {
                navigate("/error", { replace: true });
                return;
            }

                const datos = await respuesta.json();

                if (respuesta.ok) {
                    setEmpleado(datos);
                } else {
                    console.error(datos.mensaje);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setCargando(false);
            }
        };

        obtenerEmpleado();
    }, []);

    if (!visible) return null;

    if (cargando) {
        return (
            <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white">Registrando llegada...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-900  flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex justify-center -mb-8 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg ring-8 ring-slate-100">
                        <IconoCheck />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md pt-12 pb-6 px-6">
                    <div className="text-center mb-4">
                        <h1 className="text-xl font-bold text-slate-900">Solicitud Enviada</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Su solicitud de dieta ha sido enviada exitosamente        </p>
                    </div>

                    <div className="border-t border-dashed border-slate-300 my-4" />

                    <div className="divide-y divide-slate-100">
                        <Fila etiqueta="Fecha" valor={empleado.fecha} />
                        <Fila etiqueta="Hora" valor={empleado.hora} />
                        <Fila etiqueta="Colaborador" valor={empleado.nombre + " " + empleado.apellido} />
                        <Fila etiqueta="Apodo" valor={empleado.apodo} />
                        {/* <Fila etiqueta="Departamento" valor={empleado.cargo} destacado /> */}
                    </div>

                    <div className="border-t border-dashed border-slate-300 my-4" />

<p className="text-center font-semibold text-green-800">      
                      Guarda esta pantalla como comprobante
                    </p>
                </div>
            </div>
        </div>
    );
}