<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Edificio;
use App\Models\Modalidad;
use App\Models\Establecimiento;
use App\Models\Reporte;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RefactorIntegrityTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Public Map
     */
    public function test_public_map_is_accessible(): void
    {
        $response = $this->get('/mapa');
        $response->assertStatus(200);
    }

    /**
     * Test Public Report Submission
     */
    public function test_public_can_submit_report(): void
    {
        $response = $this->post('/reportes', [
            'tipo' => 'ERROR_DATOS',
            'descripcion' => 'Descripción de prueba para reporte',
            'email_remitente' => 'test@example.com'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('reportes', [
            'tipo' => 'ERROR_DATOS',
            'email_remitente' => 'test@example.com'
        ]);
    }

    /**
     * Test Administrative Access to Refactored Controllers
     */
    public function test_administrativo_can_access_modalidades(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $response = $this->actingAs($user)->get('/administrativos/establecimientos');
        $response->assertStatus(200);
    }

    public function test_administrativo_can_access_edificios(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $response = $this->actingAs($user)->get('/administrativos/edificios');
        $response->assertStatus(200);
    }

    public function test_administrativo_can_access_auditoria(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $response = $this->actingAs($user)->get('/administrativos/auditoria');
        $response->assertStatus(200);
    }

    public function test_administrativo_can_access_reportes_inbox(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $response = $this->actingAs($user)->get('/administrativos/reportes');
        $response->assertStatus(200);
    }

    /**
     * Test Creation through Action (SRP check)
     */
    public function test_can_create_modalidad_structure(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $response = $this->actingAs($user)->post('/administrativos/establecimientos', [
            'cui' => '1234567',
            'cue' => '123456789',
            'nombre_establecimiento' => 'Escuela de Prueba',
            'establecimiento_cabecera' => '123456789',
            'nivel_educativo' => 'PRIMARIA',
            'direccion_area' => 'AREA TEST',
            'ambito' => 'URBANO',
            'calle' => 'Calle Falsa 123',
            'localidad' => 'SAN JUAN',
            'zona_departamento' => 'CAPITAL',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('edificios', ['cui' => '1234567']);
        $this->assertDatabaseHas('establecimientos', ['cue' => '123456789']);
        $this->assertDatabaseHas('modalidades', ['nivel_educativo' => 'PRIMARIA']);
    }

    /**
     * Test soft-deletion of modality and cascade to establishment if it's the last one
     */
    public function test_administrativo_can_delete_modalidad_and_trigger_cascade(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $edificio = Edificio::create([
            'cui' => '1234567',
            'calle' => 'Calle Falsa 123',
            'numero_puerta' => '123',
            'localidad' => 'SAN JUAN',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
            'zona_departamento' => 'CAPITAL'
        ]);

        $est = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => '123456789',
            'cue_edificio_principal' => '123456789',
            'nombre' => 'Escuela de Prueba',
            'establecimiento_cabecera' => '123456789'
        ]);

        $mod = Modalidad::create([
            'establecimiento_id' => $est->id,
            'direccion_area' => 'AREA TEST',
            'nivel_educativo' => 'PRIMARIA',
            'ambito' => 'URBANO',
            'validado' => false,
            'estado_validacion' => 'PENDIENTE'
        ]);

        $response = $this->actingAs($user)->delete(route('administrativos.establecimientos.destroy', $mod->id));
        $response->assertRedirect();

        $this->assertSoftDeleted('modalidades', ['id' => $mod->id]);
        $this->assertSoftDeleted('establecimientos', ['id' => $est->id]);
    }

    /**
     * Test soft-deletion of modality does NOT cascade if other active modalities exist
     */
    public function test_administrativo_can_delete_modalidad_without_cascade_if_not_last(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $edificio = Edificio::create([
            'cui' => '1234567',
            'calle' => 'Calle Falsa 123',
            'numero_puerta' => '123',
            'localidad' => 'SAN JUAN',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
            'zona_departamento' => 'CAPITAL'
        ]);

        $est = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => '123456789',
            'cue_edificio_principal' => '123456789',
            'nombre' => 'Escuela de Prueba',
            'establecimiento_cabecera' => '123456789'
        ]);

        $mod1 = Modalidad::create([
            'establecimiento_id' => $est->id,
            'direccion_area' => 'AREA TEST',
            'nivel_educativo' => 'PRIMARIA',
            'ambito' => 'URBANO',
            'validado' => false,
            'estado_validacion' => 'PENDIENTE'
        ]);

        $mod2 = Modalidad::create([
            'establecimiento_id' => $est->id,
            'direccion_area' => 'AREA SECUNDARIA',
            'nivel_educativo' => 'SECUNDARIA',
            'ambito' => 'URBANO',
            'validado' => false,
            'estado_validacion' => 'PENDIENTE'
        ]);

        $response = $this->actingAs($user)->delete(route('administrativos.establecimientos.destroy', $mod1->id));
        $response->assertRedirect();

        $this->assertSoftDeleted('modalidades', ['id' => $mod1->id]);
        $this->assertDatabaseHas('modalidades', ['id' => $mod2->id, 'deleted_at' => null]);
        $this->assertDatabaseHas('establecimientos', ['id' => $est->id, 'deleted_at' => null]);
    }

    /**
     * Test that we cannot delete an Edificio if it contains active establishments
     */
    public function test_cannot_delete_edificio_with_active_establishments(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $edificio = Edificio::create([
            'cui' => '1234567',
            'calle' => 'Calle Falsa 123',
            'numero_puerta' => '123',
            'localidad' => 'SAN JUAN',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
            'zona_departamento' => 'CAPITAL'
        ]);

        $est = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => '123456789',
            'cue_edificio_principal' => '123456789',
            'nombre' => 'Escuela de Prueba',
            'establecimiento_cabecera' => '123456789'
        ]);

        $response = $this->actingAs($user)->delete(route('administrativos.edificios.destroy', $edificio->id));
        $response->assertSessionHasErrors();
        $this->assertDatabaseHas('edificios', ['id' => $edificio->id, 'deleted_at' => null]);
    }

    /**
     * Test that we CAN delete an Edificio if it is empty
     */
    public function test_can_delete_empty_edificio(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $edificio = Edificio::create([
            'cui' => '1234567',
            'calle' => 'Calle Falsa 123',
            'numero_puerta' => '123',
            'localidad' => 'SAN JUAN',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
            'zona_departamento' => 'CAPITAL'
        ]);

        $response = $this->actingAs($user)->delete(route('administrativos.edificios.destroy', $edificio->id));
        $response->assertRedirect();

        $this->assertSoftDeleted('edificios', ['id' => $edificio->id]);
    }

    /**
     * Test that regular users cannot delete modalities or edificios
     */
    public function test_regular_user_cannot_delete_modalidad_or_edificio(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        
        $edificio = Edificio::create([
            'cui' => '1234567',
            'calle' => 'Calle Falsa 123',
            'numero_puerta' => '123',
            'localidad' => 'SAN JUAN',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
            'zona_departamento' => 'CAPITAL'
        ]);

        $est = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => '123456789',
            'cue_edificio_principal' => '123456789',
            'nombre' => 'Escuela de Prueba',
            'establecimiento_cabecera' => '123456789'
        ]);

        $mod = Modalidad::create([
            'establecimiento_id' => $est->id,
            'direccion_area' => 'AREA TEST',
            'nivel_educativo' => 'PRIMARIA',
            'ambito' => 'URBANO',
            'validado' => false,
            'estado_validacion' => 'PENDIENTE'
        ]);

        $response = $this->actingAs($user)->delete(route('administrativos.establecimientos.destroy', $mod->id));
        $response->assertStatus(403);

        $response = $this->actingAs($user)->delete(route('administrativos.edificios.destroy', $edificio->id));
        $response->assertStatus(403);
    }

    /**
     * Test administrative restoration of modality and reverse cascade restoration of establishment
     */
    public function test_admin_can_restore_modalidad_and_reverse_cascade(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        
        $edificio = Edificio::create([
            'cui' => '1234567',
            'calle' => 'Calle Falsa 123',
            'numero_puerta' => '123',
            'localidad' => 'SAN JUAN',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
            'zona_departamento' => 'CAPITAL'
        ]);

        $est = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => '123456789',
            'cue_edificio_principal' => '123456789',
            'nombre' => 'Escuela de Prueba',
            'establecimiento_cabecera' => '123456789'
        ]);

        $mod = Modalidad::create([
            'establecimiento_id' => $est->id,
            'direccion_area' => 'AREA TEST',
            'nivel_educativo' => 'PRIMARIA',
            'ambito' => 'URBANO',
            'validado' => false,
            'estado_validacion' => 'PENDIENTE'
        ]);

        // Soft delete both
        $mod->delete();
        $est->delete();

        $this->assertSoftDeleted('modalidades', ['id' => $mod->id]);
        $this->assertSoftDeleted('establecimientos', ['id' => $est->id]);

        $response = $this->actingAs($user)->post(route('admin.trash.restore', ['type' => 'modalidad', 'id' => $mod->id]));
        $response->assertRedirect();

        $this->assertDatabaseHas('modalidades', ['id' => $mod->id, 'deleted_at' => null]);
        $this->assertDatabaseHas('establecimientos', ['id' => $est->id, 'deleted_at' => null]);
    }

    /**
     * Test administrative update of establishment observations/comments (CUE specific)
     */
    public function test_administrativo_can_update_establecimiento_observaciones(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $edificio = Edificio::create([
            'cui' => '1234567',
            'calle' => 'Calle Falsa 123',
            'numero_puerta' => '123',
            'localidad' => 'SAN JUAN',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
            'zona_departamento' => 'CAPITAL'
        ]);

        $est = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => '123456789',
            'cue_edificio_principal' => '123456789',
            'nombre' => 'Escuela de Prueba',
            'establecimiento_cabecera' => '123456789',
            'observaciones' => null
        ]);

        $mod = Modalidad::create([
            'establecimiento_id' => $est->id,
            'direccion_area' => 'AREA TEST',
            'nivel_educativo' => 'PRIMARIA',
            'ambito' => 'URBANO',
            'validado' => false,
            'estado_validacion' => 'PENDIENTE'
        ]);

        $response = $this->actingAs($user)->patch(route('administrativos.establecimientos.update', $mod->id), [
            'cui' => '1234567',
            'cue' => '123456789',
            'nombre_establecimiento' => 'Escuela de Prueba',
            'nivel_educativo' => 'PRIMARIA',
            'direccion_area' => 'AREA TEST',
            'ambito' => 'URBANO',
            'validado' => false,
            'radio' => '1',
            'sector' => 'PUBLICO',
            'observaciones' => 'Esta es una observación propia del CUE.'
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();
        
        // Assert that the establecimiento table now has the observations
        $this->assertDatabaseHas('establecimientos', [
            'id' => $est->id,
            'observaciones' => 'Esta es una observación propia del CUE.'
        ]);
    }

    /**
     * Test update fails validation when CUE is already assigned to another establishment.
     */
    public function test_cannot_update_modalidad_with_duplicate_cue(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $edificio = Edificio::create([
            'cui' => '1234567',
            'calle' => 'Calle Falsa 123',
            'numero_puerta' => '123',
            'localidad' => 'SAN JUAN',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
            'zona_departamento' => 'CAPITAL'
        ]);

        $est1 = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => '123456789',
            'cue_edificio_principal' => '123456789',
            'nombre' => 'Escuela de Prueba 1',
            'establecimiento_cabecera' => '123456789'
        ]);

        $est2 = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => '987654321',
            'cue_edificio_principal' => '987654321',
            'nombre' => 'Escuela de Prueba 2',
            'establecimiento_cabecera' => '987654321'
        ]);

        $mod = Modalidad::create([
            'establecimiento_id' => $est1->id,
            'direccion_area' => 'AREA TEST',
            'nivel_educativo' => 'PRIMARIA',
            'ambito' => 'URBANO',
            'validado' => false,
            'estado_validacion' => 'PENDIENTE'
        ]);

        // Attempt to update $mod (representing $est1) to use CUE of $est2 ('987654321')
        $response = $this->actingAs($user)->patch(route('administrativos.establecimientos.update', $mod->id), [
            'cui' => '1234567',
            'cue' => '987654321', // Duplicate CUE!
            'nombre_establecimiento' => 'Escuela de Prueba 1',
            'nivel_educativo' => 'PRIMARIA',
            'direccion_area' => 'AREA TEST',
            'ambito' => 'URBANO',
            'validado' => false,
            'radio' => '1',
            'letra_zona' => 'P'
        ]);

        // Assert validation fails and CUE error exists
        $response->assertSessionHasErrors(['cue']);
        
        // Assert database is not modified
        $this->assertDatabaseHas('establecimientos', [
            'id' => $est1->id,
            'cue' => '123456789'
        ]);
    }

    /**
     * Test administrative filtering of modalities by category.
     */
    public function test_administrativo_can_filter_modalidades_by_categoria(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $edificio = Edificio::create([
            'cui' => '1234567',
            'calle' => 'Calle Falsa 123',
            'numero_puerta' => '123',
            'localidad' => 'SAN JUAN',
            'latitud' => -31.5375,
            'longitud' => -68.5364,
            'zona_departamento' => 'CAPITAL'
        ]);

        $est1 = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => '123456781',
            'cue_edificio_principal' => '123456781',
            'nombre' => 'Escuela de Prueba 1',
            'establecimiento_cabecera' => '123456781'
        ]);

        $est2 = Establecimiento::create([
            'edificio_id' => $edificio->id,
            'cue' => '123456782',
            'cue_edificio_principal' => '123456782',
            'nombre' => 'Escuela de Prueba 2',
            'establecimiento_cabecera' => '123456782'
        ]);

        $mod1 = Modalidad::create([
            'establecimiento_id' => $est1->id,
            'direccion_area' => 'AREA TEST',
            'nivel_educativo' => 'PRIMARIA',
            'ambito' => 'URBANO',
            'categoria' => 'PRIMERA',
            'validado' => false,
            'estado_validacion' => 'PENDIENTE'
        ]);

        $mod2 = Modalidad::create([
            'establecimiento_id' => $est2->id,
            'direccion_area' => 'AREA TEST',
            'nivel_educativo' => 'PRIMARIA',
            'ambito' => 'URBANO',
            'categoria' => 'SEGUNDA',
            'validado' => false,
            'estado_validacion' => 'PENDIENTE'
        ]);

        $response = $this->actingAs($user)->get('/administrativos/establecimientos?categoria=PRIMERA');
        
        $response->assertStatus(200);
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Administrativos/Establecimientos/Index')
            ->has('modalidades.data', 1)
            ->where('modalidades.data.0.id', $mod1->id)
        );
    }

    /**
     * Test administrative update of report status.
     */
    public function test_administrativo_can_update_reporte_status(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $reporte = Reporte::create([
            'tipo' => 'ERROR_DATOS',
            'descripcion' => 'Descripción de prueba para reporte',
            'email_remitente' => 'test@example.com',
            'estado' => 'PENDIENTE'
        ]);

        $response = $this->actingAs($user)->patch(route('administrativos.reportes.update', $reporte->id), [
            'estado' => 'PROCESADO'
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();
        
        $this->assertDatabaseHas('reportes', [
            'id' => $reporte->id,
            'estado' => 'PROCESADO'
        ]);
    }

    /**
     * Test administrative deletion of a report.
     */
    public function test_administrativo_can_delete_reporte(): void
    {
        $user = User::factory()->create(['role' => 'administrativos']);
        
        $reporte = Reporte::create([
            'tipo' => 'ERROR_DATOS',
            'descripcion' => 'Descripción de prueba para reporte',
            'email_remitente' => 'test@example.com',
            'estado' => 'PENDIENTE'
        ]);

        $response = $this->actingAs($user)->delete(route('administrativos.reportes.destroy', $reporte->id));

        $response->assertSessionHasNoErrors();
        $response->assertRedirect();
        
        $this->assertDatabaseMissing('reportes', [
            'id' => $reporte->id
        ]);
    }

    /**
     * Test that regular users cannot update or delete reports.
     */
    public function test_regular_user_cannot_update_or_delete_reporte(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        
        $reporte = Reporte::create([
            'tipo' => 'ERROR_DATOS',
            'descripcion' => 'Descripción de prueba para reporte',
            'email_remitente' => 'test@example.com',
            'estado' => 'PENDIENTE'
        ]);

        // Attempt update
        $response = $this->actingAs($user)->patch(route('administrativos.reportes.update', $reporte->id), [
            'estado' => 'PROCESADO'
        ]);
        $response->assertStatus(403);

        // Attempt delete
        $response = $this->actingAs($user)->delete(route('administrativos.reportes.destroy', $reporte->id));
        $response->assertStatus(403);
    }
}

