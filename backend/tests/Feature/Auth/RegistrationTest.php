<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'company_name' => 'Test Company',
        'company_email' => 'company@example.com',
        'company_phone' => '1234567890',
        'company_address' => '123 Test St',
        'terms' => 'on',
    ]);

    $response->assertRedirect(route('dashboard', absolute: false));

    // Check if user and company are created
    $this->assertDatabaseHas('users', ['email' => 'test@example.com', 'role' => 'admin']);
    $this->assertDatabaseHas('companies', ['email' => 'company@example.com']);

    $this->assertAuthenticated();
});
