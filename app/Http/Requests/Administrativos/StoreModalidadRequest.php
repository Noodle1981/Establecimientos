<?php

namespace App\Http\Requests\Administrativos;

use Illuminate\Foundation\Http\FormRequest;

class StoreModalidadRequest extends FormRequest
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
            'nombre_establecimiento' => ['required', 'string', 'max:255'],
            'cue' => ['required', 'regex:/^(\d{9}|PROV.*)$/'],
            'cui' => ['required', 'regex:/^(\d{7}|PROV.*)$/'],
            'establecimiento_cabecera' => ['required', 'regex:/^(\d{9}|PROV.*)$/'],
            'nivel_educativo' => ['required', 'string', 'max:255'],
            'direccion_area' => ['required', 'string', 'max:255'],
            'ambito' => ['required', 'string', 'max:50'],
            'sector' => ['nullable'],
            'radio' => ['nullable', 'string', 'max:50'],
            'zona' => ['nullable', 'string', 'max:50'],
            'calle' => ['required', 'string', 'max:255'],
            'localidad' => ['required', 'string', 'max:255'],
            'zona_departamento' => ['required', 'string', 'max:255'],
            'latitud' => ['nullable', 'numeric'],
            'longitud' => ['nullable', 'numeric'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'latitud' => $this->latitud ?? null,
            'longitud' => $this->longitud ?? null,
        ]);
    }
}
