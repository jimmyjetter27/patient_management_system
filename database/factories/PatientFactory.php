<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'age' => $this->faker->numberBetween(18, 80),
            'hospital_id' => $this->faker->regexify('[A-Z0-9]{10}'),
            'date_of_scan' => $this->faker->date(),
            'gestational_age' => $this->faker->numberBetween(0, 40),
            'parity_gravidity' => $this->faker->randomElement(['P1G1', 'P2G1', 'P3G2']),
            'referring_physician' => $this->faker->name(),
        ];
    }
}
