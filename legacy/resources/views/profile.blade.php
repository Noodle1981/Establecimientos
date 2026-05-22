<x-app-layout>
    <div class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <!-- Header -->
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-black">Mi Perfil</h2>
                <p class="text-gray-600 mt-1">Gestiona tu información personal y configuración de cuenta</p>
            </div>

            <!-- Update Profile Information -->
            <div class="glass-strong rounded-2xl p-8">
                <div class="max-w-xl">
                    <livewire:profile.update-profile-information-form />
                </div>
            </div>

            <!-- Update Password -->
            <div class="glass-strong rounded-2xl p-8">
                <div class="max-w-xl">
                    <livewire:profile.update-password-form />
                </div>
            </div>

            <!-- Delete Account -->
            <div class="glass-strong rounded-2xl p-8">
                <div class="max-w-xl">
                    <livewire:profile.delete-user-form />
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
