<?php

namespace App\Http\Controllers;

use App\Models\ScanDetail;
use App\Http\Requests\StoreScanDetailsRequest;
use App\Http\Requests\UpdateScanDetailsRequest;

class ScanDetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreScanDetailsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ScanDetail $scanDetails)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScanDetail $scanDetails)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateScanDetailsRequest $request, ScanDetail $scanDetails)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScanDetail $scanDetails)
    {
        //
    }
}
