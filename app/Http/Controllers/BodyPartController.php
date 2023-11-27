<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BodyPartController extends Controller
{
    public function saveBodyPart(Request $request)
{
    try {
        // Validate the request data if needed

        $bodyPartId = $request->input('bodyPartId');
        $isClicked = $request->input('isClicked');
        $idpatient = $request->input('idpatient');

        // Update the 'body' table based on the body part ID, patient ID, and click status
        DB::table('body')
            ->where('idpatient', $idpatient)
            ->update([$bodyPartId => $isClicked]);

        // You can add more logic or error handling here if needed

        return response()->json(['message' => 'Body part saved successfully']);
    } catch (\Exception $e) {
        // Handle exceptions or errors
        return response()->json(['error' => 'Error saving body part'], 500);
    }
}

public function getBodyParts(Request $request)
{
    try {
        $idpatient = $request->input('idpatient');

        // Retrieve body parts for the patient ID from the 'body' table
        $bodyParts = DB::table('body')
            ->where('idpatient', $idpatient)
            ->first();

        return response()->json($bodyParts);
    } catch (\Exception $e) {
        // Handle exceptions or errors
        return response()->json(['error' => 'Error fetching body parts'], 500);
    }
}


}