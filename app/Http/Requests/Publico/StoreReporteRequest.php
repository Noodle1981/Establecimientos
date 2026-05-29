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
            'honeypot' => 'max:0',
            'edificio_id' => 'nullable|exists:edificios,id',
            'tipo' => 'required|in:ERROR_DATOS,UBICACION_INCORRECTA,INFO_FALTANTE,OTRO',
            'descripcion' => 'required|string|min:10|max:1000',
            'nombre_remitente' => 'nullable|string|max:100',
            'email_remitente' => 'nullable|email|max:150',
        ];
    }
}
