<?php

namespace App\Livewire\Administrativos;

use Livewire\Component;

class AdministrativosDashboard extends Component
{
    public function render()
    {
        return view('livewire.administrativos.administrativos-dashboard')
            ->layout('layouts.app');
    }
}
