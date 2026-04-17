import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ modalidades, edificios }) {
    
    const restore = (type, id) => {
        if (confirm('¿Restaurar este registro?')) {
            router.post(route('admin.trash.restore', { type, id }));
        }
    };

    const purge = (id) => {
        if (confirm('¡ADVERTENCIA CRÍTICA! Esta acción eliminará permanentemente al establecimiento, todos sus datos, auditorías y liberará el CUE. No se puede deshacer. ¿Proceder?')) {
            router.delete(route('admin.trash.forceDelete', id));
        }
    };

    const empty = modalidades.length === 0 && edificios.length === 0;

    return (
        <AuthenticatedLayout header={null}>
            <Head title="Papelera" />

            <div className="space-y-10 pt-2">
                {empty && (
                    <div className="bg-white p-20 rounded-3xl border border-dashed border-brand-orange/20 text-center">
                        <div className="w-16 h-16 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <i className="fas fa-leaf"></i>
                        </div>
                        <p className="text-black/40 font-black uppercase tracking-widest text-[10px]">La papelera está vacía</p>
                    </div>
                )}

                {/* Modalidades Table */}
                {modalidades.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-black/60 uppercase tracking-widest px-2">Escuelas y Modalidades ({modalidades.length})</h3>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                            <table className="w-full text-left">
                                <thead className="bg-brand-orange text-[10px] uppercase font-black text-white border-b border-orange-600">
                                    <tr>
                                        <th className="px-6 py-4">Establecimiento</th>
                                        <th className="px-6 py-4">Motivo / Categoría</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {modalidades.map((mod) => (
                                        <tr key={mod.id} className="hover:bg-orange-50/10 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-black leading-tight">{mod.establecimiento.nombre}</span>
                                                    <span className="text-[9px] font-black text-black/40 uppercase">CUE: {mod.establecimiento.cue}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">{mod.nivel_educativo} - {mod.ambito}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => restore('modalidad', mod.id)} className="px-3 py-1.5 rounded-lg bg-orange-50 text-brand-orange border border-brand-orange/20 font-black text-[9px] uppercase hover:bg-brand-orange hover:text-white transition shadow-sm">
                                                    Restaurar
                                                </button>
                                                <button onClick={() => purge(mod.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-brand-red border border-brand-red/20 font-black text-[9px] uppercase hover:bg-brand-red hover:text-white transition shadow-sm">
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
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Edificios / Inmuebles ({edificios.length})</h3>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                            <table className="w-full text-left">
                                <thead className="bg-brand-orange text-[10px] uppercase font-black text-white border-b border-orange-600">
                                    <tr>
                                        <th className="px-6 py-4">Ubicación</th>
                                        <th className="px-6 py-4">CUI</th>
                                        <th className="px-6 py-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {edificios.map((ed) => (
                                        <tr key={ed.id} className="hover:bg-orange-50/10 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-900 leading-tight">{ed.calle} {ed.numero_puerta}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase">{ed.localidad}, {ed.zona_departamento}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-black text-brand-orange uppercase">{ed.cui}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => restore('edificio', ed.id)} className="px-3 py-1.5 rounded-lg bg-orange-50 text-brand-orange border border-brand-orange/20 font-black text-[9px] uppercase hover:bg-brand-orange hover:text-white transition shadow-sm">
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
