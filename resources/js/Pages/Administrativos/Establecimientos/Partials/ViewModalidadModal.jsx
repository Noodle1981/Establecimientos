import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DetailItem from './DetailItem';
import { getNombreEdificio } from '../constants/areasNiveles';

export default function ViewModalidadModal({
    show,
    onClose,
    modalidad,
    nombresEdificios = {},
}) {
    if (!modalidad) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-xl shadow-sm ${
                                modalidad.validado
                                    ? 'border-green-100 bg-green-50 text-green-600'
                                    : 'border-red-100 bg-red-50 text-red-500'
                            }`}
                        >
                            <i
                                className={`fas ${modalidad.validado ? 'fa-school' : 'fa-clock'}`}
                            ></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-black leading-tight text-gray-900">
                                {modalidad.establecimiento?.nombre ||
                                    'Sin Establecimiento'}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                CUE: {modalidad.establecimiento?.cue || 'S/D'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-xl text-gray-400 hover:text-gray-600"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <DetailItem
                        icon="fas fa-building"
                        label="Edificio"
                        value={
                            getNombreEdificio(modalidad, nombresEdificios) ||
                            'Sin Nombre'
                        }
                    />
                    <DetailItem
                        icon="fas fa-id-card"
                        label="CUI Edificio"
                        value={
                            modalidad.establecimiento?.edificio?.cui || 'S/D'
                        }
                    />
                    <DetailItem
                        icon="fas fa-map-marker-alt"
                        label="Dirección"
                        value={`${modalidad.establecimiento?.edificio?.calle || ''} ${modalidad.establecimiento?.edificio?.numero_puerta || 'S/N'}`}
                    />
                    <DetailItem
                        icon="fas fa-city"
                        label="Departamento"
                        value={
                            modalidad.establecimiento?.edificio
                                ?.zona_departamento || 'S/D'
                        }
                    />
                    <DetailItem
                        icon="fas fa-graduation-cap"
                        label="Nivel Educativo"
                        value={modalidad.nivel_educativo}
                    />
                    <DetailItem
                        icon="fas fa-university"
                        label="Dirección de Área"
                        value={modalidad.direccion_area}
                    />
                    <DetailItem
                        icon="fas fa-landmark"
                        label="Ámbito"
                        value={modalidad.ambito}
                    />
                    <DetailItem
                        icon="fas fa-users"
                        label="Sector"
                        value={
                            (modalidad.sector ?? '') !== ''
                                ? modalidad.sector
                                : 'S/D'
                        }
                    />
                    <DetailItem
                        icon="fas fa-broadcast-tower"
                        label="Radio / Zona"
                        value={`${(modalidad.radio ?? '') !== '' ? modalidad.radio : '?'}, ${(modalidad.establecimiento.edificio?.letra_zona ?? '') !== '' ? modalidad.establecimiento.edificio.letra_zona : '?'}`}
                    />
                    <DetailItem
                        icon="fas fa-award"
                        label="Categoría"
                        value={
                            (modalidad.categoria ?? '') !== ''
                                ? modalidad.categoria
                                : 'S/D'
                        }
                    />
                    <DetailItem
                        icon="fas fa-check-circle"
                        label="Estado Validación"
                        value={
                            modalidad.validado
                                ? 'CONSOLIDADO'
                                : 'PENDIENTE DE REVISIÓN'
                        }
                    />
                </div>

                <div className="mt-6 border-t pt-4">
                    <h4 className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <i className="fas fa-comment-alt text-brand-orange"></i>{' '}
                        Observaciones del Establecimiento (CUE)
                    </h4>
                    {modalidad.establecimiento.observaciones ? (
                        <div className="rounded-2xl border border-orange-100/50 bg-orange-50/30 p-4">
                            <p className="whitespace-pre-wrap text-xs font-semibold leading-relaxed text-gray-700">
                                {modalidad.establecimiento.observaciones}
                            </p>
                        </div>
                    ) : (
                        <p className="text-xs font-medium italic text-gray-400">
                            Sin observaciones registradas para este CUE.
                        </p>
                    )}
                </div>

                <div className="mt-8 flex justify-end">
                    <SecondaryButton onClick={onClose}>
                        Cerrar Panel
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
