import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ChangePassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('auth.change-password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Cambio Obligatorio de Contraseña" />

            <div className="mb-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-brand-orange shadow-inner">
                    <i className="fas fa-key text-xl"></i>
                </div>
                <h2 className="text-2xl font-black text-gray-900">
                    Cambio Obligatorio de Contraseña
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Por motivos de seguridad institucional, debes establecer una nueva contraseña personal antes de continuar.
                </p>
            </div>

            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 leading-relaxed">
                <p className="font-bold mb-1">
                    <i className="fas fa-shield-alt mr-1"></i> Requisitos de seguridad:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                    <li>Mínimo 10 caracteres</li>
                    <li>Incluir mayúsculas y minúsculas</li>
                    <li>Incluir al menos un número</li>
                </ul>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Nueva Contraseña"
                        className="mb-1 ml-1 font-bold text-gray-700"
                    />
                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <i className="fas fa-lock text-gray-400 transition-colors group-focus-within:text-brand-orange"></i>
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full rounded-2xl border-gray-200 bg-gray-50 pl-11 shadow-sm transition-all focus:bg-white"
                            autoComplete="new-password"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Nueva Contraseña"
                        className="mb-1 ml-1 font-bold text-gray-700"
                    />
                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <i className="fas fa-check-double text-gray-400 transition-colors group-focus-within:text-brand-orange"></i>
                        </div>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full rounded-2xl border-gray-200 bg-gray-50 pl-11 shadow-sm transition-all focus:bg-white"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1"
                    />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center rounded-2xl py-3.5 text-base font-bold shadow-lg shadow-orange-500/20 active:scale-[0.99]"
                        disabled={processing}
                    >
                        {processing ? 'Actualizando...' : 'Guardar y Continuar'}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
