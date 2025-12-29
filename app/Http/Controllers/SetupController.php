<?php

namespace App\Http\Controllers;

use App\Services\ThemeService;
use Illuminate\Http\Request;

class SetupController extends Controller
{
    public function index()
    {
        $currentTheme = ThemeService::getThemeConfig();
        return view('setup.index', compact('currentTheme'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'layout_type' => 'required|in:side-nav,top-nav',
            'primary_color' => 'required|string',
            'secondary_color' => 'required|string',
            'accent_color' => 'required|string',
            'app_name' => 'required|string|max:255',
            'is_glassmorphism' => 'boolean',
        ]);

        $validated['is_glassmorphism'] = $request->has('is_glassmorphism') ? 'true' : 'false';

        ThemeService::saveTheme($validated);

        return redirect()->route('setup.index')->with('success', '¡Tema guardado exitosamente!');
    }
}
