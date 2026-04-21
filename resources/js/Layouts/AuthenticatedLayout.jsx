import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children, fullWidth = false, showSidebar = true, padding = true }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userOpen, setUserOpen] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isAdministrativo = user?.role === 'administrativos';

    // Handle mobile responsiveness for sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Desktop */}
            {showSidebar && (
                <aside 
                    className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out bg-brand-orange shadow-2xl flex flex-col ${
                        sidebarOpen ? 'w-64' : 'w-20'
                    } hidden lg:flex`}
                >
                {/* Sidebar Header - App Brand */}
                <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                            <i className="fas fa-graduation-cap text-brand-orange"></i>
                        </div>
                        {sidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-white leading-tight">Establecimientos</span>
                                <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Panel de Gestión</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Links */}
                <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1 custom-scrollbar">
                    <SidebarLink 
                        href={route('mapa.publico')} 
                        active={route().current('mapa.publico')} 
                        icon="fas fa-map-marked-alt" 
                        collapsed={!sidebarOpen}
                    >
                        Mapa Escolar
                    </SidebarLink>

                    {isAdmin && (
                        <SidebarLink 
                            href={route('admin.dashboard')} 
                            active={route().current('admin.dashboard')} 
                            icon="fas fa-chart-line" 
                            collapsed={!sidebarOpen}
                        >
                            Dashboard Admin
                        </SidebarLink>
                    )}

                    {isAdministrativo && (
                        <>
                            <div className={`px-4 mt-6 mb-2 text-[10px] uppercase font-black tracking-widest text-white/40 ${!sidebarOpen && 'hidden'}`}>
                                Gestión
                            </div>
                            <SidebarLink 
                                href={route('administrativos.dashboard')} 
                                active={route().current('administrativos.dashboard')} 
                                icon="fas fa-tachometer-alt" 
                                collapsed={!sidebarOpen}
                            >
                                Estadísticas
                            </SidebarLink>
                            <SidebarLink 
                                href={route('administrativos.edificios.index')} 
                                active={route().current('administrativos.edificios.index')} 
                                icon="fas fa-building" 
                                collapsed={!sidebarOpen}
                            >
                                Edificios
                            </SidebarLink>
                            <SidebarLink 
                                href={route('administrativos.establecimientos.index')} 
                                active={route().current('administrativos.establecimientos.index')} 
                                icon="fas fa-school" 
                                collapsed={!sidebarOpen}
                            >
                                Establecimientos
                            </SidebarLink>
                            <SidebarLink 
                                href={route('administrativos.instrumentos.index')} 
                                active={route().current('administrativos.instrumentos.index')} 
                                icon="fas fa-file-contract" 
                                collapsed={!sidebarOpen}
                            >
                                Instrumentos
                            </SidebarLink>
                            <SidebarLink 
                                href={route('administrativos.auditoria.index')} 
                                active={route().current('administrativos.auditoria.index')} 
                                icon="fas fa-clipboard-check" 
                                collapsed={!sidebarOpen}
                            >
                                Auditoría
                            </SidebarLink>
                            <SidebarLink 
                                href={route('administrativos.reportes.index')} 
                                active={route().current('administrativos.reportes.*')} 
                                icon="fas fa-inbox" 
                                collapsed={!sidebarOpen}
                            >
                                Reportes
                            </SidebarLink>
                        </>
                    )}

                    <div className={`px-4 mt-6 mb-2 text-[10px] uppercase font-black tracking-widest text-white/40 ${!sidebarOpen && 'hidden'}`}>
                        Sistema
                    </div>
                    
                    <SidebarLink 
                        href={route('bitacora.index')} 
                        active={route().current('bitacora.index')} 
                        icon="fas fa-history" 
                        collapsed={!sidebarOpen}
                    >
                        Bitácora
                    </SidebarLink>

                    {isAdmin && (
                        <>
                            <SidebarLink 
                                href={route('admin.users.index')} 
                                active={route().current('admin.users.*')} 
                                icon="fas fa-users-cog" 
                                collapsed={!sidebarOpen}
                            >
                                Usuarios
                            </SidebarLink>
                            <SidebarLink 
                                href={route('admin.trash.index')} 
                                active={route().current('admin.trash.*')} 
                                icon="fas fa-trash-alt" 
                                collapsed={!sidebarOpen}
                            >
                                Papelera
                            </SidebarLink>
                        </>
                    )}
                </div>

                {/* Sidebar Footer - Toggle */}
                <div className="p-4 border-t border-white/10 shrink-0">
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-white/10 text-white transition-colors"
                    >
                        <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                    </button>
                </div>
            </aside>
            )}

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
                showSidebar ? (sidebarOpen ? 'lg:pl-64' : 'lg:pl-20') : ''
            }`}>
                {/* Top Navbar */}
                <header className="sticky top-0 z-40 bg-white border-b border-gray-100 h-16 shrink-0 shadow-sm">
                    <div className="h-full flex items-center justify-between px-6">
                        {/* Left: Mobile Toggle & Logo Mobile */}
                        <div className="flex items-center gap-4">
                            {showSidebar && (
                                <button 
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <i className="fas fa-bars text-xl"></i>
                                </button>
                            )}
                            <Link href="/">
                                <img src="/images/logoMinisterio.png" alt="M.E." className="h-10 w-auto" />
                            </Link>
                        </div>

                        {/* Right: User Menu */}
                        <div className="flex items-center">
                            {user ? (
                                <div className="relative">
                                    <div className="flex items-center gap-3">
                                        {!showSidebar && (
                                            <Link 
                                                href={isAdmin ? route('admin.dashboard') : route('administrativos.dashboard')}
                                                className="hidden sm:inline-flex items-center px-4 py-2 bg-orange-50 text-brand-orange border border-orange-100 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-orange hover:text-white transition shadow-sm gap-2"
                                            >
                                                <i className="fas fa-th-large"></i> Entrar al Panel
                                            </Link>
                                        )}
                                        <button 
                                            onClick={() => setUserOpen(!userOpen)}
                                            className="flex items-center space-x-3 p-1 rounded-xl hover:bg-gray-50 transition"
                                        >
                                        <div className="flex flex-col text-right hidden sm:flex">
                                            <span className="text-xs font-black leading-none text-black">{user.name}</span>
                                            <span className="text-[9px] uppercase font-black tracking-tighter text-brand-orange">{user.role}</span>
                                        </div>
                                        <div 
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md font-black bg-brand-orange" 
                                        >
                                            {user.name.charAt(0)}
                                        </div>
                                        </button>
                                    </div>
                                    
                                    {userOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 overflow-hidden border z-50 border-gray-100 animate-in fade-in slide-in-from-right-4 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                                <p className="text-[10px] uppercase font-black text-gray-400">Cuenta de Usuario</p>
                                                <p className="text-sm font-black text-black truncate">{user.email}</p>
                                            </div>
                                            <Link href={route('profile.edit')} className="flex items-center px-4 py-3 text-sm text-black hover:bg-orange-50 transition font-medium">
                                                <i className="fas fa-id-card-alt mr-3 text-brand-orange"></i> Mi Perfil
                                            </Link>
                                            <Link 
                                                href={route('logout')} 
                                                method="post" 
                                                as="button" 
                                                className="w-full flex items-center px-4 py-3 text-sm hover:bg-red-50 transition text-red-600 font-medium"
                                            >
                                                <i className="fas fa-sign-out-alt mr-3"></i> Cerrar Sesión
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
                    </div>
                </header>

                {/* Mobile Slide-over Drawer (Logic simplified for Inertia links) */}
                {showSidebar && showingNavigationDropdown && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowingNavigationDropdown(false)}></div>
                        <aside className="fixed inset-y-0 left-0 w-72 bg-brand-orange shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                            <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                                <span className="text-white font-black">Menú Principal</span>
                                <button onClick={() => setShowingNavigationDropdown(false)} className="text-white hover:text-white/70 transition">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {/* Repeat similar links for mobile if needed, or unify components */}
                                <MobileNavLink href={route('mapa.publico')} active={route().current('mapa.publico')} icon="fas fa-map-marked-alt">Mapa</MobileNavLink>
                                {isAdministrativo && (
                                    <>
                                        <MobileNavLink href={route('administrativos.dashboard')} active={route().current('administrativos.dashboard')} icon="fas fa-tachometer-alt">Estadísticas</MobileNavLink>
                                        <MobileNavLink href={route('administrativos.edificios.index')} active={route().current('administrativos.edificios.index')} icon="fas fa-building">Edificios</MobileNavLink>
                                        <MobileNavLink href={route('administrativos.establecimientos.index')} active={route().current('administrativos.establecimientos.index')} icon="fas fa-school">Establecimientos</MobileNavLink>
                                        <MobileNavLink href={route('administrativos.instrumentos.index')} active={route().current('administrativos.instrumentos.index')} icon="fas fa-file-contract">Instrumentos</MobileNavLink>
                                        <MobileNavLink href={route('administrativos.auditoria.index')} active={route().current('administrativos.auditoria.index')} icon="fas fa-clipboard-check">Auditoría</MobileNavLink>
                                    </>
                                )}
                                <MobileNavLink href={route('bitacora.index')} active={route().current('bitacora.index')} icon="fas fa-history">Bitácora</MobileNavLink>
                            </div>
                        </aside>
                    </div>
                )}

                {/* Main Content Scrollable Area */}
                <main className={`flex-1 overflow-y-auto ${fullWidth ? '' : 'bg-gray-50'}`}>
                    {header && (
                        <div className="px-6 py-6 bg-white border-b border-gray-100 mb-6">
                            <div className={fullWidth ? 'w-full' : 'max-w-[1600px] mx-auto'}>
                                {header}
                            </div>
                        </div>
                    )}
                    <div className={padding ? (fullWidth ? 'p-6' : 'max-w-[1600px] mx-auto p-6 lg:p-10') : ''}>
                        {children}
                    </div>
                </main>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}} />
        </div>
    );
}

