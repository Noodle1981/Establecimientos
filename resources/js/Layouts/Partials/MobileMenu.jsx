import MobileNavLink from './MobileNavLink';

export default function MobileMenu({
    isOpen,
    onClose,
    isAdmin,
    isAdministrativo,
    isAutoridad,
    gestionOpen,
    setGestionOpen,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] lg:hidden">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            <aside className="animate-in slide-in-from-left fixed inset-y-0 left-0 flex w-72 flex-col bg-brand-orange shadow-2xl duration-300">
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
                    <span className="font-black text-white">Menú Principal</span>
                    <button
                        onClick={onClose}
                        className="text-white transition hover:text-white/70"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto p-4">
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
                                <i
                                    className={`fas fa-chevron-${gestionOpen ? 'up' : 'down'} text-xs text-white/60`}
                                ></i>
                            </button>

                            {gestionOpen && (
                                <div className="ml-6 space-y-1 border-l border-white/10 pl-4">
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
                                href={route('administrativos.reportes.index')}
                                active={route().current('administrativos.reportes.*')}
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
    );
}
