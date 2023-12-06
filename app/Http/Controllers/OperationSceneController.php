<?php

namespace App\Http\Controllers;

use App\Models\OperationScene;
use Illuminate\Http\Request;
use Carbon\Carbon;

class OperationSceneController extends Controller
{
    public function createOperationScene(Request $request)
    {

        $request->validate([
            'name' => 'required|string',

        ]);

        $id = $request->input('id');
        $name = $request->input('name');
        $description = $request->input('description');




        $operationScene = $id ? OperationScene::find($id) : new OperationScene();

        if ($id) {
            $operationScene->name = $name;
            $operationScene->description = $description;
            $operationScene->save();
        } else {
            $operationScene->name = $name;
            $operationScene->description = $description;
            $operationScene->save();
        }




        return
            response()->json(['status' => 'success', 'operactionScene' => $operationScene]);
    }

    public function getAllCurrentOperationScenes()
    {


        $twentyDaysAgo = Carbon::now()->subDays(20);

        $operationScenes = OperationScene::where('updated_at', '>=', $twentyDaysAgo)->get()->toArray();
        return response()->json($operationScenes);
    }
}
