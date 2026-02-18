<div class="relative w-full h-full overflow-hidden bg-gray-50" x-data="{ sidebarOpen: true }">
    
    <!-- Sidebar (Filtros) -->
    <div class="absolute top-0 left-0 h-full w-72 z-20 glass-strong shadow-2xl transition-transform duration-300 flex flex-col"
         :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
        
        <!-- Header Sidebar -->
        <div class="p-6 border-b border-gray-200 bg-white bg-opacity-50">
            <h2 class="text-xl font-black text-gray-900 flex items-center gap-2">
                <i class="fas fa-sliders-h text-orange-500"></i>
                Panel de Control
            </h2>
            <p class="text-xs text-gray-500 mt-1">Configuración de vistas</p>
        </div>

        <!-- Filtros -->
        <div class="p-6 flex-1 overflow-y-auto">
            
            <!-- Filtro Departamento -->
            <div class="mb-6">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filtrar por Departamento</h3>
                <div class="relative">
                    <select wire:model.live="departamento" 
                            class="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:bg-white focus:border-orange-500 font-bold text-sm">
                        <option value="">Todos los Departamentos</option>
                        @foreach($departamentos as $dep)
                            <option value="{{ $dep }}">{{ $dep }}</option>
                        @endforeach
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                </div>
            </div>

            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Filtrar por Ámbito</h3>
            
            <div class="space-y-3">
                <button wire:click="$set('ambito', 'TODOS')" 
                        class="w-full flex items-center justify-between p-3 rounded-xl transition-all group {{ $ambito === 'TODOS' ? 'bg-orange-50 ring-2 ring-orange-500 shadow-sm' : 'hover:bg-gray-100' }}">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center {{ $ambito === 'TODOS' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300' }}">
                            <i class="fas fa-globe"></i>
                        </div>
                        <span class="text-sm font-bold {{ $ambito === 'TODOS' ? 'text-gray-900' : 'text-gray-600' }}">General</span>
                    </div>
                    @if($ambito === 'TODOS') <i class="fas fa-check text-orange-500 text-xs"></i> @endif
                </button>

                <button wire:click="$set('ambito', 'PUBLICO')" 
                        class="w-full flex items-center justify-between p-3 rounded-xl transition-all group {{ $ambito === 'PUBLICO' ? 'bg-orange-50 ring-2 ring-orange-500 shadow-sm' : 'hover:bg-gray-100' }}">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center {{ $ambito === 'PUBLICO' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300' }}">
                            <i class="fas fa-school"></i>
                        </div>
                        <span class="text-sm font-bold {{ $ambito === 'PUBLICO' ? 'text-gray-900' : 'text-gray-600' }}">Público</span>
                    </div>
                    @if($ambito === 'PUBLICO') <i class="fas fa-check text-orange-500 text-xs"></i> @endif
                </button>

                <button wire:click="$set('ambito', 'PRIVADO')" 
                        class="w-full flex items-center justify-between p-3 rounded-xl transition-all group {{ $ambito === 'PRIVADO' ? 'bg-blue-50 ring-2 ring-blue-500 shadow-sm' : 'hover:bg-gray-100' }}">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center {{ $ambito === 'PRIVADO' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300' }}">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <span class="text-sm font-bold {{ $ambito === 'PRIVADO' ? 'text-gray-900' : 'text-gray-600' }}">Privado</span>
                    </div>
                    @if($ambito === 'PRIVADO') <i class="fas fa-check text-blue-500 text-xs"></i> @endif
                </button>
            </div>




        </div>

        <!-- Footer Sidebar -->
        <div class="p-4 border-t border-gray-200 bg-gray-50 text-center">
            <p class="text-[10px] text-gray-400">Sistema de Gestión Educativa</p>
        </div>
    </div>

    <!-- Toggle Button -->
    <button @click="sidebarOpen = !sidebarOpen"
            class="absolute top-4 z-30 transition-all duration-300 glass-strong rounded-full p-2 shadow-lg hover:scale-110 border border-gray-200 group"
            :class="sidebarOpen ? 'left-[17rem]' : 'left-4'"> <!-- Ajustado a la izquierda del sidebar -->
        <svg class="w-5 h-5 transition-transform duration-300 text-gray-600 group-hover:text-orange-500" 
             :class="sidebarOpen ? 'rotate-0' : 'rotate-180'"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
    </button>

    <!-- Main Content (Gráficos) -->
    <div class="absolute inset-0 z-0 overflow-y-auto scroll-smooth transition-all duration-300"
         :class="sidebarOpen ? 'pl-72' : 'pl-0'">
        
        <div class="pt-4 px-6 pb-6 max-w-7xl mx-auto">




            <!-- Gráficos Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Modalidades -->
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] hover:shadow-[0_8px_30px_rgb(255,160,0,0.15)] transition-shadow duration-300">
                    <h3 class="font-bold text-gray-800 text-xs uppercase mb-2">Modalidades Educativas</h3>
                    <div class="h-48 relative w-full">
                        <canvas id="chartModalidades"></canvas>
                    </div>
                </div>

                <!-- Categorías -->
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] hover:shadow-[0_8px_30px_rgb(255,160,0,0.15)] transition-shadow duration-300">
                    <h3 class="font-bold text-gray-800 text-xs uppercase mb-2">Categorías</h3>
                    <div class="h-48 relative w-full">
                        <canvas id="chartCategorias"></canvas>
                    </div>
                </div>

                <!-- Zonas -->
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] hover:shadow-[0_8px_30px_rgb(255,160,0,0.15)] transition-shadow duration-300 {{ $ambito !== 'TODOS' ? 'lg:row-span-2' : '' }}">
                    <h3 class="font-bold text-gray-800 text-xs uppercase mb-2">Por Departamento</h3>
                    <div class="relative w-full {{ $ambito !== 'TODOS' ? 'h-[28rem]' : 'h-48' }}">
                        <canvas id="chartZonas"></canvas>
                    </div>
                </div>

                <!-- Radios (Bar) -->
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] hover:shadow-[0_8px_30px_rgb(255,160,0,0.15)] transition-shadow duration-300 lg:col-span-2">
                    <h3 class="font-bold text-gray-800 text-xs uppercase mb-2">Distribución por Radio</h3>
                    <div class="h-48 relative w-full">
                        <canvas id="chartRadios"></canvas>
                    </div>
                </div>

                <!-- Ámbito -->
                @if($ambito === 'TODOS')
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] hover:shadow-[0_8px_30px_rgb(255,160,0,0.15)] transition-shadow duration-300">
                    <h3 class="font-bold text-gray-800 text-xs uppercase mb-2">Público vs Privado</h3>
                    <div class="h-48 relative w-full">
                        <canvas id="chartAmbito"></canvas>
                    </div>
                </div>
                @endif
            </div>

            <!-- KPIs Summary List (Horizontal) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <!-- Establecimientos -->
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] hover:shadow-[0_8px_30px_rgb(255,160,0,0.15)] transition-shadow duration-300 flex items-center justify-between">
                    <div>
                        <h3 class="font-bold text-gray-500 text-[10px] uppercase mb-1">Establecimientos</h3>
                        <p class="text-3xl font-black text-gray-800">{{ $chartData['stats']['total_establecimientos'] }}</p>
                        <p class="text-xs font-bold text-green-500 mt-0.5">Activos</p>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                        <i class="fas fa-building text-2xl"></i>
                    </div>
                </div>

                <!-- Modalidades -->
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] hover:shadow-[0_8px_30px_rgb(255,160,0,0.15)] transition-shadow duration-300 flex items-center justify-between">
                    <div>
                        <h3 class="font-bold text-gray-500 text-[10px] uppercase mb-1">Modalidades</h3>
                        <p class="text-3xl font-black text-gray-800">{{ $chartData['stats']['total_modalidades'] }}</p>
                        <p class="text-xs font-bold text-blue-500 mt-0.5">Ofertas</p>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm">
                        <i class="fas fa-graduation-cap text-2xl"></i>
                    </div>
                </div>

                <!-- Infraestructura -->
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] hover:shadow-[0_8px_30px_rgb(255,160,0,0.15)] transition-shadow duration-300 flex items-center justify-between">
                    <div>
                        <h3 class="font-bold text-gray-500 text-[10px] uppercase mb-1">Infraestructura</h3>
                        <p class="text-3xl font-black text-gray-800">{{ $chartData['stats']['total_edificios'] }}</p>
                        <p class="text-xs font-bold text-gray-500 mt-0.5">Edificios</p>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 shadow-sm">
                        <i class="fas fa-school text-2xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="h-12"></div> <!-- Spacer footer -->
        </div>
    </div>
