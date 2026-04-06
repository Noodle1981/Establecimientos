<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Error del Servidor - Ministerio de Educación</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-orange: #FE8204;
        }
        body {
            font-family: 'Inter', sans-serif;
            background: #ffffff;
        }
        .glass-strong {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(254, 130, 4, 0.1);
        }
        .text-orange-gradient {
            background: linear-gradient(135deg, #FE8204 0%, #FFB040 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .animate-glitch {
            animation: glitch 1s linear infinite;
        }
        @keyframes glitch {
          2%, 64% { transform: translate(2px, 0) skew(0deg); }
          4%, 60% { transform: translate(-2px, 0) skew(0deg); }
          62% { transform: translate(0, 0) skew(5deg); }
        }
    </style>
</head>
<body class="antialiased overflow-hidden">
    <div class="min-h-screen flex flex-col items-center justify-center p-6 relative">
        <!-- Background Elements -->
        <div class="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[100px]"></div>

        <!-- Content -->
        <div class="w-full max-w-2xl text-center relative z-10">
            <nav class="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-primary-orange animate-fade-in">
                <i class="fas fa-university"></i>
                <span>Ministerio de Educación</span>
            </nav>

            <div class="mb-8 relative">
                <h1 class="text-[180px] font-[900] text-orange-gradient leading-none tracking-tighter opacity-10 select-none animate-glitch">500</h1>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center text-red-600 shadow-inner border border-red-100">
                        <i class="fas fa-server fa-3x"></i>
                    </div>
                </div>
            </div>

            <h2 class="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tight">Falla <span class="text-primary-orange">Técnica</span></h2>
            <p class="text-gray-500 font-medium text-lg leading-relaxed mb-10 max-w-md mx-auto">
                El motor del sistema ha experimentado una interrupción inesperada. Estamos trabajando para reestablecer la operatividad estratégica.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onclick="window.location.reload()" class="px-8 py-4 bg-primary-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-3 group">
                    <i class="fas fa-sync transition-transform group-hover:rotate-180 duration-700"></i>
                    <span>Reintentar</span>
                </button>
                <a href="/" class="px-8 py-4 glass-strong text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all border border-gray-100 flex items-center gap-3 group">
                    <i class="fas fa-home transition-transform group-hover:-translate-y-0.5"></i>
                    <span>Panel Principal</span>
                </a>
            </div>

            <p class="mt-20 text-[10px] font-bold text-gray-300 uppercase tracking-widest border-t border-gray-100 pt-8">
                &copy; 2026 Sistema Administrativo - San Juan, Argentina
            </p>
        </div>
    </div>
</body>
</html>
