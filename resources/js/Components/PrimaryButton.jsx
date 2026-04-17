export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-xl border border-transparent bg-brand-orange px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-orange-600 focus:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 active:bg-orange-700 shadow-lg shadow-orange-200/50 ${
                    disabled && 'opacity-50 grayscale'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
