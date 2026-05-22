<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Informe General de Auditorías EDUGE</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; font-size: 12px; }
        .header { text-align: center; border-bottom: 2px solid #FF8200; padding-bottom: 10px; margin-bottom: 20px; }
        .title { font-size: 20px; font-weight: bold; }
        .date-range { color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #000; color: #fff; padding: 8px; text-align: left; font-size: 10px; text-transform: uppercase; }
        td { padding: 8px; border-bottom: 1px solid #eee; }
        .badge { background: #FF8200; color: white; padding: 2px 5px; border-radius: 3px; font-size: 9px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: right; font-size: 9px; color: #999; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">INFORME GLOBAL DE AUDITORÍAS EDUGE</div>
        <div class="date-range">
            Período: {{ $dateFrom ? \Carbon\Carbon::parse($dateFrom)->format('d/m/Y') : 'Inicio' }} 
            al {{ $dateTo ? \Carbon\Carbon::parse($dateTo)->format('d/m/Y') : 'Hoy' }}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Establecimiento</th>
                <th>CUE</th>
                <th>Tipo</th>
                <th>Auditado por</th>
                <th>Cambios</th>
            </tr>
        </thead>
        <tbody>
            @foreach($auditorias as $auditoria)
            <tr>
                <td>{{ \Carbon\Carbon::parse($auditoria->fecha_visita)->format('d/m/Y') }}</td>
                <td>{{ $auditoria->establecimiento ? $auditoria->establecimiento->nombre : ($auditoria->identificador_eduge ?? 'FALTANTE') }}</td>
                <td>{{ $auditoria->establecimiento ? $auditoria->establecimiento->cue : 'N/A' }}</td>
                <td><span class="badge">{{ $auditoria->tipo_cotejo ?? 'RECONCILIACION' }}</span></td>
                <td>{{ $auditoria->user->name }}</td>
                <td>{{ $auditoria->cambios ? count($auditoria->cambios) : 0 }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Sistema de Establecimientos - San Juan | Página 1
    </div>
</body>
</html>
