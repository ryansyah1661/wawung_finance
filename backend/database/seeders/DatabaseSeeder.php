<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        User::create([
            'name' => 'Superadmin',
            'email' => 'admin@wawung.com',
            'password' => $password,
            'role' => 'superadmin',
            'department' => 'Management',
        ]);

        User::create([
            'name' => 'Direktur Eksekutif',
            'email' => 'director@wawung.com',
            'password' => $password,
            'role' => 'director',
            'department' => 'Executive',
        ]);

        User::create([
            'name' => 'Finance Admin',
            'email' => 'finance@wawung.com',
            'password' => $password,
            'role' => 'finance',
            'department' => 'Finance',
        ]);

        User::create([
            'name' => 'Project Manager',
            'email' => 'pm@wawung.com',
            'password' => $password,
            'role' => 'pm',
            'department' => 'IT Project',
        ]);
    }
}
