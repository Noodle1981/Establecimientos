import Modal from '@/Components/Modal';
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

// Register ChartJS components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
);

export default function Dashboard({ filters, options, chartData }) {
    const [showFilters, setShowFilters] = useState(true);
    const [modalChart, setModalChart] = useState(null);
    const [localFilters, setLocalFilters] = useState(filters);
    const [isUpdating, setIsUpdating] = useState(false);

    // Color Palette
    const colors = {
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
        // Reset sub-filters if needed
        if (key === 'ambito') nextFilters.direccion_area = '';
        if (key === 'direccion_area') nextFilters.nivel_educativo = '';

        setLocalFilters(nextFilters);
        applyFilters(nextFilters);
    };

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Estadísticas" />

            {/* Float sync indicator if needed, but remove the static header block */}
            {isUpdating && (
                <div className="fixed right-10 top-20 z-50 flex animate-bounce items-center gap-2 rounded-full bg-brand-orange px-4 py-2 text-[10px] font-black uppercase text-white shadow-lg">
                    <i className="fas fa-sync-alt fa-spin"></i>
                    Sincronizando...
                </div>
            )}

            <div className="flex flex-col gap-4">
                {/* Horizontal Filter Bar */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300">
                    <div className="flex items-center justify-between border-b border-gray-50 bg-gray-50/30 px-6 py-3">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-filter text-xs text-brand-orange"></i>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                Filtros de Análisis
                            </h3>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-orange transition hover:text-orange-600"
                        >
                            {showFilters
                                ? 'Ocultar Filtros'
                                : 'Mostrar Filtros'}
                            <i
                                className={`fas fa-chevron-${showFilters ? 'up' : 'down'}`}
                            ></i>
                        </button>
                    </div>

                    {showFilters && (
                        <div className="animate-in fade-in slide-in-from-top-2 p-4 duration-300">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                {/* Ámbito */}
                                <div className="space-y-1.5">
                                    <label className="ml-1 text-[10px] font-bold uppercase text-gray-400">
                                        Ámbito
                                    </label>
                                    <div className="flex gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1">
                                        {['TODOS', 'PUBLICO', 'PRIVADO'].map(
                                            (opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() =>
                                                        handleFilterChange(
                                                            'ambito',
                                                            opt,
                                                        )
                                                    }
                                                    className={`flex-1 rounded-lg px-2 py-1.5 text-[10px] font-bold transition-all ${
                                                        localFilters.ambito ===
                                                        opt
                                                            ? 'border border-orange-100 bg-white text-brand-orange shadow-sm'
                                                            : 'text-gray-400 hover:text-gray-600'
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Departamento */}
                                <div className="space-y-1.5">
                                    <FilterSelect
                                        label="Departamento"
                                        name="departamento"
                                        value={localFilters.departamento}
                                        options={options.departamentos}
                                        onChange={(v) =>
                                            handleFilterChange(
                                                'departamento',
                                                v,
                                            )
                                        }
                                        icon="fas fa-map-marker-alt"
                                        compact={true}
                                    />
                                </div>

                                {/* Dirección de Área */}
                                <div className="space-y-1.5">
                                    <FilterSelect
                                        label="Dirección de Área"
                                        name="direccion_area"
                                        value={localFilters.direccion_area}
                                        options={options.direcciones_area}
                                        onChange={(v) =>
                                            handleFilterChange(
                                                'direccion_area',
                                                v,
                                            )
                                        }
                                        icon="fas fa-sitemap"
                                        compact={true}
                                    />
                                </div>

                                {/* Nivel (solo si hay dirección) */}
                                <div className="space-y-1.5">
                                    <FilterSelect
                                        label="Modalidad"
                                        name="nivel_educativo"
                                        value={localFilters.nivel_educativo}
                                        options={options.niveles_educativos}
                                        onChange={(v) =>
                                            handleFilterChange(
                                                'nivel_educativo',
                                                v,
                                            )
                                        }
                                        icon="fas fa-graduation-cap"
                                        highlight={
                                            !!localFilters.direccion_area
                                        }
                                        disabled={!localFilters.direccion_area}
                                        compact={true}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                                            backgroundColor: colors.multi,
                                            borderWidth: 2,
                                        },
                                    ],
                                },
                            })
                        }
                    >
                        <Doughnut
                            data={{
                                labels: chartData.modalidades.labels,
                                datasets: [
                                    {
                                        data: chartData.modalidades.values,
                                        backgroundColor: colors.multi,
                                        borderWidth: 0,
                                        cutout: '75%',
                                    },
                                ],
                            }}
                            options={{
                                plugins: { legend: { display: false } },
                                maintainAspectRatio: false,
                            }}
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
                                            backgroundColor: colors.primary,
                                            borderRadius: 8,
                                        },
                                    ],
                                },
                            })
                        }
                    >
                        <Bar
                            data={{
                                labels: chartData.categorias.labels,
                                datasets: [
                                    {
                                        label: 'Total',
                                        data: chartData.categorias.values,
                                        backgroundColor: colors.primary,
                                        borderRadius: 4,
                                    },
                                ],
                            }}
                            options={{
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
                            }}
                        />
                    </ChartWrapper>

                    <ChartWrapper
                        title="Zonas"
                        className={
                            localFilters.ambito !== 'TODOS'
                                ? 'sm:col-span-2 lg:col-span-1 xl:col-span-2'
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
                                            backgroundColor: colors.blue,
                                            borderRadius: 8,
                                        },
                                    ],
                                },
                            })
                        }
                    >
                        <Bar
                            data={{
                                labels: chartData.zonas.labels,
                                datasets: [
                                    {
                                        label: 'Cant.',
                                        data: chartData.zonas.values,
                                        backgroundColor: colors.blue,
                                        borderRadius: 4,
                                    },
                                ],
                            }}
                            options={{
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: {
                                        grid: { display: false },
                                        ticks: { font: { size: 9 } },
                                    },
                                    y: { display: false },
                                },
                                maintainAspectRatio: false,
                            }}
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
                                                    colors.primary,
                                                    colors.blue,
                                                ],
                                                borderWidth: 2,
                                            },
                                        ],
                                    },
                                })
                            }
                        >
                            <Doughnut
                                data={{
                                    labels: chartData.ambito.labels,
                                    datasets: [
                                        {
                                            data: chartData.ambito.values,
                                            backgroundColor: [
                                                colors.primary,
                                                colors.blue,
                                            ],
                                            borderWidth: 0,
                                            cutout: '75%',
                                        },
                                    ],
                                }}
                                options={{
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
                                }}
                            />
                        </ChartWrapper>
                    )}

                    <ChartWrapper
                        title="Distribución por Radio"
                        className="sm:col-span-2 lg:col-span-3 xl:col-span-4"
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
                                            backgroundColor: colors.multi,
                                            borderRadius: 5,
                                        },
                                    ],
                                },
                            })
                        }
                    >
                        <Bar
                            data={{
                                labels: chartData.radios.labels,
                                datasets: [
                                    {
                                        label: 'Modalidades',
                                        data: chartData.radios.values,
                                        backgroundColor: colors.multi,
                                        borderRadius: 3,
                                    },
                                ],
                            }}
                            options={{
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
                            }}
                        />
                    </ChartWrapper>
                </div>
            </div>

            {/* Chart Zoom Modal */}
            <Modal
                show={!!modalChart}
                onClose={() => setModalChart(null)}
                maxWidth="4xl"
            >
                {modalChart && (
                    <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <div className="mb-8 flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-6 w-2 rounded-full bg-brand-orange"></div>
                                <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">
                                    {modalChart.title}
                                </h2>
                            </div>
                            <button
                                onClick={() => setModalChart(null)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-500"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="h-[500px] w-full">
                            {modalChart.type === 'doughnut' ? (
                                <Doughnut
                                    data={modalChart.data}
                                    options={{
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                                labels: {
                                                    boxWidth: 15,
                                                    font: {
                                                        size: 12,
                                                        weight: 'bold',
                                                    },
                                                    padding: 20,
                                                },
                                            },
                                            tooltip: {
                                                padding: 15,
                                                titleFont: {
                                                    size: 14,
                                                    weight: 'black',
                                                },
                                                bodyFont: { size: 13 },
                                            },
                                        },
                                        maintainAspectRatio: false,
                                    }}
                                />
                            ) : (
                                <Bar
                                    data={modalChart.data}
                                    options={{
                                        indexAxis: modalChart.horizontal
                                            ? 'y'
                                            : 'x',
                                        plugins: {
                                            legend: {
                                                display: true,
                                                position: 'top',
                                                labels: {
                                                    font: {
                                                        size: 12,
                                                        weight: 'bold',
                                                    },
                                                },
                                            },
                                            tooltip: {
                                                padding: 15,
                                                titleFont: {
                                                    size: 14,
                                                    weight: 'black',
                                                },
                                                bodyFont: { size: 13 },
                                            },
                                        },
                                        scales: {
                                            x: {
                                                grid: { display: false },
                                                ticks: {
                                                    font: {
                                                        size: 11,
                                                        weight: 'bold',
                                                    },
                                                },
                                            },
                                            y: {
                                                grid: { color: '#f3f4f6' },
                                                ticks: { font: { size: 11 } },
                                            },
                                        },
                                        maintainAspectRatio: false,
                                    }}
                                />
                            )}
                        </div>

                        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-orange-100 bg-orange-50/50 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-orange shadow-sm">
                                <i className="fas fa-info-circle"></i>
                            </div>
                            <p className="text-xs font-bold leading-relaxed text-gray-600">
                                Esta vista detallada muestra los valores exactos
                                y leyendas completas. Puedes usar los filtros
                                del panel principal para actualizar los datos de
                                este gráfico en tiempo real.
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}

function FilterSelect({
    label,
    value,
    options,
    onChange,
    icon,
    highlight = false,
    compact = false,
    disabled = false,
}) {
    return (
        <div className={compact ? '' : 'mb-4'}>
            <label className="mb-1 ml-1 block text-[10px] font-bold uppercase text-gray-400">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`w-full appearance-none rounded-xl border px-3 py-2 pr-8 text-[11px] font-bold transition-colors focus:border-brand-orange focus:outline-none ${
                        disabled
                            ? 'cursor-not-allowed border-gray-100 bg-gray-100 text-gray-300'
                            : highlight
                              ? 'border-brand-orange bg-orange-50 text-brand-orange'
                              : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <option value="">Todos/as</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <div
                    className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${highlight ? 'text-brand-orange' : 'text-gray-400'}`}
                >
                    <i className={`${icon} text-[10px]`}></i>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, icon, color }) {
    return (
        <div className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-black/40">
                    {title}
                </h4>
                <p className="text-2xl font-black text-black">{value}</p>
            </div>
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-base shadow-sm ${
                    color === 'brand-orange'
                        ? 'bg-orange-50 text-brand-orange'
                        : color === 'blue'
                          ? 'bg-blue-50 text-blue-500'
                          : 'bg-gray-50 text-gray-400'
                }`}
            >
                <i className={icon}></i>
            </div>
        </div>
    );
}

function ChartWrapper({ title, children, className = '', onZoom }) {
    return (
        <div
            onClick={onZoom}
            className={`group relative flex min-h-[220px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-brand-orange hover:shadow-lg ${className}`}
        >
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-brand-orange shadow-sm">
                    <i className="fas fa-search-plus text-[10px]"></i>
                </div>
            </div>
            <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase text-gray-800">
                <div className="h-2 w-1 rounded-full bg-brand-orange"></div>
                {title}
            </h3>
            <div className="relative flex-1">{children}</div>
        </div>
    );
}
