export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-black shadow-sm transition duration-150 ease-in-out hover:border-brand-orange hover:bg-brand-orange/5 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 disabled:opacity-30 ${
                    disabled && 'opacity-30 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
