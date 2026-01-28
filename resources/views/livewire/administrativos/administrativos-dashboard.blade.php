<div class="pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        
        <!-- HEADER ESTRATÉGICO -->


        <!-- TARJETAS DE ESTADO (KPIs) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div class="bg-white rounded-lg p-6 border-l-4 shadow-sm transition-all" style="border-color: #FE8204; border-top: 1px solid #FE8204; border-right: 1px solid #FE8204; border-bottom: 1px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);">
                <p class="text-sm font-medium mb-1" style="color: #000000;">Total Establecimientos</p>
                <h3 class="text-4xl font-black" style="color: #FE8204;">{{ \App\Models\Establecimiento::count() }}</h3>
                <p class="text-xs mt-2" style="color: #000000;">Unidades educativas registradas</p>
            </div>

            <div class="bg-white rounded-lg p-6 border-l-4 shadow-sm transition-all" style="border-color: #FADC3C; border-top: 1px solid #FADC3C; border-right: 1px solid #FADC3C; border-bottom: 1px solid #FADC3C; box-shadow: 0 4px 12px rgba(250, 220, 60, 0.15);">
                <p class="text-sm font-medium mb-1" style="color: #000000;">Modalidades Activas</p>
                <h3 class="text-4xl font-black" style="color: #FADC3C;">{{ \App\Models\Modalidad::count() }}</h3>
                <p class="text-xs mt-2" style="color: #000000;">Niveles y modalidades educativas</p>
            </div>

            <div class="bg-white rounded-lg p-6 border-l-4 shadow-sm transition-all" style="border-color: #E43C2F; border-top: 1px solid #E43C2F; border-right: 1px solid #E43C2F; border-bottom: 1px solid #E43C2F; box-shadow: 0 4px 12px rgba(228, 60, 47, 0.15);">
                <p class="text-sm font-medium mb-1" style="color: #000000;">Pendientes Validación</p>
                <h3 class="text-4xl font-black" style="color: #E43C2F;">{{ \App\Models\Modalidad::where('validado', false)->count() }}</h3>
                <p class="text-xs mt-2" style="color: #000000;">Requieren revisión y aprobación</p>
            </div>
        </div>

        <!-- SECCIÓN DE GRÁFICOS -->
        <div class="mb-8">
            <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-white rounded-lg border" style="border-color: #FE8204;">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #FE8204;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </div>
                <h2 class="text-2xl font-black" style="color: #000000;">Análisis Estadístico</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Chart cards with institucional borders and white bg -->
                <div class="bg-white rounded-lg p-6 border shadow-sm" style="border-color: #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.1);">
                    <h3 class="text-sm font-black mb-4 uppercase tracking-wider" style="color: #000000;">Modalidades Educativas</h3>
                    <canvas id="chartModalidades"></canvas>
                </div>

                <div class="bg-white rounded-lg p-6 border shadow-sm" style="border-color: #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.1);">
                    <h3 class="text-sm font-black mb-4 uppercase tracking-wider" style="color: #000000;">Top 10 Categorías</h3>
                    <canvas id="chartCategorias"></canvas>
                </div>

                <div class="bg-white rounded-lg p-6 border shadow-sm" style="border-color: #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.1);">
                    <h3 class="text-sm font-black mb-4 uppercase tracking-wider" style="color: #000000;">Departamentos/Zonas</h3>
                    <canvas id="chartZonas"></canvas>
                </div>

                <div class="bg-white rounded-lg p-6 border shadow-sm" style="border-color: #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.1);">
                    <h3 class="text-sm font-black mb-4 uppercase tracking-wider" style="color: #000000;">Distribución por Radio</h3>
                    <canvas id="chartRadios"></canvas>
                </div>

                <div class="bg-white rounded-lg p-6 border shadow-sm" style="border-color: #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.1);">
                    <h3 class="text-sm font-black mb-4 uppercase tracking-wider" style="color: #000000;">Público vs Privado</h3>
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
