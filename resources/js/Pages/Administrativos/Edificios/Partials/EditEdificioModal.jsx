import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function EditEdificioModal({ show, onClose, edificio, options = {} }) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        cui: edificio?.cui || '',
        calle: edificio?.calle || '',
        numero_puerta: edificio?.numero_puerta || '',
        localidad: edificio?.localidad || '',
        zona_departamento: edificio?.zona_departamento || '',
        codigo_postal: edificio?.codigo_postal || '',
        latitud: edificio?.latitud || '',
        longitud: edificio?.longitud || '',
        letra_zona: edificio?.letra_zona || '',
        orientacion: edificio?.orientacion || '',
        te_voip: edificio?.te_voip || '',
        cue_cabecera: edificio?.cabecera_cue || '',
    });

    const [detectedNombre, setDetectedNombre] = useState('');
    const [detectedCui, setDetectedCui] = useState(null);
    const [cueStatus, setCueStatus] = useState('idle'); // 'idle' | 'loading' | 'found_local' | 'found_external' | 'not_found'

    useEffect(() => {
        if (show && edificio) {
            setData({
                cui: edificio.cui || '',
                calle: edificio.calle || '',
                numero_puerta: edificio.numero_puerta || '',
                localidad: edificio.localidad || '',
                zona_departamento: edificio.zona_departamento || '',
                codigo_postal: edificio.codigo_postal || '',
                latitud: edificio.latitud || '',
                longitud: edificio.longitud || '',
                letra_zona: edificio.letra_zona || '',
                orientacion: edificio.orientacion || '',
                te_voip: edificio.te_voip || '',
                cue_cabecera: edificio.cabecera_cue || '',
            });
        }
    }, [edificio, show, setData]);

    useEffect(() => {
        const cueStr = String(data.cue_cabecera).trim();
        if (!cueStr) {
            setDetectedNombre('');
            setDetectedCui(null);
            setCueStatus('idle');
            return;
        }

        // 1. Check if it's the current cabecera (eager-loaded)
        if (cueStr === String(edificio?.cabecera_cue)) {
            setDetectedNombre(edificio?.cabecera?.nombre || 'Sin Nombre');
            setDetectedCui(edificio?.cui);
            setCueStatus('found_local');
            return;
        }

        // 2. Check if it is in the current building's establishments
        const localEst = edificio?.establecimientos?.find(
            (e) => String(e.cue) === cueStr,
        );
        if (localEst) {
            setDetectedNombre(localEst.nombre);
            setDetectedCui(edificio?.cui);
            setCueStatus('found_local');
            return;
        }

        // 3. Otherwise, fetch from the database to see if it is a valid external CUE
        setCueStatus('loading');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            fetch(route('api.lookup-cue', cueStr), {
                signal: controller.signal,
            })
                .then((res) => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .then((res) => {
                    if (res && res.nombre) {
                        setDetectedNombre(res.nombre);
                        setDetectedCui(res.cui);
                        setCueStatus('found_external');
                    } else {
                        setDetectedNombre('');
                        setDetectedCui(null);
                        setCueStatus('not_found');
                    }
                })
                .catch(() => {
                    if (!controller.signal.aborted) {
                        setDetectedNombre('');
                        setDetectedCui(null);
                        setCueStatus('not_found');
                    }
                });
        }, 300); // 300ms debounce

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [data.cue_cabecera, edificio]);

    if (!edificio) return null;

    const submit = (e) => {
        e.preventDefault();
        patch(route('administrativos.edificios.update', edificio.id), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    const renderDetectedName = () => {
        if (!data.cue_cabecera) {
            return (
                <span className="font-medium normal-case text-gray-400">
                    Ingrese un CUE de cabecera
                </span>
            );
        }
        if (cueStatus === 'loading') {
            return (
                <span className="flex animate-pulse items-center gap-1.5 font-medium text-gray-400">
                    <i className="fas fa-spinner fa-spin"></i> Buscando CUE...
                </span>
            );
        }
        if (cueStatus === 'found_local') {
            return (
                <span className="flex items-center gap-1.5 font-extrabold text-green-600">
                    <i className="fas fa-check-circle"></i> {detectedNombre}
                </span>
            );
        }
        if (cueStatus === 'found_external') {
            return (
                <span className="flex flex-col gap-1 font-bold text-orange-600">
                    <span className="flex items-center gap-1.5 font-extrabold text-orange-600">
                        <i className="fas fa-exclamation-triangle"></i>{' '}
                        {detectedNombre}
                    </span>
                    <span className="text-[10px] font-medium normal-case leading-tight text-orange-500/80">
                        * CUE válido pero no pertenece a este edificio
                        actualmente (asociado a CUI {detectedCui}). Se
                        actualizará la cabecera del edificio.
                    </span>
                </span>
            );
        }
        if (cueStatus === 'not_found') {
            return (
                <span className="flex flex-col gap-1 font-bold text-red-600">
                    <span className="flex items-center gap-1.5 text-[11px] leading-tight">
                        <i className="fas fa-times-circle"></i> CUE no
                        registrado en el sistema
                    </span>
                    <span className="text-[9px] font-medium normal-case leading-tight text-red-500/80">
                        * Verifique el número ingresado.
                    </span>
                </span>
            );
        }
        return null;
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-xl text-brand-orange shadow-sm">
                        <i className="fas fa-edit"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase text-gray-900">
                            Editar Edificio
                        </h3>
                        <p className="text-[10px] font-bold tracking-widest text-gray-400">
                            ACTUALIZACIÓN DE REGISTRO
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="cui" value="CUI" />
                        <TextInput
                            id="cui"
                            className="mt-1 block w-full border-orange-100 bg-orange-50/50"
                            value={data.cui}
                            onChange={(e) => setData('cui', e.target.value)}
                            required
                        />
                        <InputError message={errors.cui} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel
                            htmlFor="cue_cabecera"
                            value="CUE de la Cabecera"
                        />
                        <TextInput
                            id="cue_cabecera"
                            className="mt-1 block w-full border-orange-200 bg-orange-50 font-black text-brand-orange"
                            placeholder="Ingrese CUE para actualizar nombre"
                            value={data.cue_cabecera}
                            onChange={(e) =>
                                setData('cue_cabecera', e.target.value)
                            }
                        />
                        <div className="mt-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-2.5">
                            <p className="mb-1.5 text-[10px] font-black uppercase leading-none tracking-widest text-gray-400">
                                Nombre Detectado:
                            </p>
                            <p className="text-xs font-black uppercase leading-normal">
                                {renderDetectedName()}
                            </p>
                        </div>
                        <p className="mt-1 text-[9px] font-bold uppercase italic text-gray-400">
                            * Actualizará el establecimiento cabecera del
                            edificio (edificios.cabecera_cue).
                        </p>
                        <InputError
                            message={errors.cue_cabecera}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-2 border-t pt-4 md:col-span-2">
                        <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Información de Ubicación
                        </h4>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="calle" value="Calle" />
                        <TextInput
                            id="calle"
                            className="mt-1 block w-full"
                            value={data.calle}
                            onChange={(e) => setData('calle', e.target.value)}
                            required
                        />
                        <InputError message={errors.calle} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="numero" value="Número" />
                        <TextInput
                            id="numero"
                            className="mt-1 block w-full"
                            value={data.numero_puerta}
                            onChange={(e) =>
                                setData('numero_puerta', e.target.value)
                            }
                        />
                        <InputError
                            message={errors.numero_puerta}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="localidad" value="Localidad" />
                        <TextInput
                            id="localidad"
                            className="mt-1 block w-full"
                            value={data.localidad}
                            onChange={(e) =>
                                setData('localidad', e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.localidad}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="depto" value="Departamento" />
                        <select
                            id="depto"
                            className="mt-1 block w-full rounded-xl border-gray-300 text-sm font-semibold shadow-sm focus:border-brand-orange focus:ring-brand-orange"
                            value={data.zona_departamento}
                            onChange={(e) =>
                                setData('zona_departamento', e.target.value)
                            }
                            required
                        >
                            <option value="">Seleccione Departamento...</option>
                            {(options.zonas || []).map((z) => (
                                <option key={z} value={z}>
                                    {z}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.zona_departamento}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-2 border-t pt-4 md:col-span-2">
                        <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Geo-referenciación
                        </h4>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="lat_edit" value="Latitud" />
                        <TextInput
                            id="lat_edit"
                            className="mt-1 block w-full"
                            value={data.latitud}
                            onChange={(e) => setData('latitud', e.target.value)}
                        />
                        <InputError message={errors.latitud} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="lng_edit" value="Longitud" />
                        <TextInput
                            id="lng_edit"
                            className="mt-1 block w-full"
                            value={data.longitud}
                            onChange={(e) =>
                                setData('longitud', e.target.value)
                            }
                        />
                        <InputError
                            message={errors.longitud}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-2 border-t pt-4 md:col-span-2">
                        <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Otros Datos
                        </h4>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="cp_edit" value="Código Postal" />
                        <select
                            id="cp_edit"
                            className="mt-1 block w-full rounded-xl border-gray-300 text-sm font-semibold shadow-sm focus:border-brand-orange focus:ring-brand-orange"
                            value={data.codigo_postal}
                            onChange={(e) =>
                                setData('codigo_postal', e.target.value)
                            }
                        >
                            <option value="">
                                Seleccione Código Postal...
                            </option>
                            {(options.codigos_postales || []).map((cp) => (
                                <option key={cp} value={cp}>
                                    {cp}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.codigo_postal}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel
                            htmlFor="orientacion_edit"
                            value="Orientación"
                        />
                        <select
                            id="orientacion_edit"
                            className="mt-1 block w-full rounded-xl border-gray-300 text-sm font-semibold shadow-sm focus:border-brand-orange focus:ring-brand-orange"
                            value={data.orientacion}
                            onChange={(e) =>
                                setData('orientacion', e.target.value)
                            }
                        >
                            <option value="">Seleccione Orientación...</option>
                            {(options.orientaciones || []).map((o) => (
                                <option key={o} value={o}>
                                    {o}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.orientacion}
                            className="mt-2"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel
                            htmlFor="te_voip_edit"
                            value="Teléfono VoIP"
                        />
                        <TextInput
                            id="te_voip_edit"
                            className="mt-1 block w-full"
                            value={data.te_voip}
                            onChange={(e) => setData('te_voip', e.target.value)}
                        />
                        <InputError message={errors.te_voip} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel
                            htmlFor="letra_zona_edit"
                            value="Letra Zona"
                        />
                        <select
                            id="letra_zona_edit"
                            className="mt-1 block w-full rounded-xl border-gray-300 text-sm font-semibold shadow-sm focus:border-brand-orange focus:ring-brand-orange"
                            value={data.letra_zona}
                            onChange={(e) =>
                                setData('letra_zona', e.target.value)
                            }
                        >
                            <option value="">Seleccione Letra Zona...</option>
                            {(options.letras_zona || []).map((lz) => (
                                <option key={lz} value={lz}>
                                    {lz}
                                </option>
                            ))}
                        </select>
                        <InputError
                            message={errors.letra_zona}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="mt-10 flex justify-end gap-3 border-t pt-6">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

