import { useMemo, useState } from "react";

const DATOS_PRUEBA = [
  { id: 1, nombre: "María", apellido: "Rodríguez", departamento: "Ventas", horaProgramada: "08:00 AM", hora: "08:03 AM", estado: "activo", fecha: "2026-07-14" },
  { id: 2, nombre: "Juan", apellido: "Pérez", departamento: "Sistemas", horaProgramada: "08:00 AM", hora: "07:58 AM", estado: "activo", fecha: "2026-07-14" },
  { id: 3, nombre: "Ana", apellido: "Gómez", departamento: "Recursos Humanos", horaProgramada: "08:00 AM", hora: "08:10 AM", estado: "inactivo", fecha: "2026-07-14" },
  { id: 4, nombre: "Carlos", apellido: "Fernández", departamento: "Sistemas", horaProgramada: "08:30 AM", hora: "08:15 AM", estado: "activo", fecha: "2026-07-13" },
  { id: 5, nombre: "Luisa", apellido: "Martínez", departamento: "Contabilidad", horaProgramada: "08:00 AM", hora: "07:45 AM", estado: "activo", fecha: "2026-07-13" },
  { id: 6, nombre: "Pedro", apellido: "Sánchez", departamento: "Ventas", horaProgramada: "08:30 AM", hora: "08:20 AM", estado: "inactivo", fecha: "2026-07-13" },
  { id: 7, nombre: "Rosa", apellido: "Díaz", departamento: "Recursos Humanos", horaProgramada: "08:00 AM", hora: "08:05 AM", estado: "activo", fecha: "2026-07-10" },
  { id: 8, nombre: "Miguel", apellido: "Torres", departamento: "Contabilidad", horaProgramada: "08:00 AM", hora: "08:30 AM", estado: "activo", fecha: "2026-07-10" },
];

const NOMBRES_MES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DIAS_SEMANA = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

function formatearFecha(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatearFechaLegible(fechaISO) {
  const [y, m, d] = fechaISO.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-DO", { day: "2-digit", month: "short", year: "numeric" });
}

function Calendario({ mesActual, onCambiarMes, fechaSeleccionada, onSeleccionarFecha }) {
  const primerDiaMes = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
  const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
  const diaSemanaInicio = primerDiaMes.getDay();

  const celdas = [];
  for (let i = 0; i < diaSemanaInicio; i++) celdas.push(null);
  for (let dia = 1; dia <= diasEnMes; dia++) {
    celdas.push(new Date(mesActual.getFullYear(), mesActual.getMonth(), dia));
  }

  return (
    <div className="absolute right-0 z-20 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => onCambiarMes(-1)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-slate-700">
          {NOMBRES_MES[mesActual.getMonth()]} {mesActual.getFullYear()}
        </span>
        <button
          onClick={() => onCambiarMes(1)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celdas.map((fecha, idx) => {
          if (!fecha) return <div key={`vacio-${idx}`} />;
          const iso = formatearFecha(fecha);
          const esSeleccionado = iso === fechaSeleccionada;
          const esHoy = iso === formatearFecha(new Date());

          return (
            <button
              key={iso}
              onClick={() => onSeleccionarFecha(iso)}
              className={[
                "h-8 w-8 mx-auto flex items-center justify-center rounded-full text-sm transition-colors",
                esSeleccionado
                  ? "bg-indigo-600 text-white font-semibold"
                  : esHoy
                  ? "border border-indigo-400 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100",
              ].join(" ")}
            >
              {fecha.getDate()}
            </button>
          );
        })}
      </div>

      {fechaSeleccionada && (
        <button
          onClick={() => onSeleccionarFecha(null)}
          className="mt-3 w-full text-center text-xs text-slate-500 hover:text-slate-700 underline"
        >
          Quitar filtro de fecha
        </button>
      )}
    </div>
  );
}

export default function ListadoAsistencia() {
  const [registros] = useState(DATOS_PRUEBA);
  const [cargando] = useState(false);
  const [error] = useState(null);

  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [mesActual, setMesActual] = useState(new Date());
  const [calendarioAbierto, setCalendarioAbierto] = useState(false);

  const registrosFiltrados = useMemo(() => {
    return registros.filter((r) => {
      const coincideEstado = estadoFiltro === "todos" || r.estado === estadoFiltro;
      const coincideFecha = !fechaSeleccionada || r.fecha === fechaSeleccionada;
      return coincideEstado && coincideFecha;
    });
  }, [registros, estadoFiltro, fechaSeleccionada]);

  const cambiarMes = (delta) => {
    setMesActual((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const seleccionarFecha = (iso) => {
    setFechaSeleccionada(iso);
    setCalendarioAbierto(false);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6 font-sans text-slate-800">
        {/* Encabezado */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Asistencia</h1>
            <p className="text-sm text-slate-500 mt-1">
              {cargando
                ? "Cargando listado..."
                : `${registrosFiltrados.length} de ${registros.length} registro(s)`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Filtro por estado */}
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-3 py-2 rounded-md border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>

            {/* Filtro por fecha con calendario desplegable */}
            <div className="relative">
              <button
                onClick={() => setCalendarioAbierto((abierto) => !abierto)}
                className="px-3 py-2 rounded-md border border-slate-300 text-sm bg-white flex items-center gap-2 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <span aria-hidden>📅</span>
                {fechaSeleccionada ? formatearFechaLegible(fechaSeleccionada) : "Filtrar por fecha"}
              </button>

              {calendarioAbierto && (
                <Calendario
                  mesActual={mesActual}
                  onCambiarMes={cambiarMes}
                  fechaSeleccionada={fechaSeleccionada}
                  onSeleccionarFecha={seleccionarFecha}
                />
              )}
            </div>
          </div>
        </div>

        {/* Alerta de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2.5 rounded-lg mb-4">
            <strong>No se pudo cargar el listado.</strong> {error}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {cargando ? (
            <div className="py-10 text-center text-slate-500 text-sm">
              Cargando registros...
            </div>
          ) : registrosFiltrados.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">
              No hay registros que coincidan con los filtros seleccionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left font-semibold text-slate-600 px-4 py-3">Nombre</th>
                    <th className="text-left font-semibold text-slate-600 px-4 py-3">Apellido</th>
                    <th className="text-left font-semibold text-slate-600 px-4 py-3">Departamento</th>
                    <th className="text-left font-semibold text-slate-600 px-4 py-3">Hora programada</th>
                    <th className="text-left font-semibold text-slate-600 px-4 py-3">Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosFiltrados.map((registro) => (
                    <tr
                      key={registro.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">{registro.nombre}</td>
                      <td className="px-4 py-3">{registro.apellido}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                          {registro.departamento}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{registro.horaProgramada}</td>
                      <td className="px-4 py-3 text-slate-500">{registro.hora}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}