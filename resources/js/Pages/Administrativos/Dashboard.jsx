import KPICard from '@/Components/KPICard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import debounce from 'lodash/debounce';
import { useMemo, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import ChartWrapper from './DashboardPartials/ChartWrapper';
import ChartZoomModal from './DashboardPartials/ChartZoomModal';
import DashboardFilters from './DashboardPartials/DashboardFilters';

// Register ChartJS components once at module level
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
);

// Hoisted static color palette (rendering-hoist-jsx)
const COLORS = {
    primary: '#FE8204',
    blue: '#3B82F6',
    green: '#10B981',
    multi: [
        '#FE8204',
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444',
        '#8B5CF6',
        '#EC4899',
        '#14B8A6',
    ],
};

// Hoisted static ChartJS options (rendering-hoist-jsx)
const DOUGHNUT_NO_LEGEND_OPTIONS = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
};

const CATEGORIAS_BAR_OPTIONS = {
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
        x: { display: false },
        y: {
            grid: { display: false },
            ticks: { font: { size: 9 } },
        },
    },
    maintainAspectRatio: false,
};

const ZONAS_BAR_OPTIONS = {
    plugins: { legend: { display: false } },
    scales: {
        x: {
            grid: { display: false },
            ticks: { font: { size: 9 } },
        },
        y: { display: false },
    },
    maintainAspectRatio: false,
};

const AMBITO_DOUGHNUT_OPTIONS = {
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                boxWidth: 8,
                font: { size: 9 },
            },
        },
    },
    maintainAspectRatio: false,
};

const RADIOS_BAR_OPTIONS = {
    plugins: { legend: { display: false } },
    scales: {
        x: {
            grid: { display: false },
            ticks: { font: { size: 8 } },
        },
        y: {
            grid: { display: false },
            ticks: { font: { size: 8 } },
        },
    },
    maintainAspectRatio: false,
};

