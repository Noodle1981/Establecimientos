import { Link } from '@inertiajs/react';
import SidebarLink from './SidebarLink';

export default function DesktopSidebar({
    user,
    isAdmin,
    isAdministrativo,
    isAutoridad,
}) {
    return (
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
    );
}
