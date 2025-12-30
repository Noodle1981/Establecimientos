<div class="min-h-screen bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <h1 class="text-5xl font-black text-black tracking-tight mb-2">AUDITORÍAS <span class="text-orange-500">EDUGE</span></h1>
                <p class="text-gray-500 text-lg font-medium">Reconciliación y cotejo de datos oficiales.</p>
            </div>
            <div class="flex items-center gap-3">
                <!-- Botón de Informe General -->
                <a href="{{ route('admin.auditorias.reporte-general', ['date_from' => $dateFrom, 'date_to' => $dateTo]) }}" 
                   class="px-6 py-4 bg-gray-100 text-black font-bold rounded-2xl hover:bg-gray-200 transition-all text-sm flex items-center gap-2">
                    📄 INFORME GLOBAL
                </a>
                <a href="{{ route('admin.auditorias.create') }}" 
                   class="px-8 py-4 bg-black text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm shadow-2xl shadow-orange-200 flex items-center gap-2">
                    <span class="text-orange-500">+</span> NUEVO COTEJO
                </a>
            </div>
        </div>

        <!-- Alertas -->
        @if (session()->has('success'))
            <div class="mb-8 bg-green-50 border-l-4 border-green-500 p-4 rounded-xl">
                <p class="text-green-700 font-bold uppercase text-xs tracking-widest">{{ session('success') }}</p>
            </div>
        @endif

        <!-- Filters Section -->
        <div class="bg-gray-50 rounded-[32px] p-8 mb-10 border border-gray-100 shadow-sm">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Buscar Establecimiento</label>
                    <input type="text" wire:model.live="search" placeholder="Nombre o CUE..." 
                           class="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 transition-all outline-none bg-white font-bold shadow-sm">
                </div>

                <div>
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Auditor</label>
                    <select wire:model.live="userFilter" 
                            class="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 transition-all outline-none bg-white font-bold shadow-sm appearance-none">
                        <option value="">Todos los auditores</option>
                        @foreach($usuarios as $user)
                            <option value="{{ $user->id }}">{{ $user->name }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Desde</label>
                    <input type="date" wire:model.live="dateFrom" 
                           class="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 transition-all outline-none bg-white font-bold shadow-sm">
                </div>

                <div>
                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Hasta</label>
                    <input type="date" wire:model.live="dateTo" 
                           class="w-full px-5 py-4 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 transition-all outline-none bg-white font-bold shadow-sm">
                </div>
            </div>
        </div>

        <!-- Table View -->
        <div class="bg-white rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-100">
                    <thead class="bg-black">
                        <tr>
                            <th class="px-8 py-5 text-left text-xs font-black text-white uppercase tracking-[0.2em]">CUE</th>
                            <th class="px-8 py-5 text-left text-xs font-black text-white uppercase tracking-[0.2em]">Establecimiento / EDUGE</th>
                            <th class="px-8 py-5 text-left text-xs font-black text-white uppercase tracking-[0.2em]">Fecha</th>
                            <th class="px-8 py-5 text-left text-xs font-black text-white uppercase tracking-[0.2em]">Auditado por</th>
                            <th class="px-8 py-5 text-center text-xs font-black text-white uppercase tracking-[0.2em]">Cambios</th>
                            <th class="px-8 py-5 text-center text-xs font-black text-white uppercase tracking-[0.2em] w-32">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @forelse($auditorias as $auditoria)
                            <tr class="hover:bg-orange-50/30 transition-colors group">
                                <td class="px-8 py-6">
                                    <span class="text-sm font-black text-black">
                                        {{ $auditoria->establecimiento ? $auditoria->establecimiento->cue : 'N/A' }}
                                    </span>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="flex flex-col">
                                        <span class="text-sm font-bold text-black group-hover:text-orange-600 transition-colors">
                                            {{ $auditoria->establecimiento ? $auditoria->establecimiento->nombre : ($auditoria->identificador_eduge ?? 'SIN IDENTIFICAR') }}
                                        </span>
                                        @if($auditoria->tipo_cotejo === 'FALTANTE')
                                            <span class="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">⚠️ FALTANTE EN SISTEMA</span>
                                        @else
                                            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">✓ RECONCILIACIÓN</span>
                                        @endif
                                    </div>
                                </td>
                                <td class="px-8 py-6">
                                    <span class="text-sm font-medium text-gray-600">
                                        {{ \Carbon\Carbon::parse($auditoria->fecha_visita)->format('d/m/Y') }}
                                    </span>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-black text-orange-600">
                                            {{ substr($auditoria->user->name, 0, 1) }}
                                        </div>
                                        <span class="text-sm font-bold text-gray-700">{{ $auditoria->user->name }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-6 text-center">
                                    <span class="px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-black tracking-widest">
                                        {{ $auditoria->cambios ? count($auditoria->cambios) : 0 }} OBS
                                    </span>
                                </td>
                                <td class="px-8 py-6">
                                    <div class="flex items-center justify-center gap-2">
                                        <button wire:click="viewAuditoria({{ $auditoria->id }})" 
                                                class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all shadow-sm">
                                            👁️
                                        </button>
                                        <a href="{{ route('admin.auditorias.pdf', $auditoria->id) }}" 
                                           class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                                            📄
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="px-8 py-20 text-center">
                                    <div class="flex flex-col items-center">
                                        <div class="text-6xl mb-4 grayscale opacity-20">📋</div>
                                        <p class="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">No se encontraron informes de cotejo</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="px-8 py-6 bg-gray-50/50 border-t border-gray-100">
                {{ $auditorias->links() }}
            </div>
        </div>
    </div>

    <!-- Modal de Vista Detallada -->
    @if($showViewModal && $selectedAuditoria)
        <div class="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" wire:click="closeModals"></div>

                <div class="inline-block align-bottom bg-white rounded-[40px] text-left overflow-hidden shadow-2xl transform transition-all sm:my-10 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div class="absolute top-8 right-8 z-10">
                        <button wire:click="closeModals" class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-all">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <div class="flex flex-col md:flex-row min-h-[600px]">
                        <!-- Sidebar Información -->
                        <div class="w-full md:w-80 bg-gray-50 p-10 border-r border-gray-100">
                            <div class="mb-10">
                                <span class="px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black tracking-widest uppercase mb-4 inline-block">
                                    {{ $selectedAuditoria->tipo_cotejo ?? 'RECONCILIACIÓN' }}
                                </span>
                                <h3 class="text-3xl font-black text-black leading-tight">DETALLES DEL COTEJO</h3>
                            </div>

                            <div class="space-y-8">
                                <div>
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Auditado por</label>
                                    <p class="text-black font-bold">{{ $selectedAuditoria->user->name }}</p>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fecha Oficial</label>
                                    <p class="text-black font-bold">{{ \Carbon\Carbon::parse($selectedAuditoria->fecha_visita)->format('d/m/Y') }}</p>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">CUE de Origen</label>
                                    <p class="text-black font-bold">{{ $selectedAuditoria->establecimiento ? $selectedAuditoria->establecimiento->cue : 'N/A' }}</p>
                                </div>
                                <div class="pt-10">
                                    <a href="{{ route('admin.auditorias.pdf', $selectedAuditoria->id) }}" 
                                       class="w-full py-4 bg-black text-white font-black text-xs rounded-2xl hover:bg-orange-600 transition-all text-center block shadow-xl shadow-orange-100">
                                        DESCARGAR PDF
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- Panel Principal: Discrepancias -->
                        <div class="flex-1 p-10">
                            <div class="mb-10">
                                <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Discrepancias en EDUGE</h4>
                                <div class="space-y-4">
                                    @if($selectedAuditoria->cambios && count($selectedAuditoria->cambios) > 0)
                                        @foreach($selectedAuditoria->cambios as $cambio)
                                            <div class="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
                                                <p class="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3">{{ $cambio['campo'] }}</p>
                                                <div class="flex items-center gap-4">
                                                    <div class="flex-1">
                                                        <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">En Sistema</p>
                                                        <p class="text-sm font-bold text-gray-300 line-through">{{ $cambio['anterior'] }}</p>
                                                    </div>
                                                    <div class="w-8 flex justify-center text-gray-200">→</div>
                                                    <div class="flex-1">
                                                        <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">En EDUGE</p>
                                                        <p class="text-sm font-black text-black">{{ $cambio['nuevo'] }}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        @endforeach
                                    @else
                                        <p class="text-gray-400 italic">No se registraron cambios específicos.</p>
                                    @endif
                                </div>
                            </div>

                            <div>
                                <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Notas de la Auditoría</h4>
                                <div class="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                    <p class="text-sm text-gray-600 leading-relaxed font-medium italic">
                                        "{{ $selectedAuditoria->observaciones ?? 'Sin observaciones adicionales.' }}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @endif
</div>
