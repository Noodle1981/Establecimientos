<?php

$targetPath = __DIR__ . '/../database/database.sqlite';
$sourcePath = __DIR__ . '/../database/nombres_actualizado.sqlite';

if (!file_exists($targetPath)) {
    die("Error: Target database not found at $targetPath\n");
}
if (!file_exists($sourcePath)) {
    die("Error: Source database not found at $sourcePath\n");
}

try {
    $db = new PDO("sqlite:$targetPath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Adjuntar la base de datos de origen
    $db->exec("ATTACH DATABASE '$sourcePath' AS source_db");

    // Verificar cuántas diferencias existen antes de proceder
    $stmt = $db->query("
        SELECT COUNT(*) 
        FROM main.establecimientos 
        WHERE cue IN (SELECT cue FROM source_db.establecimientos)
          AND nombre != (SELECT nombre FROM source_db.establecimientos WHERE cue = main.establecimientos.cue)
    ");
    $count = $stmt->fetchColumn();

    if ($count == 0) {
        echo "✅ No hay diferencias de nombres detectadas entre ambas bases de datos. No se requiere actualización.\n";
        exit;
    }

    echo "📊 Se detectaron $count nombres corregidos en nombres_actualizado.sqlite que difieren de database.sqlite.\n";
    echo "🔄 Actualizando nombres de establecimientos...\n";

    $db->beginTransaction();
    
    $affected = $db->exec("
        UPDATE main.establecimientos
        SET nombre = (
            SELECT nombre 
            FROM source_db.establecimientos 
            WHERE cue = main.establecimientos.cue
        )
        WHERE EXISTS (
            SELECT 1 
            FROM source_db.establecimientos 
            WHERE cue = main.establecimientos.cue 
              AND nombre != main.establecimientos.nombre
        )
    ");

    $db->commit();

    echo "✨ ¡Migración completada con éxito! Se actualizaron $affected nombres de establecimientos según las reglas ortográficas y la ley provincial.\n";

} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    echo "❌ Error ejecutando la migración: " . $e->getMessage() . "\n";
}
