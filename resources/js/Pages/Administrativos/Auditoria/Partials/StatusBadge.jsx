export default function StatusBadge({ status }) {
    const config = {
        PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
        CORRECTO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        CORREGIDO: 'bg-blue-50 text-blue-700 border-blue-200',
        REVISAR: 'bg-rose-50 text-rose-700 border-rose-200',
        BAJA: 'bg-gray-100 text-black border-gray-300',
    };
    return (
        <span
            className={`rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${config[status] || config.PENDIENTE}`}
        >
            {status || 'PENDIENTE'}
        </span>
    );
}
