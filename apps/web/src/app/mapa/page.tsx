'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the MapComponent with no SSR to prevent "window is not defined" issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">
        Cargando Mapa Educativo...
      </p>
    </div>
  ),
});

export default function MapaPublicoPage() {
  return <MapComponent />;
}
