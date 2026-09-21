export default function ChartWrapper({ title, children, className = '', onZoom }) {
    return (
        <div
            onClick={onZoom}
            className={`group relative flex min-h-[220px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-brand-orange hover:shadow-lg ${className}`}
        >
            <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-orange-100 bg-orange-50 text-brand-orange shadow-sm">
                    <i className="fas fa-search-plus text-[10px]"></i>
                </div>
            </div>
            <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase text-gray-800">
                <div className="h-2 w-1 rounded-full bg-brand-orange"></div>
                {title}
            </h3>
            <div className="relative flex-1">{children}</div>
        </div>
    );
}
