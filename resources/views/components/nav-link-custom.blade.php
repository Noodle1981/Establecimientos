@props(['active', 'icon' => null])

@php
$classes = ($active ?? false)
            ? 'group relative flex items-center justify-center p-2.5 rounded-xl transition-all shadow-sm border'
            : 'group relative flex items-center justify-center p-2.5 rounded-xl transition-all border border-transparent hover:bg-gray-50';

$style = ($active ?? false)
            ? 'background-color: rgba(254, 130, 4, 0.1); color: #FE8204; border-color: #FE8204;'
            : 'color: #000000;';
@endphp

<a {{ $attributes->merge(['class' => $classes, 'style' => $style]) }} 
   onmouseover="this.style.color='#FE8204'" 
   onmouseout="if(!{{ $active ? 'true' : 'false' }}) this.style.color='#000000'">
    @if($icon)
        <i class="{{ $icon }} fa-lg" style="color: #FE8204; filter: drop-shadow(0 2px 2px rgba(250, 220, 60, 0.5)); transition: transform 0.2s;"></i>
    @endif
    
    <!-- Tooltip -->
    <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-[100] border border-gray-700 pointer-events-none">
        {{ $slot }}
        <!-- Arrow -->
        <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 border-t border-l border-gray-700"></div>
    </div>
</a>
