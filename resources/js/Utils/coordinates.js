/**
 * Utilities for GPS Coordinate parsing and DMS conversions
 */

export function decimalToDMS(val, isLat) {
    if (val === undefined || val === null || val === '') {
        return {
            cardinal: '-',
            cardinalShort: '-',
            degrees: '-',
            minutes: '-',
            seconds: '-',
        };
    }
    const num = parseFloat(val);
    if (isNaN(num)) {
        return {
            cardinal: '-',
            cardinalShort: '-',
            degrees: '-',
            minutes: '-',
            seconds: '-',
        };
    }

    const absolute = Math.abs(num);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

    let cardinal = '';
    let cardinalShort = '';
    if (isLat) {
        cardinal = num >= 0 ? 'Norte (N)' : 'Sur (S)';
        cardinalShort = num >= 0 ? 'N' : 'S';
    } else {
        cardinal = num >= 0 ? 'Este (E)' : 'Oeste (O)';
        cardinalShort = num >= 0 ? 'E' : 'O';
    }

    return {
        cardinal,
        cardinalShort,
        degrees: String(degrees),
        minutes: String(minutes),
        seconds: String(seconds).replace('.', ','),
    };
}
