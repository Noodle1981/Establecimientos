<?php

namespace App\Livewire\Admin;

use App\Models\ActivityLog;
use App\Models\User;
use Livewire\Component;
use Livewire\WithPagination;

class ActivityLogTable extends Component
{
    use WithPagination;

    public $search = '';
    public $userFilter = '';
    public $actionFilter = '';
    public $dateFrom = '';
    public $dateTo = '';
    public $perPage = 15;

    protected $queryString = ['search', 'userFilter', 'actionFilter', 'dateFrom', 'dateTo'];

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

    public function render()
    {
        $query = ActivityLog::with('user');

        if ($this->search) {
            $query->where(function($q) {
                $q->where('description', 'like', '%' . $this->search . '%')
                  ->orWhere('model_type', 'like', '%' . $this->search . '%');
            });
        }

        if ($this->userFilter) {
            $query->where('user_id', $this->userFilter);
        }

        if ($this->actionFilter) {
            $query->where('action', $this->actionFilter);
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

        return view('livewire.admin.activity-log-table', [
            'logs' => $logs,
            'users' => $users,
        ])->layout('layouts.app');
    }
}