export default function Dashboard({ filters, options, chartData }) {
    const [showFilters, setShowFilters] = useState(true);
    const [modalChart, setModalChart] = useState(null);
    const [localFilters, setLocalFilters] = useState(filters);
    const [isUpdating, setIsUpdating] = useState(false);

    // Debounced Filter Update
    const applyFilters = useMemo(
        () =>
            debounce((newFilters) => {
                setIsUpdating(true);
                router.get(route('administrativos.dashboard'), newFilters, {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setIsUpdating(false),
                });
            }, 300),
        [],
    );

    const handleFilterChange = (key, value) => {
        const nextFilters = { ...localFilters, [key]: value };
        if (key === 'ambito') nextFilters.direccion_area = '';
        if (key === 'direccion_area') nextFilters.nivel_educativo = '';

        setLocalFilters(nextFilters);
        applyFilters(nextFilters);
    };

    // Memoize chart data payloads to prevent canvas re-renders on local state changes
    const modalidadesData = useMemo(
        () => ({
            labels: chartData.modalidades.labels,
            datasets: [
                {
                    data: chartData.modalidades.values,
                    backgroundColor: COLORS.multi,
                    borderWidth: 0,
                    cutout: '75%',
                },
            ],
        }),
        [chartData.modalidades],
    );

    const categoriasData = useMemo(
        () => ({
            labels: chartData.categorias.labels,
            datasets: [
                {
                    label: 'Total',
                    data: chartData.categorias.values,
                    backgroundColor: COLORS.primary,
                    borderRadius: 4,
                },
            ],
        }),
        [chartData.categorias],
    );

    const zonasData = useMemo(
        () => ({
            labels: chartData.zonas.labels,
            datasets: [
                {
                    label: 'Cant.',
                    data: chartData.zonas.values,
                    backgroundColor: COLORS.blue,
                    borderRadius: 4,
                },
            ],
        }),
        [chartData.zonas],
    );

    const ambitoData = useMemo(
        () => ({
            labels: chartData.ambito.labels,
            datasets: [
                {
                    data: chartData.ambito.values,
                    backgroundColor: [COLORS.primary, COLORS.blue],
                    borderWidth: 0,
                    cutout: '75%',
                },
            ],
        }),
        [chartData.ambito],
    );

    const radiosData = useMemo(
        () => ({
            labels: chartData.radios.labels,
            datasets: [
                {
                    label: 'Modalidades',
                    data: chartData.radios.values,
                    backgroundColor: COLORS.multi,
                    borderRadius: 3,
                },
            ],
        }),
        [chartData.radios],
    );

    return (
        <>
            <Head title="Estadísticas" />

            {/* Sync Indicator */}
            {isUpdating && (
                <div className="fixed right-10 top-20 z-50 flex animate-bounce items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-[10px] font-black uppercase text-white shadow-lg">
                    <i className="fas fa-sync-alt fa-spin"></i>
                    Sincronizando...
                </div>
            )}

            <div className="flex flex-col gap-4">
                {/* Horizontal Filter Bar */}
                <DashboardFilters
                    showFilters={showFilters}
                    onToggleShowFilters={() => setShowFilters(!showFilters)}
                    localFilters={localFilters}
                    options={options}
                    onFilterChange={handleFilterChange}
                />

                {/* Stats Header */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <KPICard
                        title="Establecimientos"
                        value={chartData.stats.total_establecimientos}
                        icon="fas fa-building"
                        color="brand-orange"
                    />
                    <KPICard
                        title="Modalidades"
                        value={chartData.stats.total_modalidades}
                        icon="fas fa-graduation-cap"
                        color="blue"
                    />
                    <KPICard
                        title="Edificios"
                        value={chartData.stats.total_edificios}
                        icon="fas fa-school"
                        color="gray"
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <ChartWrapper
                        title="Modalidades Educativas"
                        onZoom={() =>
                            setModalChart({
                                title: 'Distribución de Modalidades Educativas',
                                type: 'doughnut',
                                data: {
                                    labels: chartData.modalidades.labels,
                                    datasets: [
                                        {
                                            data: chartData.modalidades.values,
                                            backgroundColor: COLORS.multi,
                                            borderWidth: 2,
                                        },
                                    ],
                                },
                            })
                        }
                    >
                        <Doughnut
                            data={modalidadesData}
                            options={DOUGHNUT_NO_LEGEND_OPTIONS}
                        />
                    </ChartWrapper>

                    <ChartWrapper
                        title="Categorías"
                        onZoom={() =>
                            setModalChart({
                                title: 'Análisis por Categoría',
                                type: 'bar',
                                horizontal: true,
                                data: {
                                    labels: chartData.categorias.labels,
                                    datasets: [
                                        {
                                            label: 'Total de Establecimientos',
                                            data: chartData.categorias.values,
                                            backgroundColor: COLORS.primary,
                                            borderRadius: 8,
                                        },
                                    ],
                                },
                            })
                        }
                    >
                        <Bar
                            data={categoriasData}
                            options={CATEGORIAS_BAR_OPTIONS}
                        />
                    </ChartWrapper>

                    <ChartWrapper
                        title="Zonas"
                        className={
                            localFilters.ambito !== 'TODOS'
                                ? 'lg:col-span-2'
                                : ''
                        }
                        onZoom={() =>
                            setModalChart({
                                title: 'Estadísticas por Zona Administrativa',
                                type: 'bar',
                                data: {
                                    labels: chartData.zonas.labels,
                                    datasets: [
                                        {
                                            label: 'Cantidad',
                                            data: chartData.zonas.values,
                                            backgroundColor: COLORS.blue,
                                            borderRadius: 8,
                                        },
                                    ],
                                },
                            })
                        }
                    >
                        <Bar
                            data={zonasData}
                            options={ZONAS_BAR_OPTIONS}
                        />
                    </ChartWrapper>

                    {localFilters.ambito === 'TODOS' && (
                        <ChartWrapper
                            title="Ámbito Escolar"
                            onZoom={() =>
                                setModalChart({
                                    title: 'Distribución por Ámbito',
                                    type: 'doughnut',
                                    data: {
                                        labels: chartData.ambito.labels,
                                        datasets: [
                                            {
                                                data: chartData.ambito.values,
                                                backgroundColor: [
                                                    COLORS.primary,
                                                    COLORS.blue,
                                                ],
                                                borderWidth: 2,
                                            },
                                        ],
                                    },
                                })
                            }
                        >
                            <Doughnut
                                data={ambitoData}
                                options={AMBITO_DOUGHNUT_OPTIONS}
                            />
                        </ChartWrapper>
                    )}

                    <ChartWrapper
                        title="Distribución por Radio"
                        className="lg:col-span-4"
                        onZoom={() =>
                            setModalChart({
                                title: 'Modalidades por Radio de Ubicación',
                                type: 'bar',
                                data: {
                                    labels: chartData.radios.labels,
                                    datasets: [
                                        {
                                            label: 'Total Modalidades',
                                            data: chartData.radios.values,
                                            backgroundColor: COLORS.multi,
                                            borderRadius: 5,
                                        },
                                    ],
                                },
                            })
                        }
                    >
                        <Bar
                            data={radiosData}
                            options={RADIOS_BAR_OPTIONS}
                        />
                    </ChartWrapper>
                </div>
            </div>

            {/* Chart Zoom Modal */}
            <ChartZoomModal
                modalChart={modalChart}
                onClose={() => setModalChart(null)}
            />
        </>
    );
}

Dashboard.layout = (page) => (
    <AuthenticatedLayout header={null}>{page}</AuthenticatedLayout>
);
