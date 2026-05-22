'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect public visits to the school map
    router.push('/mapa');
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-primary" />
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest animate-pulse">
          Redireccionando al Mapa...
        </span>
      </div>
    </div>
  );
}
