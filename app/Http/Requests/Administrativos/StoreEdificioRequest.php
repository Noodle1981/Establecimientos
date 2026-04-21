<?php

namespace App\Http\Requests\Administrativos;

use Illuminate\Foundation\Http\FormRequest;

class StoreEdificioRequest extends FormRequest
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
            'cui'              => 'required|string|max:50|unique:edificios,cui',
            'calle'            => 'required|string|max:255',
            'numero_puerta'    => 'nullable|string|max:20',
            'localidad'        => 'required|string|max:255',
            'zona_departamento'=> 'required|string|max:255',
            'codigo_postal'    => 'nullable|numeric',
            'latitud'          => 'nullable|numeric',
            'longitud'         => 'nullable|numeric',
            'letra_zona'       => 'nullable|string|max:1',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'cui' => strtoupper(trim($this->cui)),
            'calle' => strtoupper(trim($this->calle)),
            'localidad' => strtoupper(trim($this->localidad)),
            'zona_departamento' => strtoupper(trim($this->zona_departamento)),
        ]);
    }
}
