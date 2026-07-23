import logo from "./../../public/icono.png";
import { Info } from "lucide-react";

export default function BienvenidaQR({empleado}) {
    // console.log(empleado);
    
    return (
        <div className="min-h-screen bg-slate-600 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl px-6 py-8 sm:px-10 sm:py-10">

                {/* Logo */}
                <div className="flex justify-center">
                    <img
                        src={logo}
                        alt="Grupo Hermanos Ruiz"
                        className="w-40 sm:w-56 md:w-64"
                    />
                </div>

                {/* Título */}
                <h1 className="mt-5 text-center font-bold text-slate-800 text-3xl sm:text-4xl md:text-5xl">
                    ¡Bienvenido!
                </h1>

                {/* Texto */}
            <div className="mt-6 text-center">
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

<p className="mt-2 text-sm md:text-base uppercase tracking-wider text-slate-400">
  {empleado.cargo}
</p>
</div>
                {/* QR */}
                <div className="flex justify-center mt-8 sm:mt-10">

                    <div className="relative bg-blue-50 rounded-full flex items-center justify-center
                                    w-56 h-56
                                    sm:w-72 sm:h-72">

                        {/* Esquinas */}
                        <div className="absolute top-10 left-10 w-8 h-8 border-l-4 border-t-4 border-blue-500 rounded-tl-lg"></div>
                        <div className="absolute top-10 right-10 w-8 h-8 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
                        <div className="absolute bottom-10 left-10 w-8 h-8 border-l-4 border-b-4 border-blue-500 rounded-bl-lg"></div>
                        <div className="absolute bottom-10 right-10 w-8 h-8 border-r-4 border-b-4 border-blue-500 rounded-br-lg"></div>

                        {/* QR */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white border-4 border-slate-700 grid grid-cols-5 gap-1 p-2">
                            {Array.from({ length: 25 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`${Math.random() > 0.5 ? "bg-slate-800" : "bg-white"}`}
                                />
                            ))}
                        </div>

                        {/* Celular */}
                        <div className="absolute right-12 bottom-12
                                        w-16 h-28
                                        sm:w-20 sm:h-36
                                        bg-white border-4 border-slate-700 rounded-xl">

                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-slate-700"></div>

                        </div>

                    </div>

                </div>

                {/* Aviso */}
                <div className="mt-8 bg-slate-100 rounded-xl p-4 sm:p-6 flex gap-4 items-center max-w-3xl mx-auto">

                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 flex items-center justify-center">
                            <Info className="text-white" size={28} />
                        </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base md:text-xl">
                        Escanea el QR, para solicitar el pago de tu dieta.
                    </p>

                </div>

          
            </div>
        </div>
    );
}