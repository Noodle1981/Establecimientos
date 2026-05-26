<?php

$targetPath = __DIR__ . '/../database/database.sqlite';
$sourcePath = __DIR__ . '/../database/nombres_actualizado.sqlite';

if (!file_exists($targetPath)) {
    die("Error: Target database not found at $targetPath\n");
}
if (!file_exists($sourcePath)) {
    die("Error: Source database not found at $sourcePath\n");
}

echo "============================================================\n";
echo "🔍 INFORME DE AUDITORÍA COMPARATIVA DE BASES DE DATOS\n";
echo "============================================================\n";
echo "Base de datos activa (Target):   $targetPath\n";
echo "Base de datos actualizada (Source): $sourcePath\n\n";

try {
    $dbTarget = new PDO("sqlite:$targetPath");
    $dbTarget->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $dbSource = new PDO("sqlite:$sourcePath");
    $dbSource->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. COMPARACIÓN DE TABLAS (SCHEMA CHECK)
    echo "------------------------------------------------------------\n";
    echo "📁 1. COMPARACIÓN DE TABLAS (ESTRUCTURA GENERAL)\n";
    echo "------------------------------------------------------------\n";
    
    $getTables = function($pdo) {
        $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    };

    $tablesTarget = $getTables($dbTarget);
    $tablesSource = $getTables($dbSource);

    $onlyInTarget = array_diff($tablesTarget, $tablesSource);
    $onlyInSource = array_diff($tablesSource, $tablesTarget);
    $sharedTables = array_intersect($tablesTarget, $tablesSource);

    echo "Tablas en DB Activa:       " . count($tablesTarget) . "\n";
    echo "Tablas en DB Actualizada:  " . count($tablesSource) . "\n";

    if (!empty($onlyInTarget)) {
        echo "⚠️ Tablas que SOLO existen en la DB Activa:\n";
        foreach ($onlyInTarget as $t) echo "   - $t\n";
    }
    if (!empty($onlyInSource)) {
        echo "⚠️ Tablas que SOLO existen en la DB Actualizada:\n";
        foreach ($onlyInSource as $t) echo "   - $t\n";
    }
    if (empty($onlyInTarget) && empty($onlyInSource)) {
        echo "✅ Estructura de tablas idéntica. Ambas tienen las mismas " . count($sharedTables) . " tablas.\n";
    }
    echo "\n";

    // 2. COMPARACIÓN DE CANTIDAD DE REGISTROS
    echo "------------------------------------------------------------\n";
    echo "📊 2. CONTEO DE REGISTROS POR TABLA COMPARATIVA\n";
    echo "------------------------------------------------------------\n";
    printf("%-25s | %-12s | %-12s | %-10s\n", "Tabla", "DB Activa", "DB Actualizada", "Diferencia");
    printf("%-25s | %-12s | %-12s | %-10s\n", str_repeat("-", 25), str_repeat("-", 12), str_repeat("-", 12), str_repeat("-", 10));

    foreach ($sharedTables as $table) {
        $countT = $dbTarget->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        $countS = $dbSource->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        $diff = $countT - $countS;
        $diffStr = $diff == 0 ? "0" : ($diff > 0 ? "+$diff" : "$diff");
        
        printf("%-25s | %-12d | %-12d | %-10s\n", $table, $countT, $countS, $diffStr);
    }
    echo "\n";

    // 3. INTEGRIDAD DE ESTABLECIMIENTOS (CUEs)
    echo "------------------------------------------------------------\n";
    echo "🏫 3. AUDITORÍA DE ESTABLECIMIENTOS (CUEs)\n";
    echo "------------------------------------------------------------\n";
    
    // Adjuntar DB actualizada para hacer consultas cruzadas
    $dbTarget->exec("ATTACH DATABASE '$sourcePath' AS source_db");

    // CUEs en activa que no están en actualizada
    $missingInSource = $dbTarget->query("
        SELECT cue, nombre FROM main.establecimientos 
        WHERE cue NOT IN (SELECT cue FROM source_db.establecimientos)
    ")->fetchAll(PDO::FETCH_ASSOC);

    // CUEs en actualizada que no están en activa
    $missingInTarget = $dbTarget->query("
        SELECT cue, nombre FROM source_db.establecimientos 
        WHERE cue NOT IN (SELECT cue FROM main.establecimientos)
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo "CUEs en DB Activa que NO existen en DB Actualizada:  " . count($missingInSource) . "\n";
    if (count($missingInSource) > 0) {
        foreach (array_slice($missingInSource, 0, 5) as $r) {
            echo "   - CUE: {$r['cue']} | {$r['nombre']}\n";
        }
        if (count($missingInSource) > 5) echo "   ... y " . (count($missingInSource) - 5) . " más.\n";
    }

    echo "CUEs en DB Actualizada que NO existen en DB Activa:  " . count($missingInTarget) . "\n";
    if (count($missingInTarget) > 0) {
        foreach (array_slice($missingInTarget, 0, 5) as $r) {
            echo "   - CUE: {$r['cue']} | {$r['nombre']}\n";
        }
        if (count($missingInTarget) > 5) echo "   ... y " . (count($missingInTarget) - 5) . " más.\n";
    }

    if (count($missingInSource) === 0 && count($missingInTarget) === 0) {
        echo "✅ Alineación perfecta de escuelas: Los CUEs coinciden al 100% en ambas bases de datos.\n";
    }
    echo "\n";

    // 4. INTEGRIDAD DE EDIFICIOS (CUIs)
    echo "------------------------------------------------------------\n";
    echo "🏢 4. AUDITORÍA DE EDIFICIOS (CUIs)\n";
    echo "------------------------------------------------------------\n";

    $cuiMissingInSource = $dbTarget->query("
        SELECT cui, calle, numero_puerta FROM main.edificios 
        WHERE cui NOT IN (SELECT cui FROM source_db.edificios)
    ")->fetchAll(PDO::FETCH_ASSOC);

    $cuiMissingInTarget = $dbTarget->query("
        SELECT cui, calle, numero_puerta FROM source_db.edificios 
        WHERE cui NOT IN (SELECT cui FROM main.edificios)
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo "CUIs en DB Activa que NO existen en DB Actualizada:  " . count($cuiMissingInSource) . "\n";
    if (count($cuiMissingInSource) > 0) {
        foreach (array_slice($cuiMissingInSource, 0, 5) as $r) {
            echo "   - CUI: {$r['cui']} | {$r['calle']} {$r['numero_puerta']}\n";
        }
        if (count($cuiMissingInSource) > 5) echo "   ... y " . (count($cuiMissingInSource) - 5) . " más.\n";
    }

    echo "CUIs en DB Actualizada que NO existen en DB Activa:  " . count($cuiMissingInTarget) . "\n";
    if (count($cuiMissingInTarget) > 0) {
        foreach (array_slice($cuiMissingInTarget, 0, 5) as $r) {
            echo "   - CUI: {$r['cui']} | {$r['calle']} {$r['numero_puerta']}\n";
        }
        if (count($cuiMissingInTarget) > 5) echo "   ... y " . (count($cuiMissingInTarget) - 5) . " más.\n";
    }

    if (count($cuiMissingInSource) === 0 && count($cuiMissingInTarget) === 0) {
        echo "✅ Alineación perfecta de infraestructura: Los CUIs coinciden al 100% en ambas bases de datos.\n";
    }
    echo "\n";

    // 5. CHEQUEO DE INCONSISTENCIAS DE MAPEO (CUE -> Edificio)
    echo "------------------------------------------------------------\n";
    echo "🔗 5. AUDITORÍA DE MAPEOS CRUZADOS (CUE -> Edificio CUI)\n";
    echo "------------------------------------------------------------\n";

    $mappingMismatches = $dbTarget->query("
        SELECT 
            t.cue, 
            t.nombre AS nombre_activa,
            te.cui AS cui_activa,
            se.cui AS cui_actualizada
        FROM main.establecimientos AS t
        JOIN main.edificios AS te ON t.edificio_id = te.id
        JOIN source_db.establecimientos AS s ON t.cue = s.cue
        JOIN source_db.edificios AS se ON s.edificio_id = se.id
        WHERE te.cui != se.cui
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo "Mapeos de Establecimiento a Edificio discrepantes: " . count($mappingMismatches) . "\n";
    if (count($mappingMismatches) > 0) {
        echo "⚠️ ¡ADVERTENCIA! Se encontraron escuelas que apuntan a edificios distintos:\n";
        foreach (array_slice($mappingMismatches, 0, 10) as $m) {
            echo "   - CUE: {$m['cue']} | {$m['nombre_activa']}\n";
            echo "     • En DB Activa apunta a CUI:       {$m['cui_activa']}\n";
            echo "     • En DB Actualizada apunta a CUI:  {$m['cui_actualizada']}\n";
        }
        if (count($mappingMismatches) > 10) echo "   ... y " . (count($mappingMismatches) - 10) . " discrepancias más.\n";
    } else {
        echo "✅ Mapeo consistente: Todos los CUEs apuntan a los mismos códigos de edificio (CUIs).\n";
    }
    echo "\n";

    // 6. CHEQUEO DE CABECERAS (establecimiento_cabecera)
    echo "------------------------------------------------------------\n";
    echo "👑 6. AUDITORÍA DE CONFIGURACIÓN DE CABECERAS\n";
    echo "------------------------------------------------------------\n";

    $cabeceraMismatches = $dbTarget->query("
        SELECT 
            t.cue, 
            t.nombre, 
            t.establecimiento_cabecera AS cabecera_activa,
            s.establecimiento_cabecera AS cabecera_actualizada
        FROM main.establecimientos AS t
        JOIN source_db.establecimientos AS s ON t.cue = s.cue
        WHERE t.establecimiento_cabecera != s.establecimiento_cabecera
           OR (t.establecimiento_cabecera IS NULL AND s.establecimiento_cabecera IS NOT NULL)
           OR (t.establecimiento_cabecera IS NOT NULL AND s.establecimiento_cabecera IS NULL)
    ")->fetchAll(PDO::FETCH_ASSOC);

    echo "Discrepancias en Establecimiento Cabecera: " . count($cabeceraMismatches) . "\n";
    if (count($cabeceraMismatches) > 0) {
        echo "⚠️ ¡NOTA! Existen diferencias en las cabeceras designadas:\n";
        foreach (array_slice($cabeceraMismatches, 0, 5) as $c) {
            echo "   - CUE: {$c['cue']} | {$c['nombre']}\n";
            echo "     • Cabecera Activa:      " . ($c['cabecera_activa'] ?? 'NULL') . "\n";
            echo "     • Cabecera Actualizada: " . ($c['cabecera_actualizada'] ?? 'NULL') . "\n";
        }
        if (count($cabeceraMismatches) > 5) echo "   ... y " . (count($cabeceraMismatches) - 5) . " más.\n";
    } else {
        echo "✅ Cabeceras consistentes: La asignación de escuelas cabeceras coincide perfectamente.\n";
    }
    echo "\n";

} catch (Exception $e) {
    echo "❌ Error ejecutando la auditoría: " . $e->getMessage() . "\n";
}
