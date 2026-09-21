export default function FilterBtn({ active, onClick, label, color }) {
    const activeClass =
        color === 'orange'
            ? 'bg-orange-50 text-brand-orange border-brand-orange/30 shadow-sm'
            : 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm';
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-xs font-bold transition-all ${
                active
                    ? activeClass
                    : 'border-gray-100 bg-gray-50 text-gray-400 grayscale'
            }`}
        >
            <div
                className={`h-2 w-2 rounded-full ${color === 'orange' ? 'bg-brand-orange shadow-orange-500/50' : 'bg-blue-500 shadow-blue-500/50'} shadow-sm`}
            ></div>
            <span>{label}</span>
        </button>
    );
}
