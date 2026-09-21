import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AuditoriaFilters from './Partials/AuditoriaFilters';
import AuditoriaTable from './Partials/AuditoriaTable';
import KPICard from './Partials/KPICard';
import StatusUpdateModal from './Partials/StatusUpdateModal';

export default function Index({
    modalidades,
    stats,
    filters,
    nombresEdificios = {},
    options = { departamentos: [], niveles: [] },
}) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedMod, setSelectedMod] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isExportingExcel, setIsExportingExcel] = useState(false);

    // Función para obtener el nombre descriptivo del edificio
    const getNombreEdificio = (mod) => {
        try {
            const edificioId = mod?.establecimiento?.edificio_id;
            const mapa = nombresEdificios || {};
            if (edificioId && mapa[edificioId]) {
                return mapa[edificioId];
            }
            // Fallback: nombre de la cabecera en el establecimiento o establecimiento mismo
            return (
                mod?.establecimiento?.edificio?.cabecera?.nombre ??
                mod?.establecimiento?.nombre ??
                null
            );
        } catch (e) {
            console.error('Error en getNombreEdificio:', e);
            return null;
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        if (key !== 'page') {
            delete newFilters.page;
        }
        router.get(route('administrativos.auditoria.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleExportPdf = async () => {
        setIsExporting(true);
        try {
            const response = await window.axios.get(
                route('administrativos.auditoria.exportPdf', filters),
                {
                    responseType: 'blob',
                },
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'reporte_auditoria.pdf';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(
                    /filename="?([^"]+)"?/,
                );
                if (fileNameMatch && fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting PDF:', error);
            alert(
                'Hubo un error al generar el PDF. Por favor, intente nuevamente.',
            );
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportExcel = async () => {
        setIsExportingExcel(true);
        try {
            const response = await window.axios.get(
                route('administrativos.auditoria.exportExcel', filters),
                {
                    responseType: 'blob',
                },
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'reporte_auditoria.xlsx';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(
                    /filename="?([^"]+)"?/,
                );
                if (fileNameMatch && fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }

            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting Excel:', error);
            alert(
                'Hubo un error al generar el Excel. Por favor, intente nuevamente.',
            );
        } finally {
            setIsExportingExcel(false);
        }
    };

    const handleOpenModal = (mod) => {
        setSelectedMod(mod);
        setShowStatusModal(true);
    };

    return (
        <>
            <Head title="Auditoría" />

            {/* KPIs */}
            <div className="mb-6 grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 xl:grid-cols-6">
                <KPICard
                    label="Avance Global"
                    value={`${stats.porcentajeAvance}%`}
                    icon="fas fa-percentage"
                    color="orange"
                />
                <KPICard
                    label="PENDIENTE"
                    value={stats.pendientes}
                    icon="fas fa-clock"
                    color="amber"
                />
                <KPICard
                    label="CORRECTO"
                    value={stats.correctos}
                    icon="fas fa-check-double"
                    color="emerald"
                />
                <KPICard
                    label="CORREGIDO"
                    value={stats.corregidos}
                    icon="fas fa-tools"
                    color="blue"
                />
                <KPICard
                    label="REVISAR"
                    value={stats.revisar}
                    icon="fas fa-exclamation-triangle"
                    color="rose"
                />
                <KPICard
                    label="BAJA"
                    value={stats.bajas}
                    icon="fas fa-arrow-down"
                    color="orange"
                />
            </div>

            <div className="space-y-6">
                {/* Filters */}
                <AuditoriaFilters
                    filters={filters}
                    options={options}
                    onFilterChange={handleFilterChange}
                    onExportPdf={handleExportPdf}
                    onExportExcel={handleExportExcel}
                    isExporting={isExporting}
                    isExportingExcel={isExportingExcel}
                />

                {/* Table */}
                <AuditoriaTable
                    modalidades={modalidades}
                    getNombreEdificio={getNombreEdificio}
                    onSelectModalidad={handleOpenModal}
                />
            </div>

            {/* Status Update Modal */}
            <StatusUpdateModal
                show={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                modalidad={selectedMod}
                getNombreEdificio={getNombreEdificio}
            />
        </>
    );
}

Index.layout = (page) => <AuthenticatedLayout header={null}>{page}</AuthenticatedLayout>;
