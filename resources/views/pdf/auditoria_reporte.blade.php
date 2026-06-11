<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Reporte de Auditoría EDUGE</title>
    <style>
        @page { margin: 1cm; }
        /* DejaVu Sans: única fuente de DOMPDF con soporte completo de ñ, tildes y ° */
        body { font-family: 'DejaVu Sans', sans-serif; color: #333; font-size: 9pt; line-height: 1.2; }
        .header { text-align: center; border-bottom: 3px solid #FF8200; padding-bottom: 10px; margin-bottom: 15px; }
        .logo-text { font-size: 24px; font-weight: 900; color: #000; letter-spacing: -1px; }
        .logo-subtext { font-size: 10px; font-weight: bold; color: #FF8200; text-transform: uppercase; letter-spacing: 2px; }
        .report-title { font-size: 14px; font-weight: bold; margin-top: 5px; text-transform: uppercase; }
        
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #000; color: #fff; padding: 6px 4px; text-align: left; font-size: 8px; text-transform: uppercase; }
        td { padding: 6px 4px; border-bottom: 1px solid #eee; vertical-align: top; font-size: 8px; }
        
        .badge { display: inline-block; padding: 2px 4px; border-radius: 3px; font-size: 7px; font-weight: bold; text-transform: uppercase; color: #fff; }
        .bg-pendiente { background-color: #6B7280; }
        .bg-correcto { background-color: #10B981; }
        .bg-corregido { background-color: #3B82F6; }
        .bg-revisar { background-color: #F59E0B; }
        .bg-baja { background-color: #EF4444; }

        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 7px; color: #999; border-top: 1px solid #eee; padding-top: 5px; }
        
        .info-bar { background: #f9f9f9; padding: 8px; border-radius: 6px; margin-bottom: 15px; font-size: 8px; }
        .info-item { display: inline-block; margin-right: 15px; }
        .info-label { font-weight: bold; color: #666; }
        
        .modifications { font-style: italic; color: #555; font-size: 7px; }
        .observations { font-size: 7px; color: #444; }

        /* KPI Dashboard CSS Styles */
        .kpi-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; margin-top: 5px; border: none; }
        .kpi-table td { border: none; padding: 0 4px; vertical-align: top; }
        .kpi-table td:first-child { padding-left: 0; }
        .kpi-table td:last-child { padding-right: 0; }
        
        .kpi-card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 8px; min-height: 32px; }
        .kpi-title { font-size: 6.5px; font-weight: bold; color: #4b5563; text-transform: uppercase; margin-bottom: 2px; letter-spacing: 0.5px; }
        .kpi-value { font-size: 11px; font-weight: 900; line-height: 1; }
        
        .kpi-global { border-color: #ff8200; background-color: #fffaf5; }
        .kpi-global .kpi-value { color: #ff8200; }
        
        .kpi-pendiente { border-color: #fcd34d; background-color: #fffbeb; }
        .kpi-pendiente .kpi-value { color: #d97706; }
        
        .kpi-correcto { border-color: #a7f3d0; background-color: #f0fdf4; }
        .kpi-correcto .kpi-value { color: #059669; }
        
        .kpi-corregido { border-color: #bfdbfe; background-color: #eff6ff; }
        .kpi-corregido .kpi-value { color: #2563eb; }
        
        .kpi-revisar { border-color: #fecaca; background-color: #fef2f2; }
        .kpi-revisar .kpi-value { color: #dc2626; }
        
        .kpi-baja { border-color: #d1d5db; background-color: #f9fafb; }
        .kpi-baja .kpi-value { color: #1f2937; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-text">EDU<span style="color:#FF8200">GE</span></div>
        <div class="logo-subtext">Ministerio de Educación - San Juan</div>
        <div class="report-title">Reporte de Auditoría de Establecimientos</div>
    </div>

    <div class="info-bar">
        <div class="info-item">
            <span class="info-label">Fecha de Emisión:</span> {{ now()->format('d/m/Y H:i') }}
        </div>
        <div class="info-item">
            <span class="info-label">Generado por:</span> {{ auth()->user()->name }}
        </div>
        @if(isset($filtros['departamento']) && $filtros['departamento'])
        <div class="info-item">
            <span class="info-label">Departamento:</span> {{ $filtros['departamento'] }}
        </div>
        @endif
        @if(isset($filtros['estado']) && $filtros['estado'])
        <div class="info-item">
            <span class="info-label">Estado:</span> {{ $filtros['estado'] }}
        </div>
        @endif
        @if(isset($filtros['ambito']) && $filtros['ambito'])
        <div class="info-item">
            <span class="info-label">Ámbito:</span> {{ $filtros['ambito'] }}
        </div>
        @endif
    </div>

    <table class="kpi-table">
        <tr>
            <td style="width: 16.66%;">
                <div class="kpi-card kpi-global">
                    <div class="kpi-title">Avance Global</div>
                    <div class="kpi-value">{{ $stats['porcentajeAvance'] }}%</div>
                </div>
            </td>
            <td style="width: 16.66%;">
                <div class="kpi-card kpi-pendiente">
                    <div class="kpi-title">Pendiente</div>
                    <div class="kpi-value">{{ $stats['pendientes'] }}</div>
                </div>
            </td>
            <td style="width: 16.66%;">
                <div class="kpi-card kpi-correcto">
                    <div class="kpi-title">Correcto</div>
                    <div class="kpi-value">{{ $stats['correctos'] }}</div>
                </div>
            </td>
            <td style="width: 16.66%;">
                <div class="kpi-card kpi-corregido">
                    <div class="kpi-title">Corregido</div>
                    <div class="kpi-value">{{ $stats['corregidos'] }}</div>
                </div>
            </td>
            <td style="width: 16.66%;">
                <div class="kpi-card kpi-revisar">
                    <div class="kpi-title">Revisar</div>
                    <div class="kpi-value">{{ $stats['revisar'] }}</div>
                </div>
            </td>
            <td style="width: 16.66%;">
                <div class="kpi-card kpi-baja">
                    <div class="kpi-title">Baja</div>
                    <div class="kpi-value">{{ $stats['bajas'] }}</div>
                </div>
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th width="18%">Establecimiento</th>
                <th width="10%">Modalidad</th>
                <th width="15%">Edificio</th>
                <th width="8%">Estado</th>
                <th width="20%">Modificaciones</th>
                <th width="20%">Observaciones</th>
                <th width="9%">F. Edición</th>
            </tr>
        </thead>
        <tbody>
            @foreach($modalidades as $m)
            <tr>
                <td>
                    <strong>{{ $m->establecimiento->nombre }}</strong><br>
                    <small>CUE: {{ $m->establecimiento->cue }}</small><br>
                    <small style="font-size: 7px; color: #666;">Dir: {{ $m->establecimiento->edificio->calle }} {{ $m->establecimiento->edificio->numero_puerta ?? 'S/N' }}</small>
                </td>
                <td>
                    {{ $m->nivel_educativo }}<br>
                    <small style="font-size: 7px; color: #666;">R:{{ $m->radio ?? '-' }} | S:{{ $m->sector ?? '-' }} | C:{{ $m->categoria ?? '-' }}</small>
                </td>
                <td>
                    {{ $nombresEdificios[$m->establecimiento->edificio_id] ?? 'S/D' }}<br>
                    <small>CUI: {{ $m->establecimiento->edificio->cui }}</small><br>
                    <small style="font-size: 7px; color: #FF8200;">GPS: {{ $m->establecimiento->edificio->latitud }}, {{ $m->establecimiento->edificio->longitud }}</small>
                </td>
                <td>
                    <span class="badge bg-{{ strtolower($m->estado_validacion) }}">
                        {{ $m->estado_validacion }}
                    </span>
                </td>
                <td class="modifications">
                    @if($m->campos_auditados)
                        {{ implode(', ', $m->campos_auditados) }}
                    @else
                        -
                    @endif
                </td>
                <td class="observations">{{ $m->observaciones ?? '-' }}</td>
                <td>{{ $m->validado_en ? \Carbon\Carbon::parse($m->validado_en)->format('d/m/Y') : '-' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Este documento es un reporte oficial del Sistema de Gestión de Establecimientos (EDUGE). Emitido el {{ now()->format('d/m/Y') }}.
    </div>
</body>
</html>
