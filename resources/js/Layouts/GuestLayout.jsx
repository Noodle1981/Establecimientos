import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-orange-50 via-white to-orange-100">
            <div className="mb-8 flex flex-col items-center">
                <Link href="/" className="flex flex-col items-center gap-4 group">
                    <div className="bg-white p-4 rounded-3xl shadow-xl group-hover:scale-105 transition-transform duration-300 border-b-4 border-brand-orange">
                        <img src="/images/logo.jpg" alt="Logo Ministerio" className="h-24 w-auto object-contain" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">
                            Establecimientos
                        </h1>
                        <p className="text-sm font-bold text-brand-orange uppercase tracking-widest">
                            Ministerio de Educación
                        </p>
                    </div>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-8 py-10 bg-white/80 backdrop-blur-md shadow-[0_20px_50px_rgba(254,130,4,0.15)] border border-white/50 overflow-hidden sm:rounded-[2.5rem]">
                {children}
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-xs text-gray-400 font-medium tracking-wide">
                    © {new Date().getFullYear()} Superior - Gobierno de San Juan
                </p>
            </div>
        </div>
    );
}
