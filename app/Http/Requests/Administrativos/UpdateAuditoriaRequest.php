<?php

namespace App\Http\Requests\Administrativos;

use App\Enums\EstadoValidacion;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAuditoriaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'estado' => ['required', Rule::in(EstadoValidacion::values())],
            'observaciones' => 'nullable|string',
            'campos_auditados' => 'nullable|array',
            'campos_auditados.*' => 'string|in:Nombre,Dirección,Edificio,CUI,CUE,GPS,RADIO,SECTOR,MODALIDAD,CATEGORÍA',
            'propagar_al_edificio' => 'nullable|boolean',
        ];
    }
}
