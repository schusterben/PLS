<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonenController;

use App\Http\Controllers\QRLoginController;
use App\Http\Controllers\TokenValidationController;
use Tymon\JWTAuth\Validators\TokenValidator;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['jwt'])->group(function () {
    // Your protected routes go here
  Route::get('/persons', [PersonenController::class, 'index']);
  Route::post('/validate-token', [TokenValidationController::class, 'validateToken']);

});



//POST-Routes

Route::post('/persons/{person}/update-triage-color', [PersonenController::class, 'update']);
//Route::post('/persons/{id}/update-triage-color', 'PersonenController@update');
Route::post('/qr-login', [QRLoginController::class,'qrLogin']);


//Get-Routes

//Route::get('/persons', [PersonenController::class, 'index']);
Route::get('/test-db', [PersonenController::class, 'testDatabaseConnection']);


