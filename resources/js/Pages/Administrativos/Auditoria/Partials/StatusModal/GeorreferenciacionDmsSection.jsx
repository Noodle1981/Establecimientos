import InputLabel from '@/Components/InputLabel';
import { copyToClipboard } from '@/Utils/clipboard';
import { decimalToDMS } from '@/Utils/coordinates';
import React, { memo, useState } from 'react';

function DmsBox({ label, value, copyValue, onCopy, copiedKey, itemKey }) {
    const isCopied = copiedKey === itemKey;
    return (
        <div className="group relative flex min-h-[48px] flex-col items-center justify-between rounded-lg border border-gray-100 bg-white p-1.5 text-center">
            <span className="text-[6px] font-black uppercase tracking-wider text-gray-400">
                {label}
            </span>
            <span className="max-w-[50px] truncate text-[11px] font-black leading-none text-gray-700" title={String(value)}>
                {value}
            </span>
            <button
                type="button"
                onClick={() => onCopy(copyValue ?? value, itemKey)}
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-brand-orange/95 text-[8px] font-black uppercase text-white opacity-0 shadow-md transition-all group-hover:opacity-100"
            >
                {isCopied ? '¡Copió!' : 'Copiar'}
            </button>
        </div>
    );
}

const GeorreferenciacionDmsSection = memo(function GeorreferenciacionDmsSection({
    latitud,
    longitud,
}) {
    const [copiedKey, setCopiedKey] = useState(null);

    if (!latitud || !longitud) return null;

    const latDms = decimalToDMS(latitud, true);
    const lngDms = decimalToDMS(longitud, false);

    const handleCopy = async (text, key) => {
        if (!text) return;
        const ok = await copyToClipboard(String(text));
        if (ok) {
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 1500);
        }
    };

    return (
        <div>
            <InputLabel
                value="Georreferenciación para EDUGE (DMS)"
                className="mb-3 text-[10px] font-black uppercase tracking-widest text-brand-orange"
            />
            <div className="space-y-3 rounded-xl border border-orange-100/50 bg-orange-50/20 p-3">
                {/* Latitud */}
                <div>
                    <p className="mb-1.5 border-b border-orange-100/30 pb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                        Latitud (Sur)
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                        <DmsBox
                            label="Card."
                            value={latDms.cardinalShort}
                            copyValue={latDms.cardinal}
                            itemKey="lat_card"
                            copiedKey={copiedKey}
                            onCopy={handleCopy}
                        />
                        <DmsBox
                            label="Grado"
                            value={`${latDms.degrees}°`}
                            copyValue={latDms.degrees}
                            itemKey="lat_deg"
                            copiedKey={copiedKey}
                            onCopy={handleCopy}
                        />
                        <DmsBox
                            label="Minuto"
                            value={`${latDms.minutes}′`}
                            copyValue={latDms.minutes}
                            itemKey="lat_min"
                            copiedKey={copiedKey}
                            onCopy={handleCopy}
                        />
                        <DmsBox
                            label="Segundo"
                            value={`${latDms.seconds}″`}
                            copyValue={latDms.seconds}
                            itemKey="lat_sec"
                            copiedKey={copiedKey}
                            onCopy={handleCopy}
                        />
                    </div>
                </div>

                {/* Longitud */}
                <div>
                    <p className="mb-1.5 border-b border-orange-100/30 pb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                        Longitud (Oeste)
                    </p>
                    <div className="grid grid-cols-4 gap-1.5">
                        <DmsBox
                            label="Card."
                            value={lngDms.cardinalShort}
                            copyValue={lngDms.cardinal}
                            itemKey="lng_card"
                            copiedKey={copiedKey}
                            onCopy={handleCopy}
                        />
                        <DmsBox
                            label="Grado"
                            value={`${lngDms.degrees}°`}
                            copyValue={lngDms.degrees}
                            itemKey="lng_deg"
                            copiedKey={copiedKey}
                            onCopy={handleCopy}
                        />
                        <DmsBox
                            label="Minuto"
                            value={`${lngDms.minutes}′`}
                            copyValue={lngDms.minutes}
                            itemKey="lng_min"
                            copiedKey={copiedKey}
                            onCopy={handleCopy}
                        />
                        <DmsBox
                            label="Segundo"
                            value={`${lngDms.seconds}″`}
                            copyValue={lngDms.seconds}
                            itemKey="lng_sec"
                            copiedKey={copiedKey}
                            onCopy={handleCopy}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default GeorreferenciacionDmsSection;
