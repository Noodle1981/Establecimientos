<?php

namespace App\Actions\Admin;

use App\Models\Edificio;
use App\Models\Modalidad;
use Illuminate\Support\Facades\DB;

class RestoreTrashAction
{
    public function execute(string $type, int|string $id): void
    {
        DB::transaction(function () use ($type, $id) {
            $model = $type === 'modalidad' ? Modalidad::onlyTrashed() : Edificio::onlyTrashed();
            $record = $model->findOrFail($id);
            $record->restore();

            // Restauración inversa en cascada para modalidades
            if ($type === 'modalidad') {
                $est = $record->establecimiento()->onlyTrashed()->first();
                if ($est) {
                    $est->restore();
                }
            }
        });
    }
}
