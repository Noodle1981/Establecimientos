import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-gray-900">
                    ¡Bienvenido de nuevo!
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Ingresa tus credenciales para acceder al panel
                </p>
            </div>

            {status && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-3 text-sm font-medium text-green-600">
                    <i className="fas fa-check-circle"></i>
                    {status}
                </div>
            )}

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
                            isFocused={true}
                            placeholder="ejemplo@mineducacion.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="ml-1 mt-2" />
                </div>

                <div>
                    <div className="mb-1 ml-1 flex items-center justify-between">
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="font-bold text-gray-700"
                        />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-brand-orange transition-colors hover:text-orange-600"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>
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
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                        />
                    </div>
                    <InputError
                        message={errors.password}
                        className="ml-1 mt-2"
                    />
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="group flex cursor-pointer items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded-lg border-gray-300 text-brand-orange shadow-sm focus:ring-brand-orange"
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600 transition-colors group-hover:text-brand-orange">
                            Recuérdame
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-600 active:scale-95"
                        disabled={processing}
                    >
                        {processing ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-sign-in-alt"></i>
                        )}
                        Ingresar al Sistema
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
