import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Restablecer Contraseña" />

            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-brand-orange shadow-inner">
                    <i className="fas fa-lock text-2xl"></i>
                </div>
                <h2 className="text-2xl font-black text-gray-900">
                    Restablecer Contraseña
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Ingresa tu correo electrónico y tu nueva contraseña para actualizar tu cuenta.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Correo Electrónico"
                        className="mb-1 ml-1 font-bold text-gray-700"
                    />
                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <i className="fas fa-envelope text-gray-400 transition-colors group-focus-within:text-brand-orange"></i>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full rounded-2xl border-gray-200 bg-gray-50 pl-11 shadow-sm transition-all focus:bg-white"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="ml-1 mt-2" />
                </div>

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
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="ml-1 mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Nueva Contraseña"
                        className="mb-1 ml-1 font-bold text-gray-700"
                    />
                    <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <i className="fas fa-shield-alt text-gray-400 transition-colors group-focus-within:text-brand-orange"></i>
                        </div>
                        <TextInput
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full rounded-2xl border-gray-200 bg-gray-50 pl-11 shadow-sm transition-all focus:bg-white"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                        />
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="ml-1 mt-2"
                    />
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-600 active:scale-95"
                        disabled={processing}
                    >
                        {processing ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-check"></i>
                        )}
                        Restablecer Contraseña
                    </PrimaryButton>
                </div>

                <div className="text-center pt-2">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-brand-orange"
                    >
                        <i className="fas fa-arrow-left text-xs"></i>
                        Volver a Iniciar Sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
