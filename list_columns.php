<?php

use Illuminate\Support\Facades\Schema;

$columns = Schema::getColumnListing('establecimientos');

foreach ($columns as $column) {
    echo $column . "\n";
}
