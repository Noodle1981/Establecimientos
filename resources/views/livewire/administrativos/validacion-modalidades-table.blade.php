<div class="min-h-screen pb-12"> <!-- El fondo ya viene del app.blade -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <!-- HEADER DE AUDITORÍA -->
        <div class="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <nav class="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">
                    <span class="opacity-60">Control de Calidad de Datos</span>
                    <span>•</span>
                    <span>Estado de Sincronización</span>
                </nav>
                <h1 class="text-4xl font-black text-slate-900 tracking-tight">Validación de Establecimientos</h1>
                <p class="text-slate-500 mt-2 font-medium">Auditoría sobre la consistencia de datos entre Áreas y Plataforma Educativa.</p>
            </div>
            
            @if (session()->has('message'))
                <div class="animate-bounce p-3 bg-green-500 text-white rounded-xl text-xs font-bold shadow-lg">
                    ✅ {{ session('message') }}
                </div>
            @endif
        </div>

        <!-- CONTADORES TIPO DASHBOARD (KPIs) -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            @php
                $estados = [
                    'PENDIENTE' => ['color' => 'yellow', 'icon' => '⏳', 'hex' => '#F9DB3B'],
                    'CORRECTO' => ['color' => 'green', 'icon' => '✅', 'hex' => '#22c55e'],
                    'CORREGIDO' => ['color' => 'blue', 'icon' => '🔄', 'hex' => '#3b82f6'],
                    'BAJA' => ['color' => 'orange', 'icon' => '⚠️', 'hex' => '#FE8204'],
                    'ELIMINADO' => ['color' => 'red', 'icon' => '🚫', 'hex' => '#E43C2F'],
                ];
            @endphp

            @foreach($estados as $key => $meta)
            <div wire:click="$set('estadoFilter', '{{ $key }}')" 
                 class="group cursor-pointer transition-all duration-300 transform hover:-translate-y-1">
                <div class="glass rounded-2xl p-5 border-b-4 shadow-sm group-hover:shadow-md transition-all {{ $estadoFilter === $key ? 'ring-2 ring-slate-800 ring-offset-2' : '' }}"
                     style="border-color: {{ $meta['hex'] }}">
                    <div class="flex flex-col">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ $key }}</span>
                        <div class="flex items-baseline gap-2">
                            <span class="text-3xl font-black text-slate-800">{{ $contadores[$key] }}</span>
                            <span class="text-lg opacity-50 group-hover:opacity-100 transition-opacity">{{ $meta['icon'] }}</span>
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        </div>

        <!-- BARRA DE FILTROS ESTILIZADA -->
        <div class="glass rounded-3xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center border border-white/60">
            <div class="relative flex-1 w-full">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input type="text" wire:model.live="search"
                       class="w-full pl-12 pr-4 py-3 bg-white/50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition shadow-inner placeholder-slate-400"
                       placeholder="Buscar por nombre de establecimiento o número de CUE...">
            </div>

            <div class="w-full md:w-64">
                <select wire:model.live="estadoFilter"
                        class="w-full py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-orange-500 shadow-sm font-bold text-slate-700">
                    <option value="">🔍 Todos los estados</option>
                    @foreach($estados as $key => $meta)
                        <option value="{{ $key }}">{{ $meta['icon'] }} {{ $key }}</option>
                    @endforeach
                </select>
            </div>
        </div>

        <!-- TABLA DE VALIDACIÓN -->
        <div class="glass rounded-3xl shadow-xl overflow-hidden border border-white/50">
            <div class="overflow-x-auto">
                <table class="w-full border-separate border-spacing-0">
                    <thead>
                        <tr class="bg-slate-900">
                            <th class="px-6 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest">Establecimiento / Identidad</th>
                            <th class="px-6 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest">Estado Auditoría</th>
                            <th class="px-6 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest">Validador</th>
                            <th class="px-6 py-4 text-left text-[10px] font-black text-white uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white/30">
                        @forelse($modalidades as $modalidad)
                            <tr class="group hover:bg-white/60 transition-all">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <div class="hidden sm:flex w-10 h-10 rounded-xl bg-white shadow-sm items-center justify-center font-black text-orange-600 border border-orange-100">
                                            {{ substr($modalidad->establecimiento->nombre, 0, 1) }}
                                        </div>
                                        <div>
                                            <p class="text-sm font-black text-slate-800 leading-tight group-hover:text-orange-600 transition-colors uppercase">
                                                {{ $modalidad->establecimiento->nombre }}
                                            </p>
                                            <div class="flex gap-2 mt-1">
                                                <span class="text-[10px] font-bold text-slate-400">CUE: {{ $modalidad->establecimiento->cue }}</span>
                                                <span class="text-[10px] font-bold text-slate-400 px-2 bg-slate-100 rounded text-slate-500">{{ $modalidad->nivel_educativo }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-3 py-1.5 rounded-xl text-[10px] font-black border tracking-tighter uppercase
                                        {{ $badgeClasses[$modalidad->estado_validacion] ?? 'bg-gray-100 text-gray-800' }}">
                                        {{ $modalidad->estado_validacion }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                                            {{ substr($modalidad->usuarioValidacion?->name ?? '?', 0, 1) }}
                                        </div>
                                        <div>
                                            <p class="text-xs font-bold text-slate-700">{{ $modalidad->usuarioValidacion?->name ?? 'Sin asignar' }}</p>
                                            <p class="text-[10px] text-slate-400">{{ $modalidad->validado_en?->format('d/m/Y H:i') ?? 'Pendiente' }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-x-2">
                                        <button wire:click="abrirCambiarEstado({{ $modalidad->id }})"
                                                class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-black rounded-xl transition shadow-md shadow-orange-200 uppercase tracking-widest">
                                            Validar
                                        </button>
                                        <button wire:click="abrirHistorial({{ $modalidad->id }})"
                                                class="p-2 bg-white text-slate-400 hover:text-blue-600 rounded-xl transition border border-slate-100 shadow-sm" title="Ver Historial">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="px-6 py-20 text-center">
                                    <p class="text-slate-400 font-bold uppercase tracking-widest">No se encontraron registros para validar</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Pagination Mejorada -->
            <div class="px-6 py-4 bg-slate-900/5">
                {{ $modalidades->links() }}
            </div>
        </div>
    </div>

    <!-- MODAL: CAMBIAR ESTADO (Refinado) -->
    @if($showCambiarEstadoModal && $modalidadSeleccionada)
    <div class="fixed inset-0 z-[60] overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity bg-slate-900/40 backdrop-blur-sm" wire:click="cerrarModales"></div>
            
            <div class="inline-block align-bottom glass-strong rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-orange-200">
                <div class="bg-slate-900 px-6 py-4 flex justify-between items-center">
                    <h3 class="text-white font-black uppercase tracking-widest text-sm">Cambiar Estado de Validación</h3>
                    <button wire:click="cerrarModales" class="text-slate-400 hover:text-white">✕</button>
                </div>

                <div class="p-8">
                    <div class="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6">
                        <p class="text-[10px] font-black text-orange-600 uppercase mb-1">Escuela a validar</p>
                        <p class="font-bold text-slate-800">{{ $modalidadSeleccionada->establecimiento->nombre }}</p>
                    </div>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Seleccionar Nuevo Estado</label>
                            <select wire:model="nuevoEstado" 
                                    class="w-full px-4 py-3 rounded-2xl border-slate-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 font-bold text-slate-700 transition-all">
                                <option value="PENDIENTE">⏳ Pendiente</option>
                                <option value="CORRECTO">✅ Correcto</option>
                                <option value="CORREGIDO">🔄 Corregido</option>
                                <option value="BAJA">⚠️ Baja</option>
                                <option value="ELIMINADO">🚫 Eliminado</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Observaciones de Auditoría</label>
                            <textarea wire:model="observaciones" 
                                      rows="3"
                                      class="w-full px-4 py-3 rounded-2xl border-slate-200 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 shadow-inner"
                                      placeholder="Escriba aquí los detalles encontrados durante la validación..."></textarea>
                        </div>
                    </div>

                    <div class="mt-8 flex gap-3">
                        <button wire:click="cerrarModales" class="flex-1 px-4 py-3 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition">Cancelar</button>
                        <button wire:click="cambiarEstado" class="flex-1 px-4 py-3 bg-orange-600 text-white rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-orange-700 transition">GUARDAR CAMBIOS</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endif
</div>