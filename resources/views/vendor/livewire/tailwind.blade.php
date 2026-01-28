@php
if (! isset($scrollTo)) {
    $scrollTo = 'body';
}

$scrollIntoViewJsSnippet = ($scrollTo !== false)
    ? <<<JS
       (\$el.closest('{$scrollTo}') || document.querySelector('{$scrollTo}')).scrollIntoView()
    JS
    : '';
@endphp

<div>
    @if ($paginator->hasPages())
        <nav role="navigation" aria-label="Pagination Navigation" class="flex items-center justify-between">
            
            {{-- Mobile View --}}
            <div class="flex justify-between flex-1 sm:hidden">
                <span>
                    @if ($paginator->onFirstPage())
                        <span class="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border cursor-not-allowed rounded-lg shadow-sm" style="color: #999; border-color: #eee;">
                            Anterior
                        </span>
                    @else
                        <button type="button" wire:click="previousPage('{{ $paginator->getPageName() }}')" x-on:click="{{ $scrollIntoViewJsSnippet }}" wire:loading.attr="disabled" class="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-lg shadow-sm transition-all" style="color: #000000; border-color: #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='#FFFFFF'">
                            Anterior
                        </button>
                    @endif
                </span>

                <span>
                    @if ($paginator->hasMorePages())
                        <button type="button" wire:click="nextPage('{{ $paginator->getPageName() }}')" x-on:click="{{ $scrollIntoViewJsSnippet }}" wire:loading.attr="disabled" class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium bg-white border rounded-lg shadow-sm transition-all" style="color: #000000; border-color: #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='#FFFFFF'">
                            Siguiente
                        </button>
                    @else
                        <span class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium bg-white border cursor-not-allowed rounded-lg shadow-sm" style="color: #999; border-color: #eee;">
                            Siguiente
                        </span>
                    @endif
                </span>
            </div>

            {{-- Desktop View --}}
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm leading-5" style="color: #000000;">
                        <span>Mostrando</span>
                        <span class="font-bold" style="color: #FE8204;">{{ $paginator->firstItem() }}</span>
                        <span>a</span>
                        <span class="font-bold" style="color: #FE8204;">{{ $paginator->lastItem() }}</span>
                        <span>de</span>
                        <span class="font-bold" style="color: #FE8204;">{{ $paginator->total() }}</span>
                        <span>resultados</span>
                    </p>
                </div>

                <div>
                    <span class="relative z-0 inline-flex rounded-lg shadow-sm gap-1">
                        <span>
                            {{-- Previous Page Link --}}
                            @if ($paginator->onFirstPage())
                                <span aria-disabled="true" aria-label="Anterior">
                                    <span class="relative inline-flex items-center px-3 py-2 text-sm font-medium bg-white border cursor-not-allowed rounded-lg" style="color: #ccc; border-color: #eee;">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                </span>
                            @else
                                <button type="button" wire:click="previousPage('{{ $paginator->getPageName() }}')" x-on:click="{{ $scrollIntoViewJsSnippet }}" class="relative inline-flex items-center px-3 py-2 text-sm font-medium bg-white border rounded-lg transition-all" style="color: #FE8204; border-color: #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='#FFFFFF'" aria-label="Anterior">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            @endif
                        </span>

                        {{-- Pagination Elements --}}
                        @foreach ($elements as $element)
                            {{-- "Three Dots" Separator --}}
                            @if (is_string($element))
                                <span aria-disabled="true">
                                    <span class="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-lg" style="color: #000000; border-color: #eee;">{{ $element }}</span>
                                </span>
                            @endif

                            {{-- Array Of Links --}}
                            @if (is_array($element))
                                @foreach ($element as $page => $url)
                                    <span wire:key="paginator-{{ $paginator->getPageName() }}-page{{ $page }}">
                                        @if ($page == $paginator->currentPage())
                                            <span aria-current="page">
                                                <span class="relative inline-flex items-center px-4 py-2 text-sm font-bold border rounded-lg shadow-md" style="background-color: #FE8204; color: #FFFFFF; border-color: #FE8204;">{{ $page }}</span>
                                            </span>
                                        @else
                                            <button type="button" wire:click="gotoPage({{ $page }}, '{{ $paginator->getPageName() }}')" x-on:click="{{ $scrollIntoViewJsSnippet }}" class="relative inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-lg transition-all" style="color: #000000; border-color: #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='#FFFFFF'">
                                                {{ $page }}
                                            </button>
                                        @endif
                                    </span>
                                @endforeach
                            @endif
                        @endforeach

                        <span>
                            {{-- Next Page Link --}}
                            @if ($paginator->hasMorePages())
                                <button type="button" wire:click="nextPage('{{ $paginator->getPageName() }}')" x-on:click="{{ $scrollIntoViewJsSnippet }}" class="relative inline-flex items-center px-3 py-2 text-sm font-medium bg-white border rounded-lg transition-all" style="color: #FE8204; border-color: #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='#FFFFFF'" aria-label="Siguiente">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            @else
                                <span aria-disabled="true" aria-label="Siguiente">
                                    <span class="relative inline-flex items-center px-3 py-2 text-sm font-medium bg-white border cursor-not-allowed rounded-lg" style="color: #ccc; border-color: #eee;">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </span>
                                </span>
                            @endif
                        </span>
                    </span>
                </div>
            </div>
        </nav>
    @endif
</div>
