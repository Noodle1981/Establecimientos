<?php

namespace App\Http\Requests\Administrativos;

use App\Enums\EstadoReporte;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReporteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isAdministrativo() || $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'estado' => ['required', Rule::in(EstadoReporte::values())],
        ];
    }
}
