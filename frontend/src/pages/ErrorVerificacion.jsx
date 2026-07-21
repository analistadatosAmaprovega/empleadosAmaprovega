import { useState } from "react";

const DATOS_PRUEBA = {
  fecha: "15 de julio, 2026",
  hora: "08:03 AM",
  estadoSolicitud: "Rechazada",
};

function IconoError() {
  return (
    <svg
      className="w-10 h-10 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
            ? "text-sm font-semibold text-red-600"
            : "text-sm font-semibold text-slate-800"
        }
      >
        {valor}
      </span>
    </div>
  );
}

export default function ReciboError({ datos = DATOS_PRUEBA }) {
  const [visible] = useState(true);

  if (!visible) return null;

  return (
    <div className="w-full min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center -mb-8 relative z-10">
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg ring-8 ring-slate-100">
            <IconoError />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md pt-12 pb-6 px-6">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-slate-900">Error en Solicitud</h1>
            <p className="text-sm text-slate-500 mt-1">
              No se pudo comprobar la identidad del dispositivo
            </p>
          </div>

          <div className="border-t border-dashed border-slate-300 my-4" />

          <div className="divide-y divide-slate-100">
            <Fila etiqueta="Fecha" valor={datos.fecha} />
            <Fila etiqueta="Hora" valor={datos.hora} />
            <Fila etiqueta="Estado de la solicitud" valor={datos.estadoSolicitud} />
          </div>

          <div className="border-t border-dashed border-slate-300 my-4" />

          <p className="text-center  font-bold text-red-400">
            Favor comunicarse con el departamento de RRHH
          </p>
        </div>
      </div>
    </div>
  );
}