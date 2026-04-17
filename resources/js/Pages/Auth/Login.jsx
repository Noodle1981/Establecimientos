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
                <h2 className="text-2xl font-black text-gray-900">¡Bienvenido de nuevo!</h2>
                <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales para acceder al panel</p>
            </div>

            {status && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 text-sm font-medium text-green-600 border border-green-100 flex items-center gap-2">
                    <i className="fas fa-check-circle"></i>
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Correo Electrónico" className="text-gray-700 font-bold ml-1 mb-1" />
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-envelope text-gray-400 group-focus-within:text-brand-orange transition-colors"></i>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full pl-11 bg-gray-50 border-gray-200 focus:bg-white transition-all rounded-2xl shadow-sm"
                            autoComplete="username"
                            isFocused={true}
                            placeholder="ejemplo@mineducacion.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2 ml-1" />
                </div>

                <div>
                    <div className="flex justify-between items-center ml-1 mb-1">
                        <InputLabel htmlFor="password" value="Contraseña" className="text-gray-700 font-bold" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-bold text-brand-orange hover:text-orange-600 transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fas fa-lock text-gray-400 group-focus-within:text-brand-orange transition-colors"></i>
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full pl-11 bg-gray-50 border-gray-200 focus:bg-white transition-all rounded-2xl shadow-sm"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2 ml-1" />
                </div>

                <div className="flex items-center justify-between px-1">
                    <label className="flex items-center cursor-pointer group">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded-lg border-gray-300 text-brand-orange shadow-sm focus:ring-brand-orange"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600 group-hover:text-brand-orange transition-colors">Recuérdame</span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton 
                        className="w-full justify-center py-4 bg-brand-orange hover:bg-orange-600 text-white rounded-2xl shadow-lg shadow-orange-200 text-sm font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2" 
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
