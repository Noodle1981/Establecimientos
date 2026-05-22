<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Informe de Auditoría EDUGE</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #FF8200;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .title {
            color: #000;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
        }
        .subtitle {
            color: #FF8200;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background: #f8f8f8;
            padding: 8px 15px;
            border-left: 4px solid #000;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 15px;
        }
        .grid {
            width: 100%;
            border-collapse: collapse;
        }
        .grid td {
            padding: 10px;
            vertical-align: top;
        }
        .label {
            font-weight: bold;
            color: #666;
            width: 30%;
        }
        .value {
            color: #000;
        }
        table.changes {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        table.changes th {
            background: #000;
            color: #fff;
            padding: 10px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
        }
        table.changes td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .badge {
            background: #FF8200;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">INFORME DE COTEJO EDUGE</h1>
        <div class="subtitle">Ministerio de Educación - San Juan</div>
    </div>

    <div class="section">
        <div class="section-title">DATOS GENERALES</div>
        <table class="grid">
            <tr>
                <td class="label">Establecimiento:</td>
                <td class="value">
                    {{ $auditoria->establecimiento ? $auditoria->establecimiento->nombre : ($auditoria->identificador_eduge ?? 'FALTANTE EN SISTEMA') }}
                </td>
            </tr>
            <tr>
                <td class="label">CUE:</td>
                <td class="value">{{ $auditoria->establecimiento ? $auditoria->establecimiento->cue : 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Fecha de Auditoría:</td>
                <td class="value">{{ \Carbon\Carbon::parse($auditoria->fecha_visita)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="label">Tipo de Auditoría:</td>
                <td class="value">
                    <span class="badge">{{ $auditoria->tipo_cotejo ?? 'RECONCILIACION' }}</span>
                </td>
            </tr>
            <tr>
                <td class="label">Auditado por:</td>
                <td class="value">{{ $auditoria->user->name }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">RECONCILIACIÓN DE DATOS (SISTEMA VS EDUGE)</div>
        <table class="changes">
            <thead>
                <tr>
                    <th>Campo</th>
                    <th>Valor Anterior (Sistema)</th>
                    <th>Valor Nuevo (EDUGE)</th>
                </tr>
            </thead>
            <tbody>
                @if($auditoria->cambios && count($auditoria->cambios) > 0)
                    @foreach($auditoria->cambios as $cambio)
                    <tr>
                        <td style="font-weight: bold;">{{ $cambio['campo'] }}</td>
                        <td style="color: #666;">{{ $cambio['anterior'] }}</td>
                        <td style="color: #FF8200; font-weight: bold;">{{ $cambio['nuevo'] }}</td>
                    </tr>
                    @endforeach
                @else
                    <tr>
                        <td colspan="3" style="text-align: center; color: #999;">No se registraron cambios específicos.</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">OBSERVACIONES FINALIZADAS</div>
        <div style="background: #fdfdfd; padding: 15px; border: 1px solid #eee; font-size: 14px;">
            {{ $auditoria->observaciones ?? 'Sin observaciones adicionales.' }}
        </div>
    </div>

    <div class="footer">
        Este documento es un comprobante oficial de la auditoría de datos realizada en la plataforma de Establecimientos.
        <br> Generado el {{ now()->format('d/m/Y H:i') }}
    </div>
</body>
</html>
