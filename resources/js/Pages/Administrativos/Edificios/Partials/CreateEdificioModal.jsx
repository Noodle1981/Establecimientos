import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CreateEdificioModal({ show, onClose, options = {} }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        cui: '',
        calle: '',
        numero_puerta: '',
        localidad: '',
        zona_departamento: '',
        codigo_postal: '',
        latitud: '',
        longitud: '',
        letra_zona: '',
        orientacion: '',
        te_voip: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('administrativos.edificios.store'), {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={submit} className="p-6">
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-xl text-brand-orange shadow-sm">
                        <i className="fas fa-plus-circle"></i>
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase text-black">
                            Nuevo Edificio
                        </h3>
                        <p className="text-[10px] font-black tracking-widest text-black/40">
                            ALTA DE REGISTRO
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

                    <div className="col-span-2 border-t border-orange-100 pt-4 md:col-span-2">
                        <h4 className="mb-2 text-[10px] font-black uppercase tracking-widest text-black/50">
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
                            Geo-referenciación (Opcional)
                        </h4>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="lat" value="Latitud" />
                        <TextInput
                            id="lat"
                            className="mt-1 block w-full"
                            value={data.latitud}
                            onChange={(e) => setData('latitud', e.target.value)}
                        />
                        <InputError message={errors.latitud} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="lng" value="Longitud" />
                        <TextInput
                            id="lng"
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
                        <InputLabel htmlFor="cp" value="Código Postal" />
                        <select
                            id="cp"
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
                        <InputLabel htmlFor="orientacion" value="Orientación" />
                        <select
                            id="orientacion"
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
                        <InputLabel htmlFor="te_voip" value="Teléfono VoIP" />
                        <TextInput
                            id="te_voip"
                            className="mt-1 block w-full"
                            value={data.te_voip}
                            onChange={(e) => setData('te_voip', e.target.value)}
                        />
                        <InputError message={errors.te_voip} className="mt-2" />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <InputLabel htmlFor="letra_zona" value="Letra Zona" />
                        <select
                            id="letra_zona"
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
                        {processing ? 'Creando...' : 'Crear Edificio'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}

