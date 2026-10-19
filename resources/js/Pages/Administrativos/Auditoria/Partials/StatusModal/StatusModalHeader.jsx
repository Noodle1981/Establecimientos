import React, { memo } from 'react';

const StatusModalHeader = memo(function StatusModalHeader({ establecimientoNombre, onClose }) {
    return (
        <div className="mb-6 flex items-center gap-4 border-b pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-xl text-brand-orange shadow-sm">
                <i className="fas fa-tasks"></i>
            </div>
            <div className="flex-1">
                <h3 className="text-lg font-black uppercase leading-none tracking-tight text-gray-900">
                    Validación de Datos
                </h3>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {establecimientoNombre || 'Sin Establecimiento'}
                </p>
            </div>
            <button
                onClick={onClose}
                type="button"
                className="text-gray-400 transition-colors hover:text-brand-orange"
                aria-label="Cerrar modal"
            >
                <i className="fas fa-times text-xl"></i>
            </button>
        </div>
    );
});

export default StatusModalHeader;
