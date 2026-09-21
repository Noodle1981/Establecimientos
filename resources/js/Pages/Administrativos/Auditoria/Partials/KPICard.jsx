export default function KPICard({ label, value, icon, color }) {
    const colors = {
        orange: 'bg-orange-50 text-brand-orange border-brand-orange/20',
        amber: 'bg-amber-50 text-amber-600 border-amber-200',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        rose: 'bg-rose-50 text-rose-600 border-rose-200',
    };
    return (
        <div
            className={`flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm`}
        >
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${colors[color]}`}
            >
                <i className={icon}></i>
            </div>
            <div>
                <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-black opacity-60">
                    {label}
                </p>
                <p className="text-xl font-black leading-none tracking-tight text-black">
                    {value}
                </p>
            </div>
        </div>
    );
}
