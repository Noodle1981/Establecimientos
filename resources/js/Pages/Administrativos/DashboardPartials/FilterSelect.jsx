export default function FilterSelect({
    label,
    value,
    options,
    onChange,
    icon,
    highlight = false,
    compact = false,
    disabled = false,
}) {
    return (
        <div className={compact ? '' : 'mb-4'}>
            <label className="mb-1 ml-1 block text-[10px] font-bold uppercase text-gray-400">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`w-full appearance-none rounded-xl border px-3 py-2 pr-8 text-[11px] font-bold transition-colors focus:border-brand-orange focus:outline-none ${
                        disabled
                            ? 'cursor-not-allowed border-gray-100 bg-gray-100 text-gray-300'
                            : highlight
                              ? 'border-brand-orange bg-orange-50 text-brand-orange'
                              : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <option value="">Todos/as</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <div
                    className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${highlight ? 'text-brand-orange' : 'text-gray-400'}`}
                >
                    <i className={`${icon} text-[10px]`}></i>
                </div>
            </div>
        </div>
    );
}
