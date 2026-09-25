/**
 * Safe clipboard copy with fallback for older browsers or insecure contexts
 */

export async function copyToClipboard(text) {
    if (!text) return false;
    const stringText = String(text);

    if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {
        try {
            await navigator.clipboard.writeText(stringText);
            return true;
        } catch (err) {
            console.warn('navigator.clipboard failed, using fallback copy:', err);
            return fallbackCopy(stringText);
        }
    } else {
        return fallbackCopy(stringText);
    }
}

function fallbackCopy(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        console.error('Fallback copy threw error:', err);
        return false;
    }
}
