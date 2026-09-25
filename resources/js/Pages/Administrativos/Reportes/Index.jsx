import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import ReporteDetail from './Partials/ReporteDetail';
import ReportesList from './Partials/ReportesList';
import ReportesStats from './Partials/ReportesStats';

export default function ReportesIndex({ reportes, stats }) {
    const [selectedReporte, setSelectedReporte] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = (reporte, nuevoEstado) => {
        setIsUpdating(true);
        router.patch(
            route('administrativos.reportes.update', reporte.id),
            { estado: nuevoEstado },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedReporte(null),
                onFinish: () => setIsUpdating(false),
            },
        );
    };

    const handleDelete = (reporte) => {
        if (
            confirm('¿Estás seguro de eliminar este reporte permanentemente?')
        ) {
            router.delete(route('administrativos.reportes.destroy', reporte.id), {
                preserveScroll: true,
                onSuccess: () => setSelectedReporte(null),
            });
        }
    };

    return (
        <>
            <Head title="Bandeja de Reportes" />

            <div className="space-y-6">
                {/* Stats Summary */}
                <ReportesStats stats={stats} />

                {/* Inbox Area */}
                <div className="flex h-[700px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl md:flex-row">
                    {/* List */}
                    <ReportesList
                        reportes={reportes}
                        selectedReporte={selectedReporte}
                        onSelectReporte={setSelectedReporte}
                    />

                    {/* Detail View */}
                    <ReporteDetail
                        selectedReporte={selectedReporte}
                        onUpdateStatus={handleUpdateStatus}
                        onDelete={handleDelete}
                        isUpdating={isUpdating}
                    />
                </div>
            </div>
        </>
    );
}

ReportesIndex.layout = (page) => (
    <AuthenticatedLayout
        header={
            <h2 className="text-2xl font-black leading-tight text-gray-800">
                Bandeja de <span className="text-brand-orange">Reportes</span>
            </h2>
        }
    >
        {page}
    </AuthenticatedLayout>
);
