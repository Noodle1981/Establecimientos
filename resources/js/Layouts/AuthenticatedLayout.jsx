import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isAdministrativo = user?.role === 'administrativos';

    return (
        <div className="min-h-screen bg-white">
            <nav className="fixed w-full top-0 z-50 bg-white shadow-sm border-b" style={{ borderColor: '#FE8204' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Left Side: Logo & Navigation Links */}
                        <div className="flex items-center space-x-6">
                            {/* Logo */}
                            <Link href={route('dashboard')} className="flex items-center gap-3">
                                <img src="/images/logo.jpg" alt="Logo M.E." className="h-10 w-auto object-contain" />
                                <div className="flex flex-col">
                                    <span className="text-lg leading-tight font-semibold" style={{ color: '#FE8204' }}>Establecimientos</span>
                                    <span className="text-xs text-black font-medium">Ministerio de Educación</span>
                                </div>
                            </Link>

                            {/* Navigation Links (Desktop) */}
                            <div className="hidden md:flex md:space-x-1">
                                <NavLinkCustom href={route('mapa.publico')} active={route().current('mapa.publico')} icon="fas fa-map-marked-alt">
                                    Mapa
                                </NavLinkCustom>

                                {isAdmin && (
                                    <>
                                        <NavLinkCustom href={route('admin.dashboard')} active={route().current('admin.dashboard')} icon="fas fa-chart-line">
                                            Dashboard
                                        </NavLinkCustom>
                                        {/* Agregaremos más links conforme los migremos */}
                                    </>
                                )}

                                {isAdministrativo && (
                                    <>
                                        <NavLinkCustom href={route('administrativos.dashboard')} active={route().current('administrativos.dashboard')} icon="fas fa-tachometer-alt">
                                            Panel
                                        </NavLinkCustom>
                                        <NavLinkCustom href={route('administrativos.edificios.index')} active={route().current('administrativos.edificios.index')} icon="fas fa-building">
                                            Edificios
                                        </NavLinkCustom>
                                        <NavLinkCustom href={route('administrativos.establecimientos.index')} active={route().current('administrativos.establecimientos.index')} icon="fas fa-school">
                                            Establecimientos
                                        </NavLinkCustom>
                                        <NavLinkCustom href={route('administrativos.instrumentos.index')} active={route().current('administrativos.instrumentos.index')} icon="fas fa-file-contract">
                                            Instrumentos
                                        </NavLinkCustom>
                                        <NavLinkCustom href={route('administrativos.auditoria.index')} active={route().current('administrativos.auditoria.index')} icon="fas fa-clipboard-check">
                                            Auditoría
                                        </NavLinkCustom>
                                    </>
                                )}

                                {user?.role === 'admin' && (
                                    <div className="flex items-center gap-1 border-l pl-4 ml-4">
                                        <NavLinkCustom href={route('admin.users.index')} active={route().current('admin.users.*')} icon="fas fa-users-cog">
                                            Usuarios
                                        </NavLinkCustom>
                                        <NavLinkCustom href={route('admin.logs.index')} active={route().current('admin.logs.*')} icon="fas fa-history">
                                            Logs
                                        </NavLinkCustom>
                                        <NavLinkCustom href={route('admin.trash.index')} active={route().current('admin.trash.*')} icon="fas fa-trash-alt">
                                            Papelera
                                        </NavLinkCustom>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side: User Menu or Login Button */}
                        <div className="hidden md:flex md:items-center">
                            {user ? (
                                <div className="relative">
                                    <button 
                                        onClick={() => setUserOpen(!userOpen)}
                                        className="flex items-center space-x-3 p-1 rounded-xl hover:bg-orange-50 transition"
                                    >
                                        <div className="flex flex-col text-right">
                                            <span className="text-sm font-medium leading-none text-black">{user.name}</span>
                                            <span className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: '#E57303' }}>{user.role}</span>
                                        </div>
                                        <div 
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md font-bold" 
                                            style={{ backgroundColor: '#FE8204' }}
                                        >
                                            {user.name.charAt(0)}
                                        </div>
                                    </button>
                                    
                                    {userOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 overflow-hidden border z-50"
                                             style={{ borderColor: '#FE8204' }}>
                                            <div className="px-4 py-2 border-b bg-orange-50/50" style={{ borderColor: '#FADC3C' }}>
                                                <p className="text-[10px] uppercase font-bold" style={{ color: '#FE8204' }}>Cuenta del Sistema</p>
                                            </div>
                                            <Link href={route('profile.edit')} className="block px-4 py-3 text-sm text-black hover:bg-orange-50 transition">
                                                <i className="fas fa-user-circle mr-2" style={{ color: '#FE8204' }}></i> Mi Perfil
                                            </Link>
                                            <Link 
                                                href={route('logout')} 
                                                method="post" 
                                                as="button" 
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 transition text-brand-red font-medium"
                                            >
                                                <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link 
                                    href={route('login')}
                                    className="inline-flex items-center px-6 py-2 bg-brand-orange border border-transparent rounded-xl font-black text-xs text-white uppercase tracking-widest hover:bg-orange-600 transition shadow-lg gap-2"
                                >
                                    <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden">
                            <button 
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)} 
                                className="p-2 rounded-lg text-black hover:bg-gray-100 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path x-show="!showingNavigationDropdown" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showingNavigationDropdown && (
                    <div className="md:hidden border-t bg-white" style={{ borderColor: '#FE8204' }}>
                        <div className="px-4 py-4 space-y-2">
                            <ResponsiveNavLinkCustom href={route('mapa.publico')} active={route().current('mapa.publico')} icon="fas fa-map-marked-alt">
                                Mapa
                            </ResponsiveNavLinkCustom>
                            
                            {isAdmin && (
                                <ResponsiveNavLinkCustom href={route('admin.dashboard')} active={route().current('admin.dashboard')} icon="fas fa-chart-line">
                                    Dashboard Admin
                                </ResponsiveNavLinkCustom>
                            )}
                            
                            {isAdministrativo && (
                                <>
                                    <ResponsiveNavLinkCustom href={route('administrativos.dashboard')} active={route().current('administrativos.dashboard')} icon="fas fa-tachometer-alt">
                                        Panel Administrativo
                                    </ResponsiveNavLinkCustom>
                                    <ResponsiveNavLinkCustom href={route('administrativos.edificios.index')} active={route().current('administrativos.edificios.index')} icon="fas fa-building">
                                        Edificios
                                    </ResponsiveNavLinkCustom>
                                    <ResponsiveNavLinkCustom href={route('administrativos.establecimientos.index')} active={route().current('administrativos.establecimientos.index')} icon="fas fa-school">
                                        Establecimientos
                                    </ResponsiveNavLinkCustom>
                                    <ResponsiveNavLinkCustom href={route('administrativos.instrumentos.index')} active={route().current('administrativos.instrumentos.index')} icon="fas fa-file-contract">
                                        Instrumentos Legales
                                    </ResponsiveNavLinkCustom>
                                    <ResponsiveNavLinkCustom href={route('administrativos.auditoria.index')} active={route().current('administrativos.auditoria.index')} icon="fas fa-clipboard-check">
                                        Auditoría
                                    </ResponsiveNavLinkCustom>
                                </>
                            )}

                            {isAdmin && (
                                <div className="pt-4 mt-4 border-t border-orange-100">
                                    <div className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Consola Admin</div>
                                    <ResponsiveNavLinkCustom href={route('admin.users.index')} active={route().current('admin.users.*')} icon="fas fa-users-cog">
                                        Gestión Usuarios
                                    </ResponsiveNavLinkCustom>
                                    <ResponsiveNavLinkCustom href={route('admin.logs.index')} active={route().current('admin.logs.*')} icon="fas fa-history">
                                        Logs de Actividad
                                    </ResponsiveNavLinkCustom>
                                    <ResponsiveNavLinkCustom href={route('admin.trash.index')} active={route().current('admin.trash.*')} icon="fas fa-trash-alt">
                                        Papelera de Reciclaje
                                    </ResponsiveNavLinkCustom>
                                </div>
                            )}

                            {!user && (
                                <div className="pt-4 mt-4 border-t border-orange-100">
                                    <ResponsiveNavLinkCustom href={route('login')} icon="fas fa-sign-in-alt">
                                        Iniciar Sesión
                                    </ResponsiveNavLinkCustom>
                                </div>
                            )}

                            <hr className="my-2" style={{ borderTop: '1px solid rgba(254, 130, 4, 0.2)' }} />
                            
                            <Link href={route('profile.edit')} className="block px-4 py-2 rounded-lg text-black hover:bg-orange-50 transition">
                                <i className="fas fa-user-circle mr-2 text-brand-orange"></i> Mi Perfil
                            </Link>
                            
                            <Link 
                                href={route('logout')} 
                                method="post" 
                                as="button" 
                                className="w-full text-left px-4 py-2 rounded-lg text-brand-red hover:bg-red-50 transition font-medium"
                            >
                                <i className="fas fa-sign-out-alt mr-2"></i> Cerrar Sesión
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer for fixed navbar */}
            <div className="h-16"></div>

            {header && (
                <header className="bg-white shadow-sm border-b border-gray-100">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="pt-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavLinkCustom({ href, active, children, icon }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-lg gap-2 ${
                active 
                    ? 'text-brand-orange bg-orange-50' 
                    : 'text-black hover:text-brand-orange hover:bg-orange-50/50'
            }`}
        >
            <i className={`${icon} ${active ? 'text-brand-orange' : 'text-gray-400'}`}></i>
            {children}
        </Link>
    );
}

function ResponsiveNavLinkCustom({ href, active, children, icon }) {
    return (
        <Link
            href={href}
            className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                active 
                    ? 'bg-orange-50 text-brand-orange' 
                    : 'text-black hover:bg-orange-50/50 hover:text-brand-orange'
            }`}
        >
            <i className={`${icon} mr-2 ${active ? 'text-brand-orange' : 'text-gray-400'}`}></i>
            {children}
        </Link>
    );
}
