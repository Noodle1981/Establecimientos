import { Link } from '@inertiajs/react';
import logoMinisterio from '../../../images/logoMinisterio.png';

export default function Navbar({
    user,
    isAdmin,
    showSidebar,
    showingNavigationDropdown,
    setShowingNavigationDropdown,
    userOpen,
    setUserOpen,
}) {
    return (
        <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-gray-100 bg-white shadow-sm">
            <div className="flex h-full items-center justify-between px-6">
                {/* Left: Mobile Toggle & Logo */}
                <div className="flex items-center gap-4">
                    {showSidebar && (
                        <button
                            onClick={() =>
                                setShowingNavigationDropdown(
                                    !showingNavigationDropdown,
                                )
                            }
                            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
                        >
                            <i className="fas fa-bars text-xl"></i>
                        </button>
                    )}
                    <Link href="/">
                        <img
                            src={logoMinisterio}
                            alt="M.E."
                            className="h-10 w-auto"
                            width="160"
                            height="40"
                        />
                    </Link>
                </div>

                {/* Right: User Menu */}
                <div className="flex items-center">
                    {user ? (
                        <div className="relative">
                            <div className="flex items-center gap-3">
                                {!showSidebar && (
                                    <Link
                                        href={
                                            isAdmin
                                                ? route('admin.dashboard')
                                                : route(
                                                      'administrativos.dashboard',
                                                  )
                                        }
                                        className="hidden items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white sm:inline-flex"
                                    >
                                        <i className="fas fa-th-large"></i> Entrar
                                        al Panel
                                    </Link>
                                )}
                                <button
                                    onClick={() => setUserOpen(!userOpen)}
                                    className="flex items-center space-x-3 rounded-xl p-1 transition hover:bg-gray-50"
                                >
                                    <div className="flex hidden flex-col text-right sm:flex">
                                        <span className="text-xs font-black leading-none text-black">
                                            {user.name}
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-tighter text-brand-orange">
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange font-black text-white shadow-md">
                                        {user.name.charAt(0)}
                                    </div>
                                </button>
                            </div>

                            {userOpen && (
                                <div className="animate-in fade-in slide-in-from-right-4 absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-2xl duration-200">
                                    <div className="border-b border-gray-50 bg-gray-50/50 px-4 py-3">
                                        <p className="text-[10px] font-black uppercase text-gray-400">
                                            Cuenta de Usuario
                                        </p>
                                        <p className="truncate text-sm font-black text-black">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center px-4 py-3 text-sm font-medium text-black transition hover:bg-orange-50"
                                    >
                                        <i className="fas fa-id-card-alt mr-3 text-brand-orange"></i>{' '}
                                        Mi Perfil
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                        <i className="fas fa-sign-out-alt mr-3"></i>{' '}
                                        Cerrar Sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-brand-orange px-6 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-orange-600"
                        >
                            <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
