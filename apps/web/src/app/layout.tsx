import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sistema Único Educativo | Mapa Escolar',
  description: 'Sistema Único Educativo (SUE) - Portal de validación geográfica, auditorías y control escolar del Ministerio de Educación de San Juan.',
  keywords: ['educacion', 'mapa escolar', 'san juan', 'auditoria', 'escuelas'],
  authors: [{ name: 'Ministerio de Educación de San Juan' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-slate-50/50">
        <main className="relative flex min-h-screen flex-col overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
