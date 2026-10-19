import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import React from 'react';

const ESTADOS = ['PENDIENTE', 'CORRECTO', 'CORREGIDO', 'REVISAR'];

export default function AuditFormSection({
    data,
    setData,
    toggleCampo,
    camposAuditoria,
    vinculadosCount,
    processing,
    onClose,
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Selector de Nuevo Estado */}
                <div>
                    <InputLabel
                        value="Nuevo Estado de Validación"
                        className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400"
                    />
                    <div className="grid grid-cols-4 gap-2">
                        {ESTADOS.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setData('estado', s)}
                                className={`rounded-xl border-2 px-1.5 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${
                                    data.estado === s
                                        ? 'border-brand-orange bg-orange-50 text-brand-orange shadow-sm'
                                        : 'border-gray-100 text-gray-400 hover:border-orange-100'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Campos Auditados */}
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <InputLabel
                            value="Campos Auditados / Reportados"
                            className="text-[10px] font-black uppercase tracking-widest text-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setData('campos_auditados', [...camposAuditoria])
                            }
                            className="text-[9px] font-black uppercase text-brand-orange hover:underline"
                        >
                            Marcar Todo
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {camposAuditoria.map((campo) => {
                            const isChecked = data.campos_auditados?.includes(campo);
                            return (
                                <button
                                    key={campo}
                                    type="button"
                                    onClick={() => toggleCampo(campo)}
                                    className={`rounded-lg border px-1 py-2 text-[9px] font-bold uppercase transition-all ${
                                        isChecked
                                            ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
                                            : 'border-gray-100 bg-white text-gray-400'
                                    }`}
                                >
                                    {campo}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Observaciones */}
            <div>
                <InputLabel
                    value="Observaciones"
                    className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400"
                />
                <textarea
                    className="h-28 w-full rounded-xl border-gray-200 bg-gray-50/20 p-3 text-sm font-medium focus:border-brand-orange focus:ring-brand-orange"
                    placeholder="Escribe aquí las observaciones..."
                    value={data.observaciones}
                    onChange={(e) => setData('observaciones', e.target.value)}
                ></textarea>
            </div>

            {/* Acciones de Footer */}
            <div className="flex flex-wrap items-center justify-end gap-3 border-t pt-4">
                <SecondaryButton onClick={onClose} className="px-6 py-2.5">
                    Cancelar
                </SecondaryButton>
                {vinculadosCount > 0 && (
                    <button
                        type="button"
                        onClick={() =>
                            setData(
                                'propagar_al_edificio',
                                !data.propagar_al_edificio,
                            )
                        }
                        className={`flex items-center gap-2 rounded-xl border px-4 py-1.5 text-xs font-black transition-all ${
                            data.propagar_al_edificio
                                ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <i
                            className={`fas ${data.propagar_al_edificio ? 'fa-check-double' : 'fa-link'}`}
                        ></i>
                        <div className="text-left">
                            <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest">
                                Sincronizar Edificio ({vinculadosCount})
                            </p>
                            <p
                                className={`text-[8px] font-bold ${data.propagar_al_edificio ? 'text-white/80' : 'text-gray-400'}`}
                            >
                                Aplicar validación a todo el CUI
                            </p>
                        </div>
                    </button>
                )}
                <PrimaryButton className="px-12 py-2.5" disabled={processing}>
                    {processing ? 'Guardando...' : 'Confirmar Validación'}
                </PrimaryButton>
            </div>
        </div>
    );
}
