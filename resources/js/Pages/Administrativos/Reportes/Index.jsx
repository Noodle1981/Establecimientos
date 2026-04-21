import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ReportesIndex({ reportes, stats }) {
    const [selectedReporte, setSelectedReporte] = useState(null);
    const { patch, delete: destroy, processing } = useForm();

    const updateStatus = (reporte, nuevoEstado) => {
        patch(route('administrativos.reportes.update', reporte.id), {
            data: { estado: nuevoEstado },
            onSuccess: () => setSelectedReporte(null)
        });
    };

    const deleteReporte = (reporte) => {
        if (confirm('¿Estás seguro de eliminar este reporte permanentemente?')) {
            destroy(route('administrativos.reportes.destroy', reporte.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-black text-2xl text-gray-800 leading-tight">Bandeja de <span className="text-brand-orange">Reportes</span></h2>}
        >
            <Head title="Bandeja de Reportes" />

            <div className="space-y-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row h-[700px]">
                    
                    {/* List */}
                    <div className="w-full md:w-1/3 border-r border-gray-50 flex flex-col">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Mensajes</h3>
                            <span className="bg-brand-orange text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                {reportes.length} Total
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {reportes.length === 0 ? (
                                <div className="p-10 text-center">
                                    <i className="fas fa-inbox text-4xl text-gray-100 mb-4"></i>
                                    <p className="text-xs font-bold text-gray-300 uppercase">Sin reportes nuevos</p>
                                </div>
                            ) : (
                                reportes.map(reporte => (
                                    <button 
                                        key={reporte.id}
                                        onClick={() => setSelectedReporte(reporte)}
                                        className={`w-full text-left p-6 border-b border-gray-50 transition-all hover:bg-orange-50/30 flex flex-col gap-2 relative ${selectedReporte?.id === reporte.id ? 'bg-orange-50/50 border-l-4 border-l-brand-orange' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                reporte.estado === 'PENDIENTE' ? 'bg-orange-100 text-brand-orange' : 
                                                reporte.estado === 'PROCESADO' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                                {reporte.estado}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-300">
                                                {new Date(reporte.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs font-black text-gray-800 line-clamp-1 uppercase">
                                            {reporte.edificio ? `CUI: ${reporte.edificio.cui} - ${reporte.edificio.localidad}` : 'Reporte General'}
                                        </p>
                                        <p className="text-[11px] text-gray-500 line-clamp-2 italic">
                                            "{reporte.descripcion}"
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Detail View */}
                    <div className="flex-1 bg-gray-50/30 flex flex-col">
                        {selectedReporte ? (
                            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Detail Header */}
                                <div className="p-8 bg-white border-b border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                                            selectedReporte.tipo === 'ERROR_DATOS' ? 'bg-red-50 text-red-500' : 
                                            selectedReporte.tipo === 'UBICACION_INCORRECTA' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-brand-orange'
                                        }`}>
                                            <i className="fas fa-exclamation-triangle"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-gray-900 leading-none mb-1 uppercase">{selectedReporte.tipo.replace('_', ' ')}</h4>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detalles del Reporte #{selectedReporte.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => updateStatus(selectedReporte, 'PROCESADO')}
                                            className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition shadow-lg shadow-green-500/20"
                                        >
                                            <i className="fas fa-check mr-2"></i> Solucionado
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(selectedReporte, 'DESCARTADO')}
                                            className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition"
                                        >
                                            <i className="fas fa-ban mr-2"></i> Descartar
                                        </button>
                                        <button 
                                            onClick={() => deleteReporte(selectedReporte)}
                                            className="w-10 h-10 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Detail Body */}
                                <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar">
                                    {/* Info Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2">
                                                <i className="fas fa-building text-brand-orange"></i> Datos de la Escuela
                                            </p>
                                            {selectedReporte.edificio ? (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-black text-gray-800 uppercase">{selectedReporte.edificio.localidad}</p>
                                                    <p className="text-[11px] font-bold text-gray-500">{selectedReporte.edificio.calle} {selectedReporte.edificio.numero_puerta}</p>
                                                    <div className="pt-2">
                                                        <span className="text-[10px] font-black bg-orange-50 text-brand-orange px-3 py-1 rounded-full uppercase">CUI: {selectedReporte.edificio.cui}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs font-bold text-gray-300 italic">No asociado a una escuela específica</p>
                                            )}
                                        </div>

                                        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2">
                                                <i className="fas fa-user text-brand-orange"></i> Remitente
                                            </p>
                                            <div className="space-y-2">
                                                <p className="text-sm font-black text-gray-800 uppercase">{selectedReporte.nombre_remitente || 'Anónimo'}</p>
                                                <p className="text-[11px] font-bold text-gray-500">{selectedReporte.email_remitente || 'Sin correo electrónico'}</p>
                                                <div className="pt-2">
                                                    <span className="text-[10px] font-black bg-blue-50 text-blue-500 px-3 py-1 rounded-full uppercase">IP Registrada</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="p-8 bg-white rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <i className="fas fa-quote-right text-6xl text-brand-orange"></i>
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-gray-400 mb-4 flex items-center gap-2">
                                            <i className="fas fa-align-left text-brand-orange"></i> Mensaje del Usuario
                                        </p>
                                        <p className="text-base font-medium text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                                            "{selectedReporte.descripcion}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-4xl text-gray-200 mb-6">
                                    <i className="fas fa-mouse-pointer"></i>
                                </div>
                                <h4 className="text-lg font-black text-gray-400 uppercase">Selecciona un mensaje</h4>
                                <p className="text-xs font-bold text-gray-300 uppercase max-w-xs mt-2">Haz clic en un reporte de la lista para ver los detalles y gestionarlo</p>
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
        <div className={`p-6 rounded-3xl border bg-white transition-all shadow-xl flex items-center gap-6 ${active ? 'border-brand-orange ring-4 ring-orange-50' : 'border-gray-100'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${colors[color]}`}>
                <i className={icon}></i>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">{label}</p>
                <p className="text-3xl font-black text-gray-800">{value}</p>
            </div>
        </div>
    );
}