function SidebarLink({ href, active, children, icon, collapsed }) {
    return (
        <Link
            href={href}
            title={collapsed ? children : ''}
            className={`flex items-center h-12 rounded-xl transition-all duration-200 group relative ${
                active 
                    ? 'bg-white text-brand-orange shadow-lg font-black translate-x-1' 
                    : 'text-white hover:bg-white/10 font-bold'
            } ${collapsed ? 'px-0 justify-center' : 'px-4 gap-4'}`}
        >
            <div className={`flex items-center justify-center shrink-0 ${collapsed ? 'w-full' : 'w-5'}`}>
                <i className={`${icon} ${active ? 'text-brand-orange' : 'text-white/60 group-hover:text-white'} transition-colors ${collapsed ? 'text-lg' : 'text-sm'}`}></i>
            </div>
            {!collapsed && (
                <span className="truncate text-sm tracking-tight">{children}</span>
            )}
            {active && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-orange rounded-l-full"></div>
            )}
        </Link>
    );
}

function MobileNavLink({ href, active, children, icon }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-black text-sm ${
                active 
                    ? 'bg-white text-brand-orange shadow-lg' 
                    : 'text-white hover:bg-white/10'
            }`}
        >
            <i className={`${icon} w-5 text-center ${active ? 'text-brand-orange' : 'text-white/60'}`}></i>
            {children}
        </Link>
    );
}
