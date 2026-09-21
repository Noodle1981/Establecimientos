import ToastNotification from '@/Components/ToastNotification';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import DesktopSidebar from './Partials/DesktopSidebar';
import MobileMenu from './Partials/MobileMenu';
import Navbar from './Partials/Navbar';

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
            {/* Sidebar Desktop */}
            {showSidebar && (
                <DesktopSidebar
                    user={user}
                    isAdmin={isAdmin}
                    isAdministrativo={isAdministrativo}
                    isAutoridad={isAutoridad}
                />
            )}

            {/* Main Content Area */}
            <div
                className={`flex min-w-0 flex-1 flex-col transition-all duration-200 ease-in-out ${
                    showSidebar ? 'lg:pl-20' : ''
                }`}
            >
                {/* Top Navbar */}
                <Navbar
                    user={user}
                    isAdmin={isAdmin}
                    showSidebar={showSidebar}
                    showingNavigationDropdown={showingNavigationDropdown}
                    setShowingNavigationDropdown={setShowingNavigationDropdown}
                    userOpen={userOpen}
                    setUserOpen={setUserOpen}
                />

                {/* Mobile Slide-over Drawer */}
                {showSidebar && (
                    <MobileMenu
                        isOpen={showingNavigationDropdown}
                        onClose={() => setShowingNavigationDropdown(false)}
                        isAdmin={isAdmin}
                        isAdministrativo={isAdministrativo}
                        isAutoridad={isAutoridad}
                        gestionOpen={gestionOpen}
                        setGestionOpen={setGestionOpen}
                    />
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
