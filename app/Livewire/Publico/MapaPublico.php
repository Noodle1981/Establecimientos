<?php

namespace App\Livewire\Publico;

use Livewire\Component;

class MapaPublico extends Component
{
    public function render()
    {
        return view('livewire.publico.mapa-publico')
            ->layout('layouts.app');
    }
}
