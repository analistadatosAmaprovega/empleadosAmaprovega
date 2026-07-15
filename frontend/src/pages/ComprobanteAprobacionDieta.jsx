import { useState } from "react";


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
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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

export default function ReciboConfirmacion({ datos = DATOS_PRUEBA }) {
    const [visible] = useState(true);

    if (!visible) return null;

    return (
        <div className="w-full min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="flex justify-center -mb-8 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg ring-8 ring-slate-100">
                        <IconoCheck />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md pt-12 pb-6 px-6">
                    <div className="text-center mb-4">
                        <h1 className="text-xl font-bold text-slate-900">Solicitud Aprobada</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Su solicitud de dieta ha sido enviada exitosamente        </p>
                    </div>

                    <div className="border-t border-dashed border-slate-300 my-4" />

                    <div className="divide-y divide-slate-100">
                        <Fila etiqueta="Fecha" valor={datos.fecha} />
                        <Fila etiqueta="Hora" valor={datos.hora} />
                        <Fila etiqueta="ID de solicitud" valor={datos.idSolicitud} />
                        <Fila etiqueta="Colaborador" valor={datos.nombreColaborador} />
                        <Fila etiqueta="Estatus" valor={datos.estatus} destacado />
                    </div>

                    <div className="border-t border-dashed border-slate-300 my-4" />

                    <p className="text-center text-xs text-slate-400">
                        Guarda esta pantalla como comprobante de tu verificación
                    </p>
                </div>
            </div>
        </div>
    );
}