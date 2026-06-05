import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-orange-50 via-white to-orange-100 pt-6 sm:justify-center sm:pt-0">
            <div className="mb-8 flex flex-col items-center">
                <Link
                    href="/"
                    className="group flex flex-col items-center gap-4"
                >
                    <div className="rounded-3xl border-b-4 border-brand-orange bg-white p-4 shadow-xl transition-transform duration-300 group-hover:scale-105">
                        <img
                            src="/images/logo.jpg"
                            alt="Logo Ministerio"
                            className="h-24 w-auto object-contain"
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">
                            Establecimientos
                        </h1>
                        <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
                            Ministerio de Educación
                        </p>
                    </div>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden border border-white/50 bg-white/80 px-8 py-10 shadow-[0_20px_50px_rgba(254,130,4,0.15)] backdrop-blur-md sm:max-w-md sm:rounded-[2.5rem]">
                {children}
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs font-medium tracking-wide text-gray-400">
                    © {new Date().getFullYear()} Superior - Gobierno de San Juan
                </p>
            </div>
        </div>
    );
}
