import ToastNotification from '@/Components/ToastNotification';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import logoMinisterio from '../../images/logoMinisterio.png';

export default function AuthenticatedLayout({
    header,
    children,
    fullWidth = false,
    showSidebar = true,
    padding = true,
}) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const isAdmin = user?.role === 'admin';
    const isAdministrativo = user?.role === 'administrativos';
    const isAutoridad = user?.role === 'autoridades';

    const isGestionActive =
        route().current('administrativos.dashboard') ||
        route().current('administrativos.edificios.index') ||
        route().current('administrativos.establecimientos.index') ||
        route().current('administrativos.instrumentos.index') ||
        route().current('administrativos.auditoria.index');

    const [gestionOpen, setGestionOpen] = useState(isGestionActive);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar Desktop (Gemini-style compact dock) */}
            {showSidebar && (
                <aside className="fixed inset-y-0 left-0 z-[1050] hidden w-20 flex-col border-r border-gray-200/80 bg-white shadow-xs lg:flex">
                    {/* Header Spacer (mantiene la altura y alineación con el navbar de h-16) */}
                    <div className="h-16 shrink-0 border-b border-gray-100" />

                    {/* Navigation Links */}
                    <div className="custom-scrollbar flex-1 flex flex-col items-center space-y-2 overflow-visible py-4 px-2">
                        <SidebarLink
                            href={route('mapa.publico')}
                            active={route().current('mapa.publico')}
                            icon="fas fa-map-marked-alt"
                        >
                            Mapa Escolar
                        </SidebarLink>

                        {isAutoridad && (
                            <>
                                <div className="my-1.5 h-px w-8 bg-gray-200/80 shrink-0" />
                                <SidebarLink
                                    href={route('administrativos.dashboard')}
                                    active={route().current('administrativos.dashboard')}
                                    icon="fas fa-tachometer-alt"
                                >
                                    Estadísticas
                                </SidebarLink>
                            </>
                        )}

                        {(isAdministrativo || isAdmin) && (
                            <>
                                <div className="my-1.5 h-px w-8 bg-gray-200/80 shrink-0" />
                                <SidebarLink
                                    href={route('administrativos.dashboard')}
                                    active={route().current('administrativos.dashboard')}
                                    icon="fas fa-tachometer-alt"
                                >
                                    Estadísticas
                                </SidebarLink>
                                <SidebarLink
                                    href={route('administrativos.edificios.index')}
                                    active={route().current('administrativos.edificios.index')}
                                    icon="fas fa-building"
                                >
                                    Edificios
                                </SidebarLink>
                                <SidebarLink
                                    href={route('administrativos.establecimientos.index')}
                                    active={route().current('administrativos.establecimientos.index')}
                                    icon="fas fa-school"
                                >
                                    Establecimientos
                                </SidebarLink>
                                <SidebarLink
                                    href={route('administrativos.instrumentos.index')}
                                    active={route().current('administrativos.instrumentos.index')}
                                    icon="fas fa-file-contract"
                                >
                                    Instrumentos
                                </SidebarLink>
                                <SidebarLink
                                    href={route('administrativos.auditoria.index')}
                                    active={route().current('administrativos.auditoria.index')}
                                    icon="fas fa-clipboard-check"
                                >
                                    Auditoría
                                </SidebarLink>

                                <div className="my-1.5 h-px w-8 bg-gray-200/80 shrink-0" />
                                <SidebarLink
                                    href={route('bitacora.index')}
                                    active={route().current('bitacora.index')}
                                    icon="fas fa-history"
                                >
                                    Bitácora
                                </SidebarLink>
                                <SidebarLink
                                    href={route('administrativos.reportes.index')}
                                    active={route().current('administrativos.reportes.*')}
                                    icon="fas fa-inbox"
                                >
                                    Reportes
                                </SidebarLink>
                            </>
                        )}

                        {isAdmin && (
                            <>
                                <div className="my-1.5 h-px w-8 bg-gray-200/80 shrink-0" />
                                <SidebarLink
                                    href={route('admin.dashboard')}
                                    active={route().current('admin.dashboard')}
                                    icon="fas fa-chart-line"
                                >
                                    Dashboard Admin
                                </SidebarLink>
                                <SidebarLink
                                    href={route('admin.users.index')}
                                    active={route().current('admin.users.*')}
                                    icon="fas fa-users-cog"
                                >
                                    Usuarios
                                </SidebarLink>
                                <SidebarLink
                                    href={route('admin.trash.index')}
                                    active={route().current('admin.trash.*')}
                                    icon="fas fa-trash-alt"
                                >
                                    Papelera
                                </SidebarLink>
                            </>
                        )}
                    </div>

                    {/* Sidebar Footer */}
                    {user && (
                        <div className="flex shrink-0 flex-col items-center border-t border-gray-100 py-3">
                            <div className="relative group flex items-center justify-center">
                                <Link
                                    href={route('profile.edit')}
                                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-gray-500 hover:bg-gray-100 hover:text-black transition-colors"
                                >
                                    <i className="fas fa-user-circle text-lg"></i>
                                </Link>
                                <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-[1100] hidden md:flex items-center rounded-xl bg-[#1e1f20] px-3.5 py-1.5 text-xs font-medium text-white shadow-2xl transition-all duration-150 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1.5">
                                    <span>Mi Perfil ({user.name})</span>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            )}

            {/* Main Content Area */}
            <div
                className={`flex flex-1 flex-col min-w-0 transition-all duration-200 ease-in-out ${
                    showSidebar ? 'lg:pl-20' : ''
                }`}
            >
                {/* Top Navbar */}
                <header className="sticky top-0 z-40 h-16 shrink-0 border-b border-gray-100 bg-white shadow-sm">
                    <div className="flex h-full items-center justify-between px-6">
                        {/* Left: Mobile Toggle & Logo Mobile */}
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
                                                        ? route(
                                                              'admin.dashboard',
                                                          )
                                                        : route(
                                                              'administrativos.dashboard',
                                                          )
                                                }
                                                className="hidden items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-brand-orange shadow-sm transition hover:bg-brand-orange hover:text-white sm:inline-flex"
                                            >
                                                <i className="fas fa-th-large"></i>{' '}
                                                Entrar al Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={() =>
                                                setUserOpen(!userOpen)
                                            }
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
                                    <i className="fas fa-sign-in-alt"></i>{' '}
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Mobile Slide-over Drawer (Logic simplified for Inertia links) */}
                {showSidebar && showingNavigationDropdown && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowingNavigationDropdown(false)}
                        ></div>
                        <aside className="animate-in slide-in-from-left fixed inset-y-0 left-0 flex w-72 flex-col bg-brand-orange shadow-2xl duration-300">
                            <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
                                <span className="font-black text-white">
                                    Menú Principal
                                </span>
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(false)
                                    }
                                    className="text-white transition hover:text-white/70"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="flex-1 space-y-2 overflow-y-auto p-4">
                                {/* Repeat similar links for mobile if needed, or unify components */}
                                <MobileNavLink
                                    href={route('mapa.publico')}
                                    active={route().current('mapa.publico')}
                                    icon="fas fa-map-marked-alt"
                                >
                                    Mapa
                                </MobileNavLink>

                                {isAutoridad && (
                                    <MobileNavLink
                                        href={route('administrativos.dashboard')}
                                        active={route().current('administrativos.dashboard')}
                                        icon="fas fa-tachometer-alt"
                                    >
                                        Estadísticas
                                    </MobileNavLink>
                                )}

                                {isAdministrativo && (
                                    <>
                                        <MobileNavLink
                                            href={route('administrativos.dashboard')}
                                            active={route().current('administrativos.dashboard')}
                                            icon="fas fa-tachometer-alt"
                                        >
                                            Estadísticas
                                        </MobileNavLink>
                                        <MobileNavLink
                                            href={route('administrativos.edificios.index')}
                                            active={route().current('administrativos.edificios.index')}
                                            icon="fas fa-building"
                                        >
                                            Edificios
                                        </MobileNavLink>
                                        <MobileNavLink
                                            href={route('administrativos.establecimientos.index')}
                                            active={route().current('administrativos.establecimientos.index')}
                                            icon="fas fa-school"
                                        >
                                            Establecimientos
                                        </MobileNavLink>
                                        <MobileNavLink
                                            href={route('administrativos.instrumentos.index')}
                                            active={route().current('administrativos.instrumentos.index')}
                                            icon="fas fa-file-contract"
                                        >
                                            Instrumentos
                                        </MobileNavLink>
                                        <MobileNavLink
                                            href={route('administrativos.auditoria.index')}
                                            active={route().current('administrativos.auditoria.index')}
                                            icon="fas fa-clipboard-check"
                                        >
                                            Auditoría
                                        </MobileNavLink>
                                    </>
                                )}

                                {isAdmin && (
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => setGestionOpen(!gestionOpen)}
                                            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-black text-white hover:bg-white/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <i className="fas fa-tasks w-5 text-center text-white/60"></i>
                                                <span>Gestión</span>
                                            </div>
                                            <i className={`fas fa-chevron-${gestionOpen ? 'up' : 'down'} text-xs text-white/60`}></i>
                                        </button>

                                        {gestionOpen && (
                                            <div className="pl-4 space-y-1 border-l border-white/10 ml-6">
                                                <MobileNavLink
                                                    href={route('administrativos.dashboard')}
                                                    active={route().current('administrativos.dashboard')}
                                                    icon="fas fa-tachometer-alt"
                                                >
                                                    Estadísticas
                                                </MobileNavLink>
                                                <MobileNavLink
                                                    href={route('administrativos.edificios.index')}
                                                    active={route().current('administrativos.edificios.index')}
                                                    icon="fas fa-building"
                                                >
                                                    Edificios
                                                </MobileNavLink>
                                                <MobileNavLink
                                                    href={route('administrativos.establecimientos.index')}
                                                    active={route().current('administrativos.establecimientos.index')}
                                                    icon="fas fa-school"
                                                >
                                                    Establecimientos
                                                </MobileNavLink>
                                                <MobileNavLink
                                                    href={route('administrativos.instrumentos.index')}
                                                    active={route().current('administrativos.instrumentos.index')}
                                                    icon="fas fa-file-contract"
                                                >
                                                    Instrumentos
                                                </MobileNavLink>
                                                <MobileNavLink
                                                    href={route('administrativos.auditoria.index')}
                                                    active={route().current('administrativos.auditoria.index')}
                                                    icon="fas fa-clipboard-check"
                                                >
                                                    Auditoría
                                                </MobileNavLink>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {(isAdmin || isAdministrativo) && (
                                    <>
                                        <MobileNavLink
                                            href={route('bitacora.index')}
                                            active={route().current('bitacora.index')}
                                            icon="fas fa-history"
                                        >
                                            Bitácora
                                        </MobileNavLink>
                                        <MobileNavLink
                                            href={route(
                                                'administrativos.reportes.index',
                                            )}
                                            active={route().current(
                                                'administrativos.reportes.*',
                                            )}
                                            icon="fas fa-inbox"
                                        >
                                            Reportes
                                        </MobileNavLink>
                                    </>
                                )}
                                {isAdmin && (
                                    <>
                                        <MobileNavLink
                                            href={route('admin.dashboard')}
                                            active={route().current('admin.dashboard')}
                                            icon="fas fa-chart-line"
                                        >
                                            Dashboard Admin
                                        </MobileNavLink>
                                        <MobileNavLink
                                            href={route('admin.users.index')}
                                            active={route().current('admin.users.*')}
                                            icon="fas fa-users-cog"
                                        >
                                            Usuarios
                                        </MobileNavLink>
                                        <MobileNavLink
                                            href={route('admin.trash.index')}
                                            active={route().current('admin.trash.*')}
                                            icon="fas fa-trash-alt"
                                        >
                                            Papelera
                                        </MobileNavLink>
                                    </>
                                )}
                            </div>
                        </aside>
                    </div>
                )}

                {/* Main Content Scrollable Area */}
                <main
                    className={`flex-1 overflow-y-auto ${fullWidth ? '' : 'bg-gray-50'}`}
                >
                    {header && (
                        <div className="mb-6 border-b border-gray-100 bg-white px-6 py-6">
                            <div
                                className={
                                    fullWidth
                                        ? 'w-full'
                                        : 'mx-auto max-w-[1600px]'
                                }
                            >
                                {header}
                            </div>
                        </div>
                    )}
                    <div
                        className={
                            padding
                                ? fullWidth
                                    ? 'p-6'
                                    : 'mx-auto max-w-[1600px] p-6 lg:p-10'
                                : ''
                        }
                    >
                        {children}
                    </div>
                </main>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
            `,
                }}
            />
            <ToastNotification />
        </div>
    );
}

function SidebarLink({ href, active, children, icon, shortcut }) {
    return (
        <div className="group relative flex items-center justify-center">
            <Link
                href={href}
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                    active
                        ? 'bg-orange-50 text-brand-orange ring-1 ring-orange-200/80 shadow-xs'
                        : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                }`}
            >
                <i
                    className={`${icon} text-base transition-transform duration-200 group-hover:scale-110`}
                ></i>
            </Link>

            {/* Tooltip estilo Gemini flotante */}
            <div className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-[1100] hidden md:flex items-center gap-2 rounded-xl bg-[#1e1f20] px-3.5 py-1.5 text-xs font-medium text-white shadow-2xl transition-all duration-150 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1.5">
                <span>{children}</span>
                {shortcut && (
                    <span className="text-[10px] text-gray-400 font-mono tracking-tight">
                        ({shortcut})
                    </span>
                )}
            </div>
        </div>
    );
}

function MobileNavLink({ href, active, children, icon }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-black transition-colors ${
                active
                    ? 'bg-white text-brand-orange shadow-lg'
                    : 'text-white hover:bg-white/10'
            }`}
        >
            <i
                className={`${icon} w-5 text-center ${active ? 'text-brand-orange' : 'text-white/60'}`}
            ></i>
            {children}
        </Link>
    );
}
