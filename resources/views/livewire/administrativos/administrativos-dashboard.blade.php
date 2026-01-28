<div class="min-h-screen pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <!-- HEADER ESTRATÉGICO -->
        <div class="mb-10">
            <nav class="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">
                <span class="opacity-60">Ministerio de Educación</span>
                <span>•</span>
                <span>Panel de Control Administrativo</span>
            </nav>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight">Panel Administrativo</h1>
            <p class="text-slate-500 mt-2 font-medium">Gestión integral de establecimientos educativos de la provincia</p>
        </div>

        <!-- TARJETAS DE ESTADO (KPIs) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div class="glass rounded-2xl p-6 border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-all">
                <p class="text-slate-500 text-sm font-medium mb-1">Total Establecimientos</p>
                <h3 class="text-4xl font-black text-slate-900">{{ \App\Models\Establecimiento::count() }}</h3>
                <p class="text-xs text-slate-400 mt-2">Unidades educativas registradas</p>
            </div>

            <div class="glass rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all">
                <p class="text-slate-500 text-sm font-medium mb-1">Modalidades Activas</p>
                <h3 class="text-4xl font-black text-slate-900">{{ \App\Models\Modalidad::count() }}</h3>
                <p class="text-xs text-slate-400 mt-2">Niveles y modalidades educativas</p>
            </div>

            <div class="glass rounded-2xl p-6 border-l-4 border-yellow-500 shadow-sm hover:shadow-md transition-all">
                <p class="text-slate-500 text-sm font-medium mb-1">Pendientes Validación</p>
                <h3 class="text-4xl font-black text-slate-900">{{ \App\Models\Modalidad::where('validado', false)->count() }}</h3>
                <p class="text-xs text-slate-400 mt-2">Requieren revisión y aprobación</p>
            </div>
        </div>

        <!-- SECCIÓN DE GRÁFICOS -->
        <div class="mb-8">
            <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </div>
                <h2 class="text-2xl font-black text-slate-900">Análisis Estadístico</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Chart 1: Modalidades -->
                <div class="glass rounded-2xl p-6 shadow-sm border border-white/50">
                    <h3 class="text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">Modalidades Educativas</h3>
                    <canvas id="chartModalidades"></canvas>
                </div>

                <!-- Chart 2: Categorías -->
                <div class="glass rounded-2xl p-6 shadow-sm border border-white/50">
                    <h3 class="text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">Top 10 Categorías</h3>
                    <canvas id="chartCategorias"></canvas>
                </div>

                <!-- Chart 3: Departamentos/Zonas -->
                <div class="glass rounded-2xl p-6 shadow-sm border border-white/50">
                    <h3 class="text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">Departamentos/Zonas</h3>
                    <canvas id="chartZonas"></canvas>
                </div>

                <!-- Chart 4: Radio -->
                <div class="glass rounded-2xl p-6 shadow-sm border border-white/50">
                    <h3 class="text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">Distribución por Radio</h3>
                    <canvas id="chartRadios"></canvas>
                </div>

                <!-- Chart 5: Público vs Privado -->
                <div class="glass rounded-2xl p-6 shadow-sm border border-white/50">
                    <h3 class="text-sm font-black text-slate-700 mb-4 uppercase tracking-wider">Público vs Privado</h3>
                    <canvas id="chartAmbito"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const chartData = @json($chartData);
        
        // Color palette
        const colors = {
            primary: '#FF8200',
            secondary: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
            multi: ['#FF8200', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6'],
        };

        // Chart 1: Modalidades (Doughnut)
        new Chart(document.getElementById('chartModalidades'), {
            type: 'doughnut',
            data: {
                labels: chartData.modalidades.labels,
                datasets: [{
                    data: chartData.modalidades.values,
                    backgroundColor: colors.multi,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { size: 11 } }
                    }
                }
            }
        });

        // Chart 2: Categorías (Bar)
        new Chart(document.getElementById('chartCategorias'), {
            type: 'bar',
            data: {
                labels: chartData.categorias.labels,
                datasets: [{
                    label: 'Cantidad',
                    data: chartData.categorias.values,
                    backgroundColor: colors.primary,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // Chart 3: Zonas (Horizontal Bar)
        new Chart(document.getElementById('chartZonas'), {
            type: 'bar',
            data: {
                labels: chartData.zonas.labels,
                datasets: [{
                    label: 'Establecimientos',
                    data: chartData.zonas.values,
                    backgroundColor: '#3B82F6',
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { beginAtZero: true }
                }
            }
        });

        // Chart 4: Radios (Pie)
        new Chart(document.getElementById('chartRadios'), {
            type: 'pie',
            data: {
                labels: chartData.radios.labels,
                datasets: [{
                    data: chartData.radios.values,
                    backgroundColor: colors.multi,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { size: 11 } }
                    }
                }
            }
        });

        // Chart 5: Ámbito (Doughnut)
        new Chart(document.getElementById('chartAmbito'), {
            type: 'doughnut',
            data: {
                labels: chartData.ambito.labels,
                datasets: [{
                    data: chartData.ambito.values,
                    backgroundColor: [colors.primary, '#3B82F6'],
                    borderWidth: 3,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { font: { size: 13, weight: 'bold' } }
                    }
                }
            }
        });
    });
</script>
@endpush
