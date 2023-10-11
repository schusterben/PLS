<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Http\Request;

class LocationController extends Controller
{

    public function locateUserView(Request $request)
    {
                $title = 'Welcome to Laravel!!';

        return view('pages.user')-> with('title', $title);
    }

    public function locateUser(Request $request)
    {

        $data = json_decode($request->getContent());

       //$data = $request->input('latitude') + "\n" + $request->input('longitude');
       $filePath = storage_path('app/myfile.txt');
       file_put_contents($filePath, $data->latitude);
      

        // Validate and store the coordinates in the user's record
      //  $user = auth()->user(); // You can modify this based on your authentication setup
//$user->latitude = $request->input('latitude');
   //     $user->longitude = $request->input('longitude');
        
        return response()->json(['message' => 'Coordinates stored successfully']);
    }
}
