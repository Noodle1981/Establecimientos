<?php

namespace App\Livewire\Admin;

use App\Models\ActivityLog;
use App\Models\User;
use Livewire\Component;

class AdminDashboard extends Component
{
    public function render()
    {
        $stats = [
            'users_total' => User::count(),
            'users_admin' => User::where('role', 'admin')->count(),
            'users_administrativos' => User::where('role', 'administrativos')->count(),
            'users_user' => User::where('role', 'user')->count(),
            'users_recent' => User::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        $recentActivity = ActivityLog::with('user')
            ->latest()
            ->take(5)
            ->get();

        return view('livewire.admin.admin-dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }
}
