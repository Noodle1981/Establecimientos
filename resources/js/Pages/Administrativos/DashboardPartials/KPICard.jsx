export default function KPICard({ title, value, icon, color }) {
    return (
        <div className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div>
                <h4 className="text-[9px] font-black uppercase tracking-widest text-black/40">
                    {title}
                </h4>
                <p className="text-2xl font-black text-black">{value}</p>
            </div>
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-base shadow-sm ${
                    color === 'brand-orange'
                        ? 'bg-orange-50 text-brand-orange'
                        : color === 'blue'
                          ? 'bg-blue-50 text-blue-500'
                          : 'bg-gray-50 text-gray-400'
                }`}
            >
                <i className={icon}></i>
            </div>
        </div>
    );
}
