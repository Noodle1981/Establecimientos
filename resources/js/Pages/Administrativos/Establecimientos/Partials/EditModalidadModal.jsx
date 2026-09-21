import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { MAPA_AREA_NIVEL } from '../constants/areasNiveles';
import ModalInput from './ModalInput';

export default function EditModalidadModal({
    show,
    onClose,
    modalidad,
    options,
    nombresEdificios = {},
}) {
    const { data, setData, patch, processing, errors } = useForm({
        cui: '',
        cue: '',
        nombre_establecimiento: '',
        nivel_educativo: '',
        direccion_area: '',
        ambito: '',
        radio: '',
        sector: '',
        letra_zona: '',
        categoria: '',
        validado: false,
        observaciones: '',
    });

    const [edificioInfo, setEdificioInfo] = useState({
        departamento: '',
        cabecera: '',
    });

    useEffect(() => {
        if (show && modalidad) {
            setData({
                cui: modalidad.establecimiento.edificio?.cui || '',
                cue: modalidad.establecimiento.cue || '',
                nombre_establecimiento: modalidad.establecimiento.nombre || '',
                nivel_educativo: modalidad.nivel_educativo || '',
                direccion_area: modalidad.direccion_area || '',
                ambito: modalidad.ambito || '',
                radio: modalidad.radio ?? '',
                sector: modalidad.sector ?? '',
                letra_zona:
                    modalidad.establecimiento.edificio?.letra_zona ?? '',
                categoria: modalidad.categoria ?? '',
                validado: !!modalidad.validado,
                observaciones: modalidad.establecimiento.observaciones || '',
            });

            setEdificioInfo({
                departamento:
                    modalidad.establecimiento.edificio?.zona_departamento || '',
                cabecera:
                    nombresEdificios[modalidad.establecimiento.edificio_id] ||
                    'Sin Nombre',
            });
        }
    }, [modalidad, show, nombresEdificios, setData]);

    useEffect(() => {
        const cuiStr = String(data.cui).trim();
        if (!cuiStr) {
            setEdificioInfo({ departamento: '', cabecera: '' });
            return;
        }

        // Si coincide con el CUI original de este edificio
        if (
            modalidad?.establecimiento?.edificio?.cui &&
            cuiStr === String(modalidad.establecimiento.edificio.cui)
        ) {
            setEdificioInfo({
                departamento:
                    modalidad.establecimiento.edificio?.zona_departamento || '',
                cabecera:
                    nombresEdificios[modalidad.establecimiento.edificio_id] ||
                    'Sin Nombre',
            });
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            fetch(route('api.lookup-edificio', cuiStr), {
                signal: controller.signal,
            })
                .then((res) => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .then((res) => {
                    if (res) {
                        setEdificioInfo({
                            departamento:
                                res.zona_departamento || 'Sin Departamento',
                            cabecera:
                                res.cabecera_nombre ||
                                'Edificio sin cabecera asignada',
                        });
                    } else {
                        setEdificioInfo({
                            departamento: 'Nuevo CUI (No registrado)',
                            cabecera: 'Se creará un nuevo edificio al guardar',
                        });
                    }
                })
                .catch(() => {
                    // Ignore abort
                });
        }, 300);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [data.cui, modalidad, nombresEdificios]);

    if (!modalidad) return null;

    const submit = (e) => {
        e.preventDefault();
        patch(route('administrativos.establecimientos.update', modalidad.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <h3 className="mb-6 border-b pb-4 text-xl font-black text-gray-900">
                    Actualizar Establecimiento
                </h3>

                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    <div>
                        <ModalInput
                            label="CUI Edificio"
                            value={data.cui}
                            onChange={(v) => setData('cui', v)}
                            error={errors.cui}
                        />
                        {data.cui && (
                            <div className="mt-1.5 space-y-1 rounded-xl border border-orange-100/50 bg-orange-50/50 px-3 py-1.5 text-[10px] font-bold text-gray-600">
                                <div>
                                    <span className="mb-0.5 block text-[8px] font-black uppercase tracking-widest text-gray-400">
                                        Establecimiento Cabecera
                                    </span>
                                    <span
                                        className="block truncate text-xs font-black leading-none text-brand-orange"
                                        title={edificioInfo.cabecera}
                                    >
                                        {edificioInfo.cabecera || 'Sin Nombre'}
                                    </span>
                                </div>
                                {edificioInfo.departamento && (
                                    <div className="border-t border-orange-100/40 pt-1">
                                        <span className="mb-0.5 block text-[8px] font-black uppercase tracking-widest text-gray-400">
                                            Ubicación del CUI
                                        </span>
                                        <span className="block text-[11px] font-extrabold uppercase leading-none text-gray-700">
                                            <i className="fas fa-map-marker-alt mr-1 text-brand-orange"></i>{' '}
                                            {edificioInfo.departamento}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <ModalInput
                        label="CUE Establecimiento"
                        value={data.cue}
                        onChange={(v) => setData('cue', v)}
                        error={errors.cue}
                    />
                    <div className="col-span-2">
                        <ModalInput
                            label="Nombre del Establecimiento"
                            value={data.nombre_establecimiento}
                            onChange={(v) =>
                                setData('nombre_establecimiento', v)
                            }
                            error={errors.nombre_establecimiento}
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel value="Ámbito" />
                        <select
                            className="mt-1 w-full rounded-xl border-gray-300"
                            value={data.ambito}
                            onChange={(e) => setData('ambito', e.target.value)}
                        >
                            {options.ambitos.map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                        {errors.ambito && (
                            <InputError message={errors.ambito} />
                        )}
                    </div>

                    <div className="col-span-2 flex items-center gap-3 pt-6 md:col-span-1">
                        <input
                            type="checkbox"
                            id="validado"
                            checked={data.validado}
                            onChange={(e) =>
                                setData('validado', e.target.checked)
                            }
                            className="h-6 w-6 rounded-lg border-gray-300 text-brand-orange focus:ring-brand-orange"
                        />
                        <label
                            htmlFor="validado"
                            className="text-sm font-black text-gray-700"
                        >
                            MARCAR COMO VALIDADO
                        </label>
                    </div>

                    <div className="col-span-2 md:col-span-1">
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
                        {errors.direccion_area && (
                            <InputError message={errors.direccion_area} />
                        )}
                    </div>

                    <div className="col-span-1">
                        <InputLabel value="Nivel Educativo" />
                        <select
                            className="mt-1 w-full rounded-xl border-gray-300 text-sm focus:border-brand-orange focus:ring-brand-orange"
                            value={data.nivel_educativo}
                            onChange={(e) =>
                                setData('nivel_educativo', e.target.value)
                            }
                            disabled={!data.direccion_area}
                        >
                            <option value="">Seleccione Nivel...</option>
                            {(data.direccion_area
                                ? MAPA_AREA_NIVEL[data.direccion_area] || []
                                : []
                            ).map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                        {errors.nivel_educativo && (
                            <InputError message={errors.nivel_educativo} />
                        )}
                    </div>

                    <div className="col-span-2 mt-2 grid grid-cols-2 gap-4 border-t pt-4 md:grid-cols-4">
                        <ModalInput
                            label="Radio"
                            value={data.radio}
                            onChange={(v) => setData('radio', v)}
                            error={errors.radio}
                        />
                        <ModalInput
                            label="Sector"
                            value={data.sector}
                            onChange={(v) => setData('sector', v)}
                            error={errors.sector}
                        />
                        <ModalInput
                            label="Zona"
                            value={data.letra_zona}
                            onChange={(v) => setData('letra_zona', v)}
                            error={errors.letra_zona}
                        />
                        <div className="space-y-1">
                            <InputLabel value="Categoría" />
                            <select
                                className="mt-1 w-full rounded-xl border-gray-300 text-xs font-bold focus:border-brand-orange focus:ring-brand-orange"
                                value={data.categoria}
                                onChange={(e) =>
                                    setData('categoria', e.target.value)
                                }
                            >
                                <option value="">Seleccione...</option>
                                <option value="PRIMERA">PRIMERA</option>
                                <option value="SEGUNDA">SEGUNDA</option>
                                <option value="TERCERA">TERCERA</option>
                                <option value="CUARTA">CUARTA</option>
                            </select>
                            {errors.categoria && (
                                <InputError message={errors.categoria} />
                            )}
                        </div>
                    </div>

                    <div className="col-span-2 mt-2 border-t pt-4">
                        <InputLabel
                            value="Comentarios / Observaciones del Establecimiento (CUE)"
                            className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400"
                        />
                        <textarea
                            placeholder="Escriba aquí las observaciones específicas de esta escuela (CUE)..."
                            value={data.observaciones}
                            onChange={(e) =>
                                setData('observaciones', e.target.value)
                            }
                            className="min-h-[100px] w-full rounded-xl border-gray-300 text-sm focus:border-brand-orange focus:ring-brand-orange"
                        />
                        {errors.observaciones && (
                            <InputError message={errors.observaciones} />
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose}>
                        Descartar
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
