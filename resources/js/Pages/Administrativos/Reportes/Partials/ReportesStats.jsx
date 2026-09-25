export default function ReportesStats({ stats }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
                label="Pendientes"
                value={stats.pendientes}
                icon="fas fa-clock"
                color="orange"
                active={true}
            />
            <StatCard
                label="Procesados"
                value={stats.procesados}
                icon="fas fa-check-circle"
                color="green"
            />
            <StatCard
                label="Descartados"
                value={stats.descartados}
                icon="fas fa-times-circle"
                color="gray"
            />
        </div>
    );
}

function StatCard({ label, value, icon, color, active = false }) {
    const colors = {
        orange: 'bg-brand-orange text-white shadow-orange-500/20',
        green: 'bg-emerald-500 text-white shadow-emerald-500/20',
        gray: 'bg-gray-500 text-white shadow-gray-500/20',
    };

    return (
        <div
            className={`flex items-center gap-6 rounded-3xl border bg-white p-6 shadow-sm transition-all ${
                active ? 'border-brand-orange ring-4 ring-orange-50' : 'border-gray-100'
            }`}
        >
            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-md ${colors[color]}`}
            >
                <i className={icon}></i>
            </div>
            <div>
                <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-gray-400">
                    {label}
                </p>
                <p className="text-3xl font-black text-black">{value}</p>
            </div>
        </div>
    );
}
