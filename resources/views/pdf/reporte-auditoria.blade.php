<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Reporte de Auditoría de Establecimientos</title>
    <style>
        body {
            font-family: sans-serif;
            color: #333;
            line-height: 1.5;
            font-size: 12px;
        }
        header {
            border-bottom: 2px solid #FE8204;
            padding-bottom: 10px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo-text {
            text-transform: uppercase;
            font-weight: bold;
            color: #FE8204;
            font-size: 10px;
            letter-spacing: 1px;
        }
        h1 {
            color: #000;
            font-size: 20px;
            margin: 0;
            text-transform: uppercase;
        }
        .meta-info {
            text-align: right;
            font-size: 10px;
            color: #666;
        }
        
        /* Tablas */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #FE8204;
            color: white;
            padding: 8px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            font-size: 10px;
        }
        tr:nth-child(even) {
            background-color: #fff8f0;
        }
        
        /* KPIs */
        .kpi-container {
            display: table;
            width: 100%;
            margin-bottom: 30px;
            background-color: #f9f9f9;
            border: 1px solid #eee;
            padding: 15px;
        }
        .kpi-box {
            display: table-cell;
            text-align: center;
            padding: 0 10px;
            border-right: 1px solid #ddd;
        }
        .kpi-box:last-child {
            border-right: none;
        }
        .kpi-val {
            display: block;
            font-size: 24px;
            font-weight: bold;
            color: #FE8204;
        }
        .kpi-label {
            display: block;
            font-size: 9px;
            text-transform: uppercase;
            color: #666;
            margin-top: 5px;
        }

        /* Footer */
        footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 30px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            text-align: center;
            font-size: 9px;
            color: #999;
        }

        .badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 8px;
            text-transform: uppercase;
        }
        .badge-correcto { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .badge-corregido { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .badge-faltante { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .badge-pendiente { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .badge-baja { background: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <header>
        <div>
            <div class="logo-text">Ministerio de Educación</div>
            <h1>Informe de Auditoría de Establecimientos</h1>
        </div>
        <div class="meta-info">
            <p><strong>Fecha de Emisión:</strong> {{ now()->format('d/m/Y H:i') }}</p>
            <p><strong>Generado por:</strong> {{ auth()->user()->name }}</p>
            <p><strong>Período Auditado:</strong> Histórico Completo</p>
        </div>
    </header>

    <footer>
        Documento generado automáticamente por el Sistema de Gestión de Establecimientos. 
        Página <span class="page-number"></span>
    </footer>

    <!-- RESUMEN EJECUTIVO -->
    <h3 style="color: #666; border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">
        1. Resumen Ejecutivo
    </h3>
    
    <div class="kpi-container">
        <div class="kpi-box">
            <span class="kpi-val">{{ $contadores['total'] }}</span>
            <span class="kpi-label">Total Auditado</span>
        </div>
        <div class="kpi-box">
            <span class="kpi-val" style="color: #10b981;">{{ $contadores['CORRECTO'] ?? 0 }}</span>
            <span class="kpi-label">Correctos</span>
        </div>
        <div class="kpi-box">
            <span class="kpi-val" style="color: #3b82f6;">{{ $contadores['CORREGIDO'] ?? 0 }}</span>
            <span class="kpi-label">Corregir</span>
        </div>
        <div class="kpi-box">
            <span class="kpi-val" style="color: #ef4444;">{{ $contadores['FALTANTE_EDUGE'] ?? 0 }}</span>
            <span class="kpi-label">Faltantes</span>
        </div>
        <div class="kpi-box">
            <span class="kpi-val" style="color: #f59e0b;">{{ $contadores['PENDIENTE'] ?? 0 }}</span>
            <span class="kpi-label">Pendientes</span>
        </div>
        <div class="kpi-box">
            <span class="kpi-val" style="color: #9333ea;">{{ $porcentajeAvance }}%</span>
            <span class="kpi-label">Progreso</span>
        </div>
    </div>

    <!-- DETALLE DE ANOMALÍAS -->
    <h3 style="color: #666; border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;">
        2. Detalle de Anomalías y Correcciones
    </h3>
    <p style="font-size: 10px; color: #666; margin-bottom: 10px;">
        Se listan a continuación los establecimientos que presentaron observaciones, fueron corregidos, o marcan inconsistencias con EDUGE.
        (Se excluyen los registros marcados como "Correcto").
    </p>

    <table>
        <thead>
            <tr>
                <th>Establecimiento</th>
                <th>CUE</th>
                <th>Nivel</th>
                <th>Ámbito</th>
                <th>Departamento</th>
                <th>Estado</th>
                <th>Validado Por</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            @forelse($anomalias as $item)
                <tr>
                    <td>{{ $item->establecimiento->nombre }}</td>
                    <td>{{ $item->establecimiento->cue }}</td>
                    <td>{{ $item->nivel_educativo }}</td>
                    <td>{{ $item->ambito }}</td>
                    <td>{{ $item->establecimiento->edificio?->zona_departamento ?? 'S/D' }}</td>
                    <td>
                        @php
                            $class = match($item->estado_validacion) {
                                'CORRECTO' => 'badge-correcto',
                                'CORREGIDO' => 'badge-corregido',
                                'FALTANTE_EDUGE' => 'badge-faltante',
                                'PENDIENTE' => 'badge-pendiente',
                                default => 'badge-baja'
                            };
                            $label = match($item->estado_validacion) {
                                'CORREGIDO' => 'CORREGIR',
                                'FALTANTE_EDUGE' => 'FALTANTES',
                                default => $item->estado_validacion
                            };
                        @endphp
                        <span class="badge {{ $class }}">{{ $label }}</span>
                    </td>
                    <td>{{ $item->usuarioValidacion?->name ?? 'Sistema' }}</td>
                    <td>{{ $item->validado_en ? $item->validado_en->format('d/m/Y') : '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px; color: #666;">
                        No se encontraron anomalías en el período seleccionado. ¡Excelente trabajo!
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>