</div>

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        let charts = {};
        const colors = {
            primary: '#FF8200', 
            secondary: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
            multi: ['#FF8200', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'],
        };

        const initCharts = (data) => {
            Object.values(charts).forEach(chart => chart.destroy());
            
            Chart.defaults.font.family = "'Inter', sans-serif";
            Chart.defaults.color = '#6B7280';

            // Chart 1: Modalidades
            const ctxModalidades = document.getElementById('chartModalidades');
            if (ctxModalidades) {
                charts.modalidades = new Chart(ctxModalidades, {
                    type: 'doughnut',
                    data: {
                        labels: data.modalidades.labels,
                        datasets: [{
                            data: data.modalidades.values,
                            backgroundColor: colors.multi,
                            borderWidth: 0,
                            hoverOffset: 10
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '75%',
                        plugins: {
                            legend: { position: 'right', labels: { boxWidth: 10, usePointStyle: true, font: { size: 10 } } }
                        },
                        layout: { padding: 10 }
                    }
                });
            }

            // Chart 2: Categorías
            const ctxCategorias = document.getElementById('chartCategorias');
            if (ctxCategorias) {
                charts.categorias = new Chart(ctxCategorias, {
                    type: 'bar',
                    data: {
                        labels: data.categorias.labels,
                        datasets: [{
                            label: 'Cant.',
                            data: data.categorias.values,
                            backgroundColor: colors.primary,
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { 
                            y: { beginAtZero: true, grid: { borderDash: [4, 4], color: '#f3f4f6' }, border: { display: false } }, 
                            x: { grid: { display: false }, border: { display: false } } 
                        }
                    }
                });
            }

            // Chart 3: Zonas
            const ctxZonas = document.getElementById('chartZonas');
            if (ctxZonas) {
                charts.zonas = new Chart(ctxZonas, {
                    type: 'bar',
                    data: {
                        labels: data.zonas.labels,
                        datasets: [{
                            label: 'Establecimientos',
                            data: data.zonas.values,
                            backgroundColor: '#3B82F6',
                            borderRadius: 6
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { 
                            x: { beginAtZero: true, grid: { borderDash: [4, 4], color: '#f3f4f6' }, border: { display: false } }, 
                            y: { grid: { display: false }, border: { display: false } } 
                        }
                    }
                });
            }

            // Chart 4: Radios
            const ctxRadios = document.getElementById('chartRadios');
            if (ctxRadios) {
                charts.radios = new Chart(ctxRadios, {
                    type: 'bar',
                    data: {
                        labels: data.radios.labels,
                        datasets: [{
                            label: 'Establecimientos',
                            data: data.radios.values,
                            backgroundColor: colors.multi,
                            borderRadius: 6,
                            barPercentage: 0.6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { 
                            y: { beginAtZero: true, grid: { borderDash: [4, 4], color: '#f3f4f6' }, border: { display: false } }, 
                            x: { grid: { display: false }, border: { display: false } } 
                        }
                    }
                });
            }

            // Chart 5: Ámbito (Solo si existe)
            const ctxAmbito = document.getElementById('chartAmbito');
            if (ctxAmbito) {
                charts.ambito = new Chart(ctxAmbito, {
                    type: 'doughnut',
                    data: {
                        labels: data.ambito.labels,
                        datasets: [{
                            data: data.ambito.values,
                            backgroundColor: [colors.primary, '#3B82F6'],
                            borderWidth: 0,
                            hoverOffset: 10
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '75%',
                        plugins: {
                            legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 11, weight: 'bold' } } }
                        },
                        layout: { padding: 10 }
                    }
                });
            }
        };

        initCharts(@json($chartData));

        Livewire.on('update-charts', (data) => {
            const newData = Array.isArray(data) ? data[0] : data;
            initCharts(newData);
        });
    });
</script>
@endpush
