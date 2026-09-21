import InputLabel from '@/Components/InputLabel';

export default function FilterSelect({ label, value, options = [], onChange }) {
    return (
        <div className="space-y-1">
            <InputLabel value={label} />
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border-gray-200 text-xs font-bold focus:border-brand-orange focus:ring-brand-orange"
            >
                <option value="">Cualquiera</option>
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}
