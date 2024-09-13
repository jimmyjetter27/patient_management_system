<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
//            'type' => Str::headline(Str::after($this->type, "App\Models\\")),
            'type' => $this->type,
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-D'),
            'updated_at' => Carbon::parse($this->updated_at)->format('Y-m-D'),
        ];
    }
}
