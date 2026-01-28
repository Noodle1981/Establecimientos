@props(['active', 'icon' => null])

@php
$classes = ($active ?? false)
            ? 'flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-orange-700 font-bold transition-all shadow-sm border border-orange-100'
            : 'flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition-all border border-transparent hover:border-slate-100';
@endphp

<a {{ $attributes->merge(['class' => $classes]) }}>
    @if($icon)
        <span class="text-xl">{{ $icon }}</span>
    @endif
    <span class="text-sm font-medium">{{ $slot }}</span>
</a>
