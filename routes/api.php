<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PersonenController;

use App\Http\Controllers\LoginController;
use App\Http\Controllers\PatientQrCodeController;
use App\Http\Controllers\QRLoginController;
use App\Http\Controllers\TokenValidationController;
use App\Http\Controllers\UserController;
use Tymon\JWTAuth\Validators\TokenValidator;
use App\Http\Controllers\BodyPartController;


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
  Route::get('/getUnusedPatientQrCodes', [PatientQrCodeController::class, 'getAllUnusedQrCodes']);
  Route::get('/getLoginQrCodes', [QRLoginController::class, 'getLoginQrCodes']);
  Route::post('/validate-token', [TokenValidationController::class, 'validateToken']);
  Route::post('/generateQRCodes', [PatientQrCodeController::class, 'generateQRCodeForPatients']);
  Route::post('/createAdminUser', [UserController::class, 'createNewAdminUser']);
  Route::post('/changeAdminPassword', [UserController::class, 'changeAdminPassword']);
  Route::put('/save-body-part', [BodyPartController::class, 'saveBodyPart']);
  Route::get('/get-body-parts', [BodyPartController::class, 'getBodyParts']);
});



//POST-Routes

Route::post('/persons/{person}/update-triage-color', [PersonenController::class, 'update']);
//Route::post('/persons/{id}/update-triage-color', 'PersonenController@update');
Route::post('/qr-login', [LoginController::class, 'qrLogin']);
Route::post('/verify-patient-qr-code', [PersonenController::class, 'verifyPatientQrCode']);
Route::post('/adminLogin', [LoginController::class, 'adminLogin']);


//Get-Routes

//Route::get('/persons', [PersonenController::class, 'index']);
Route::get('/test-db', [PersonenController::class, 'testDatabaseConnection']);
