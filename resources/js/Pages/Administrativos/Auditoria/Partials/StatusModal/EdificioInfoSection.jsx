import CopyableField from '@/Components/CopyableField';
import InputLabel from '@/Components/InputLabel';
import React, { memo } from 'react';

const EdificioInfoSection = memo(function EdificioInfoSection({
    modalidad,
    nombreEdificio,
}) {
    const edificio = modalidad?.establecimiento?.edificio;
    const direccion = edificio?.calle
        ? `${edificio.calle} ${edificio.numero_puerta || 'S/N'}`
        : null;
    const gps =
        edificio?.latitud && edificio?.longitud
            ? `${edificio.latitud}, ${edificio.longitud}`
            : null;

    return (
        <div className="space-y-3">
            <InputLabel
                value="Información del Edificio"
                className="text-[10px] font-black uppercase tracking-widest text-brand-orange"
            />
            <div className="space-y-2">
                {nombreEdificio && (
                    <CopyableField
                        label="Edificio / Establecimiento Cabecera"
                        value={nombreEdificio}
                    />
                )}
                <CopyableField
                    label="Dirección Física"
                    value={direccion}
                />
                <div className="grid grid-cols-3 gap-1.5">
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-1.5 text-center">
                        <p className="mb-0.5 text-[7px] font-black uppercase text-gray-400">
                            Radio
                        </p>
                        <p className="text-[10px] font-black text-gray-800">
                            {modalidad?.radio || '-'}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-1.5 text-center">
                        <p className="mb-0.5 text-[7px] font-black uppercase text-gray-400">
                            Sector
                        </p>
                        <p className="text-[10px] font-black text-gray-800">
                            {modalidad?.sector || '-'}
                        </p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-1.5 text-center">
                        <p className="mb-0.5 text-[7px] font-black uppercase text-gray-400">
                            Cat.
                        </p>
                        <p className="text-[10px] font-black text-gray-800">
                            {modalidad?.categoria || '-'}
                        </p>
                    </div>
                </div>
                {gps && (
                    <CopyableField
                        label="GPS"
                        value={gps}
                    />
                )}
                <div className="grid grid-cols-3 gap-2">
                    <CopyableField
                        label="Departamento"
                        value={edificio?.zona_departamento}
                    />
                    <CopyableField
                        label="C.P."
                        value={edificio?.codigo_postal}
                    />
                    <CopyableField
                        label="Orientación"
                        value={edificio?.orientacion}
                    />
                </div>
            </div>
        </div>
    );
});

export default EdificioInfoSection;
