<?php

use Inertia\Testing\AssertableInertia as Assert;

test('public map renders with inertia', function () {
    $response = $this->get('/mapa');
    
    $response->assertInertia(fn (Assert $page) => clone $page->component('Publico/MapaPublico'));
});
