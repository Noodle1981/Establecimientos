<?php

namespace App\Livewire\Admin;

use App\Models\ActivityLog;
use App\Models\User;
use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\Layout;
use Illuminate\Support\Facades\Auth;

class ActivityLogTable extends Component
{
    use WithPagination;

    public $search = '';
    public $userFilter = '';
    public $actionFilter = '';
    public $areaFilter = '';
    public $departamentoFilter = '';
    public $ambitoFilter = '';
    public $fieldsFilter = [];
    public $dateFrom = '';
    public $dateTo = '';
    public $perPage = 15;

    protected $queryString = [
        'search', 
        'userFilter', 
        'actionFilter', 
        'areaFilter', 
        'departamentoFilter', 
        'ambitoFilter', 
        'fieldsFilter',
        'dateFrom', 
        'dateTo'
    ];

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function updatingUserFilter()
    {
        $this->resetPage();
    }

    public function updatingActionFilter()
    {
        $this->resetPage();
    }

    public function updatingAreaFilter()
    {
        $this->resetPage();
    }

    public function updatingDepartamentoFilter()
    {
        $this->resetPage();
    }

    public function updatingAmbitoFilter()
    {
        $this->resetPage();
    }

    public function updatingFieldsFilter()
    {
        $this->resetPage();
    }

    public function resetFilters()
    {
        $this->reset(['search', 'userFilter', 'actionFilter', 'areaFilter', 'departamentoFilter', 'ambitoFilter', 'fieldsFilter', 'dateFrom', 'dateTo']);
        $this->resetPage();
    }

    #[Layout('layouts.app')]
    public function render()
    {
        $query = ActivityLog::with('user');

        if ($this->search) {
            $query->where(function($q) {
                $q->where('description', 'like', '%' . $this->search . '%')
                  ->orWhere('model_type', 'like', '%' . $this->search . '%');
            });
        }

        // Restricción por rol
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($user?->isAdministrativo()) {
            $query->where('user_id', Auth::id());
        } elseif ($this->userFilter) {
            // Solo admin puede filtrar por otros usuarios
            $query->where('user_id', $this->userFilter);
        }

        if ($this->actionFilter) {
            $query->where('action', $this->actionFilter);
        }

        if ($this->areaFilter) {
            $query->where(function($q) {
                $q->whereHasMorph('model', [\App\Models\Modalidad::class], function($sq) {
                    $sq->where('direccion_area', $this->areaFilter);
                })->orWhereHasMorph('model', [\App\Models\Establecimiento::class], function($sq) {
                    $sq->whereHas('modalidades', function($ssq) {
                        $ssq->where('direccion_area', $this->areaFilter);
                    });
                });
            });
        }

        if ($this->ambitoFilter) {
            $query->where(function($q) {
                $q->whereHasMorph('model', [\App\Models\Modalidad::class], function($sq) {
                    $sq->where('ambito', $this->ambitoFilter);
                })->orWhereHasMorph('model', [\App\Models\Establecimiento::class], function($sq) {
                    $sq->whereHas('modalidades', function($ssq) {
                        $ssq->where('ambito', $this->ambitoFilter);
                    });
                });
            });
        }

        if ($this->departamentoFilter) {
            $query->where(function($q) {
                $q->whereHasMorph('model', [\App\Models\Modalidad::class], function($sq) {
                    $sq->whereHas('establecimiento', function($ssq) {
                        $ssq->whereHas('edificio', function($sssq) {
                            $sssq->where('zona_departamento', $this->departamentoFilter);
                        });
                    });
                })->orWhereHasMorph('model', [\App\Models\Establecimiento::class], function($sq) {
                    $sq->whereHas('edificio', function($ssq) {
                        $ssq->where('zona_departamento', $this->departamentoFilter);
                    });
                })->orWhereHasMorph('model', [\App\Models\Edificio::class], function($sq) {
                    $sq->where('zona_departamento', $this->departamentoFilter);
                });
            });
        }

        if (!empty($this->fieldsFilter)) {
            $query->where(function($q) {
                foreach ($this->fieldsFilter as $field) {
                    // Mapear campos de búsqueda si es necesario
                    $searchFields = match($field) {
                        'direccion' => ['calle', 'numero_puerta', 'localidad'],
                        'categoria' => ['categoria', 'nivel_educativo', 'ambito'],
                        default => [$field],
                    };

                    foreach ($searchFields as $sField) {
                        $q->orWhereJsonContains('changes->after', [$sField => null], 'or')
                          ->orWhereRaw("JSON_EXTRACT(changes, '$.after.\"$sField\"') IS NOT NULL");
                    }
                }
            });
        }

        if ($this->dateFrom) {
            $query->whereDate('created_at', '>=', $this->dateFrom);
        }

        if ($this->dateTo) {
            $query->whereDate('created_at', '<=', $this->dateTo);
        }

        $logs = $query->latest()
            ->paginate($this->perPage);

        $users = User::orderBy('name')->get();

        // Obtener opciones para filtros de los modelos reales
        $areas = \App\Models\Modalidad::distinct()->pluck('direccion_area')->filter()->values();
        $ambitos = \App\Models\Modalidad::distinct()->pluck('ambito')->filter()->values();
        $departamentos = \App\Models\Edificio::distinct()->pluck('zona_departamento')->filter()->values();

        return view('livewire.admin.activity-log-table', [
            'logs' => $logs,
            'users' => $users,
            'areas' => $areas,
            'ambitos' => $ambitos,
            'departamentos' => $departamentos,
        ]);
    }
}
