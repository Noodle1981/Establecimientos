<div class="min-h-screen bg-white pb-20">
    <div class="max-w-5xl mx-auto px-4 pt-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
                <nav class="flex items-center text-sm text-gray-500 mb-4 space-x-2">
                    <a href="{{ route('admin.auditorias') }}" class="hover:text-orange-500 transition-colors">Auditorías</a>
                    <span>/</span>
                    <span class="text-black font-semibold">Nuevo Cotejo de Datos</span>
                </nav>
                <h1 class="text-5xl font-black text-black tracking-tight">AUDITORÍA <span class="text-orange-500">EDUGE</span></h1>
                <p class="text-gray-500 mt-2 text-lg">Reconciliación de datos entre sistema y plataforma oficial.</p>
            </div>
            <a href="{{ route('admin.auditorias') }}" class="px-6 py-3 border-2 border-black text-black font-bold rounded-2xl hover:bg-black hover:text-white transition-all text-sm">
                CANCELAR
            </a>
        </div>

        <form wire:submit.prevent="save" class="space-y-10">
            <!-- Sección 1: Contexto del Cotejo -->
            <div class="bg-gray-50 rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <div class="flex items-center space-x-3 mb-8">
                    <div class="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold">1</div>
                    <h2 class="text-2xl font-bold text-black">Contexto del Cotejo</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Tipo de Auditoría</label>
                        <select wire:model.live="tipo_cotejo" class="w-full px-5 py-4 rounded-2xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-bold transition-all">
                            <option value="RECONCILIACION">RECONCILIACIÓN (EXISTENTE)</option>
                            <option value="FALTANTE">ESTABLECIMIENTO FALTANTE</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Fecha del Cotejo</label>
                        <input type="date" wire:model="fecha_visita" class="w-full px-5 py-4 rounded-2xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-bold transition-all">
                        @error('fecha_visita') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                    </div>

                    <div class="md:col-span-2">
                        @if($tipo_cotejo === 'RECONCILIACION')
                            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Seleccionar Establecimiento en Sistema</label>
                            <select wire:model="establecimiento_id" class="w-full px-5 py-4 rounded-2xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-bold transition-all">
                                <option value="">Seleccione un establecimiento...</option>
                                @foreach($establecimientos as $est)
                                    <option value="{{ $est->id }}">{{ $est->nombre }} (CUE: {{ $est->cue }})</option>
                                @endforeach
                            </select>
                            @error('establecimiento_id') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                        @else
                            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Identificador / Nombre en EDUGE</label>
                            <input type="text" wire:model="identificador_eduge" placeholder="Nombre completo o CUE como figura en EDUGE" class="w-full px-5 py-4 rounded-2xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-bold transition-all uppercase">
                            @error('identificador_eduge') <span class="text-red-500 text-xs mt-1">{{ $message }}</span> @enderror
                        @endif
                    </div>
                </div>
            </div>

            <!-- Sección 2: Discrepancias Detectadas -->
            <div class="bg-black rounded-3xl p-8 mb-10 shadow-2xl">
                <div class="flex items-center space-x-3 mb-8">
                    <div class="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold">2</div>
                    <h2 class="text-2xl font-bold text-white">Cotejo de Campos</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <input type="text" wire:model="nuevoCampo" placeholder="CAMPO (Ej: Nombre, Domicilio)" class="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 transition-all outline-none bg-white/10 text-white font-bold placeholder-gray-500 uppercase">
                    </div>
                    <div>
                        <input type="text" wire:model="valorAnterior" placeholder="VALOR EN SISTEMA" class="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-red-500 transition-all outline-none bg-white/10 text-white font-bold placeholder-gray-500 uppercase">
                    </div>
                    <div class="flex gap-2">
                        <input type="text" wire:model="valorNuevo" placeholder="VALOR EN EDUGE" class="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-green-500 transition-all outline-none bg-white/10 text-white font-bold placeholder-gray-500 uppercase flex-1">
                        <button type="button" wire:click="addCambio" class="bg-orange-500 text-white p-4 rounded-2xl hover:bg-orange-600 transition-all">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
                        </button>
                    </div>
                </div>

                <!-- Listado de cambios -->
                @if(count($cambios) > 0)
                <div class="space-y-3 mt-8 border-t border-white/10 pt-8">
                    @foreach($cambios as $index => $cambio)
                    <div class="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div class="grid grid-cols-3 flex-1 gap-4">
                            <span class="text-orange-400 font-black text-xs uppercase tracking-widest">{{ $cambio['campo'] }}</span>
                            <span class="text-red-400 font-bold line-through opacity-50">{{ $cambio['anterior'] }}</span>
                            <span class="text-green-400 font-bold">{{ $cambio['nuevo'] }}</span>
                        </div>
                        <button type="button" wire:click="removeCambio({{ $index }})" class="text-gray-500 hover:text-red-500 transition-colors ml-4">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                    @endforeach
                </div>
                @else
                <p class="text-gray-500 text-center py-4 italic">No hay discrepancias registradas aún.</p>
                @endif
                @error('cambios') <p class="text-red-500 text-xs mt-4">{{ $message }}</p> @enderror
            </div>

            <!-- Sección 3: Observaciones y Cierre -->
            <div class="bg-gray-50 rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <div class="flex items-center space-x-3 mb-8">
                    <div class="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold">3</div>
                    <h2 class="text-2xl font-bold text-black">Conclusión del Cotejo</h2>
                </div>

                <textarea wire:model="observaciones" rows="4" placeholder="Describa brevemente el resultado del cotejo o cualquier nota relevante para el informe..." class="w-full px-5 py-4 rounded-2xl border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium transition-all"></textarea>
                @error('observaciones') <p class="text-red-500 text-xs mt-2">{{ $message }}</p> @enderror

                <div class="flex justify-end mt-10">
                    <button type="submit" class="px-12 py-5 bg-black text-white font-black text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl tracking-widest">
                        PUBLICAR INFORME DE COTEJO
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
