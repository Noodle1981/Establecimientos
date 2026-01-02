<?php

namespace App\Livewire\Admin;

use App\Models\AuditoriaEduge;
use App\Models\Establecimiento;
use Livewire\Component;
use Illuminate\Support\Facades\Auth;

class AuditoriaEdugeForm extends Component
{
    public $establecimiento_id;
    public $fecha_visita;
    public $observaciones;
    public $cambios = [];
    
    // Auxiliar para agregar campos al JSON de cambios
    public $nuevoCampo = '';
    public $valorAnterior = '';
    public $valorNuevo = '';

    public $tipo_cotejo = 'RECONCILIACION';
    public $identificador_eduge;

    protected $rules = [
        'establecimiento_id' => 'required_if:tipo_cotejo,RECONCILIACION|exists:establecimientos,id',
        'identificador_eduge' => 'required_if:tipo_cotejo,FALTANTE',
        'fecha_visita' => 'required|date|before_or_equal:today',
        'observaciones' => 'required|min:10',
        'cambios' => 'required|array|min:1',
    ];

    public function mount()
    {
        $this->fecha_visita = now()->format('Y-m-d');
    }

    public function addCambio()
    {
        $this->validate([
            'nuevoCampo' => 'required|string',
            'valorAnterior' => 'required',
            'valorNuevo' => 'required',
        ]);

        $this->cambios[] = [
            'campo' => strtoupper($this->nuevoCampo),
            'anterior' => $this->valorAnterior,
            'nuevo' => $this->valorNuevo,
        ];

        $this->reset(['nuevoCampo', 'valorAnterior', 'valorNuevo']);
    }

    public function removeCambio($index)
    {
        unset($this->cambios[$index]);
        $this->cambios = array_values($this->cambios);
    }

    public function save()
    {
        $this->validate();

        AuditoriaEduge::create([
            'establecimiento_id' => $this->tipo_cotejo === 'RECONCILIACION' ? $this->establecimiento_id : null,
            'identificador_eduge' => $this->tipo_cotejo === 'FALTANTE' ? strtoupper($this->identificador_eduge) : null,
            'user_id' => Auth::id(),
            'fecha_visita' => $this->fecha_visita,
            'cambios' => $this->cambios,
            'observaciones' => $this->observaciones,
            'tipo_cotejo' => $this->tipo_cotejo,
        ]);

        session()->flash('success', 'Auditoría registrada correctamente.');
        
        $route = Auth::user()->isAdmin() ? 'admin.auditorias' : 'administrativos.auditorias';
        return redirect()->route($route);
    }

    public function render()
    {
        return view('livewire.admin.auditoria-eduge-form', [
            'establecimientos' => Establecimiento::orderBy('nombre')->get(),
        ]);
    }
}
