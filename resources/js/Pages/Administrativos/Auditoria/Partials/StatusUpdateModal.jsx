import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AuditFormSection from './StatusModal/AuditFormSection';
import EdificioInfoSection from './StatusModal/EdificioInfoSection';
import EstablecimientoInfoSection from './StatusModal/EstablecimientoInfoSection';
import GeorreferenciacionDmsSection from './StatusModal/GeorreferenciacionDmsSection';
import StatusModalHeader from './StatusModal/StatusModalHeader';

const CAMPOS_AUDITORIA = [
    'Nombre',
    'Dirección',
    'Edificio',
    'CUI',
    'CUE',
    'GPS',
    'RADIO',
    'SECTOR',
    'MODALIDAD',
    'CATEGORÍA',
];

export default function StatusUpdateModal({
    show,
    onClose,
    modalidad,
    getNombreEdificio,
}) {
    const { data, setData, patch, processing } = useForm({
        estado: modalidad?.estado_validacion || 'PENDIENTE',
        observaciones: modalidad?.observaciones || '',
        campos_auditados: modalidad?.campos_auditados || [],
        propagar_al_edificio: false,
    });

    const [vinculados, setVinculados] = useState([]);

    // Sincronizar formulario y cargar vinculados al abrir o cambiar modalidad
    useEffect(() => {
        if (modalidad && show) {
            setData({
                estado: modalidad.estado_validacion || 'PENDIENTE',
                observaciones: modalidad.observaciones || '',
                campos_auditados: modalidad.campos_auditados || [],
                propagar_al_edificio: false,
            });

            fetch(route('administrativos.auditoria.vinculados', modalidad.id))
                .then((res) => res.json())
                .then((resData) => setVinculados(resData))
                .catch((err) => console.error('Error cargando vinculados:', err));
        }
    }, [modalidad, show, setData]);

    const toggleCampo = useCallback(
        (campo) => {
            const current = data.campos_auditados || [];
            if (current.includes(campo)) {
                setData(
                    'campos_auditados',
                    current.filter((c) => c !== campo),
                );
            } else {
                setData('campos_auditados', [...current, campo]);
            }
        },
        [data.campos_auditados, setData],
    );

    const submit = (e) => {
        e.preventDefault();
        patch(route('administrativos.auditoria.updateEstado', modalidad.id), {
            onSuccess: () => onClose(),
        });
    };

    const nombreEdificio = useMemo(() => {
        return modalidad && getNombreEdificio ? getNombreEdificio(modalidad) : null;
    }, [modalidad, getNombreEdificio]);

    if (!modalidad) return null;

    const latitud = modalidad.establecimiento?.edificio?.latitud;
    const longitud = modalidad.establecimiento?.edificio?.longitud;

    return (
        <Modal show={show} onClose={onClose} maxWidth="5xl">
            <form onSubmit={submit} className="p-6">
                <StatusModalHeader
                    establecimientoNombre={modalidad.establecimiento?.nombre}
                    onClose={onClose}
                />

                <div className="space-y-6">
                    {/* Fila 1: Datos del Establecimiento e Información del Edificio */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <EstablecimientoInfoSection modalidad={modalidad} />
                        <EdificioInfoSection
                            modalidad={modalidad}
                            nombreEdificio={nombreEdificio}
                        />
                    </div>

                    {/* Fila 2: Georreferenciación DMS (si existen coordenadas) */}
                    {latitud && longitud && (
                        <GeorreferenciacionDmsSection
                            latitud={latitud}
                            longitud={longitud}
                        />
                    )}

                    {/* Fila 3: Controles del Formulario de Auditoría */}
                    <AuditFormSection
                        data={data}
                        setData={setData}
                        toggleCampo={toggleCampo}
                        camposAuditoria={CAMPOS_AUDITORIA}
                        vinculadosCount={vinculados.length}
                        processing={processing}
                        onClose={onClose}
                    />
                </div>
            </form>
        </Modal>
    );
}
