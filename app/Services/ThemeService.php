<?php

namespace App\Services;

use App\Models\ProjectSetting;

class ThemeService
{
    public static function getThemeConfig(): array
    {
        return [
            'layout_type' => ProjectSetting::get('layout_type', 'side-nav'),
            'primary_color' => ProjectSetting::get('primary_color', '#8b5cf6'),
            'secondary_color' => ProjectSetting::get('secondary_color', '#ec4899'),
            'accent_color' => ProjectSetting::get('accent_color', '#3b82f6'),
            'logo_url' => ProjectSetting::get('logo_url', null),
            'app_name' => ProjectSetting::get('app_name', 'Laravel App'),
            'is_glassmorphism' => ProjectSetting::get('is_glassmorphism', 'true') === 'true',
        ];
    }

    public static function getCssVariables(): string
    {
        $config = self::getThemeConfig();
        
        return "
            :root {
                --primary-color: {$config['primary_color']};
                --secondary-color: {$config['secondary_color']};
                --accent-color: {$config['accent_color']};
            }
        ";
    }

    public static function saveTheme(array $data): void
    {
        foreach ($data as $key => $value) {
            ProjectSetting::set($key, $value);
        }
    }
}
