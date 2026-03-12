<div class="animate-fade-in p-6 lg:p-10 max-w-7xl mx-auto">
    <!-- HEADER ESTRATÉGICO -->
    <div class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="flex items-center gap-5">
            <a href="{{ route('administrativos.validacion') }}" 
               class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-primary-orange hover:shadow-md transition-all group">
                <i class="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            </a>
            <div>
                <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1 text-primary-orange/60">
                    <i class="fas fa-microscope"></i>
                    <span>Auditoría de Campo</span>
                    <span>•</span>
                    <span class="text-gray-400">Edificio #{{ $edificio->id }}</span>
                </nav>
                <h2 class="text-3xl font-black tracking-tight text-gray-900 leading-tight">
                    Auditación de <span class="text-primary-orange">Edificio</span>
                </h2>
                <p class="text-sm text-gray-500 font-medium">Validación integral de establecimientos y modalidades</p>
            </div>
        </div>

        <div class="flex items-center gap-3 glass p-2 rounded-2xl shadow-sm border border-white/50">
            @if (session()->has('message'))
                <div class="px-4 py-2 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce-short">
                    <i class="fas fa-check-circle"></i>
                    {{ session('message') }}
                </div>
            @endif
            <div class="px-5 py-2.5 rounded-xl bg-gray-900 text-white flex items-center gap-3 shadow-lg">
                <i class="fas fa-id-card text-primary-orange"></i>
                <div class="flex flex-col">
                    <span class="text-[9px] font-black uppercase text-gray-400 tracking-tighter leading-none">CUI Edificio</span>
                    <span class="text-sm font-black font-mono">{{ $edificio->cui }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- MAIN CONTENT: GRID 12 COLUMNS -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- SIDEBAR IZQUIERDO: FICHA TÉCNICA DEL EDIFICIO (4 COL) -->
        <div class="lg:col-span-4 space-y-6">
            <div class="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden sticky top-10">
                <!-- Mini Mapa / Geoposicionamiento Header -->
                <div class="relative h-48 bg-gray-100 group">
                    @if($edificio->latitud && $edificio->longitud)
                        <!-- Placeholder visual o integración estática simple -->
                        <div class="absolute inset-0 bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors overflow-hidden">
                            <i class="fas fa-map-marked-alt text-6xl text-blue-200/50 transform group-hover:scale-110 transition-transform duration-500"></i>
                            <div class="absolute bottom-4 right-4 z-10">
                                <a href="https://www.google.com/maps/search/?api=1&query={{ $edificio->latitud }},{{ $edificio->longitud }}" 
                                   target="_blank" 
                                   class="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 text-xs font-black rounded-xl shadow-lg hover:-translate-y-1 transition-all border border-blue-50">
                                    <i class="fas fa-external-link-alt"></i> VER EN GOOGLE
                                </a>
                            </div>
                        </div>
                    @else
                        <div class="absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-300">
                            <i class="fas fa-map-marker-slash text-4xl"></i>
                        </div>
                    @endif
                </div>

                <div class="p-8">
                    <div class="space-y-8">
                        <!-- Localización -->
                        <section>
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 rounded-lg bg-orange-50 text-primary-orange flex items-center justify-center text-xs">
                                    <i class="fas fa-map-signs"></i>
                                </div>
                                <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Localización FIsica</h3>
                            </div>
                            <div class="space-y-4">
                                <div class="relative pl-6 border-l-2 border-orange-100">
                                    <span class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Dirección</span>
                                    <span class="text-lg font-black text-gray-800 leading-tight">
                                        {{ $edificio->calle }} {{ $edificio->numero_puerta }}
                                    </span>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <span class="block text-[9px] font-bold text-gray-400 uppercase mb-1">Localidad</span>
                                        <span class="text-sm font-black text-gray-700">{{ $edificio->localidad }}</span>
                                    </div>
                                    <div class="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <span class="block text-[9px] font-bold text-gray-400 uppercase mb-1">Departamento</span>
                                        <span class="text-sm font-black text-gray-700">{{ $edificio->zona_departamento }}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Coordenadas -->
                        @if($edificio->latitud)
                        <section>
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                                    <i class="fas fa-globe-americas"></i>
                                </div>
                                <h3 class="text-xs font-black text-gray-400 uppercase tracking-widest">Geoposicionamiento</h3>
                            </div>
                            <div class="p-5 rounded-3xl bg-blue-900 text-white shadow-inner font-mono text-center">
                                <div class="text-xs opacity-60 mb-1 font-sans">COORDS:</div>
                                <div class="text-base font-black tracking-widest">{{ $edificio->latitud }}, {{ $edificio->longitud }}</div>
                            </div>
                        </section>
                        @endif

                        <!-- Botón de Acción -->
                        <div class="pt-6 border-t border-gray-50">
                            <button class="w-full py-4 bg-orange-50 text-primary-orange text-xs font-black rounded-2xl border border-orange-100 hover:bg-primary-orange hover:text-white transition-all shadow-sm">
                                <i class="fas fa-edit mr-2"></i> EDITAR DATOS EDIFICIO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- AREA CENTRAL: ESCUELAS Y MODALIDADES (8 COL) -->
        <div class="lg:col-span-8 space-y-8">
            <div class="flex items-center gap-4 mb-2">
                <div class="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-primary-orange">
                    <i class="fas fa-university fa-lg"></i>
                </div>
                <div>
                    <h3 class="text-xl font-black text-gray-800 tracking-tight">Establecimientos Relacionados</h3>
                    <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Auditoría de consistencia EDUGE</p>
                </div>
            </div>

            <div class="space-y-10">
                @foreach($edificio->establecimientos ?? [] as $est)
                    <div class="relative">
                        <!-- Conector vertical decorativo -->
                        @if(!$loop->last)
                            <div class="absolute left-6 top-12 bottom-0 w-px bg-gradient-to-b from-orange-200 to-transparent z-0 opacity-30"></div>
                        @endif

                        <div class="relative z-10 bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-orange-100 transition-all duration-500">
                            <!-- Est. Header -->
                            <div class="bg-gray-50/50 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
                                <div class="flex items-center gap-5">
                                    <div class="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary-orange scale-110">
                                        <i class="fas fa-school fa-2x opacity-20 absolute"></i>
                                        <span class="text-2xl font-black relative">{{ $loop->iteration }}</span>
                                    </div>
                                    <div>
                                        <h4 class="text-xl font-black text-gray-900 group-hover:text-primary-orange transition-colors">
                                            {{ $est->nombre }}
                                        </h4>
                                        <div class="flex items-center gap-3 mt-1">
                                            <span class="flex items-center gap-2 text-sm font-black text-primary-orange bg-gray-900 px-4 py-1.5 rounded-xl border border-gray-800 uppercase tracking-tighter shadow-md">
                                                <i class="fas fa-barcode text-xs opacity-70"></i> CUE: <span class="text-white font-black">{{ $est->cue }}</span>
                                            </span>
                                            @if($est->establecimiento_cabecera)
                                                <span class="flex items-center gap-1.5 text-[9px] font-black text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 uppercase tracking-tighter">
                                                    <i class="fas fa-crown text-[10px]"></i> SEDE CABECERA
                                                </span>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Est. Modalities Table-like list -->
                            <div class="p-8">
                                <div class="space-y-6">
                                    @foreach($est->modalidades ?? [] as $mod)
                                        <div class="group/mod relative p-6 rounded-[32px] bg-gray-50/30 border border-gray-100 hover:bg-white hover:shadow-lg hover:border-orange-200 transition-all duration-300">
                                            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                                
                                                <!-- Level & Status (4 col) -->
                                                <div class="md:col-span-4 flex items-center gap-4">
                                                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/10 {{ $badgeClasses[$mod->estado_validacion] ?? 'bg-gray-400' }}">
                                                        <i class="fas fa-chalkboard-teacher text-lg"></i>
                                                    </div>
                                                    <div>
                                                        <span class="block text-sm font-black text-gray-800 uppercase tracking-tight">{{ $mod->nivel_educativo }}</span>
                                                        <div class="flex items-center gap-2 mt-1">
                                                            <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border {{ $badgeClasses[$mod->estado_validacion] ?? 'border-gray-300' }}">
                                                                {{ $mod->estado_validacion }}
                                                            </span>
                                                            @if($mod->validado_en)
                                                                <span class="text-[8px] font-bold text-gray-400 italic">Auditado el {{ \Carbon\Carbon::parse($mod->validado_en)->format('d/m/y') }}</span>
                                                            @endif
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Detailed Fields (5 col) -->
                                                <div class="md:col-span-5 grid grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <div>
                                                        <span class="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Categoría</span>
                                                        <span class="text-[10px] font-black text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-200/50 shadow-xs">{{ $mod->categoria ?? 'S/D' }}</span>
                                                    </div>
                                                    <div>
                                                        <span class="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ámbito</span>
                                                        <span class="text-[10px] font-black text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-200/50 shadow-xs">{{ $mod->ambito ?? 'S/D' }}</span>
                                                    </div>
                                                    <div>
                                                        <span class="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Zona</span>
                                                        <span class="text-[10px] font-black text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-200/50 shadow-xs">{{ $mod->zona ?? 'S/D' }}</span>
                                                    </div>
                                                    <div>
                                                        <span class="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Radio</span>
                                                        <span class="text-[10px] font-black text-primary-orange bg-orange-50/50 px-2 py-1 rounded-lg border border-orange-100 shadow-xs">{{ $mod->radio ?? 'S/D' }}</span>
                                                    </div>
                                                    <div class="col-span-2">
                                                        <span class="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dir. de Área</span>
                                                        <span class="text-[10px] font-bold text-gray-600 italic truncate block" title="{{ $mod->direccion_area }}">{{ $mod->direccion_area ?? 'N/C' }}</span>
                                                    </div>
                                                </div>

                                                <!-- Audit Actions (3 col) -->
                                                <div class="md:col-span-3 flex justify-end gap-2">
                                                    <button wire:click="toggleCorrecto({{ $mod->id }})" 
                                                            class="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50 text-green-600 border border-green-100 hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow-green-500/20"
                                                            title="Marcar como CORRECTO">
                                                        <i class="fas fa-check"></i>
                                                    </button>
                                                    <button wire:click="abrirCambiarEstado({{ $mod->id }})" 
                                                            class="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-[10px] font-black rounded-xl border border-gray-200 hover:border-primary-orange hover:text-primary-orange transition-all shadow-sm">
                                                        <i class="fas fa-edit"></i> CORREGIR
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- Observaciones Inline if any -->
                                            @if($mod->observaciones_validacion || $mod->historialEstados->first()?->observaciones)
                                                <div class="mt-4 pt-4 border-t border-gray-100 flex items-start gap-3">
                                                    <i class="fas fa-comment-alt text-[10px] text-gray-300 mt-1"></i>
                                                    <p class="text-[10px] font-bold text-gray-500 italic">
                                                        "{{ $mod->observaciones_validacion ?: $mod->historialEstados->first()->observaciones }}"
                                                    </p>
                                                </div>
                                            @endif
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- MODAL DE CAMBIO DE ESTADO (REUTILIZADO) -->
    @if($showCambiarEstadoModal && $modalidadSeleccionada)
    <div class="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="cerrarModales"></div>
            
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div class="inline-block align-bottom bg-white rounded-[40px] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full animate-modal-pop">
                <div class="bg-gray-900 px-8 py-8 relative">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-2xl bg-primary-orange flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <i class="fas fa-clipboard-check fa-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-black text-white leading-none mb-2">Validar Información</h3>
                            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">{{ $modalidadSeleccionada->establecimiento->nombre }}</p>
                        </div>
                    </div>
                    <button wire:click="cerrarModales" class="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors">
                        <i class="fas fa-times fa-lg"></i>
                    </button>
                </div>

                <div class="p-10 space-y-8">
                    <!-- Selector de Estado Premium -->
                    <div>
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Seleccione el Estado de Auditoría</label>
                        <div class="grid grid-cols-2 gap-4">
                            @foreach(['PENDIENTE', 'CORRECTO', 'CORREGIDO', 'FALTANTE_EDUGE', 'BAJA'] as $estado)
                                @php
                                    $meta = [
                                        'PENDIENTE' => ['color' => 'orange', 'icon' => 'clock', 'label' => 'Pendiente'],
                                        'CORRECTO' => ['color' => 'green', 'icon' => 'check-circle', 'label' => 'Correcto'],
                                        'CORREGIDO' => ['color' => 'blue', 'icon' => 'sync-alt', 'label' => 'Corregido'],
                                        'FALTANTE_EDUGE' => ['color' => 'red', 'icon' => 'exclamation-circle', 'label' => 'Faltante'],
                                        'BAJA' => ['color' => 'gray', 'icon' => 'minus-circle', 'label' => 'Baja'],
                                    ][$estado];
                                @endphp
                                <button wire:click="$set('nuevoEstado', '{{ $estado }}')"
                                        class="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left {{ $nuevoEstado === $estado ? 'border-primary-orange bg-orange-50 shadow-md ring-2 ring-orange-100' : 'border-gray-100 hover:border-gray-200' }}">
                                    <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-{{ $meta['color'] }}-500">
                                        <i class="fas fa-{{ $meta['icon'] }}"></i>
                                    </div>
                                    <span class="text-xs font-black text-gray-700 uppercase">{{ $meta['label'] }}</span>
                                </button>
                            @endforeach
                        </div>
                    </div>

                    <!-- Observaciones -->
                    <div>
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex justify-between">
                            Observaciones de Auditoría
                            @if($this->requiereObservaciones())
                                <span class="text-primary-orange font-black">OBLIGATORIO</span>
                            @endif
                        </label>
                        <textarea wire:model="observaciones" rows="4" 
                                  placeholder="Escriba aquí los detalles de la inconsistencia o los cambios realizados..."
                                  class="w-full p-5 rounded-3xl bg-gray-50 border-gray-100 text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-primary-orange transition-all"></textarea>
                        @error('observaciones') <span class="text-[10px] font-bold text-red-500 mt-2 block pl-2">{{ $message }}</span> @enderror
                    </div>
                </div>

                <div class="bg-gray-50 px-10 py-8 flex flex-col md:flex-row gap-4 border-t border-gray-100">
                    <button wire:click="cambiarEstado" class="btn-primary flex-1 py-4 text-xs font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-transform">
                        CONFIRMAR VALIDACIÓN
                    </button>
                    <button wire:click="cerrarModales" class="btn-secondary px-8 text-xs font-black uppercase">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    </div>
    @endif
</div>
