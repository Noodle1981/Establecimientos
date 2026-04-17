import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import debounce from 'lodash/debounce';

// Register ChartJS components
ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title
);

export default function Dashboard({ filters, options, chartData }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [localFilters, setLocalFilters] = useState(filters);
    const [isUpdating, setIsUpdating] = useState(false);

    // Color Palette
    const colors = {
        primary: '#FE8204',
        blue: '#3B82F6',
        green: '#10B981',
        multi: ['#FE8204', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'],
    };

    // Debounced Filter Update
    const applyFilters = useCallback(
        debounce((newFilters) => {
            setIsUpdating(true);
            router.get(route('administrativos.dashboard'), newFilters, {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsUpdating(false),
            });
        }, 300),
        []
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
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-black flex items-center gap-2">
                        <i className="fas fa-chart-area text-brand-orange"></i>
                        Panel de Control Administrativo
                    </h2>
                    <div className="flex gap-2">
                        {isUpdating && (
                            <span className="text-xs text-brand-orange font-bold animate-pulse">Sincronizando datos...</span>
                        )}
                        <button 
                            onClick={() => applyFilters(localFilters)}
                            className="bg-orange-50 text-brand-orange p-2 rounded-lg hover:bg-brand-orange hover:text-white transition-all shadow-sm"
                        >
                            <i className="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Panel Administrativo" />

            <div className="relative flex min-h-[calc(100vh-200px)]">
                {/* Sidebar Filtros */}
                <aside 
                    className={`absolute lg:relative z-40 transition-all duration-300 bg-white border rounded-2xl shadow-sm ${
                        sidebarOpen ? 'w-72 opacity-100 translate-x-0 ml-0 mr-6' : 'w-0 opacity-0 -translate-x-full overflow-hidden'
                    }`}
                    style={{ borderColor: '#FE8204' }}
                >
                    <div className="p-6 w-72">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b pb-2">Filtros Avanzados</h3>
                        
                        {/* Selector Ámbito */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-500 mb-2 block">Ámbito</label>
                            <div className="flex flex-col gap-2">
                                {['TODOS', 'PUBLICO', 'PRIVADO'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleFilterChange('ambito', opt)}
                                        className={`flex items-center justify-between p-3 rounded-xl transition-all border ${
                                            localFilters.ambito === opt 
                                                ? 'bg-orange-50 border-brand-orange text-brand-orange ring-1 ring-brand-orange' 
                                                : 'border-gray-100 hover:bg-gray-50 text-gray-600'
                                        }`}
                                    >
                                        <span className="text-sm font-bold capitalize">{opt.toLowerCase()}</span>
                                        {localFilters.ambito === opt && <i className="fas fa-check text-[10px]"></i>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selector Departamento */}
                        <FilterSelect 
                            label="Departamento" 
                            name="departamento"
                            value={localFilters.departamento} 
                            options={options.departamentos} 
                            onChange={(v) => handleFilterChange('departamento', v)} 
                            icon="fas fa-map-marker-alt"
                        />

                        {/* Selector Dirección de Área */}
                        <FilterSelect 
                            label="Dirección de Área" 
                            name="direccion_area"
                            value={localFilters.direccion_area} 
                            options={options.direcciones_area} 
                            onChange={(v) => handleFilterChange('direccion_area', v)} 
                            icon="fas fa-sitemap"
                        />

                        {/* Selector Nivel (solo si hay dirección) */}
                        {localFilters.direccion_area && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <FilterSelect 
                                    label="Desglose por Modalidad" 
                                    name="nivel_educativo"
                                    value={localFilters.nivel_educativo} 
                                    options={options.niveles_educativos} 
                                    onChange={(v) => handleFilterChange('nivel_educativo', v)} 
                                    icon="fas fa-graduation-cap"
                                    highlight={true}
                                />
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Dashboard Content */}
                <div className="flex-1 transition-all duration-300">
                    {/* Toggle Button for Desktop */}
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`hidden lg:flex absolute top-0 -left-3 z-50 bg-white border shadow-md w-8 h-8 rounded-full items-center justify-center text-brand-orange hover:scale-110 transition-all ${sidebarOpen ? 'rotate-0' : 'rotate-180 translate-x-3'}`}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    {/* Stats Header */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <KPICard title="Establecimientos" value={chartData.stats.total_establecimientos} icon="fas fa-building" color="brand-orange" />
                        <KPICard title="Modalidades" value={chartData.stats.total_modalidades} icon="fas fa-graduation-cap" color="blue" />
                        <KPICard title="Edificios" value={chartData.stats.total_edificios} icon="fas fa-school" color="gray" />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ChartWrapper title="Modalidades Educativas">
                            <Doughnut 
                                data={{
                                    labels: chartData.modalidades.labels,
                                    datasets: [{
                                        data: chartData.modalidades.values,
                                        backgroundColor: colors.multi,
                                        borderWidth: 0,
                                        cutout: '75%',
                                    }]
                                }}
                                options={{
                                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } } } },
                                    maintainAspectRatio: false
                                }}
                            />
                        </ChartWrapper>

                        <ChartWrapper title="Principales Categorías">
                            <Bar 
                                data={{
                                    labels: chartData.categorias.labels,
                                    datasets: [{
                                        label: 'Total',
                                        data: chartData.categorias.values,
                                        backgroundColor: colors.primary,
                                        borderRadius: 8,
                                    }]
                                }}
                                options={{
                                    indexAxis: 'y',
                                    plugins: { legend: { display: false } },
                                    scales: { x: { grid: { display: false } }, y: { grid: { display: false } } },
                                    maintainAspectRatio: false
                                }}
                            />
                        </ChartWrapper>

                        <ChartWrapper title="Zonas Administrativas">
                            <Bar 
                                data={{
                                    labels: chartData.zonas.labels,
                                    datasets: [{
                                        label: 'Cant.',
                                        data: chartData.zonas.values,
                                        backgroundColor: colors.blue,
                                        borderRadius: 8,
                                    }]
                                }}
                                options={{
                                    plugins: { legend: { display: false } },
                                    scales: { x: { grid: { display: false } }, y: { grid: { display: false } } },
                                    maintainAspectRatio: false
                                }}
                            />
                        </ChartWrapper>

                        <ChartWrapper title="Distribución por Radio" className="lg:col-span-2">
                             <Bar 
                                data={{
                                    labels: chartData.radios.labels,
                                    datasets: [{
                                        label: 'Modalidades',
                                        data: chartData.radios.values,
                                        backgroundColor: colors.multi,
                                        borderRadius: 5,
                                    }]
                                }}
                                options={{
                                    plugins: { legend: { display: false } },
                                    scales: { x: { grid: { display: false } }, y: { grid: { display: false } } },
                                    maintainAspectRatio: false
                                }}
                            />
                        </ChartWrapper>

                        <ChartWrapper title="Ámbito Escolar">
                            <Doughnut 
                                data={{
                                    labels: chartData.ambito.labels,
                                    datasets: [{
                                        data: chartData.ambito.values,
                                        backgroundColor: [colors.primary, colors.blue],
                                        borderWidth: 0,
                                        cutout: '75%',
                                    }]
                                }}
                                options={{
                                    plugins: { legend: { position: 'bottom' } },
                                    maintainAspectRatio: false
                                }}
                            />
                        </ChartWrapper>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function FilterSelect({ label, name, value, options, onChange, icon, highlight = false }) {
    return (
        <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 mb-2 block">{label}</label>
            <div className="relative">
                <select 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full appearance-none border text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:border-brand-orange font-bold text-sm transition-colors ${
                        highlight ? 'bg-orange-50 border-brand-orange text-brand-orange' : 'bg-gray-50 border-gray-100 hover:border-gray-300'
                    }`}
                >
                    <option value="">Todos/as</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${highlight ? 'text-brand-orange' : 'text-gray-400'}`}>
                    <i className={icon}></i>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, icon, color }) {
    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between group">
            <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h4>
                <p className="text-3xl font-black text-gray-900">{value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                color === 'brand-orange' ? 'bg-orange-50 text-brand-orange' : 
                color === 'blue' ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-400'
            }`}>
                <i className={icon}></i>
            </div>
        </div>
    );
}

function ChartWrapper({ title, children, className = '' }) {
    return (
        <div className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col min-h-[300px] ${className}`}>
            <h3 className="font-bold text-gray-800 text-xs uppercase mb-4 flex items-center gap-2">
                <div className="w-1 h-3 bg-brand-orange rounded-full"></div>
                {title}
            </h3>
            <div className="flex-1 relative">
                {children}
            </div>
        </div>
    );
}
