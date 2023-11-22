<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function createNewAdminUser(Request $request)
    {


        $validatedData = $request->validate([
            'username' => 'required|string|max:255',
            'password' => 'required|string|min:6',
        ]);

        $userExists = User::where('username', $validatedData['username'])->exists();
        // Benutzer erstellen
        if (!$userExists) {
            $user = User::create([
                'username' => $validatedData['username'],
                'password' => Hash::Make($validatedData['password']),
                'adminRole' => true,
            ]);

            return response()->json(['message' => 'Benutzer erfolgreich erstellt', 'user' => $user]);
        } else {
            return response()->json(['error' => 'User wurde nicht angelegt'], 500);
        }
    }
}
