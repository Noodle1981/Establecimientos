export default function KPICard({
    title,
    label,
    value,
    icon,
    color = 'brand-orange',
    className = '',
}) {
    const displayTitle = title || label;

    const colorStyles = {
        'brand-orange': 'bg-orange-50 text-brand-orange border-brand-orange/20',
        orange: 'bg-orange-50 text-brand-orange border-brand-orange/20',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        amber: 'bg-amber-50 text-amber-600 border-amber-200',
        rose: 'bg-rose-50 text-rose-600 border-rose-200',
        gray: 'bg-gray-50 text-gray-500 border-gray-200',
    };

    const iconStyle = colorStyles[color] || colorStyles['brand-orange'];

    return (
        <div
            className={`group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md ${className}`}
        >
            <div>
                <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-black/40">
                    {displayTitle}
                </p>
                <p className="text-2xl font-black tracking-tight text-black">
                    {value}
                </p>
            </div>
            <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl shadow-sm ${iconStyle}`}
            >
                <i className={icon}></i>
            </div>
        </div>
    );
}
