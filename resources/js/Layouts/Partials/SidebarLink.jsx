import { Link } from '@inertiajs/react';

export default function SidebarLink({ href, active, children, icon, shortcut }) {
    return (
        <div className="group relative flex items-center justify-center">
            <Link
                href={href}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                    active
                        ? 'bg-orange-50 text-brand-orange ring-1 ring-orange-200/80 shadow-xs'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                }`}
            >
                <i
                    className={`${icon} text-base transition-transform duration-200 group-hover:scale-110`}
                ></i>
            </Link>

            {/* Tooltip estilo Gemini flotante */}
            <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-[1100] hidden md:flex items-center gap-2 rounded-xl bg-[#1e1f20] px-3.5 py-1.5 text-xs font-medium text-white shadow-2xl transition-all duration-150 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1.5">
                <span>{children}</span>
                {shortcut && (
                    <span className="text-[10px] text-gray-400 font-mono tracking-tight">
                        ({shortcut})
                    </span>
                )}
            </div>
        </div>
    );
}
