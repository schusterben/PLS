<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonenController;

use App\Http\Controllers\QRLoginController;

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


//POST-Routes

Route::post('/persons/{person}/update-triage-color', [PersonenController::class, 'update']);
//Route::post('/persons/{id}/update-triage-color', 'PersonenController@update');
Route::post('/qr-login', [QRLoginController::class,'qrLogin']);
Route::post('/verify-patient-qr-code',[PersonenController::class, 'verifyPatientQrCode']);


//Get-Routes

Route::get('/persons', [PersonenController::class, 'index']);
Route::get('/test-db', [PersonenController::class, 'testDatabaseConnection']);


