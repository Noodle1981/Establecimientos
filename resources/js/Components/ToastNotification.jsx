import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ToastNotification() {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({
                id: Date.now(),
                type: 'success',
                message: flash.success,
            });
        } else if (flash?.error) {
            setToast({
                id: Date.now(),
                type: 'error',
                message: flash.error,
            });
        }
    }, [flash]);

    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast]);

    if (!toast) return null;

    const isSuccess = toast.type === 'success';

    return (
        <div className="fixed bottom-5 right-5 z-[9999] max-w-sm transform animate-fade-in transition-all duration-300 ease-out">
            <div
                className={`flex items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md ${
                    isSuccess
                        ? 'border-emerald-200 bg-emerald-50/95 text-emerald-900'
                        : 'border-red-200 bg-red-50/95 text-red-900'
                }`}
                role="alert"
            >
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-inner ${
                        isSuccess
                            ? 'bg-emerald-500 text-white'
                            : 'bg-red-500 text-white'
                    }`}
                >
                    <i
                        className={`fas ${
                            isSuccess ? 'fa-check' : 'fa-exclamation'
                        } text-base`}
                    ></i>
                </div>

                <div className="flex-1 pr-2">
                    <p className="text-xs font-black uppercase tracking-wider">
                        {isSuccess ? 'Operación Exitosa' : 'Atención'}
                    </p>
                    <p className="text-sm font-medium leading-snug">
                        {toast.message}
                    </p>
                </div>

                <button
                    onClick={() => setToast(null)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-black/5 hover:text-gray-700"
                    aria-label="Cerrar notificación"
                >
                    <i className="fas fa-times text-xs"></i>
                </button>
            </div>
        </div>
    );
}
