<div class="relative w-full h-full overflow-hidden bg-gray-50" 
     x-data="dashboardCharts(@js($chartData))" 
     wire:init="loadData">
    
    <!-- Background Processing Indicator (Subtle) -->
    <div wire:loading.delay.longest wire:target="loadData, refreshData, ambito, departamento, direccion_area, nivel_educativo" 
         class="absolute top-0 right-0 left-0 h-1 z-[100] bg-orange-100 overflow-hidden">
        <div class="h-full bg-orange-500 animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
    </div>

    <style>
        @keyframes loading-bar {
            0% { transform: translateX(-100%); width: 30%; }
            50% { transform: translateX(100%); width: 70%; }
            100% { transform: translateX(400%); width: 30%; }
        }
    </style>
    
    <!-- Sidebar (Filtros) -->
    <div class="absolute top-0 left-0 h-full w-72 z-20 glass-strong shadow-2xl transition-transform duration-300 flex flex-col"
         :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
        
        <!-- Header Sidebar -->
        <div class="p-6 border-b border-gray-200 bg-white bg-opacity-50 relative">
            <h2 class="text-xl font-black text-gray-900 flex items-center gap-2">
                <i class="fas fa-sliders-h text-orange-500"></i>
                Panel de Control
            </h2>
            <p class="text-xs text-gray-500 mt-1">Configuración de vistas</p>
            
            <!-- Botón de Refresco Manual -->
            <button wire:click="refreshData" 
                    id="btn-refresh-dashboard"
                    name="refresh-dashboard"
                    class="absolute top-6 right-6 p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-300 group shadow-sm"
                    title="Recargar datos">
                <i class="fas fa-sync-alt group-hover:rotate-180 transition-transform duration-500"></i>
            </button>
        </div>

        <!-- Filtros -->
        <div class="p-6 flex-1 overflow-y-auto">
            
            <!-- Filtro Departamento -->
            <div class="mb-4">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Filtrar por Departamento</h3>
                <div class="relative">
                    <select wire:model.live="departamento" 
                            id="select-departamento"
                            name="departamento"
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

            <!-- Filtro Dirección de Área -->
            <div class="mb-6">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Filtrar por Dirección de Área</h3>
                <div class="relative">
                    <select wire:model.live="direccion_area" 
                            id="select-direccion-area"
                            name="direccion_area"
                            class="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:bg-white focus:border-orange-500 font-bold text-sm">
                        <option value="">Todas las Direcciones</option>
                        @foreach($direcciones_area as $dir)
                            <option value="{{ $dir }}">{{ $dir }}</option>
                        @endforeach
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <i class="fas fa-sitemap"></i>
                    </div>
                </div>
            </div>

            <!-- Filtro Desglose por Modalidad -->
            @if(!empty($direccion_area))
            <div class="mb-6 animate-fade-in-down">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Desglose por Modalidad</h3>
                <div class="relative">
                    <select wire:model.live="nivel_educativo" 
                            id="select-nivel-educativo"
                            name="nivel_educativo"
                            class="w-full appearance-none bg-orange-50 border border-orange-200 text-orange-900 py-3 px-4 pr-8 rounded-xl focus:outline-none focus:bg-white focus:border-orange-500 font-bold text-sm">
                        <option value="">Todas las Modalidades ({{ $direccion_area }})</option>
                        @foreach($niveles_educativos as $niv)
                            <option value="{{ $niv }}">{{ $niv }}</option>
                        @endforeach
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-500">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                </div>
            </div>
            @endif

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
            id="btn-sidebar-toggle"
            name="sidebar-toggle"
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
                @php $chartsCards = [
                    ['title' => 'Modalidades Educativas', 'id' => 'chartModalidades'],
                    ['title' => 'Categorías', 'id' => 'chartCategorias'],
                    ['title' => 'Por Departamento', 'id' => 'chartZonas', 'span' => $ambito !== 'TODOS'],
                ]; @endphp

                @foreach($chartsCards as $card)
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] transition-all duration-300 {{ ($card['span'] ?? false) ? 'lg:row-span-2' : '' }}">
                    <h3 class="font-bold text-gray-800 text-xs uppercase mb-3 flex items-center gap-2">
                        <div class="w-1 h-3 bg-orange-500 rounded-full text-black"></div>
                        {{ $card['title'] }}
                    </h3>
                    
                    <div x-show="$wire.readyToLoad" 
                         class="relative w-full {{ ($card['span'] ?? false) ? 'h-[28rem]' : 'h-48' }} animate-fade-in text-black">
                        <canvas x-ref="{{ $card['id'] }}"></canvas>
                    </div>
                    
                    <div x-show="!$wire.readyToLoad" 
                         class="w-full flex flex-col gap-3 animate-pulse">
                        <div class="w-full {{ ($card['span'] ?? false) ? 'h-[28rem]' : 'h-48' }} bg-gray-50 rounded-xl"></div>
                    </div>
                </div>
                @endforeach

                <!-- Radios (Bar) -->
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] lg:col-span-2 transition-all">
                    <h3 class="font-bold text-gray-800 text-xs uppercase mb-3 flex items-center gap-2">
                        <div class="w-1 h-3 bg-blue-500 rounded-full"></div>
                        Distribución por Radio
                    </h3>
                    <div x-show="$wire.readyToLoad" 
                         class="h-48 relative w-full animate-fade-in text-black">
                        <canvas x-ref="chartRadios"></canvas>
                    </div>
                    <div x-show="!$wire.readyToLoad" 
                         class="h-48 w-full bg-gray-50 rounded-xl animate-pulse"></div>
                </div>

                <!-- Ámbito -->
                @if($ambito === 'TODOS')
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] transition-all">
                    <h3 class="font-bold text-gray-800 text-xs uppercase mb-3 flex items-center gap-2">
                        <div class="w-1 h-3 bg-green-500 rounded-full"></div>
                        Público vs Privado
                    </h3>
                    <div x-show="$wire.readyToLoad" 
                         class="h-48 relative w-full animate-fade-in text-black">
                        <canvas x-ref="chartAmbito"></canvas>
                    </div>
                    <div x-show="!$wire.readyToLoad" 
                         class="h-48 w-full bg-gray-50 rounded-xl animate-pulse"></div>
                </div>
                @endif
            </div>

            <!-- KPIs Summary List (Horizontal) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                @php $kpis = [
                    ['title' => 'Establecimientos', 'value' => $chartData['stats']['total_establecimientos'], 'tag' => 'Activos', 'color' => 'orange', 'icon' => 'fa-building'],
                    ['title' => 'Modalidades', 'value' => $chartData['stats']['total_modalidades'], 'tag' => 'Ofertas', 'color' => 'blue', 'icon' => 'fa-graduation-cap'],
                    ['title' => 'Infraestructura', 'value' => $chartData['stats']['total_edificios'], 'tag' => 'Edificios', 'color' => 'gray', 'icon' => 'fa-school'],
                ]; @endphp

                @foreach($kpis as $kpi)
                <div class="bg-white rounded-2xl p-6 border border-orange-50 shadow-[0_8px_30px_rgb(255,160,0,0.08)] transition-all flex items-center justify-between group overflow-hidden relative">
                    <div class="relative z-10">
                        <h3 class="font-bold text-gray-400 text-[10px] uppercase mb-1 tracking-widest">{{ $kpi['title'] }}</h3>
                        <div x-show="$wire.readyToLoad" class="animate-fade-in">
                            <p class="text-3xl font-black text-gray-800">{{ $kpi['value'] }}</p>
                            <p class="text-[10px] font-black text-{{ $kpi['color'] }}-500 mt-1 uppercase bg-{{ $kpi['color'] }}-50 px-2 py-0.5 rounded-full inline-block">{{ $kpi['tag'] }}</p>
                        </div>
                        <div x-show="!$wire.readyToLoad">
                            <div class="h-8 w-20 bg-gray-100 rounded-lg animate-pulse mb-2"></div>
                            <div class="h-4 w-12 bg-gray-50 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div class="w-14 h-14 rounded-2xl bg-{{ $kpi['color'] }}-50 flex items-center justify-center text-{{ $kpi['color'] }}-500 shadow-sm relative z-10">
                        <i class="fas {{ $kpi['icon'] }} text-2xl"></i>
                    </div>
                    
                    <i class="fas {{ $kpi['icon'] }} absolute -bottom-4 -right-4 text-8xl text-{{ $kpi['color'] }}-50 opacity-10 rotate-12 transition-transform duration-700 group-hover:scale-150 group-hover:opacity-20"></i>
                </div>
                @endforeach
            </div>
            
            <div class="h-12"></div> <!-- Spacer footer -->
        </div>
    </div>
