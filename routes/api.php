<?php

use App\Http\Controllers\ApiProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SummaryController;
use App\Http\Controllers\TransactionController;
use App\Models\Company;
use App\Models\User;

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

Route::middleware([\App\Http\Middleware\ForceJson::class])->group(function () {
//    Route::get('users', [UserController::class, 'index']);
    // Protected Routes
//    Route::middleware("auth:sanctum")->group(function () {
//    Route::middleware("auth")->group(function () {
//    Route::middleware([\App\Http\Middleware\AuthenticateAny::class])->group(function () {

//    Route::middleware([\App\Http\Middleware\AuthenticateAny::class])->group(function () {
    Route::middleware('web')->group(function () {
        Route::get('users', [UserController::class, 'index']);
        Route::get('patients', [\App\Http\Controllers\PatientController::class, 'index']);
        Route::get('patient-services/{patient}', [\App\Http\Controllers\ServiceController::class, 'patientServices'])->name('patient-services');

    });

});
