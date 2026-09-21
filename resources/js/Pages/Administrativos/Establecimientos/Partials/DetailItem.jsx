export default function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-4 rounded-xl border border-gray-50 bg-gray-50/50 p-3">
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
