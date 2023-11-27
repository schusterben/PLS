<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Patient;
use App\Models\Body;


class BodyPartController extends Controller
{
    public function saveBodyPart(Request $request)
{
    try {
        // Validate the request data if needed

        $bodyPartId = $request->input('bodyPartId');
        $isClicked = $request->input('isClicked');
        $patientId = $request->input('patient_id');

        // Update the 'body' table based on the body part ID, patient ID, and click status
        DB::table('body')
            ->where('idpatient', $patientId)
            ->update([$bodyPartId => $isClicked]);

        // You can add more logic or error handling here if needed

        return response()->json(['message' => 'Body part saved successfully']);
    } catch (\Exception $e) {
        // Handle exceptions or errors
        return response()->json(['error' => 'Error saving body part'], 500);
    }
}



public function getBodyParts($id)
{
    $patient = Patient::findOrFail($id);

    $selectedBodyParts = $patient->body;

    return response()->json(['selectedBodyParts' => $selectedBodyParts]);
}




}
