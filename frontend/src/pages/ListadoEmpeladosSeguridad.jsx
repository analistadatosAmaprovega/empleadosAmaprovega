import { useState } from "react";

const DATOS_PRUEBA = [
    { id: 1, nombre: "María", apellido: "Rodríguez", departamento: "Ventas", hora: "08:03 AM" },
    { id: 2, nombre: "Juan", apellido: "Pérez", departamento: "Sistemas", hora: "07:58 AM" },
    { id: 3, nombre: "Ana", apellido: "Gómez", departamento: "Recursos Humanos", hora: "08:10 AM" },
    { id: 4, nombre: "Carlos", apellido: "Fernández", departamento: "Sistemas", hora: "08:15 AM" },
    { id: 5, nombre: "Luisa", apellido: "Martínez", departamento: "Contabilidad", hora: "07:45 AM" },
    { id: 6, nombre: "Pedro", apellido: "Sánchez", departamento: "Ventas", hora: "08:20 AM" },
    { id: 7, nombre: "Rosa", apellido: "Díaz", departamento: "Recursos Humanos", hora: "08:05 AM" },
    { id: 8, nombre: "Miguel", apellido: "Torres", departamento: "Contabilidad", hora: "08:30 AM" },
    { id: 9, nombre: "Elena", apellido: "Castillo", departamento: "Ventas", hora: "08:02 AM" },
    { id: 10, nombre: "Rafael", apellido: "Núñez", departamento: "Sistemas", hora: "08:07 AM" },
    { id: 11, nombre: "Carmen", apellido: "Reyes", departamento: "Recursos Humanos", hora: "07:50 AM" },
    { id: 12, nombre: "José", apellido: "Ramírez", departamento: "Contabilidad", hora: "08:12 AM" },
    { id: 13, nombre: "Patricia", apellido: "Cruz", departamento: "Ventas", hora: "08:18 AM" },
    { id: 14, nombre: "Fernando", apellido: "Peña", departamento: "Sistemas", hora: "07:55 AM" },
    { id: 15, nombre: "Gabriela", apellido: "Vargas", departamento: "Recursos Humanos", hora: "08:00 AM" },
    { id: 16, nombre: "Antonio", apellido: "Mejía", departamento: "Contabilidad", hora: "08:22 AM" },
    { id: 17, nombre: "Isabel", apellido: "Herrera", departamento: "Ventas", hora: "08:09 AM" },
    { id: 18, nombre: "Ramón", apellido: "Ortiz", departamento: "Sistemas", hora: "08:14 AM" },
    { id: 19, nombre: "Sofía", apellido: "Jiménez", departamento: "Recursos Humanos", hora: "07:59 AM" },
    { id: 20, nombre: "Manuel", apellido: "Castro", departamento: "Contabilidad", hora: "08:25 AM" },
];

export default function ListadoSeguridad() {
    const [registros] = useState(DATOS_PRUEBA);

    return (
        <div className="w-full min-h-screen bg-slate-100">
            <div className="max-w-3xl mx-auto p-4">
                <div className="text-center mb-4">
                    <h1 className="text-3xl font-bold text-slate-900">Dietas Solicitadas</h1>
                    <p className="text-lg text-slate-500 mt-1">{registros.length} personas</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-800">
                                <th className="text-left text-white font-bold text-base px-4 py-3">Nombre</th>
                                <th className="text-left text-white font-bold text-base px-4 py-3">Apellido</th>
                                <th className="text-left text-white font-bold text-base px-4 py-3">Departamento</th>
                                <th className="text-left text-white font-bold text-base px-4 py-3">Hora</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((registro, index) => (
                                <tr
                                    key={registro.id}
                                    className={index % 2 === 0 ? "bg-white" : "bg-slate-300"}
                                >
                                    <td className="px-4 py-3 text-lg font-semibold text-slate-900 border-b border-slate-100">
                                        {registro.nombre}
                                    </td>
                                    <td className="px-4 py-3 text-lg text-slate-900 border-b border-slate-100">
                                        {registro.apellido}
                                    </td>
                                    <td className="px-4 py-3 border-b border-slate-100">
                                        <span className="px-4 py-3 text-lg text-slate-900 border-b border-slate-100">

                                            {/* <span className="inline-block px-3 py-1 rounded-full text-base font-medium bg-indigo-50 text-indigo-700"> */}
                                            {registro.departamento}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-lg font-semibold text-slate-700 border-b border-slate-100">
                                        {registro.hora}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}