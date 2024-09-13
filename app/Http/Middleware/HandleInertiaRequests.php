<?php

namespace App\Http\Middleware;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = auth()->user();

        $users_permissions = $user ? [
            'view' => $user->can('viewAny', User::class),
            'create' => $user->can('create')
        ] : [];

        $patients_permissions = $user ? [
            'view' => $user->can('viewAny', Patient::class),
            'create' => $user->can('create', Patient::class),
            'update' => $user->can('update', Patient::class),
            'delete' => $user->can('delete', Patient::class),
            'printReport' => $user->can('printReport', Patient::class)
        ] : [];
//        Log::info('flash message: '. $request->session()->get('success_message'));
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success_message' => fn() => $request->session()->get('success_message'),
                'error_message' => fn() => $request->session()->get('error_message'),
            ],
            'users_permissions' => $users_permissions,
            'appUrl' => config('app.url')
        ];
    }
}
