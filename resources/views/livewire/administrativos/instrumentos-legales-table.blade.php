<div>
    <!-- HEADER ESTRATÉGICO -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 animate-fade-in">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-primary-orange">
                <i class="fas fa-university"></i>
                <span>Ministerio de Educación</span>
                <span>•</span>
                <span>Gestión Legal</span>
            </nav>
            <div class="flex items-center gap-3">
                <div class="p-3 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
                    <i class="fas fa-gavel fa-2x text-primary-orange"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-black tracking-tight text-black">
                        Instrumentos <span class="text-primary-orange">Legales</span>
                    </h2>
                    <p class="text-sm text-gray-500 font-medium">Normativa de creación, categorización y radios escolares</p>
                </div>
            </div>
        </div>
        
        <div class="flex flex-wrap gap-3 glass p-2 rounded-xl">
             @if (session()->has('message'))
                <div class="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-bold flex items-center gap-2">
                    <i class="fas fa-check-circle"></i>
                    {{ session('message') }}
                </div>
            @endif
        </div>
    </div>

    <!-- FLASH MESSAGES -->
    <div class="mb-4">
        <x-toast-notifications />
    </div>

    <!-- FILTROS AVANZADOS -->
    <div class="mb-8 glass-strong rounded-xl overflow-hidden shadow-lg" x-data="{ filtersOpen: true }">
        <div class="px-6 py-4 flex justify-between items-center bg-orange-50/50 border-b border-orange-100">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm text-primary-orange">
                    <i class="fas fa-filter"></i>
                </div>
                <h3 class="font-bold text-gray-800">Filtros de Búsqueda</h3>
            </div>
            <button @click="filtersOpen = !filtersOpen" class="text-gray-400 hover:text-primary-orange transition-colors">
                <i class="fas fa-chevron-down transform transition duration-300" :class="filtersOpen ? 'rotate-180' : ''"></i>
            </button>
        </div>
        
        <div x-show="filtersOpen" x-collapse class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1 text-gray-500">Buscar Establecimiento</label>
                    <div class="relative">
                        <input type="text" wire:model.live.debounce.300ms="search" 
                               placeholder="Nombre, CUE o nivel..." 
                               class="input-glass w-full pl-10 pr-4 py-2.5 rounded-lg transition-all focus:ring-2 focus:ring-orange-500/20">
                        <i class="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
                    </div>
                </div>
                
                <div class="pb-2">
                    <label class="inline-flex items-center cursor-pointer group select-none">
                        <div class="relative">
                            <input type="checkbox" wire:model.live="filterMissing" class="sr-only peer">
                            <div class="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-orange"></div>
                        </div>
                        <span class="ml-3 text-sm font-bold text-gray-700 group-hover:text-primary-orange transition-colors">Ver solo con datos faltantes</span>
                    </label>
                </div>
            </div>
        </div>
    </div>

    <!-- TABLA -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="bg-primary-orange text-white">
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider w-1/3">Establecimiento</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Inst. Legal Radio</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Inst. Legal Categoría</th>
                        <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Inst. Legal Creación</th>
                        <th class="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider w-32">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 bg-white">
                    @forelse($modalidades as $mod)
                        <tr class="group hover:bg-orange-50/30 transition-colors duration-200">
                            <!-- Nombre y CUE -->
                            <td class="px-6 py-4">
                                @if($mod->establecimiento)
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded bg-gray-50 flex items-center justify-center font-bold text-primary-orange border border-gray-200 text-xs shadow-sm">
                                            {{ substr($mod->establecimiento->nombre, 0, 1) }}
                                        </div>
                                        <div>
                                            <div class="text-sm font-bold text-gray-900 leading-tight uppercase">{{ $mod->establecimiento->nombre }}</div>
                                            <div class="flex gap-2 mt-1">
                                                <span class="text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">CUE: {{ $mod->establecimiento->cue }}</span>
                                                <span class="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200 font-bold">{{ $mod->nivel_educativo }}</span>
                                            </div>
                                        </div>
                                    </div>
                                @else
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Sin Establecimiento
                                    </span>
                                @endif
                            </td>

                            @if($editingId === $mod->id)
                                <!-- MODO EDICIÓN -->
                                <td class="px-6 py-4">
                                    <input type="text" wire:model="editForm.inst_legal_radio" 
                                           class="input-glass w-full text-xs py-2 px-3 focus:ring-2 focus:ring-orange-500/50" 
                                           placeholder="---">
                                </td>
                                <td class="px-6 py-4">
                                    <input type="text" wire:model="editForm.inst_legal_categoria" 
                                           class="input-glass w-full text-xs py-2 px-3 focus:ring-2 focus:ring-orange-500/50"
                                           placeholder="---">
                                </td>
                                <td class="px-6 py-4">
                                    <input type="text" wire:model="editForm.inst_legal_creacion" 
                                           class="input-glass w-full text-xs py-2 px-3 focus:ring-2 focus:ring-orange-500/50"
                                           placeholder="---">
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex justify-end gap-2">
                                        <button wire:click="save" class="btn-primary px-3 py-1.5 text-xs shadow-md" title="Guardar">
                                            <i class="fas fa-save mr-1"></i> Guardar
                                        </button>
                                        <button wire:click="cancelEdit" class="btn-secondary px-3 py-1.5 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" title="Cancelar">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </td>
                            @else
                                <!-- MODO VISUALIZACIÓN -->
                                <td class="px-6 py-4 text-xs font-medium text-gray-700">
                                    {{ $mod->inst_legal_radio ?: '-' }}
                                </td>
                                <td class="px-6 py-4 text-xs font-medium text-gray-700">
                                    {{ $mod->inst_legal_categoria ?: '-' }}
                                </td>
                                <td class="px-6 py-4 text-xs font-medium text-gray-700">
                                    {{ $mod->inst_legal_creacion ?: '-' }}
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <button wire:click="startEdit({{ $mod->id }})" 
                                            class="p-2 rounded-lg text-gray-400 hover:text-primary-orange hover:bg-orange-50 transition-all" 
                                            title="Editar">
                                        <i class="fas fa-pencil-alt"></i>
                                    </button>
                                </td>
                            @endif
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center justify-center">
                                    <div class="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                                        <i class="fas fa-search fa-2x text-primary-orange/50"></i>
                                    </div>
                                    <h3 class="text-lg font-bold text-gray-900">No hay registros</h3>
                                    <p class="text-gray-500 text-sm">Intenta ajustar los filtros o desactivar "Datos faltantes"</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            {{ $modalidades->links() }}
        </div>
    </div>
</div>
