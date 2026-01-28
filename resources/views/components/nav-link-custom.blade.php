@props(['active', 'icon' => null])

@php
$classes = ($active ?? false)
            ? 'flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-sm border'
            : 'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all border border-transparent hover:bg-gray-50';

$style = ($active ?? false)
            ? 'background-color: rgba(254, 130, 4, 0.1); color: #FE8204; border-color: #FE8204;'
            : 'color: #000000;';
@endphp

<a {{ $attributes->merge(['class' => $classes, 'style' => $style]) }} 
   onmouseover="this.style.color='#FE8204'" 
   onmouseout="if(!{{ $active ? 'true' : 'false' }}) this.style.color='#000000'">
    @if($icon)
        <i class="{{ $icon }} fa-lg" style="color: #FE8204; filter: drop-shadow(0 2px 2px rgba(250, 220, 60, 0.5));"></i>
    @endif
    <span class="text-sm font-bold tracking-wide">{{ $slot }}</span>
</a>
