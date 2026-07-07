import Pagination from '@/Components/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ReportesIndex({ reportes, stats }) {
    const [selectedReporte, setSelectedReporte] = useState(null);
    const { patch, delete: destroy } = useForm();

    const updateStatus = (reporte, nuevoEstado) => {
        patch(route('administrativos.reportes.update', reporte.id), {
            data: { estado: nuevoEstado },
            onSuccess: () => setSelectedReporte(null),
        });
    };

    const deleteReporte = (reporte) => {
        if (
            confirm('¿Estás seguro de eliminar este reporte permanentemente?')
        ) {
            destroy(route('administrativos.reportes.destroy', reporte.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-black leading-tight text-gray-800">
                    Bandeja de{' '}
                    <span className="text-brand-orange">Reportes</span>
                </h2>
            }
        >
            <Head title="Bandeja de Reportes" />

            <div className="space-y-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <StatCard
                        label="Pendientes"
                        value={stats.pendientes}
                        icon="fas fa-clock"
                        color="orange"
                        active={true}
                    />
                    <StatCard
                        label="Procesados"
                        value={stats.procesados}
                        icon="fas fa-check-circle"
                        color="green"
                    />
                    <StatCard
                        label="Descartados"
                        value={stats.descartados}
                        icon="fas fa-times-circle"
                        color="gray"
                    />
                </div>

                {/* Inbox Area */}
                <div className="flex h-[700px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl md:flex-row">
                    {/* List */}
                    <div className="flex w-full flex-col border-r border-gray-50 md:w-1/3">
                        <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/30 p-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                                Mensajes
                            </h3>
                            <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-black text-white">
                                {reportes.total} Total
                            </span>
                        </div>
                        <div className="custom-scrollbar flex-1 overflow-y-auto">
                            {reportes.data.length === 0 ? (
                                <div className="p-10 text-center">
                                    <i className="fas fa-inbox mb-4 text-4xl text-gray-100"></i>
                                    <p className="text-xs font-bold uppercase text-gray-300">
                                        Sin reportes nuevos
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {reportes.data.map((reporte) => (
                                        <button
                                            key={reporte.id}
                                            onClick={() =>
                                                setSelectedReporte(reporte)
                                            }
                                            className={`relative flex w-full flex-col gap-2 border-b border-gray-50 p-6 text-left transition-all hover:bg-orange-50/30 ${selectedReporte?.id === reporte.id ? 'border-l-4 border-l-brand-orange bg-orange-50/50' : ''}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <span
                                                    className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase ${
                                                        reporte.estado ===
                                                        'PENDIENTE'
                                                            ? 'bg-orange-100 text-brand-orange'
                                                            : reporte.estado ===
                                                                'PROCESADO'
                                                              ? 'bg-green-100 text-green-600'
                                                              : 'bg-gray-100 text-gray-400'
                                                    }`}
                                                >
                                                    {reporte.estado}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-300">
                                                    {new Date(
                                                        reporte.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="line-clamp-1 text-xs font-black uppercase text-gray-800">
                                                {reporte.edificio
                                                    ? `CUI: ${reporte.edificio.cui} - ${reporte.edificio.localidad}`
                                                    : 'Reporte General'}
                                            </p>
                                            <p className="line-clamp-2 text-[11px] italic text-gray-500">
                                                "{reporte.descripcion}"
                                            </p>
                                        </button>
                                    ))}
                                    {/* Controles de Paginación */}
                                    <div className="flex justify-center border-t border-gray-50 bg-gray-50/50 p-4">
                                        <Pagination links={reportes.links} />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Detail View */}
                    <div className="flex flex-1 flex-col bg-gray-50/30">
                        {selectedReporte ? (
                            <div className="animate-in fade-in slide-in-from-right-4 flex h-full flex-col duration-300">
                                {/* Detail Header */}
                                <div className="flex items-center justify-between border-b border-gray-100 bg-white p-8">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-sm ${
                                                selectedReporte.tipo ===
                                                'ERROR_DATOS'
                                                    ? 'bg-red-50 text-red-500'
                                                    : selectedReporte.tipo ===
                                                        'UBICACION_INCORRECTA'
                                                      ? 'bg-blue-50 text-blue-500'
                                                      : 'bg-orange-50 text-brand-orange'
                                            }`}
                                        >
                                            <i className="fas fa-exclamation-triangle"></i>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-lg font-black uppercase leading-none text-gray-900">
                                                {selectedReporte.tipo.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </h4>
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                                Detalles del Reporte #
                                                {selectedReporte.id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    selectedReporte,
                                                    'PROCESADO',
                                                )
                                            }
                                            className="rounded-xl bg-green-500 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-green-500/20 transition hover:bg-green-600"
                                        >
                                            <i className="fas fa-check mr-2"></i>{' '}
                                            Solucionado
                                        </button>
                                        <button
                                            onClick={() =>
                                                updateStatus(
                                                    selectedReporte,
                                                    'DESCARTADO',
                                                )
                                            }
                                            className="rounded-xl bg-gray-100 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 transition hover:bg-gray-200"
                                        >
                                            <i className="fas fa-ban mr-2"></i>{' '}
                                            Descartar
                                        </button>
                                        <button
                                            onClick={() =>
                                                deleteReporte(selectedReporte)
                                            }
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-400 transition hover:bg-red-500 hover:text-white"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Detail Body */}
                                <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-8">
                                    {/* Info Cards */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                            <p className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                                                <i className="fas fa-building text-brand-orange"></i>{' '}
                                                Datos de la Escuela
                                            </p>
                                            {selectedReporte.edificio ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-black uppercase text-gray-800">
                                                        {
                                                            selectedReporte
                                                                .edificio
                                                                .localidad
                                                        }
                                                    </p>
                                                    <p className="text-[11px] font-bold text-gray-500">
                                                        {
                                                            selectedReporte
                                                                .edificio.calle
                                                        }{' '}
                                                        {
                                                            selectedReporte
                                                                .edificio
                                                                .numero_puerta
                                                        }
                                                    </p>
                                                    <div className="pt-2">
                                                        <span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase text-brand-orange">
                                                            CUI:{' '}
                                                            {
                                                                selectedReporte
                                                                    .edificio
                                                                    .cui
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs font-bold italic text-gray-300">
                                                    No asociado a una escuela
                                                    específica
                                                </p>
                                            )}
                                        </div>

                                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                            <p className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                                                <i className="fas fa-user text-brand-orange"></i>{' '}
                                                Remitente
                                            </p>
                                            <div className="space-y-2">
                                                <p className="text-sm font-black uppercase text-gray-800">
                                                    {selectedReporte.nombre_remitente ||
                                                        'Anónimo'}
                                                </p>
                                                <p className="text-[11px] font-bold text-gray-500">
                                                    {selectedReporte.email_remitente ||
                                                        'Sin correo electrónico'}
                                                </p>
                                                <div className="pt-2">
                                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase text-blue-500">
                                                        IP Registrada
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-8 shadow-sm">
                                        <div className="absolute right-0 top-0 p-4 opacity-5">
                                            <i className="fas fa-quote-right text-6xl text-brand-orange"></i>
                                        </div>
                                        <p className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
                                            <i className="fas fa-align-left text-brand-orange"></i>{' '}
                                            Mensaje del Usuario
                                        </p>
                                        <p className="whitespace-pre-wrap text-base font-medium italic leading-relaxed text-gray-700">
                                            "{selectedReporte.descripcion}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
                                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-4xl text-gray-200">
                                    <i className="fas fa-mouse-pointer"></i>
                                </div>
                                <h4 className="text-lg font-black uppercase text-gray-400">
                                    Selecciona un mensaje
                                </h4>
                                <p className="mt-2 max-w-xs text-xs font-bold uppercase text-gray-300">
                                    Haz clic en un reporte de la lista para ver
                                    los detalles y gestionarlo
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
            `}</style>
        </AuthenticatedLayout>
    );
}

function StatCard({ label, value, icon, color, active = false }) {
    const colors = {
        orange: 'bg-orange-500 shadow-orange-500/20 text-white',
        green: 'bg-green-500 shadow-green-500/20 text-white',
        gray: 'bg-gray-400 shadow-gray-400/20 text-white',
    };

    return (
        <div
            className={`flex items-center gap-6 rounded-3xl border bg-white p-6 shadow-xl transition-all ${active ? 'border-brand-orange ring-4 ring-orange-50' : 'border-gray-100'}`}
        >
            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg ${colors[color]}`}
            >
                <i className={icon}></i>
            </div>
            <div>
                <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-gray-400">
                    {label}
                </p>
                <p className="text-3xl font-black text-gray-800">{value}</p>
            </div>
        </div>
    );
}
