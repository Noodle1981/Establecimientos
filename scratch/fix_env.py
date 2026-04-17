import os

env_path = r'b:\Establecimientos\.env'

if os.path.exists(env_path):
    with open(env_path, 'rb') as f:
        content = f.read()
    
    # Intentar decodificar eliminando nulos o caracteres extraños
    # El error mostraba A\P\P... lo que indica que hay bytes nulos intercalados
    clean_lines = []
    for line in content.splitlines():
        # Eliminar bytes nulos y decodificar
        clean_line = line.replace(b'\x00', b'').decode('utf-8', errors='ignore').strip()
        if clean_line and 'A P P _ L O C A L E' not in clean_line:
            if clean_line.startswith('APP_LOCALE='):
                clean_lines.append('APP_LOCALE=es')
            else:
                clean_lines.append(clean_line)
    
    with open(env_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(clean_lines) + '\n')
    
    print("Archivo .env reparado con éxito.")
else:
    print("No se encontró el archivo .env")
