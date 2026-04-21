<?php

namespace App\Http\Requests\Publico;

use Illuminate\Foundation\Http\FormRequest;

class StoreReporteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public route
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'edificio_id' => 'nullable|exists:edificios,id',
            'tipo' => 'required|string',
            'descripcion' => 'required|string|min:10',
            'nombre_remitente' => 'nullable|string|max:255',
            'email_remitente' => 'nullable|email|max:255',
        ];
    }
}
