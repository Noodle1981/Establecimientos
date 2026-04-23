import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap gap-1">
            {links.map((link, key) => (
                link.url === null ? (
                    <div
                        key={key}
                        className="px-3 py-1.5 text-[10px] text-gray-400 border rounded-lg bg-gray-50 cursor-default font-black uppercase tracking-tighter"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-3 py-1.5 text-[10px] border rounded-lg transition-colors font-black uppercase tracking-tighter ${
                            link.active 
                                ? 'bg-brand-orange text-white border-brand-orange' 
                                : 'bg-white text-gray-700 hover:bg-orange-50 hover:border-brand-orange'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
