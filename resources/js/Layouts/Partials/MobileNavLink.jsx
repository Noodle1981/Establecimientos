import { Link } from '@inertiajs/react';

export default function MobileNavLink({ href, active, children, icon }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-black transition-colors ${
                active
                    ? 'bg-white text-brand-orange shadow-lg'
                    : 'text-white hover:bg-white/10'
            }`}
        >
            <i
                className={`${icon} w-5 text-center ${active ? 'text-brand-orange' : 'text-white/60'}`}
            ></i>
            {children}
        </Link>
    );
}
