<div>
    <!-- HEADER ESTRATÉGICO -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2" style="color: #FE8204;">
                <i class="fas fa-university"></i>
                <span>Ministerio de Educación</span>
                <span>•</span>
                <span>Gestión Legal</span>
            </nav>
            <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg" style="background-color: rgba(254, 130, 4, 0.1);">
                    <i class="fas fa-gavel fa-2x" style="color: #FE8204;"></i>
                </div>
                <h2 class="text-4xl font-extrabold tracking-tight" style="color: #000000;">Instrumentos Legales</h2>
            </div>
            <p class="mt-1 ml-14" style="color: #000000;">Actualización y control de normativa de creación, categorización y radios.</p>
        </div>
    </div>

    <!-- FILTROS -->
    <div class="mb-8 bg-white rounded-lg overflow-hidden" style="border: 1px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);">
        <div class="px-6 py-4 flex justify-between items-center" style="background-color: #FE8204;">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg">
                    <i class="fas fa-filter" style="color: #FE8204;"></i>
                </div>
                <h3 class="font-bold text-white">Filtros de Búsqueda</h3>
            </div>
        </div>
        
        <div class="p-6 bg-white">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                    <label class="block text-xs font-bold uppercase mb-2 ml-1" style="color: #000000;">Buscar Establecimiento</label>
                    <div class="relative">
                        <input type="text" wire:model.live.debounce.300ms="search" placeholder="Nombre o CUE..." 
                               class="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg transition"
                               style="border: 1px solid #FE8204; color: #000000;">
                        <i class="fas fa-search absolute left-3 top-3.5" style="color: #FE8204;"></i>
                    </div>
                </div>
                
                <div>
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox" wire:model.live="filterMissing" class="form-checkbox rounded text-orange-600 focus:ring-orange-500 h-5 w-5">
                        <span class="ml-2 font-bold text-gray-700">Ver solo con datos faltantes</span>
                    </label>
                </div>
            </div>
        </div>
    </div>

    <!-- TABLA -->
    <div class="bg-white rounded-lg overflow-hidden" style="border: 1px solid #FE8204; box-shadow: 0 4px 12px rgba(254, 130, 4, 0.15);">
        <table class="min-w-full">
            <thead>
                <tr style="background-color: #FE8204;">
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider w-1/3">Establecimiento</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Inst. Legal Radio</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Inst. Legal Categoría</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Inst. Legal Creación</th>
                    <th class="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider w-24">Acciones</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y" style="border-color: #ffe0b2;">
                @forelse($modalidades as $mod)
                    <tr class="group transition-all hover:bg-orange-50">
                        <!-- Nombre y CUE -->
                        <td class="px-6 py-4">
                            @if($mod->establecimiento)
                                <div class="text-sm font-bold uppercase text-gray-900">{{ $mod->establecimiento->nombre }}</div>
                                <span class="text-xs text-gray-500 font-mono">CUE: {{ $mod->establecimiento->cue }}</span>
                                <div class="text-[10px] text-orange-600 mt-1">{{ $mod->nivel_educativo }}</div>
                            @else
                                <span class="text-red-500">Sin Establecimiento Asignado</span>
                            @endif
                        </td>

                        @if($editingId === $mod->id)
                            <!-- MODO EDICIÓN -->
                            <td class="px-6 py-4">
                                <input type="text" wire:model="editForm.inst_legal_radio" class="w-full text-xs rounded border-orange-300 focus:border-orange-500 focus:ring-orange-500">
                            </td>
                            <td class="px-6 py-4">
                                <input type="text" wire:model="editForm.inst_legal_categoria" class="w-full text-xs rounded border-orange-300 focus:border-orange-500 focus:ring-orange-500">
                            </td>
                            <td class="px-6 py-4">
                                <input type="text" wire:model="editForm.inst_legal_creacion" class="w-full text-xs rounded border-orange-300 focus:border-orange-500 focus:ring-orange-500">
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex justify-end gap-2">
                                    <button wire:click="save" class="text-green-600 hover:text-green-800" title="Guardar">
                                        <i class="fas fa-save fa-lg"></i>
                                    </button>
                                    <button wire:click="cancelEdit" class="text-red-500 hover:text-red-700" title="Cancelar">
                                        <i class="fas fa-times fa-lg"></i>
                                    </button>
                                </div>
                            </td>
                        @else
                            <!-- MODO VISUALIZACIÓN -->
                            <td class="px-6 py-4 text-sm text-gray-700">
                                {{ $mod->inst_legal_radio ?: '-' }}
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-700">
                                {{ $mod->inst_legal_categoria ?: '-' }}
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-700">
                                {{ $mod->inst_legal_creacion ?: '-' }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button wire:click="startEdit({{ $mod->id }})" 
                                        class="text-orange-500 hover:text-orange-700 transition" 
                                        title="Editar">
                                    <i class="fas fa-pencil-alt"></i>
                                </button>
                            </td>
                        @endif
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                            No se encontraron registros.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        {{ $modalidades->links() }}
    </div>
</div>
