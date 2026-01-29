<?php

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$inputFileName = 'd:/Establecimientos/Establecimientos_Publicos.xlsx';

try {
    $spreadsheet = IOFactory::load($inputFileName);
    $worksheet = $spreadsheet->getActiveSheet();
    $rows = [];
    $i = 0;
    foreach ($worksheet->getRowIterator() as $row) {
        $cellIterator = $row->getCellIterator();
        $cellIterator->setIterateOnlyExistingCells(FALSE);
        $cells = [];
        foreach ($cellIterator as $cell) {
            $cells[] = $cell->getValue();
        }
        $rows[] = $cells;
        $i++;
        if ($i >= 2) break; // Header and 1st row
    }
    
    echo json_encode($rows, JSON_PRETTY_PRINT);

} catch(\Exception $e) {
    echo 'Error loading file: ', $e->getMessage();
}
