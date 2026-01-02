<div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-black mb-2">Panel Administrativo</h1>
            <p class="text-gray-600">Gestión de modalidades educativas</p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="glass rounded-2xl p-6">
                <h3 class="text-3xl font-bold text-black mb-1">{{ \App\Models\Establecimiento::count() }}</h3>
                <p class="text-gray-600 text-sm">Establecimientos</p>
            </div>

            <div class="glass rounded-2xl p-6">
                <h3 class="text-3xl font-bold text-black mb-1">{{ \App\Models\Modalidad::count() }}</h3>
                <p class="text-gray-600 text-sm">Modalidades</p>
            </div>

            <div class="glass rounded-2xl p-6">
                <h3 class="text-3xl font-bold text-black mb-1">{{ \App\Models\Modalidad::where('validado', false)->count() }}</h3>
                <p class="text-gray-600 text-sm">Pendientes de Validar</p>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="glass rounded-2xl p-8">
            <h2 class="text-2xl font-bold text-black mb-6">Acciones Rápidas</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="{{ route('administrativos.modalidades') }}" 
                   class="glass rounded-xl p-6 hover:shadow-lg transition group">
                    <div class="flex items-center space-x-4">
                        <div class="p-3 rounded-lg group-hover:scale-110 transition" 
                             style="background-color: var(--primary-orange);">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-black">Gestionar Modalidades</h3>
                            <p class="text-sm text-gray-600">Ver, editar y validar modalidades</p>
                        </div>
                    </div>
                </a>

                <a href="{{ route('mapa.publico') }}" 
                   class="glass rounded-xl p-6 hover:shadow-lg transition group">
                    <div class="flex items-center space-x-4">
                        <div class="p-3 rounded-lg group-hover:scale-110 transition" 
                             style="background-color: var(--primary-orange);">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-semibold text-black">Ver Mapa</h3>
                            <p class="text-sm text-gray-600">Visualizar establecimientos en el mapa</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="mt-8">
            <h2 class="text-2xl font-bold text-black mb-6">📊 Análisis Estadístico</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Chart 1: Modalidades -->
                <div class="glass rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-black mb-4">Modalidades Educativas</h3>
                    <canvas id="chartModalidades"></canvas>
                </div>

                <!-- Chart 2: Categorías -->
                <div class="glass rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-black mb-4">Top 10 Categorías</h3>
                    <canvas id="chartCategorias"></canvas>
                </div>

                <!-- Chart 3: Departamentos/Zonas -->
                <div class="glass rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-black mb-4">Departamentos/Zonas</h3>
                    <canvas id="chartZonas"></canvas>
                </div>

                <!-- Chart 4: Radio -->
                <div class="glass rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-black mb-4">Distribución por Radio</h3>
                    <canvas id="chartRadios"></canvas>
                </div>

                <!-- Chart 5: Público vs Privado -->
                <div class="glass rounded-2xl p-6">
                    <h3 class="text-lg font-semibold text-black mb-4">Público vs Privado</h3>
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
