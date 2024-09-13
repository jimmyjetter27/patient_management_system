<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PagesController extends Controller
{
    public function dashboard()
    {
        $totalUsers = User::count();
        $totalPatients = Patient::count();

        return Inertia::render('Dashboard', [
            'totalUsers' => $totalUsers,
            'totalPatients' => $totalPatients,
        ]);
    }

    public function users(): \Inertia\Response
    {
        return Inertia::render('Users/Users');
    }

    public function patients(): \Inertia\Response
    {
//        return Inertia::render('Patients/Test');
        return Inertia::render('Patients/Patients');
    }
}
