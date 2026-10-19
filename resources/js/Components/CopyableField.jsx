import { copyToClipboard } from '@/Utils/clipboard';
import { useState } from 'react';

export default function CopyableField({
    label,
    value,
    copyValue,
    fallback = 'S/D',
    allowCopy = true,
    className = '',
    title,
}) {
    const [copied, setCopied] = useState(false);
    const displayValue = value ?? fallback;
    const valueToCopy = copyValue ?? value;
    const canCopy = allowCopy && Boolean(valueToCopy && valueToCopy !== fallback);

    const handleCopy = async () => {
        if (!canCopy) return;
        const ok = await copyToClipboard(String(valueToCopy));
        if (ok) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <div
            className={`group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-2 ${className}`}
        >
            <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-[8px] font-black uppercase tracking-widest text-gray-400">
                    {label}
                </p>
                <p
                    className="truncate text-xs font-black leading-tight text-gray-800"
                    title={title || (typeof displayValue === 'string' ? displayValue : '')}
                >
                    {displayValue}
                </p>
            </div>
            {canCopy && (
                <button
                    type="button"
                    onClick={handleCopy}
                    className="ml-2 shrink-0 rounded-lg border border-gray-100 bg-white p-1 text-gray-400 shadow-sm transition-all hover:text-brand-orange hover:border-orange-200"
                    title={`Copiar ${label}`}
                    aria-label={`Copiar ${label}`}
                >
                    <i
                        className={`fas ${copied ? 'fa-check text-green-500' : 'fa-copy'} text-[9px]`}
                    ></i>
                </button>
            )}
        </div>
    );
}
