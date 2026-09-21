import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DetailItem from './DetailItem';

export default function ViewEdificioModal({ show, onClose, edificio }) {
    if (!edificio) return null;

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-xl text-brand-orange shadow-sm">
                            <i className="fas fa-info-circle"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900">
                                Detalles del Edificio
                            </h3>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                CUI: {edificio.cui}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <DetailItem
                        icon="fas fa-map-marker-alt"
                        label="Ubicación"
                        value={`${edificio.calle} ${edificio.numero_puerta || 'S/N'}`}
                    />
                    <DetailItem
                        icon="fas fa-city"
                        label="Localidad / Depto"
                        value={`${edificio.localidad} - ${edificio.zona_departamento}`}
                    />
                    <DetailItem
                        icon="fas fa-mail-bulk"
                        label="Código Postal"
                        value={edificio.codigo_postal || 'N/A'}
                    />
                    <DetailItem
                        icon="fas fa-compass"
                        label="Coordenadas"
                        value={`${edificio.latitud || '?'}, ${edificio.longitud || '?'}`}
                    />
                </div>

                <div className="border-t pt-6">
                    <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Establecimientos que comparten este edificio
                    </h4>
                    <div className="space-y-3">
                        {edificio.establecimientos &&
                            edificio.establecimientos.map((est) => (
                                <div
                                    key={est.id}
                                    className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-brand-orange"
                                >
                                    <div>
                                        <p className="mb-1 text-xs font-black leading-none text-gray-800">
                                            {est.nombre}
                                        </p>
                                        <p className="text-[10px] font-bold uppercase text-gray-400">
                                            CUE: {est.cue}
                                        </p>
                                    </div>
                                    <i className="fas fa-chevron-right text-gray-200 transition-colors group-hover:text-brand-orange"></i>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <SecondaryButton onClick={onClose}>Cerrar</SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
