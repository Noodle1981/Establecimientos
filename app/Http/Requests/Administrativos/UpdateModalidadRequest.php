<?php

namespace App\Http\Requests\Administrativos;

use Illuminate\Foundation\Http\FormRequest;

class UpdateModalidadRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->isAdministrativo();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'cui' => ['required', 'regex:/^(\d{7}|PROV.*)$/'],
            'cue' => ['required', 'regex:/^(\d{9}|PROV.*)$/'],
            'nombre_establecimiento' => 'required|string',
            'nivel_educativo' => 'required',
            'direccion_area' => 'required',
            'validado' => 'boolean',
            'radio' => 'nullable',
            'sector' => 'nullable',
            'ambito' => 'required',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'cui' => strtoupper($this->cui),
        ]);
    }
}
