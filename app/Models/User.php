<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'password_changed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_changed_at' => 'datetime',
        ];
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN->value;
    }

    /**
     * Check if user is administrativo.
     */
    public function isAdministrativo(): bool
    {
        return $this->role === UserRole::ADMINISTRATIVO->value;
    }

    /**
     * Check if user is autoridad.
     */
    public function isAutoridad(): bool
    {
        return $this->role === UserRole::AUTORIDAD->value;
    }

    /**
     * Check if user is mid.
     */
    public function isMid(): bool
    {
        return $this->role === UserRole::MID->value;
    }

    /**
     * Check if user is a regular user.
     */
    public function isUser(): bool
    {
        return $this->role === UserRole::USER->value;
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasRole(string|array|UserRole $roles): bool
    {
        if ($roles instanceof UserRole) {
            return $this->role === $roles->value;
        }

        if (is_string($roles)) {
            return $this->role === $roles;
        }

        $mapped = array_map(fn ($r) => $r instanceof UserRole ? $r->value : $r, $roles);

        return in_array($this->role, $mapped);
    }

    /**
     * Get the audits performed by the user.
     */
    public function auditorias()
    {
        return $this->hasMany(AuditoriaEduge::class);
    }
}
