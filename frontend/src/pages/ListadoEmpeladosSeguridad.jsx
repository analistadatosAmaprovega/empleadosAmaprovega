import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { API_URL } from "../../config.js";

const DURACION_MS = (0.25 * 60 * 1000); // 10 minutos

export default function ListadoSeguridad() {
    const [registros, setRegistros] = useState([]);
    const [respuesta, setRespuesta] = useState({});
    const [cargando, setCargando] = useState(true);
    const [urlQR, setUrlQR] = useState("");
    const [segundosRestantes, setSegundosRestantes] = useState(DURACION_MS / 1000);

    const generarNuevoQR = () => {
       const timestamp = Date.now();
        setUrlQR(`${"https://empleadosamaprovega.onrender.com"}/registro/${timestamp}`);
        setSegundosRestantes(DURACION_MS / 1000);
    };

    useEffect(() => {
        const obtenerRegistros = async () => {
            try {
                const respuesta = await fetch(`${API_URL}/registroLlegada/verHoyPG`, {
                    credentials: "include",
                });
                setRespuesta(respuesta)
                const data = await respuesta.json();
                if (respuesta.ok) {
                    setRegistros(data.registros);
                } else {
                    console.error(data.mensaje);
                }
                                console.error("datos  ----:", respuesta.status
                                );

            } catch (error) {
                console.error("Error obteniendo registros:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerRegistros();
        generarNuevoQR();

        // Regenera el QR completo cada 10 minutos
        const intervaloQR = setInterval(generarNuevoQR, DURACION_MS);
        return () => clearInterval(intervaloQR);
    }, []);

    // Cuenta regresiva visual, se actualiza cada segundo
    useEffect(() => {
        const intervaloCuenta = setInterval(() => {
            setSegundosRestantes((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(intervaloCuenta);
    }, []);

    const cambiarEstado = (id) => {
        setRegistros((prev) =>
            prev.map((registro) =>
                registro.id === id ? { ...registro, pagado: !registro.pagado } : registro
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

    const minutos = Math.floor(segundosRestantes / 60);
    const segundos = String(segundosRestantes % 60).padStart(2, "0");

    return (
        <div className="w-full min-h-screen bg-slate-100">
            <div className="max-w-5xl mx-auto p-4">
                <div className="flex justify-between items-center mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
                    <div className="text-left">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Listado de Dietas
                        </h1>
                        <p className="text-base text-slate-500 mt-1 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {registros.length} persona{registros.length !== 1 && "s"}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-700">
                                Escanea para tu dieta
                            </p>
                            <p className="text-xs text-slate-400">
                                Válido por {minutos}:{segundos}
                            </p>
                        </div>

                        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                            <QRCode
                                value={urlQR}
                                size={96}
                                style={{ height: "auto", maxWidth: "150px", width: "150px" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-800">
                                <th className="text-left text-white font-bold text-base px-4 py-3">ID</th>
                                <th className="text-left text-white font-bold text-base px-4 py-3">Nombre</th>
                                <th className="text-left text-white font-bold text-base px-4 py-3">Ubicación</th>
                                <th className="text-left text-white font-bold text-base px-4 py-3">Hora</th>
                                <th className="text-left text-center text-white font-bold text-base px-4 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.length > 0 ? (
                                registros.map((registro, index) => (
                                    <tr key={registro.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-100"}>
                                        <td className="px-4 py-3 border-b text-left">{registro.id_empleado}</td>
                                        <td className="px-4 py-3 font-semibold border-b text-left">
                                            {registro.nombre} {registro.apellido}
                                        </td>
                                        <td className="px-4 py-3 border-b text-left">{registro.location}</td>
                                        <td className="px-4 py-3 font-semibold border-b text-left">{registro.hora}</td>
                                        <td className="px-4 py-3 border-b text-center text-left">
                                            <button
                                                onClick={() => cambiarEstado(registro.id)}
                                                className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
                                                    registro.pagado
                                                        ? "bg-green-700 hover:bg-green-800"
                                                        : "bg-orange-400 hover:bg-orange-500"
                                                }`}
                                            >
                                                {registro.pagado ? "Pagado" : "Pendiente"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : respuesta.status === 401 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-3 text-slate-500">
                                        No está autorizado para esta consulta.
                                    </td>
                                </tr>
                            ):
                            (
                                <tr>
                                    <td colSpan="5" className="text-center py-3 text-slate-500">
                                        No hay registros para el día de hoy.
                                    </td>
                                </tr>
                            )
                        
                        
                        
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// import { useEffect, useState } from "react";
// import QRCode from "react-qr-code";
// import { API_URL } from "../../config.js";

// const URL_REGISTRO = `${API_URL}/registro`;

// export default function ListadoSeguridad() {
//     const [registros, setRegistros] = useState([]);
//     const [cargando, setCargando] = useState(true);

//     useEffect(() => {
//         const obtenerRegistros = async () => {
//             try {
//                 const respuesta = await fetch(
//                     `${API_URL}/registroLlegada/verHoyPG`,
//                     {
//                         credentials: "include",
//                     }
//                 );

//                 const data = await respuesta.json();

//                 if (respuesta.ok) {
//                     setRegistros(data.registros);
//                 } else {
//                     console.error(data.mensaje);
//                 }
//             } catch (error) {
//                 console.error("Error obteniendo registros:", error);
//             } finally {
//                 setCargando(false);
//             }
//         };

//         obtenerRegistros();
//     }, []);
//     const cambiarEstado = (id) => {
//         setRegistros((prev) =>
//             prev.map((registro) =>
//                 registro.id === id
//                     ? {
//                         ...registro,
//                         pagado: !registro.pagado,
//                     }
//                     : registro
//             )
//         );
//     };
//     if (cargando) {
//         return (
//             <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
//                 Cargando registros...
//             </div>
//         );
//     }

//     return (
//         <div className="w-full min-h-screen bg-slate-100">
//             <div className="max-w-5xl mx-auto p-4">

//                 {/* Contenedor del QR en la esquina superior derecha */}
//                 <div className="flex justify-between items-center mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
//                     <div className="text-left">
//                         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//                             Listado de Dietas
//                         </h1>
//                         <p className="text-base text-slate-500 mt-1 flex items-center gap-2">
//                             <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
//                             {registros.length} persona{registros.length !== 1 && "s"}
//                         </p>
//                     </div>

//                     <div className="flex items-center gap-4">
//                         <div className="text-right hidden sm:block">
//                             <p className="text-sm font-semibold text-slate-700">
//                                 Escanea para tu dieta
//                             </p>
//                             <p className="text-xs text-slate-400">
//                                 Entrada / Salida
//                             </p>
//                         </div>

//                         <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100">
//                             <QRCode
//                                 value={URL_REGISTRO}
//                                 size={96}
//                                 style={{ height: "auto", maxWidth: "150px", width: "150px" }}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="bg-slate-800">
//                                 <th className="text-left text-white font-bold text-base px-4 py-3">
//                                     ID
//                                 </th>

//                                 <th className="text-left text-white font-bold text-base px-4 py-3">
//                                     Nombre
//                                 </th>

//                                 <th className="text-left text-white font-bold text-base px-4 py-3">
//                                     Ubicación
//                                 </th>

//                                 <th className="text-left text-white font-bold text-base px-4 py-3">
//                                     Hora
//                                 </th>
//                                 <th className="text-left text-center text-white font-bold text-base px-4 py-3 ">
//                                     Estado
//                                 </th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {registros.length > 0 ? (
//                                 registros.map((registro, index) => (
//                                     <tr
//                                         key={registro.id}
//                                         className={
//                                             index % 2 === 0
//                                                 ? "bg-white"
//                                                 : "bg-slate-100"
//                                         }
//                                     >
//                                         <td className="px-4 py-3 border-b text-left">
//                                             {registro.id_empleado}
//                                         </td>

//                                         <td className="px-4 py-3 font-semibold border-b text-left">
//                                             {registro.nombre} {registro.apellido}
//                                         </td>

//                                         <td className="px-4 py-3 border-b text-left">
//                                             {registro.location}
//                                         </td>

//                                         <td className="px-4 py-3 font-semibold border-b text-left">
//                                             {registro.hora}
//                                         </td>
//                                         <td className="px-4 py-3 border-b text-center text-left">
//                                             <button
//                                                 onClick={() => cambiarEstado(registro.id)}
//                                                 className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 ${registro.pagado
//                                                     ? "bg-green-700 hover:bg-green-800"
//                                                     : "bg-orange-400 hover:bg-orange-500"
//                                                     }`}
//                                             >
//                                                 {registro.pagado ? "Pagado" : "Pendiente"}
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan="4"
//                                         className="text-center py-6 text-slate-500 text-left"
//                                     >
//                                         No hay registros para el día de hoy.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }


// import { useEffect, useState } from "react";
// import { API_URL } from "../../config.js";

// export default function ListadoSeguridad() {
//     const [registros, setRegistros] = useState([]);
//     const [cargando, setCargando] = useState(true);

//     useEffect(() => {
//         const obtenerRegistros = async () => {
//             try {
//                 const respuesta = await fetch(
//                     `${API_URL}/registroLlegada/verHoyPG`,
//                     {
//                         credentials: "include",
//                     }
//                 );

//                 const data = await respuesta.json();

//                 if (respuesta.ok) {
//                     setRegistros(data.registros);
//                 } else {
//                     console.error(data.mensaje);
//                 }
//             } catch (error) {
//                 console.error("Error obteniendo registros:", error);
//             } finally {
//                 setCargando(false);
//             }
//         };

//         obtenerRegistros();
//     }, []);
//     const cambiarEstado = (id) => {
//         setRegistros((prev) =>
//             prev.map((registro) =>
//                 registro.id === id
//                     ? {
//                         ...registro,
//                         pagado: !registro.pagado,
//                     }
//                     : registro
//             )
//         );
//     };
//     if (cargando) {
//         return (
//             <div className="flex justify-center items-center min-h-screen text-xl font-semibold">
//                 Cargando registros...
//             </div>
//         );
//     }

//     return (
//         <div className="w-full min-h-screen bg-slate-100">
//             <div className="max-w-5xl mx-auto p-4">
//                 <div className="text-center mb-4">
//                     <h1 className="text-3xl font-bold text-slate-900">
//                         Listado de Dietas
//                     </h1>

//                     <p className="text-lg text-slate-500 mt-1">
//                         {registros.length} persona{registros.length !== 1 && "s"}
//                     </p>
//                 </div>

//                 <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//                     <table className="w-full">
//                         <thead>
//                             <tr className="bg-slate-800">
//                                 <th className="text-left text-white font-bold text-base px-4 py-3">
//                                     ID
//                                 </th>

//                                 <th className="text-left text-white font-bold text-base px-4 py-3">
//                                     Nombre
//                                 </th>

//                                 <th className="text-left text-white font-bold text-base px-4 py-3">
//                                     Ubicación
//                                 </th>

//                                 <th className="text-left text-white font-bold text-base px-4 py-3">
//                                     Hora
//                                 </th>
//                                 <th className="text-left text-center text-white font-bold text-base px-4 py-3 ">
//                                     Estado
//                                 </th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {registros.length > 0 ? (
//                                 registros.map((registro, index) => (
//                                     <tr
//                                         key={registro.id}
//                                         className={
//                                             index % 2 === 0
//                                                 ? "bg-white"
//                                                 : "bg-slate-100"
//                                         }
//                                     >
//                                         <td className="px-4 py-3 border-b text-left">
//                                             {registro.id_empleado}
//                                         </td>

//                                         <td className="px-4 py-3 font-semibold border-b text-left">
//                                             {registro.nombre} {registro.apellido}
//                                         </td>

//                                         <td className="px-4 py-3 border-b text-left">
//                                             {registro.location}
//                                         </td>

//                                         <td className="px-4 py-3 font-semibold border-b text-left">
//                                             {registro.hora}
//                                         </td>
//                                         <td className="px-4 py-3 border-b text-center text-left">
//                                             <button
//                                                 onClick={() => cambiarEstado(registro.id)}
//                                                 className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 ${registro.pagado
//                                                     ? "bg-green-700 hover:bg-green-800"
//                                                     : "bg-orange-400 hover:bg-orange-500"
//                                                     }`}
//                                             >
//                                                 {registro.pagado ? "Pagado" : "Pendiente"}
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td
//                                         colSpan="4"
//                                         className="text-center py-6 text-slate-500 text-left"
//                                     >
//                                         No hay registros para el día de hoy.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// }