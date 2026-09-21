import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function ModalInput({ label, value, onChange, error, type = 'text' }) {
    return (
        <div className="space-y-1">
            <InputLabel value={label} />
            <TextInput
                type={type}
                className="mt-1 w-full"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {error && <InputError message={error} />}
        </div>
    );
}