</div>

@push('scripts')
<script>
    (function() {
        const dashboardChartsData = (initialData) => ({
            sidebarOpen: true,
            charts: {},
            data: initialData,
            colors: {
                primary: '#FF8200', 
                secondary: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
                multi: ['#FF8200', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'],
            },

            init() {
                // Initialize charts on load if ready
                if (this.$wire.readyToLoad) {
                    this.$nextTick(() => this.renderCharts());
                }

                // Listen for Livewire initialization
                this.$watch('$wire.readyToLoad', value => {
                    if (value) {
                        this.$nextTick(() => {
                           // Pequeño delay para asegurar que los canvas estén en el DOM
                           setTimeout(() => this.renderCharts(), 150);
                        });
                    }
                });

                // Listen for updates from backend
                Livewire.on('update-charts', (eventData) => {
                    this.data = Array.isArray(eventData) ? eventData[0] : eventData;
                    this.renderCharts();
                });
            },

            renderCharts() {
                const data = this.data;
                if (!data || !data.modalidades) return;

                // Destruir existentes usando Chart.getChart para asegurar limpieza correcta del canvas real en DOM
                ['chartModalidades', 'chartCategorias', 'chartZonas', 'chartRadios', 'chartAmbito'].forEach(id => {
                    const canvas = this.$refs[id];
                    if (canvas) {
                        const existingChart = Chart.getChart(canvas);
                        if (existingChart) {
                            existingChart.destroy();
                        }
                    }
                });
                
                Chart.defaults.font.family = "'Inter', sans-serif";
                Chart.defaults.color = '#6B7280';

                const config = {
                    responsive: true,
                    maintainAspectRatio: false,
                };

                // Chart 1: Modalidades
                const ctxModalidades = this.$refs.chartModalidades;
                if (ctxModalidades) {
                    this.charts.modalidades = new Chart(ctxModalidades, {
                        type: 'doughnut',
                        data: {
                            labels: data.modalidades.labels,
                            datasets: [{
                                data: data.modalidades.values,
                                backgroundColor: this.colors.multi,
                                borderWidth: 0,
                                hoverOffset: 10
                            }]
                        },
                        options: {
                            ...config,
                            cutout: '75%',
                            plugins: {
                                legend: { position: 'right', labels: { boxWidth: 10, usePointStyle: true, font: { size: 10 } } }
                            },
                            layout: { padding: 10 }
                        }
                    });
                }

                // Chart 2: Categorías
                const ctxCategorias = this.$refs.chartCategorias;
                if (ctxCategorias) {
                    this.charts.categorias = new Chart(ctxCategorias, {
                        type: 'bar',
                        data: {
                            labels: data.categorias.labels,
                            datasets: [{
                                label: 'Cant.',
                                data: data.categorias.values,
                                backgroundColor: this.colors.primary,
                                borderRadius: 6
                            }]
                        },
                        options: {
                            ...config,
                            plugins: { legend: { display: false } },
                            scales: { 
                                y: { beginAtZero: true, grid: { borderDash: [4, 4], color: '#f3f4f6' }, border: { display: false } }, 
                                x: { grid: { display: false }, border: { display: false } } 
                            }
                        }
                    });
                }

                // Chart 3: Zonas
                const ctxZonas = this.$refs.chartZonas;
                if (ctxZonas) {
                    this.charts.zonas = new Chart(ctxZonas, {
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
                            ...config,
                            indexAxis: 'y',
                            plugins: { legend: { display: false } },
                            scales: { 
                                x: { beginAtZero: true, grid: { borderDash: [4, 4], color: '#f3f4f6' }, border: { display: false } }, 
                                y: { grid: { display: false }, border: { display: false } } 
                            }
                        }
                    });
                }

                // Chart 4: Radios
                const ctxRadios = this.$refs.chartRadios;
                if (ctxRadios) {
                    this.charts.radios = new Chart(ctxRadios, {
                        type: 'bar',
                        data: {
                            labels: data.radios.labels,
                            datasets: [{
                                label: 'Establecimientos',
                                data: data.radios.values,
                                backgroundColor: this.colors.multi,
                                borderRadius: 6,
                                barPercentage: 0.6
                            }]
                        },
                        options: {
                            ...config,
                            plugins: { legend: { display: false } },
                            scales: { 
                                y: { beginAtZero: true, grid: { borderDash: [4, 4], color: '#f3f4f6' }, border: { display: false } }, 
                                x: { grid: { display: false }, border: { display: false } } 
                            }
                        }
                    });
                }

                // Chart 5: Ámbito (Solo si existe)
                const ctxAmbito = this.$refs.chartAmbito;
                if (ctxAmbito) {
                    this.charts.ambito = new Chart(ctxAmbito, {
                        type: 'doughnut',
                        data: {
                            labels: data.ambito.labels,
                            datasets: [{
                                data: data.ambito.values,
                                backgroundColor: [this.colors.primary, '#3B82F6'],
                                borderWidth: 0,
                                hoverOffset: 10
                            }]
                        },
                        options: {
                            ...config,
                            cutout: '75%',
                            plugins: {
                                legend: { position: 'bottom', labels: { usePointStyle: true, font: { size: 11, weight: 'bold' } } }
                            },
                            layout: { padding: 10 }
                        }
                    });
                }
            }
        });

        // Robust registration
        if (window.Alpine) {
            Alpine.data('dashboardCharts', dashboardChartsData);
        } else {
            document.addEventListener('alpine:init', () => {
                Alpine.data('dashboardCharts', dashboardChartsData);
            });
        }
    })();
</script>
@endpush
