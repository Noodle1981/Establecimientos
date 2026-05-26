<?php
$sourcePath = __DIR__ . '/../database/nombres_actualizado.sqlite';

try {
    $db = new PDO("sqlite:$sourcePath");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "=== ESTABLECIMIENTOS 700015600 Y 700015601 EN DB VIEJA ===\n";
    $stmt = $db->query("SELECT * FROM establecimientos WHERE cue IN (700015600, 700015601)");
    $ests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($ests);

    echo "\n=== MODALIDADES DE ESTOS ESTABLECIMIENTOS ===\n";
    $stmt = $db->query("
        SELECT m.* 
        FROM modalidades m 
        WHERE m.establecimiento_id IN (SELECT id FROM establecimientos WHERE cue IN (700015600, 700015601))
    ");
    $mods = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($mods);

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
