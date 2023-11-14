<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TokenValidationController extends Controller
{
    public function validateToken(Request $request)
    {
        try {
            $isValid = true;

            return response()->json(['isValid' => $isValid]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token validation failed'], 500);
        }
    }
}
