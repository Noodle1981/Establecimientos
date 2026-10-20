import { Link } from '@inertiajs/react';
import { memo } from 'react';

// Decodes common HTML entities from Laravel pagination labels safely
function formatLabel(label) {
    if (!label) return '';
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&nbsp;/g, ' ');
}

function Pagination({ links = [], preserveScroll = true }) {
    if (!links || links.length <= 3) return null;

    return (
        <div
            className="flex flex-wrap gap-1"
            role="navigation"
            aria-label="Paginación"
        >
            {links.map((link, index) => {
                const uniqueKey = `${link.label}-${index}`;
                const labelText = formatLabel(link.label);

                return link.url === null ? (
                    <span
                        key={uniqueKey}
                        className="cursor-default select-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter text-gray-400"
                        aria-disabled="true"
                    >
                        {labelText}
                    </span>
                ) : (
                    <Link
                        key={uniqueKey}
                        href={link.url}
                        preserveScroll={preserveScroll}
                        prefetch="hover"
                        className={`rounded-lg border px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter transition-colors ${
                            link.active
                                ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
                                : 'border-gray-200 bg-white text-black hover:border-brand-orange hover:bg-orange-50'
                        }`}
                        aria-current={link.active ? 'page' : undefined}
                    >
                        {labelText}
                    </Link>
                );
            })}
        </div>
    );
}

export default memo(Pagination);
