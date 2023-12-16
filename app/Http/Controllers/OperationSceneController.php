<?php

namespace App\Http\Controllers;

use App\Models\OperationScene;
use Illuminate\Http\Request;
use Carbon\Carbon;


/**
 * The OperationSceneController class handles operations related to operation scenes.
 */
class OperationSceneController extends Controller
{

    /**
     * Create or update an operation scene.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createOperationScene(Request $request)
    {

        $request->validate([
            'name' => 'required|string',

        ]);

        $id = $request->input('id');
        $name = $request->input('name');
        $description = $request->input('description');



        // Check if an ID is provided to determine if it's an update or creation
        $operationScene = $id ? OperationScene::find($id) : new OperationScene();

        // Set the name and description for the operation scene
        $operationScene->name = $name;
        $operationScene->description = $description;

        // Save the operation scene to the database
        $operationScene->save();




        return
            response()->json(['status' => 'success', 'operactionScene' => $operationScene]);
    }


    /**
     * Get all current operation scenes updated within the last 20 days.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllCurrentOperationScenes()
    {

        // Calculate a date 20 days ago
        $twentyDaysAgo = Carbon::now()->subDays(20);

        // Query for operation scenes updated within the last 20 days
        $operationScenes = OperationScene::where('updated_at', '>=', $twentyDaysAgo)->get()->toArray();
        return response()->json($operationScenes);
    }
}
