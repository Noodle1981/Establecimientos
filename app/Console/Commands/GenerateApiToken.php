<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GenerateApiToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'api:token 
                            {user : Email o ID del usuario que será propietario del token} 
                            {name=Plataforma-Externa : Nombre identificador del consumidor externo}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generar un token Bearer de Laravel Sanctum para consumo de APIs externas';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $userIdentifier = $this->argument('user');
        $tokenName = $this->argument('name');

        $user = is_numeric($userIdentifier)
            ? User::find($userIdentifier)
            : User::where('email', $userIdentifier)->first();

        if (! $user) {
            $this->error("❌ No se encontró ningún usuario con el identificador: {$userIdentifier}");
            return self::FAILURE;
        }

        $token = $user->createToken($tokenName);

        $this->info('====================================================================');
        $this->info('🔑 TOKEN DE ACCESO API GENERADO CON ÉXITO');
        $this->info('====================================================================');
        $this->line("<comment>Usuario:</comment> {$user->name} ({$user->email})");
        $this->line("<comment>Consumidor / Nombre:</comment> {$tokenName}");
        $this->line("<comment>Token ID:</comment> {$token->accessToken->id}");
        $this->newLine();
        $this->line("<fg=yellow;options=bold>Bearer Token (Copiar ahora, no se volverá a mostrar):</>");
        $this->line("<fg=green;options=bold>{$token->plainTextToken}</>");
        $this->newLine();
        $this->info('Ejemplo de uso en cURL / Postman:');
        $this->line('curl -X GET "http://establecimientos.test/api/v1/establecimientos?departamento=Capital" \\');
        $this->line("     -H \"Authorization: Bearer {$token->plainTextToken}\" \\");
        $this->line('     -H "Accept: application/json"');
        $this->info('====================================================================');

        return self::SUCCESS;
    }
}
