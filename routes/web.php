<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [\App\Http\Controllers\PagesController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('users', [\App\Http\Controllers\PagesController::class, 'users'])->name('users');
    Route::post('users', [\App\Http\Controllers\UserController::class, 'store'])->name('store-user');
    Route::put('/users/{user}/edit', [\App\Http\Controllers\UserController::class, 'update'])->name('update-user');
    Route::delete('/users/{user}/delete', [\App\Http\Controllers\UserController::class, 'destroy'])->name('delete-user');

    Route::get('patients', [\App\Http\Controllers\PagesController::class, 'patients'])->name('patients');
    Route::post('/patients', [\App\Http\Controllers\PatientController::class, 'store'])->name('store-patient');
    Route::put('/patients/{patient}/edit', [\App\Http\Controllers\PatientController::class, 'update'])->name('update-patient');
    Route::delete('/patients/{patient}/delete', [\App\Http\Controllers\PatientController::class, 'destroy'])->name('delete-patient');

    Route::post('add-service/{patient}', [\App\Http\Controllers\ServiceController::class, 'store'])->name('store-service');
    Route::put('update-services', [\App\Http\Controllers\ServiceController::class, 'updateMultiple'])->name('update-service');
});


require __DIR__.'/auth.php';
