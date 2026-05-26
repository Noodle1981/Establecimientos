<?php

it('returns a successful response', function () {
    $response = $this->get('/mapa');

    $response->assertStatus(200);
});
