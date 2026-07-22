import { useEffect, useState } from "react";

export default function ListadoSeguridad() {
    const [registros, setRegistros] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerRegistros = async () => {
            try {
                const respuesta = await fetch(
                    "http://localhost:3000/registroLlegada/verHoyPG",
                    {
                        credentials: "include",
                    }
                );

                const data = await respuesta.json();

                if (respuesta.ok) {
                    setRegistros(data.registros);
                } else {
                    console.error(data.mensaje);
                }
            } catch (error) {
                console.error("Error obteniendo registros:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerRegistros();
    }, []);
    const cambiarEstado = (id) => {
        setRegistros((prev) =>
            prev.map((registro) =>
                registro.id === id
                    ? {
                        ...registro,
                        pagado: !registro.pagado,
                    }
                    : registro
            )
        );
    };
    if (cargando) {
        return (
            <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
                Cargando registros...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-slate-100">
            <div className="max-w-5xl mx-auto p-4">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Listado de Dietas
                    </h1>

                    <p className="text-lg text-slate-500 mt-1">
                        {registros.length} persona{registros.length !== 1 && "s"}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-800">
                                <th className="text-left text-white font-bold text-base px-4 py-3">
                                    ID
                                </th>

                                <th className="text-left text-white font-bold text-base px-4 py-3">
                                    Nombre
                                </th>

                                <th className="text-left text-white font-bold text-base px-4 py-3">
                                    Ubicación
                                </th>

                                <th className="text-left text-white font-bold text-base px-4 py-3">
                                    Hora
                                </th>
                                <th className="text-left text-center text-white font-bold text-base px-4 py-3 ">
                                    Estado
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {registros.length > 0 ? (
                                registros.map((registro, index) => (
                                    <tr
                                        key={registro.id}
                                        className={
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-slate-100"
                                        }
                                    >
                                        <td className="px-4 py-3 border-b text-left">
                                            {registro.id_empleado} 
                                        </td>

                                        <td className="px-4 py-3 font-semibold border-b text-left">
                                            {registro.nombre} {registro.apellido}
                                        </td>

                                        <td className="px-4 py-3 border-b text-left">
                                            {registro.location}
                                        </td>

                                        <td className="px-4 py-3 font-semibold border-b text-left">
                                            {registro.hora}
                                        </td>
                                        <td className="px-4 py-3 border-b text-center text-left">
                                            <button
                                                onClick={() => cambiarEstado(registro.id)}
                                                className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 ${registro.pagado
                                                        ? "bg-green-700 hover:bg-green-800"
                                                        : "bg-orange-400 hover:bg-orange-500"
                                                    }`}
                                            >
                                                {registro.pagado ? "Pagado" : "Pendiente"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center py-6 text-slate-500 text-left"
                                    >
                                        No hay registros para el día de hoy.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}