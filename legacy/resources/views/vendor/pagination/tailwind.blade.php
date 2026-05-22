@if ($paginator->hasPages())
    <nav role="navigation" aria-label="{{ __('Pagination Navigation') }}">

        {{-- Mobile View --}}
        <div class="flex gap-2 items-center justify-between sm:hidden">
            @if ($paginator->onFirstPage())
                <span class="inline-flex items-center px-4 py-2 text-sm font-medium bg-white border cursor-not-allowed rounded-lg shadow-sm" style="color: #999; border-color: #eee;">
                    Anterior
                </span>
            @else
                <a href="{{ $paginator->previousPageUrl() }}" rel="prev" class="inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-lg shadow-sm transition-all" style="color: #000000; border-color: #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='#FFFFFF'">
                    Anterior
                </a>
            @endif

            @if ($paginator->hasMorePages())
                <a href="{{ $paginator->nextPageUrl() }}" rel="next" class="inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-lg shadow-sm transition-all" style="color: #000000; border-color: #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='#FFFFFF'">
                    Siguiente
                </a>
            @else
                <span class="inline-flex items-center px-4 py-2 text-sm font-medium bg-white border cursor-not-allowed rounded-lg shadow-sm" style="color: #999; border-color: #eee;">
                    Siguiente
                </span>
            @endif
        </div>

        {{-- Desktop View --}}
        <div class="hidden sm:flex-1 sm:flex sm:gap-2 sm:items-center sm:justify-between">
            <div>
                <p class="text-sm leading-5" style="color: #000000;">
                    Mostrando
                    <span class="font-bold" style="color: #FE8204;">{{ $paginator->firstItem() }}</span>
                    a
                    <span class="font-bold" style="color: #FE8204;">{{ $paginator->lastItem() }}</span>
                    de
                    <span class="font-bold" style="color: #FE8204;">{{ $paginator->total() }}</span>
                    resultados
                </p>
            </div>

            <div>
                <span class="inline-flex rounded-lg shadow-sm gap-1">
                    {{-- Previous Page Link --}}
                    @if ($paginator->onFirstPage())
                        <span aria-disabled="true" aria-label="Anterior">
                            <span class="inline-flex items-center px-3 py-2 text-sm font-medium bg-white border cursor-not-allowed rounded-lg" style="color: #ccc; border-color: #eee;">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </span>
                        </span>
                    @else
                        <a href="{{ $paginator->previousPageUrl() }}" rel="prev" class="inline-flex items-center px-3 py-2 text-sm font-medium bg-white border rounded-lg transition-all" style="color: #FE8204; border-color: #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='#FFFFFF'" aria-label="Anterior">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    @endif

                    {{-- Pagination Elements --}}
                    @foreach ($elements as $element)
                        {{-- "Three Dots" Separator --}}
                        @if (is_string($element))
                            <span aria-disabled="true">
                                <span class="inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-lg" style="color: #000000; border-color: #eee;">{{ $element }}</span>
                            </span>
                        @endif

                        {{-- Array Of Links --}}
                        @if (is_array($element))
                            @foreach ($element as $page => $url)
                                @if ($page == $paginator->currentPage())
                                    <span aria-current="page">
                                        <span class="inline-flex items-center px-4 py-2 text-sm font-bold border rounded-lg shadow-md" style="background-color: #FE8204; color: #FFFFFF; border-color: #FE8204;">{{ $page }}</span>
                                    </span>
                                @else
                                    <a href="{{ $url }}" class="inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded-lg transition-all" style="color: #000000; border-color: #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='#FFFFFF'">
                                        {{ $page }}
                                    </a>
                                @endif
                            @endforeach
                        @endif
                    @endforeach

                    {{-- Next Page Link --}}
                    @if ($paginator->hasMorePages())
                        <a href="{{ $paginator->nextPageUrl() }}" rel="next" class="inline-flex items-center px-3 py-2 text-sm font-medium bg-white border rounded-lg transition-all" style="color: #FE8204; border-color: #FE8204;" onmouseover="this.style.backgroundColor='rgba(254, 130, 4, 0.1)'" onmouseout="this.style.backgroundColor='#FFFFFF'" aria-label="Siguiente">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </a>
                    @else
                        <span aria-disabled="true" aria-label="Siguiente">
                            <span class="inline-flex items-center px-3 py-2 text-sm font-medium bg-white border cursor-not-allowed rounded-lg" style="color: #ccc; border-color: #eee;">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </span>
                        </span>
                    @endif
                </span>
            </div>
        </div>
    </nav>
@endif
