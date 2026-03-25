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
            
            <button wire:click="abrirBulkAction('EDIFICIO')" 
                    class="px-5 py-2.5 rounded-xl bg-primary-orange text-white flex items-center gap-3 shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95">
                <i class="fas fa-layer-group"></i>
                <div class="flex flex-col items-start">
                    <span class="text-[9px] font-black uppercase text-orange-200 tracking-tighter leading-none">Acción Global</span>
                    <span class="text-xs font-black">VALIDAR EDIFICIO</span>
                </div>
            </button>

            <div class="px-5 py-2.5 rounded-xl bg-gray-900 text-white flex items-center gap-3 shadow-lg">
                <i class="fas fa-id-card text-primary-orange"></i>
                <div class="flex flex-col">
                    <span class="text-[9px] font-black uppercase text-gray-400 tracking-tighter leading-none">CUI Edificio</span>
                    <span class="text-sm font-black font-mono">{{ $edificio->cui }}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- PANEL ACCION MASIVA -->
    @if($showBulkAction)
    <div class="mb-8 p-8 bg-gray-900 rounded-[40px] shadow-2xl border border-gray-800 animate-slide-up relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
            <i class="fas fa-layer-group text-8xl text-white"></i>
        </div>
        
        <div class="relative z-10">
            <div class="flex justify-between items-start mb-8">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <span class="px-3 py-1 bg-primary-orange text-white text-[10px] font-black rounded-lg uppercase">Validación Masiva</span>
                        <span class="text-gray-400 text-xs font-bold uppercase tracking-widest">
                            Scope: <span class="text-white">{{ $bulkScope === 'EDIFICIO' ? 'Todo el Edificio' : 'Establecimiento' }}</span>
                        </span>
                    </div>
                    <h3 class="text-2xl font-black text-white">Aplicar cambios a múltiples registros</h3>
                    <p class="text-sm text-gray-400">Esta acción afectará a todas las modalidades dentro del alcance seleccionado.</p>
                </div>
                <button wire:click="cerrarModales" class="text-gray-500 hover:text-white transition-colors">
                    <i class="fas fa-times fa-lg"></i>
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {{-- Selector de Estado --}}
                <div class="space-y-4">
                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Nuevo Estado para el Grupo</label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        @foreach($this->estadosMetadata as $key => $meta)
                            <button type="button" 
                                    wire:click="$set('bulkEstado', '{{ $key }}')"
                                    class="flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all text-left
                                           {{ $bulkEstado === $key 
                                              ? 'border-primary-orange bg-orange-500/10 text-white shadow-[0_0_20px_rgba(255,102,0,0.2)]' 
                                              : 'border-gray-800 bg-gray-800/50 text-gray-500 hover:border-gray-700' }}">
                                <i class="fas {{ $meta['icon'] }} {{ $bulkEstado === $key ? 'text-primary-orange' : '' }}"></i>
                                <span class="text-[10px] font-black uppercase">{{ $meta['badge'] }}</span>
                            </button>
                        @endforeach
                    </div>
                </div>

                {{-- Observaciones --}}
                <div class="space-y-4">
                    <label class="block text-[10px] font-black text-gray-500 uppercase tracking-widest flex justify-between">
                        Observación Histórica Única
                        @if(in_array($bulkEstado, ['CORREGIDO', 'REVISAR', 'BAJA', 'ELIMINADO']))
                            <span class="text-primary-orange text-[9px]">OBLIGATORIO</span>
                        @endif
                    </label>
                    <div class="flex flex-col gap-4">
                        <textarea wire:model="bulkObservaciones" rows="3" 
                                  class="w-full bg-gray-800 border-gray-700 text-white rounded-2xl focus:border-primary-orange focus:ring-primary-orange text-sm p-4"
                                  placeholder="Indique el motivo del cambio masivo (ej: Corrección de domicilio del edificio)..."></textarea>
                        
                        <div class="flex gap-3">
                            <button wire:click="aplicarValidacionMasiva" class="btn-primary flex-1 py-4 text-[10px] font-black uppercase shadow-lg shadow-orange-500/20 shadow-lg">
                                <i class="fas fa-check-double mr-2"></i> Procesar Validación Masiva
                            </button>
                            <button wire:click="cerrarModales" class="btn-secondary px-6 text-[10px] font-black uppercase">
                                Cancelar
                            </button>
                        </div>
                        @error('bulkObservaciones') <span class="text-[10px] font-bold text-red-400 italic font-mono">{{ $message }}</span> @enderror
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endif

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
                                            <span class="flex items-center gap-2 text-[10px] font-black text-gray-700 bg-white px-3 py-1 rounded-lg border border-gray-200 uppercase tracking-tighter shadow-sm">
                                                <i class="fas fa-building text-xs opacity-50 text-primary-orange"></i> CUI: <span class="text-gray-900 font-black">{{ $edificio->cui }}</span>
                                            </span>
                                            @if($est->establecimiento_cabecera)
                                                <span class="flex items-center gap-1.5 text-[9px] font-black text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100 uppercase tracking-tighter">
                                                    <i class="fas fa-crown text-[10px]"></i> {{ $est->establecimiento_cabecera }}
                                                </span>
                                            @endif
                                        </div>
                                    </div>
                                </div>
                                <button wire:click="abrirBulkAction('ESTABLECIMIENTO', {{ $est->id }})" 
                                        class="px-4 py-2 bg-white text-gray-400 text-[10px] font-black rounded-xl border border-gray-100 hover:border-primary-orange hover:text-primary-orange transition-all shadow-sm flex items-center gap-2 group/btn">
                                    <i class="fas fa-school text-primary-orange/50 group-hover/btn:scale-110 transition-transform"></i>
                                    VALIDACIÓN ESCUELA
                                </button>
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
                                                    @if($editModalidadId !== $mod->id)
                                                        <button wire:click="toggleCorrecto({{ $mod->id }})" 
                                                                class="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50 text-green-600 border border-green-100 hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow-green-500/20"
                                                                title="Marcar como CORRECTO">
                                                            <i class="fas fa-check"></i>
                                                        </button>
                                                        <button wire:click="abrirCambiarEstado({{ $mod->id }})" 
                                                                class="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-[10px] font-black rounded-xl border border-gray-200 hover:border-primary-orange hover:text-primary-orange transition-all shadow-sm">
                                                            <i class="fas fa-edit"></i> CORREGIR
                                                        </button>
                                                    @else
                                                        <button wire:click="cerrarModales" class="btn-secondary px-3 py-1.5 text-[10px] uppercase">
                                                            Cancelar
                                                        </button>
                                                    @endif
                                                </div>
                                            </div>

                                            <!-- Formulario de Edición Inline -->
                                            @if($editModalidadId === $mod->id)
                                                <div class="mt-6 pt-6 border-t border-orange-100 space-y-4 animate-fade-in">
                                                    <div class="flex flex-col md:flex-row gap-6">
                                                        {{-- Pill Selector --}}
                                                        <div class="flex-1">
                                                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nuevo Estado</label>
                                                            <div class="flex flex-wrap gap-2">
                                                                @foreach($this->estadosMetadata as $key => $meta)
                                                                    <button type="button" 
                                                                            wire:click="$set('nuevoEstado', '{{ $key }}')"
                                                                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-[10px] font-black uppercase transition-all
                                                                                   {{ $nuevoEstado === $key 
                                                                                      ? "{$meta['border']} {$meta['bg']} {$meta['color']}" 
                                                                                      : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200' }}">
                                                                        <i class="fas {{ $meta['icon'] }} text-[9px]"></i>
                                                                        {{ $meta['badge'] }}
                                                                    </button>
                                                                @endforeach
                                                            </div>
                                                        </div>

                                                        {{-- Observations & Save --}}
                                                        <div class="flex-[1.5] flex flex-col gap-2">
                                                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between">
                                                                Observaciones
                                                                @if(in_array($nuevoEstado, ['CORREGIDO', 'REVISAR', 'BAJA', 'ELIMINADO']))
                                                                    <span class="text-primary-orange">OBLIGATORIO</span>
                                                                @endif
                                                            </label>
                                                            <div class="flex gap-2">
                                                                <textarea wire:model="observaciones" rows="2" 
                                                                          class="input-glass flex-1 text-xs py-2" 
                                                                          placeholder="Detalles de la validación..."></textarea>
                                                                <button wire:click="cambiarEstado" class="btn-primary px-4 self-end h-10">
                                                                    <i class="fas fa-save"></i>
                                                                </button>
                                                            </div>
                                                            @error('observaciones') <span class="text-[9px] font-bold text-red-500">{{ $message }}</span> @enderror
                                                        </div>
                                                    </div>
                                                </div>
                                            @else
                                                <!-- Observaciones Inline si NO está editando -->
                                                @if($mod->observaciones || $mod->historialEstados->first()?->observaciones)
                                                    <div class="mt-4 pt-4 border-t border-gray-100 flex items-start gap-3">
                                                        <i class="fas fa-comment-alt text-[10px] text-gray-300 mt-1"></i>
                                                        <p class="text-[10px] font-bold text-gray-500 italic">
                                                            "{{ $mod->observaciones ?: $mod->historialEstados->first()->observaciones }}"
                                                        </p>
                                                    </div>
                                                @endif
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

</div>
