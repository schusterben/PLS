<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


/**
 * Der UserController verwaltet benutzerbezogene Operationen,
 * einschließlich der Erstellung neuer Admin-Benutzer und des Änderns von Passwörtern.
 */
class UserController extends Controller
{
    /**
     * Erstellt einen neuen Admin-Benutzer.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse JSON-Antwort, die den Erfolg oder Fehler der Benutzererstellung anzeigt
     */
    public function createNewAdminUser(Request $request)
    {

        // Validiert die eingehenden Daten (Username und Passwort sind erforderlich)
        $validatedData = $request->validate([
            'username' => 'required|string|max:255',// Der Benutzername darf maximal 255 Zeichen lang sein
            'password' => 'required|string|min:6', // Das Passwort muss mindestens 6 Zeichen lang sein
        ]);

        // Check if a user with the same username already exists
        $userExists = User::where('username', $validatedData['username'])->exists();

        // Create a new user if it doesn't already exist
        if (!$userExists) {
            $user = User::create([
                'username' => $validatedData['username'],
                'password' => Hash::Make($validatedData['password']),
                'adminRole' => true,
            ]);

            // Return a JSON response indicating the successful user creation
            return response()->json(['message' => 'Benutzer erfolgreich erstellt', 'user' => $user]);
        } else {
            // Return an error response if the user already exists
            return response()->json(['error' => 'User wurde nicht angelegt'], 500);
        }
    }

    /**
     * Ändert das Passwort eines Admin-Benutzers.
     *
     * @param Request $request HTTP-Anfrage mit aktuellem Passwort, neuem Passwort und Benutzername
     * @return \Illuminate\Http\JsonResponse JSON-Antwort, die den Erfolg oder Fehler der Passwortaktualisierung anzeigt
     */
    public function changeAdminPassword(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'username' => 'required|string|max:255',
            'password' => 'required|string',
            'newpassword' => 'required|string|min:6',
        ]);

        // Find the user with the specified username
        $user = User::where('username', $validatedData['username'])->first();

        // Check if the user exists
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Check if the provided password matches the user's current password

        if (Hash::check($validatedData['password'], $user->password)) {
            // Update the user's password with the new password
            $user->password = Hash::make($validatedData['newpassword']);
            $user->save();

            // Return a JSON response indicating the successful password update
            return response()->json(['message' => 'User updated successfully', 'user' => $user]);
        }
    }
}
