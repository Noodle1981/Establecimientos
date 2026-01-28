<div>
        
        <!-- HEADER ESTRATÉGICO -->
        <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2" style="color: #FE8204;">
                    <i class="fas fa-university"></i>
                    <span>Control de Calidad de Datos</span>
                    <span>•</span>
                    <span>Estado de Sincronización</span>
                </nav>
                <div class="flex items-center gap-3">
                    <div class="p-2 rounded-lg" style="background-color: rgba(254, 130, 4, 0.1);">
                        <i class="fas fa-clipboard-check fa-2x" style="color: #FE8204;"></i>
                    </div>
                    <h2 class="text-4xl font-extrabold tracking-tight" style="color: #000000;">Validación de Establecimientos</h2>
                </div>
                <p class="mt-1 ml-14" style="color: #000000;">Auditoría de consistencia entre Áreas y Plataforma Educativa.</p>
            </div>
            
            @if (session()->has('message'))
                <div class="p-3 bg-white border-l-4 rounded-r-lg shadow-sm" style="border-color: #FE8204; border: 1px solid #FE8204; border-left-width: 4px;">
                    <span class="font-bold" style="color: #000000;">✅ {{ session('message') }}</span>
                </div>
            @endif
        </div>

        <!-- CONTADORES TIPO DASHBOARD (KPIs) -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            @php
                $estados = [
                    'PENDIENTE' => ['label' => 'Pendientes', 'icon' => 'fa-clock', 'hex' => '#FADC3C'],
                    'CORRECTO'  => ['label' => 'Correctos', 'icon' => 'fa-check-circle', 'hex' => '#FE8204'],
                    'CORREGIDO' => ['label' => 'Corregidos', 'icon' => 'fa-sync', 'hex' => '#FADC3C'],
                    'BAJA'      => ['label' => 'De Baja', 'icon' => 'fa-exclamation-triangle', 'hex' => '#E43C2F'],
                    'ELIMINADO' => ['label' => 'Eliminados', 'icon' => 'fa-trash-alt', 'hex' => '#000000'],
                ];
            @endphp

            @foreach($estados as $key => $meta)
            <div wire:click="$set('estadoFilter', '{{ $key }}')" 
                 class="group cursor-pointer transition-all duration-300">
                <div class="bg-white p-5 rounded-lg shadow-sm transition-all {{ $estadoFilter === $key ? 'ring-2 ring-offset-2' : '' }}"
                     style="border: 2px solid {{ $meta['hex'] }}; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.1);">
                    <div class="flex flex-col">
                        <span class="text-sm font-medium" style="color: #000000;">{{ $meta['label'] }}</span>
                        <h4 class="text-2xl font-bold" style="color: {{ $meta['hex'] }};">{{ $contadores[$key] }}</h4>
                    </div>
                </div>
            </div>
            @endforeach
        </div>

        <!-- FILTROS AVANZADOS -->
        <div class="mb-8 bg-white rounded-lg overflow-hidden" style="border: 1px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);" x-data="{ filtersOpen: true }">
            <div class="px-6 py-4 flex justify-between items-center" style="background-color: #FE8204; border-bottom: 1px solid #FADC3C;">
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-white rounded-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #FE8204;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                    </div>
                    <h3 class="font-bold text-white">Panel de Filtros de Auditoría</h3>
                </div>
                <button @click="filtersOpen = !filtersOpen" class="text-white hover:text-yellow-200 transition">
                    <svg class="w-6 h-6 transform transition" :class="filtersOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
            </div>

            <div x-show="filtersOpen" x-transition class="p-6 bg-white">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="md:col-span-3">
                        <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Buscar Establecimiento</label>
                        <div class="relative">
                            <input type="text" wire:model.live.debounce.300ms="search" placeholder="Nombre o número de CUE..." 
                                   class="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg transition border"
                                   style="border-color: #FE8204; color: #000000;"
                                   onfocus="this.style.boxShadow='0 0 0 3px rgba(254, 130, 4, 0.1)'"
                                   onblur="this.style.boxShadow='none'">
                            <i class="fas fa-school absolute left-3 top-3.5" style="color: #FE8204;"></i>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Estado de Validación</label>
                        <select wire:model.live="estadoFilter" class="w-full py-2.5 bg-white rounded-lg border font-bold" style="border-color: #FE8204; color: #000000;">
                            <option value="">TODOS</option>
                            @foreach($estados as $key => $meta)
                                <option value="{{ $key }}">{{ $key }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- TABLA DE VALIDACIÓN (Clon exacto) -->
        <div class="bg-white rounded-lg overflow-hidden" style="border: 1px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr style="background-color: #FE8204;">
                            <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Establecimiento / CUE</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Estado Auditoría</th>
                            <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Validador</th>
                            <th class="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y bg-white" style="border-color: #FADC3C;">
                        @forelse($modalidades as $modalidad)
                            <tr class="group transition-all" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.05)'" onmouseout="this.style.backgroundColor='#FFFFFF'">
                                <td class="px-6 py-5">
                                    <div class="flex items-center gap-4">
                                        <!-- Identificador Visual -->
                                        <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-black border" 
                                             style="border-color: #FE8204; color: #FE8204; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                                            {{ substr($modalidad->establecimiento->nombre, 0, 1) }}
                                        </div>
                                        <div>
                                            <p class="text-sm font-bold uppercase leading-tight" style="color: #000000;">
                                                {{ $modalidad->establecimiento->nombre }}
                                            </p>
                                            <div class="flex gap-2 mt-1.5 font-mono text-[10px]">
                                                <span class="px-2 py-0.5 rounded border" style="border-color: #FE8204;">CUE {{ $modalidad->establecimiento->cue }}</span>
                                                <span class="px-2 py-0.5 rounded border" style="background-color: #FADC3C; border-color: #FADC3C; color: #000000;">{{ $modalidad->nivel_educativo }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-5">
                                    <!-- Badges usando solo la paleta oficial -->
                                    @php
                                        $badgeStyles = [
                                            'PENDIENTE' => 'background-color: #FADC3C; color: #000000;',
                                            'CORRECTO'  => 'background-color: #FE8204; color: #FFFFFF;',
                                            'CORREGIDO' => 'background-color: #FFFFFF; color: #FE8204; border: 1px solid #FE8204;',
                                            'BAJA'      => 'background-color: #E43C2F; color: #FFFFFF;',
                                            'ELIMINADO' => 'background-color: #000000; color: #FFFFFF;',
                                        ];
                                    @endphp
                                    <span class="px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest" style="{{ $badgeStyles[$modalidad->estado_validacion] ?? '' }}">
                                        {{ $modalidad->estado_validacion }}
                                    </span>
                                </td>
                                <td class="px-6 py-5">
                                    <div class="flex items-center gap-2">
                                        <i class="fas fa-user-check" style="color: #FE8204;"></i>
                                        <div>
                                            <p class="text-xs font-bold" style="color: #000000;">{{ $modalidad->usuarioValidacion?->name ?? 'SISTEMA' }}</p>
                                            <p class="text-[10px] uppercase font-bold opacity-60" style="color: #000000;">{{ $modalidad->validado_en?->format('d/m/Y') ?? 'Pendiente' }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-5 text-right">
                                    <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button wire:click="abrirCambiarEstado({{ $modalidad->id }})"
                                                class="px-4 py-2 text-white text-[10px] font-black rounded transition shadow-md uppercase tracking-tighter"
                                                style="background-color: #FE8204;"
                                                onmouseover="this.style.backgroundColor='#E57303'"
                                                onmouseout="this.style.backgroundColor='#FE8204'">
                                            <i class="fas fa-edit mr-1"></i> Validar
                                        </button>
                                        <button wire:click="abrirHistorial({{ $modalidad->id }})"
                                                class="p-2 bg-white rounded transition border" 
                                                style="border-color: #FE8204; color: #FE8204;"
                                                onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'"
                                                onmouseout="this.style.backgroundColor='#FFFFFF'">
                                            <i class="fas fa-history"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="px-6 py-20 text-center">
                                    <i class="fas fa-search fa-3x mb-4 opacity-20" style="color: #FE8204;"></i>
                                    <p class="font-bold text-lg" style="color: #000000;">No hay registros para validar</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
</div>