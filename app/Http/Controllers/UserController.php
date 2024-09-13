<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
//        dd('hello there!');
        $users = QueryBuilder::for(User::class)
            ->allowedFilters(['name'])
            ->allowedSorts(['name', 'email'])
            ->where('id', '!=', $request->user()->id)
            ->latest()
            ->paginate($request->per_page ?? 15);
        return UserResource::collection($users);
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
    public function store(StoreUserRequest $request)
    {
        try {
            User::query()->create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'type' => $request->type,
                'added_by' => $request->user()->id
            ]);

            return redirect()->back()->with(['success_message' => 'User created']);
        } catch (\Exception $e) {
            Log::debug('UserCreationError: ' . $e->getMessage());
            return redirect()->back()->with(['error_message' => 'User could not be created']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->update($request->all());

            return redirect()->back()->with('success_message', 'User updated successfully.');
        } catch (\Exception $e)
        {
            Log::debug('UpdateUserError: '.$e->getMessage());
            return redirect()->back()->with(['error_message' => 'An error occurred']);
        }

    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {

        try {

            $user = User::where('id', $id)->first();
            if ($user) {
                $user->delete();
                return redirect()->back()->with(['success_message' => 'Account deleted']);

            }
            return redirect()->back()->with(['error_message' => 'User account not found']);
        } catch (\Exception $e) {
            return redirect()->back()->with(['error_message' => 'An error occurred']);
        }
    }
}
