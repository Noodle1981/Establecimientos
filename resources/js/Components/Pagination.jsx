import { Link } from '@inertiajs/react';

export default function Pagination({ links, preserveScroll = true }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap gap-1">
            {links.map((link, key) =>
                link.url === null ? (
                    <div
                        key={key}
                        className="cursor-default rounded-lg border bg-gray-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-gray-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        preserveScroll={preserveScroll}
                        className={`rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter transition-colors ${
                            link.active
                                ? 'border-brand-orange bg-brand-orange text-white'
                                : 'bg-white text-gray-700 hover:border-brand-orange hover:bg-orange-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </div>
    );
}
