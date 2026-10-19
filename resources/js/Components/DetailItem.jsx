export default function DetailItem({
    icon,
    label,
    value,
    variant = 'card', // 'card' | 'inline'
    className = '',
}) {
    if (variant === 'inline') {
        return (
            <div className={`flex items-start gap-4 ${className}`}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-brand-orange">
                    <i className={icon}></i>
                </div>
                <div>
                    <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-black/40">
                        {label}
                    </p>
                    <p className="text-sm font-black leading-tight text-black">
                        {value}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`flex items-start gap-4 rounded-xl border border-gray-50 bg-gray-50/50 p-3 ${className}`}
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-400 shadow-sm">
                <i className={icon}></i>
            </div>
            <div>
                <p className="mb-1 text-[9px] font-black uppercase leading-none tracking-widest text-gray-400">
                    {label}
                </p>
                <p className="text-xs font-bold leading-tight text-gray-800">
                    {value}
                </p>
            </div>
        </div>
    );
}
