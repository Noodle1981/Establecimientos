<!-- Toast Notifications Container -->
<div
    x-data="{
        notices: [],
        visible: [],
        add(e) {
            const notice = {
                id: Date.now(),
                type: e.detail.type || 'info',
                message: e.detail.message
            };
            this.notices.push(notice);
            this.visible.push(notice.id);
            setTimeout(() => this.remove(notice.id), e.detail.duration || 4000);
        },
        remove(id) {
            const index = this.visible.indexOf(id);
            if (index > -1) {
                this.visible.splice(index, 1);
            }
        }
    }"
    @notify.window="add($event)"
    class="fixed top-4 right-4 z-50 space-y-2"
    style="pointer-events: none;"
>
    <template x-for="notice in notices" :key="notice.id">
        <div
            x-show="visible.includes(notice.id)"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 transform translate-x-full"
            x-transition:enter-end="opacity-100 transform translate-x-0"
            x-transition:leave="transition ease-in duration-200"
            x-transition:leave-start="opacity-100 transform translate-x-0"
            x-transition:leave-end="opacity-0 transform translate-x-full"
            :class="{
                'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200': notice.type === 'success',
                'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200': notice.type === 'error',
                'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200': notice.type === 'warning',
                'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200': notice.type === 'info'
            }"
            class="flex items-center p-4 border-l-4 rounded-r-lg shadow-lg max-w-sm"
            style="pointer-events: auto;"
        >
            <div class="flex-shrink-0">
                <!-- Success Icon -->
                <svg x-show="notice.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <!-- Error Icon -->
                <svg x-show="notice.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <!-- Warning Icon -->
                <svg x-show="notice.type === 'warning'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <!-- Info Icon -->
                <svg x-show="notice.type === 'info'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <div class="ml-3 flex-1" x-text="notice.message"></div>
            <button @click="remove(notice.id)" class="ml-3 flex-shrink-0 text-current hover:opacity-75">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    </template>
</div>

<!-- Auto-trigger from session flash messages -->
@if (session()->has('success'))
    <div x-data x-init="$dispatch('notify', { type: 'success', message: '{{ session('success') }}' })"></div>
@endif

@if (session()->has('error'))
    <div x-data x-init="$dispatch('notify', { type: 'error', message: '{{ session('error') }}' })"></div>
@endif

@if (session()->has('warning'))
    <div x-data x-init="$dispatch('notify', { type: 'warning', message: '{{ session('warning') }}' })"></div>
@endif

@if (session()->has('info'))
    <div x-data x-init="$dispatch('notify', { type: 'info', message: '{{ session('info') }}' })"></div>
@endif
