<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
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

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }
}
