<?php

namespace Database\Seeders;

use App\Models\RegularUser;
use App\Models\SuperAdmin;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SuperAdmin::create([
            'name' => 'James Atiah',
            'email' => 'jimmyjetter27@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        SuperAdmin::create([
            'name' => 'Abu',
            'email' => 'abu@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);
        SuperAdmin::factory()->count(1)->create();
        RegularUser::factory()->count(3)->create();
    }
}
