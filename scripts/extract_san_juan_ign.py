#!/usr/bin/env python3
"""
extract_san_juan_ign.py
Extrae los 19 departamentos de San Juan a partir de la capa oficial del IGN (departamento.geojson),
normaliza sus propiedades para compatibilidad total con el sistema Establecimientos,
redondea coordenadas a 6 decimales (~10 cm de precisión) y genera los archivos finales optimizados.
"""

import os
import json
import unicodedata

def strip_accents(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').upper().strip()

CABECERAS = {
    '70028': 'San Juan',
    '70077': 'Villa Krause',
    '70084': 'Rivadavia',
    '70042': 'Villa Paula Albarracín de Sarmiento',
    '70098': 'Santa Lucía',
    '70070': 'Villa Aberastain',
    '70007': 'Villa San Martín',
    '70014': 'Villa del Salvador',
    '70035': 'Caucete',
    '70091': 'San Martín',
    '70063': '9 de Julio',
    '70126': 'Santa Rosa',
    '70105': 'Media Agua',
    '70112': 'Villa Ibáñez',
    '70133': 'Villa Basilio Nievas',
    '70056': 'San José de Jáchal',
    '70049': 'Rodeo',
    '70021': 'Tamberías',
    '70119': 'San Agustín del Valle Fértil',
}

def round_coords(c):
    if isinstance(c[0], (int, float)):
        return [round(c[0], 6), round(c[1], 6)]
    return [round_coords(sub) for sub in c]

def main():
    ign_path = os.path.join('public', 'ign_sjon', 'departamento.geojson')
    target_path1 = os.path.join('public', 'geojson', 'departamentos-san_juan.json')
    target_path2 = os.path.join('public', 'geojson', 'san_juan_departamentos.geojson')

    print(f"Cargando {ign_path}...")
    with open(ign_path, 'r', encoding='utf-8', errors='ignore') as f:
        data = json.load(f)

    # Filtrar departamentos de San Juan (código INDEC inicia con '70')
    sj_raw = [
        f for f in data['features']
        if str(f.get('properties', {}).get('in1', '')).startswith('70')
    ]

    print(f"Departamentos encontrados para San Juan: {len(sj_raw)}")
    if len(sj_raw) != 19:
        raise ValueError(f"Se esperaban 19 departamentos pero se encontraron {len(sj_raw)}")

    processed_features = []
    # Ordenar alfabéticamente por nombre
    sj_raw.sort(key=lambda f: strip_accents(f['properties'].get('nam', '')))

    for feat in sj_raw:
        props = feat.get('properties', {})
        in1 = str(props.get('in1', ''))
        raw_name = props.get('nam', '')
        normalized_depto = strip_accents(raw_name)

        # Caso particular '9 de Julio'
        if '9 DE JULIO' in normalized_depto:
            normalized_depto = '9 DE JULIO'

        new_props = {
            'id': int(in1) if in1.isdigit() else in1,
            'in1': in1,
            'departamento': normalized_depto,
            'nombre': raw_name,
            'fna': props.get('fna', f"Departamento {raw_name}"),
            'cabecera': CABECERAS.get(in1, ''),
            'provincia': 'SAN JUAN',
            'fuente': 'Instituto Geográfico Nacional (IGN)'
        }

        rounded_geom = {
            'type': feat['geometry']['type'],
            'coordinates': round_coords(feat['geometry']['coordinates'])
        }

        processed_features.append({
            'type': 'Feature',
            'id': in1,
            'properties': new_props,
            'geometry': rounded_geom
        })

    geojson_output = {
        'type': 'FeatureCollection',
        'name': 'departamentos_san_juan',
        'crs': {
            'type': 'name',
            'properties': {'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'}
        },
        'features': processed_features
    }

    os.makedirs(os.path.dirname(target_path1), exist_ok=True)

    json_str = json.dumps(geojson_output, ensure_ascii=False, indent=None, separators=(',', ':'))

    with open(target_path1, 'w', encoding='utf-8') as f:
        f.write(json_str)
    size_mb1 = os.path.getsize(target_path1) / (1024 * 1024)
    print(f"Guardado {target_path1} ({size_mb1:.2f} MB)")

    with open(target_path2, 'w', encoding='utf-8') as f:
        f.write(json_str)
    size_mb2 = os.path.getsize(target_path2) / (1024 * 1024)
    print(f"Guardado {target_path2} ({size_mb2:.2f} MB)")

    print("Lista de departamentos generados:")
    for f in processed_features:
        p = f['properties']
        print(f" - [{p['in1']}] {p['departamento']:<15} ({p['nombre']})")

if __name__ == '__main__':
    main()
