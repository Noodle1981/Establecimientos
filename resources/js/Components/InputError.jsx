export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            role="alert"
            {...props}
            className={'text-xs font-bold text-brand-red ' + className}
        >
            {message}
        </p>
    ) : null;
}
