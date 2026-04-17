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
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-black flex items-center gap-2">
                    <i className="fas fa-trash-alt text-brand-orange"></i>
                    Papelera de Reciclaje
                </h2>
            }
        >
            <Head title="Papelera" />

            <div className="space-y-10">
                {empty && (
                    <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center">
                        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            <i className="fas fa-leaf"></i>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">La papelera está vacía</p>
                    </div>
                )}

                {/* Modalidades Table */}
                {modalidades.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Escuelas y Modalidades ({modalidades.length})</h3>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-500 border-b">
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
                                                    <span className="text-xs font-black text-gray-900 leading-tight">{mod.establecimiento.nombre}</span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase">CUE: {mod.establecimiento.cue}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase">{mod.nivel_educativo} - {mod.ambito}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => restore('modalidad', mod.id)} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 font-black text-[9px] uppercase hover:bg-green-600 hover:text-white transition">
                                                    Restaurar
                                                </button>
                                                <button onClick={() => purge(mod.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 font-black text-[9px] uppercase hover:bg-red-600 hover:text-white transition">
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
                                <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-500 border-b">
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
                                                <button onClick={() => restore('edificio', ed.id)} className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 font-black text-[9px] uppercase hover:bg-green-600 hover:text-white transition">
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
