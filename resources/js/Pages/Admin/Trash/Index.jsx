import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ modalidades, edificios }) {
    const restore = (type, id) => {
        if (confirm('¿Restaurar este registro?')) {
            router.post(route('admin.trash.restore', { type, id }));
        }
    };

    const purge = (id) => {
        if (
            confirm(
                '¡ADVERTENCIA CRÍTICA! Esta acción eliminará permanentemente al establecimiento, todos sus datos, auditorías y liberará el CUE. No se puede deshacer. ¿Proceder?',
            )
        ) {
            router.delete(route('admin.trash.forceDelete', id));
        }
    };

    const empty = modalidades.length === 0 && edificios.length === 0;

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Papelera" />

            <div className="space-y-10 pt-2">
                {empty && (
                    <div className="rounded-3xl border border-dashed border-brand-orange/20 bg-white p-20 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-2xl text-brand-orange">
                            <i className="fas fa-leaf"></i>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                            La papelera está vacía
                        </p>
                    </div>
                )}

                {/* Modalidades Table */}
                {modalidades.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="px-2 text-[10px] font-black uppercase tracking-widest text-black/60">
                            Escuelas y Modalidades ({modalidades.length})
                        </h3>
                        <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-2xl">
                            <table className="w-full text-left">
                                <thead className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase text-white">
                                    <tr>
                                        <th className="px-6 py-4">
                                            Establecimiento
                                        </th>
                                        <th className="px-6 py-4">
                                            Motivo / Categoría
                                        </th>
                                        <th className="px-6 py-4 text-right">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {modalidades.map((mod) => (
                                        <tr
                                            key={mod.id}
                                            className="transition-colors hover:bg-orange-50/10"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black leading-tight text-black">
                                                        {
                                                            mod.establecimiento?.nombre ?? 'Establecimiento no encontrado'
                                                        }
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase text-black/40">
                                                        CUE:{' '}
                                                        {
                                                            mod.establecimiento?.cue ?? 'S/D'
                                                        }
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold uppercase text-gray-500">
                                                    {mod.nivel_educativo} -{' '}
                                                    {mod.ambito}
                                                </span>
                                            </td>
                                            <td className="space-x-2 px-6 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        restore(
                                                            'modalidad',
                                                            mod.id,
                                                        )
                                                    }
                                                    className="rounded-lg border border-brand-orange/20 bg-orange-50 px-3 py-1.5 text-[9px] font-black uppercase text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                >
                                                    Restaurar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        purge(mod.id)
                                                    }
                                                    className="rounded-lg border border-brand-red/20 bg-red-50 px-3 py-1.5 text-[9px] font-black uppercase text-brand-red shadow-sm transition hover:bg-brand-red hover:text-white"
                                                >
                                                    BORRAR DEFINITIVO
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Edificios Table */}
                {edificios.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="px-2 text-xs font-black uppercase tracking-widest text-gray-400">
                            Edificios / Inmuebles ({edificios.length})
                        </h3>
                        <div className="overflow-hidden border border-gray-100 bg-white shadow-sm sm:rounded-2xl">
                            <table className="w-full text-left">
                                <thead className="border-b border-orange-600 bg-brand-orange text-[10px] font-black uppercase text-white">
                                    <tr>
                                        <th className="px-6 py-4">Ubicación</th>
                                        <th className="px-6 py-4">CUI</th>
                                        <th className="px-6 py-4 text-right">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {edificios.map((ed) => (
                                        <tr
                                            key={ed.id}
                                            className="transition-colors hover:bg-orange-50/10"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black leading-tight text-gray-900">
                                                        {ed.calle}{' '}
                                                        {ed.numero_puerta}
                                                    </span>
                                                    <span className="text-[9px] font-bold uppercase text-gray-400">
                                                        {ed.localidad},{' '}
                                                        {ed.zona_departamento}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-black uppercase text-brand-orange">
                                                    {ed.cui}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        restore(
                                                            'edificio',
                                                            ed.id,
                                                        )
                                                    }
                                                    className="rounded-lg border border-brand-orange/20 bg-orange-50 px-3 py-1.5 text-[9px] font-black uppercase text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white"
                                                >
                                                    Restaurar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
