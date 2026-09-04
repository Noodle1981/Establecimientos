import { Head, Link } from '@inertiajs/react';

export default function Error({ status = 404 }) {
    const title = {
        503: 'Servicio No Disponible',
        500: 'Error Interno del Servidor',
        404: 'Página No Encontrada',
        403: 'Acceso No Autorizado',
        401: 'Sesión Expirada',
    }[status] || 'Ha Ocurrido un Error';

    const description = {
        503: 'Estamos realizando tareas de mantenimiento preventivo. Por favor, intente nuevamente en unos minutos.',
        500: 'Ocurrió un error inesperado en nuestros servidores. Nuestro equipo técnico ha sido notificado.',
        404: 'Lo sentimos, el recurso o página que está buscando no existe o ha sido reubicada.',
        403: 'No cuenta con los permisos necesarios para acceder a este módulo o sección del sistema.',
        401: 'Su sesión ha expirado o no ha iniciado sesión. Por favor, autentíquese nuevamente.',
    }[status] || 'Ocurrió un problema inesperado al procesar su solicitud.';

    const icon = {
        503: 'fa-tools',
        500: 'fa-exclamation-triangle',
        404: 'fa-search-location',
        403: 'fa-user-lock',
        401: 'fa-key',
    }[status] || 'fa-circle-exclamation';

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white p-6 font-sans antialiased">
            <Head title={`${status}: ${title}`} />

            {/* Background blur decorative orbs */}
            <div className="pointer-events-none absolute -right-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]"></div>
            <div className="pointer-events-none absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]"></div>

            <div className="relative z-10 w-full max-w-2xl text-center">
                {/* Brand Header */}
                <div className="mb-6 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#FE8204]">
                    <i className="fas fa-graduation-cap text-base"></i>
                    <span>Ministerio de Educación</span>
                </div>

                {/* Status Hero */}
                <div className="relative mb-6">
                    <span className="select-none text-[150px] font-black leading-none tracking-tighter text-gray-100 sm:text-[180px]">
                        {status}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-orange-200 bg-orange-50/80 text-[#FE8204] shadow-inner backdrop-blur-sm">
                            <i className={`fas ${icon} text-4xl`}></i>
                        </div>
                    </div>
                </div>

                {/* Title & Description */}
                <h1 className="mb-3 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                    {title}
                </h1>
                <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-gray-600">
                    {description}
                </p>

                {/* Actions */}
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href={route('home')}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FE8204] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#e07102] sm:w-auto"
                    >
                        <i className="fas fa-home text-sm"></i>
                        <span>Ir al Mapa Principal</span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-xs font-black uppercase tracking-wider text-gray-700 shadow-sm transition hover:bg-gray-50 sm:w-auto"
                    >
                        <i className="fas fa-arrow-left text-sm"></i>
                        <span>Volver Atrás</span>
                    </button>
                </div>

                <div className="mt-12 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Sistema de Gestión de Establecimientos M.E. &copy; {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
}
