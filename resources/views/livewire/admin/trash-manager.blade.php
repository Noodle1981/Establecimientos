<div class="animate-fade-in">
    <!-- HEADER -->
    <div class="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-red-600">
                <i class="fas fa-trash-alt"></i>
                <span>Administración</span>
                <span>•</span>
                <span>Zona de Limpieza Crítica</span>
            </nav>
            <div class="flex items-center gap-3">
                <div class="p-3 rounded-xl bg-red-50 border border-red-100 shadow-sm text-red-600">
                    <i class="fas fa-skull-crossbones fa-2x"></i>
                </div>
                <div>
                    <h2 class="text-3xl font-black tracking-tight text-gray-900">
                        Papelera de <span class="text-red-700">Admins</span>
                    </h2>
                    <p class="text-sm text-gray-500 font-medium italic">Gestión de registros eliminados y resolución de conflictos de CUE</p>
                </div>
            </div>
        </div>
        
        <a href="{{ route('admin.establecimientos') }}" class="btn-secondary flex items-center gap-2">
            <i class="fas fa-arrow-left"></i>
            Volver a Establecimientos
        </a>
    </div>

    <!-- FLASH MESSAGES -->
    <div class="mb-6">
        @if (session()->has('success'))
            <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 border border-green-200" role="alert">
                <i class="fas fa-check-circle mr-2"></i> {{ session('success') }}
            </div>
        @endif
        @if (session()->has('error'))
            <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200" role="alert">
                <i class="fas fa-exclamation-circle mr-2"></i> {{ session('error') }}
            </div>
        @endif
    </div>

    <!-- BUSCADOR -->
    <div class="mb-6">
        <div class="relative max-w-md">
            <input type="text" wire:model.live.debounce.300ms="search" 
                   placeholder="Buscar en la papelera (Nombre o CUE)..." 
                   class="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 focus:ring-red-500 focus:border-red-500 shadow-sm">
            <i class="fas fa-search absolute left-3 top-4 text-gray-400"></i>
        </div>
    </div>

    <!-- TABLA DE ELIMINADOS -->
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Establecimiento</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Detalles</th>
                        <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Eliminado el</th>
                        <th class="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones Críticas</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50 bg-white">
                    @forelse($modalidades as $modalidad)
                        <tr class="hover:bg-red-50/10 transition-colors">
                            <td class="px-6 py-4">
                                <div class="font-black text-gray-900 uppercase">{{ $modalidad->establecimiento->nombre }}</div>
                                <div class="flex gap-2 mt-1">
                                    <span class="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">CUE: {{ $modalidad->establecimiento->cue }}</span>
                                    <span class="text-[10px] px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">CUI: {{ $modalidad->establecimiento->edificio->cui }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600">
                                <div>{{ $modalidad->nivel_educativo }}</div>
                                <div class="text-xs text-gray-400">{{ $modalidad->establecimiento->edificio->localidad }}</div>
                            </td>
                            <td class="px-6 py-4 text-sm text-red-400 font-medium">
                                {{ $modalidad->deleted_at->format('d/m/Y H:i') }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex justify-end gap-2">
                                    <button wire:click="restore({{ $modalidad->id }})" 
                                            class="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors shadow-sm border border-green-200">
                                        <i class="fas fa-undo"></i> Restaurar
                                    </button>
                                    <button wire:click="confirmDelete({{ $modalidad->id }})" 
                                            class="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all shadow-md">
                                        <i class="fas fa-skull-crossbones"></i> BORRADO DEFINITIVO
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-6 py-16 text-center">
                                <div class="flex flex-col items-center justify-center text-gray-400">
                                    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <i class="fas fa-trash-alt fa-2x"></i>
                                    </div>
                                    <p class="text-lg font-bold">La papelera está vacía</p>
                                    <p class="text-sm">No hay registros eliminados que coincidan con la búsqueda.</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
            {{ $modalidades->links() }}
        </div>
    </div>

    <!-- MODAL DE CONFIRMACIÓN CRÍTICA -->
    @if($showDeleteModal && $selectedModalidad)
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="closeModals"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50">
                <div class="px-6 py-4 bg-red-700 flex justify-between items-center">
                    <h3 class="text-lg font-black text-white flex items-center gap-2 uppercase tracking-widest">
                        <i class="fas fa-exclamation-triangle"></i> Peligro Máximo
                    </h3>
                    <button wire:click="closeModals" class="text-white hover:text-red-200 transition">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="p-8">
                    <div class="text-center mb-6">
                        <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-50 shadow-inner">
                            <i class="fas fa-trash-alt fa-3x"></i>
                        </div>
                        <h4 class="text-xl font-bold text-gray-900 mb-2">¿Confirmar Borrado Definitivo?</h4>
                        <p class="text-sm text-gray-500">Estás por eliminar permanentemente el establecimiento:</p>
                        <div class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div class="text-lg font-black text-red-700 uppercase leading-tight">{{ $selectedModalidad->establecimiento->nombre }}</div>
                            <div class="text-xs font-mono text-gray-400 mt-1">CUE: {{ $selectedModalidad->establecimiento->cue }} | CUI: {{ $selectedModalidad->establecimiento->edificio->cui }}</div>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                            <i class="fas fa-info-circle text-orange-500 mt-1"></i>
                            <div class="text-[11px] text-orange-800 leading-relaxed font-medium">
                                Esta acción eliminará el registro de la base de datos de forma irreversible. Se borrarán todas las modalidades y auditorías asociadas. El CUE quedará liberado inmediatamente.
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 grid grid-cols-2 gap-3">
                        <button wire:click="closeModals" class="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all border border-gray-200 uppercase text-xs tracking-wider">
                            Cancelar
                        </button>
                        <button wire:click="forceDeleteEverything({{ $selectedModalidad->id }})" 
                                wire:loading.attr="disabled"
                                class="w-full py-3 px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl font-black transition-all shadow-lg flex items-center justify-center gap-2 uppercase text-xs tracking-wider">
                            <span wire:loading.remove wire:target="forceDeleteEverything">¡Eliminar para Siempre!</span>
                            <span wire:loading wire:target="forceDeleteEverything"><i class="fas fa-spinner fa-spin"></i> Procesando...</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @endif
</div>
