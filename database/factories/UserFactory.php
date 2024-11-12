<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * Diese Factory-Klasse generiert Dummy-Daten für das User-Modell.
 * Sie wird verwendet, um Testdatensätze für die `user`-Tabelle
 * zu erstellen, ohne manuelle Dateneingaben.
 */
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
     /**
     * Standarddefinition für die Erstellung eines Benutzerdatensatzes.
     * Hier werden zufällige Werte für die Felder `name`, `email`,
     * `email_verified_at`, `password` und `remember_token` generiert.
     */
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(), // Generiert einen zufälligen Namen
            'email' => fake()->unique()->safeEmail(), // Generiert eine eindeutige E-Mail
            'email_verified_at' => now(), // Setzt das Verifizierungsdatum auf die aktuelle Zeit
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => Str::random(10),
        ];
    }

     /**
     * Zustand für unbestätigte E-Mail-Adressen.
     * Wird verwendet, wenn ein Benutzer mit nicht bestätigter E-Mail generiert werden soll.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
