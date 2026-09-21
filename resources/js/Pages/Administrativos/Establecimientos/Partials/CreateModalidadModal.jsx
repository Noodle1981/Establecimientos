import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { MAPA_AREA_NIVEL } from '../constants/areasNiveles';
import ModalInput from './ModalInput';

export default function CreateModalidadModal({ show, onClose, options }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre_establecimiento: '',
        cue: '',
        cui: '',
        establecimiento_cabecera: '',
        nivel_educativo: '',
        direccion_area: '',
        ambito: 'PUBLICO',
        sector: '',
        radio: '',
        zona: '',
        calle: '',
        localidad: '',
        zona_departamento: '',
    });

    const [cabeceraNombre, setCabeceraNombre] = useState('');

    useEffect(() => {
        if (!show) {
            setCabeceraNombre('');
        }
    }, [show]);

    const lookupCUI = (cuiStr) => {
        const cui = String(cuiStr).trim();
        if (cui.length < 3) return;
        fetch(route('api.lookup-edificio', cui))
            .then((res) => res.json())
            .then((res) => {
                if (res) {
                    setData((prev) => ({
                        ...prev,
                        cui,
                        calle: res.calle,
                        localidad: res.localidad,
                        zona_departamento: res.zona_departamento,
                        establecimiento_cabecera:
                            res.cabecera_cue || prev.cue || '',
                    }));
                    if (res.cabecera_nombre) {
                        setCabeceraNombre(res.cabecera_nombre);
                    } else {
                        setCabeceraNombre(
                            'Edificio sin cabecera asignada (este nuevo establecimiento será cabecera)',
                        );
                    }
                } else {
                    setData((prev) => ({
                        ...prev,
                        cui,
                        establecimiento_cabecera: prev.cue || '',
                    }));
                    setCabeceraNombre(
                        'Edificio nuevo (este nuevo establecimiento será cabecera)',
                    );
                }
            })
            .catch(() => {
                setCabeceraNombre('');
            });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('administrativos.establecimientos.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <form onSubmit={submit} className="p-8">
                <h3 className="mb-8 flex items-center gap-3 text-2xl font-black text-gray-900">
                    <div className="rounded-xl bg-orange-50 p-2 text-brand-orange">
                        <i className="fas fa-plus"></i>
                    </div>
                    Nueva Modalidad Escolar
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-4 border-r pr-6 lg:col-span-1">
                        <h4 className="border-b pb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Datos de Ubicación
                        </h4>
                        <div>
                            <InputLabel value="CUI del Edificio" />
                            <TextInput
                                className="mt-1 w-full"
                                value={data.cui}
                                onChange={(e) => {
                                    setData('cui', e.target.value);
                                    lookupCUI(e.target.value);
                                }}
                            />
                            <InputError message={errors.cui} />
                        </div>
                        <ModalInput
                            label="Calle"
                            value={data.calle}
                            onChange={(v) => setData('calle', v)}
                        />
                        <ModalInput
                            label="Localidad"
                            value={data.localidad}
                            onChange={(v) => setData('localidad', v)}
                        />
                        <ModalInput
                            label="Departamento"
                            value={data.zona_departamento}
                            onChange={(v) => setData('zona_departamento', v)}
                        />
                    </div>

                    <div className="space-y-4 lg:col-span-2">
                        <h4 className="border-b pb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Datos Académicos / Institucionales
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 lg:col-span-1">
                                <InputLabel value="CUE de la Modalidad" />
                                <TextInput
                                    className="mt-1 w-full"
                                    value={data.cue}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setData((prev) => ({
                                            ...prev,
                                            cue: val,
                                            // Si no hay cabecera asignada en el edificio, se asume que este CUE es cabecera de sí mismo
                                            establecimiento_cabecera:
                                                !cabeceraNombre ||
                                                cabeceraNombre.includes(
                                                    'nueva',
                                                ) ||
                                                cabeceraNombre.includes(
                                                    'nuevo',
                                                ) ||
                                                cabeceraNombre.includes(
                                                    'sin cabecera',
                                                )
                                                    ? val
                                                    : prev.establecimiento_cabecera,
                                        }));
                                    }}
                                />
                                <InputError message={errors.cue} />
                            </div>
                            <div className="col-span-2 lg:col-span-1">
                                <InputLabel value="CUE Establecimiento Cabecera" />
                                <TextInput
                                    className="mt-1 w-full bg-gray-50 font-mono text-gray-700"
                                    value={data.establecimiento_cabecera}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setData(
                                            'establecimiento_cabecera',
                                            val,
                                        );
                                        setCabeceraNombre('');
                                    }}
                                    placeholder="Ej: 700053600"
                                />
                                {cabeceraNombre && (
                                    <p className="mt-1 text-xs font-semibold text-brand-orange">
                                        <i className="fas fa-school mr-1"></i>{' '}
                                        {cabeceraNombre}
                                    </p>
                                )}
                                <InputError
                                    message={errors.establecimiento_cabecera}
                                />
                            </div>
                            <div className="col-span-2">
                                <InputLabel value="Nombre Completo" />
                                <TextInput
                                    className="mt-1 w-full"
                                    value={data.nombre_establecimiento}
                                    onChange={(e) =>
                                        setData(
                                            'nombre_establecimiento',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.nombre_establecimiento}
                                />
                            </div>

                            <div className="col-span-1">
                                <InputLabel value="Dirección de Área" />
                                <select
                                    className="mt-1 w-full rounded-xl border-gray-300 text-sm"
                                    value={data.direccion_area}
                                    onChange={(e) => {
                                        const newArea = e.target.value;
                                        setData((prev) => ({
                                            ...prev,
                                            direccion_area: newArea,
                                            nivel_educativo: '', // Reset Nivel Educativo when area changes
                                        }));
                                    }}
                                >
                                    <option value="">Seleccione...</option>
                                    {options.areas.map((o) => (
                                        <option key={o} value={o}>
                                            {o}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <InputLabel value="Nivel Educativo" />
                                <select
                                    className="mt-1 w-full rounded-xl border-gray-300 text-sm focus:border-brand-orange focus:ring-brand-orange"
                                    value={data.nivel_educativo}
                                    onChange={(e) =>
                                        setData(
                                            'nivel_educativo',
                                            e.target.value,
                                        )
                                    }
                                    disabled={!data.direccion_area}
                                >
                                    <option value="">
                                        Seleccione Nivel...
                                    </option>
                                    {(data.direccion_area
                                        ? MAPA_AREA_NIVEL[
                                              data.direccion_area
                                          ] || []
                                        : []
                                    ).map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex justify-end gap-4 border-t pt-8">
                    <SecondaryButton onClick={onClose}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton
                        className="px-8 py-3 text-sm"
                        disabled={processing}
                    >
                        Confirmar Alta
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
