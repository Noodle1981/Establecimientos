import CopyableField from '@/Components/CopyableField';
import InputLabel from '@/Components/InputLabel';
import React, { memo } from 'react';

const EstablecimientoInfoSection = memo(function EstablecimientoInfoSection({ modalidad }) {
    const est = modalidad?.establecimiento;
    const edificio = est?.edificio;

    return (
        <div className="space-y-3">
            <InputLabel
                value="Datos del Establecimiento (CUE)"
                className="text-[10px] font-black uppercase tracking-widest text-brand-orange"
            />
            <div className="space-y-2">
                <CopyableField
                    label="Nombre del Establecimiento"
                    value={est?.nombre}
                    fallback="Sin Establecimiento"
                    title={est?.nombre || ''}
                />
                <div className="grid grid-cols-4 gap-2">
                    <CopyableField
                        label="CUE"
                        value={est?.cue}
                    />
                    <CopyableField
                        label="CUI"
                        value={edificio?.cui}
                    />
                    <CopyableField
                        label="Categoría"
                        value={modalidad?.categoria}
                    />
                    <CopyableField
                        label="Sector"
                        value={modalidad?.sector}
                    />
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-2.5">
                    <p className="mb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                        Modalidad / Nivel Educativo
                    </p>
                    <p className="text-xs font-black leading-none text-gray-800">
                        {modalidad?.nivel_educativo || 'S/D'}
                    </p>
                </div>
            </div>
        </div>
    );
});

export default EstablecimientoInfoSection;
