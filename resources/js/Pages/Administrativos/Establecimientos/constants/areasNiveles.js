// Mapeo estático de Dirección de Área a Niveles Educativos
export const MAPA_AREA_NIVEL = {
    ADULTOS: ['CENS', 'PROPAA', 'UEPA'],
    'ED. ESPECIAL': ['EDUCACIÓN ESPECIAL', 'EDUCACIÓN HOSPITALARIA'],
    INICIAL: ['INICIAL'],
    PRIMARIO: ['ALBERGUE', 'PRIMARIO'],
    PRIVADA: [
        'ADULTOS',
        'AGROTECNICA',
        'CENS',
        'EDUCACIÓN ESPECIAL',
        'INICIAL',
        'NO FORMAL',
        'PRIMARIO',
        'SECUNDARIO',
        'SUPERIOR',
        'TEC. CAP. LABORAL',
        'TÉCNICO',
        'UEPA',
    ],
    SECUNDARIO: ['NO FORMAL', 'SECUNDARIO'],
    SUPERIOR: ['SUPERIOR'],
    TÉCNICA: [
        'AGROTECNICA',
        'FOR. PROF. EDUC. NO FORMAL',
        'MONOTÉCNICA',
        'TEC. CAP. LABORAL',
        'TÉCNICO',
    ],
};

// Función para obtener el nombre descriptivo del edificio
export const getNombreEdificio = (item, mapa = {}) => {
    try {
        const edificioId = item.establecimiento?.edificio_id;
        if (edificioId && mapa[edificioId]) {
            return mapa[edificioId];
        }
        // Fallback: nombre del establecimiento si no hay mapa
        return (
            item.establecimiento?.edificio?.cabecera?.nombre ??
            item.establecimiento?.nombre ??
            null
        );
    } catch (e) {
        console.error('Error en getNombreEdificio:', e);
        return null;
    }
};
