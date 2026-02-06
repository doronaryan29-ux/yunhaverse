<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DonationsController extends Controller
{
    private function ensureAdmin(Request $request)
    {
        $requesterRole = strtolower(trim((string) $request->input('requesterRole', $request->query('requesterRole', ''))));
        if ($requesterRole !== 'admin') {
            return response()->json(['message' => 'Admin access required.'], 403);
        }

        return null;
    }

    public function store(Request $request)
    {
        if (!Schema::hasTable('donations')) {
            return response()->json(['message' => 'donations table is missing.'], 500);
        }

        $validated = $request->validate([
            'userId' => ['nullable', 'integer'],
            'name' => ['nullable', 'string', 'max:190'],
            'email' => ['nullable', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:1'],
            'currency' => ['nullable', 'string', 'size:3'],
            'channel' => ['nullable', 'string', 'max:60'],
            'status' => ['nullable', 'string', 'max:40'],
            'notes' => ['nullable', 'string'],
        ]);

        $id = DB::table('donations')->insertGetId([
            'user_id' => $validated['userId'] ?? null,
            'name' => $validated['name'] ?? null,
            'email' => $validated['email'] ?? null,
            'amount' => $validated['amount'],
            'currency' => $validated['currency'] ?? 'PHP',
            'channel' => $validated['channel'] ?? null,
            'status' => $validated['status'] ?? 'completed',
            'notes' => $validated['notes'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Donation recorded.', 'id' => $id], 201);
    }

    public function storeAdmin(Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        return $this->store($request);
    }

    public function updateAdmin(int $id, Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('donations')) {
            return response()->json(['message' => 'donations table is missing.'], 500);
        }

        $validated = $request->validate([
            'userId' => ['nullable', 'integer'],
            'name' => ['nullable', 'string', 'max:190'],
            'email' => ['nullable', 'string', 'max:255'],
            'amount' => ['nullable', 'numeric', 'min:1'],
            'currency' => ['nullable', 'string', 'size:3'],
            'channel' => ['nullable', 'string', 'max:60'],
            'status' => ['nullable', 'string', 'max:40'],
            'notes' => ['nullable', 'string'],
        ]);

        $payload = [];
        $fieldMap = [
            'userId' => 'user_id',
            'name' => 'name',
            'email' => 'email',
            'amount' => 'amount',
            'currency' => 'currency',
            'channel' => 'channel',
            'status' => 'status',
            'notes' => 'notes',
        ];

        foreach ($fieldMap as $inputKey => $column) {
            if (array_key_exists($inputKey, $validated)) {
                $payload[$column] = $validated[$inputKey];
            }
        }

        if (empty($payload)) {
            return response()->json(['message' => 'No changes provided.'], 400);
        }

        $payload['updated_at'] = now();

        $updated = DB::table('donations')->where('id', $id)->update($payload);
        if (!$updated) {
            return response()->json(['message' => 'Donation not found.'], 404);
        }

        return response()->json(['message' => 'Donation updated.']);
    }

    public function deleteAdmin(int $id, Request $request)
    {
        $adminError = $this->ensureAdmin($request);
        if ($adminError) {
            return $adminError;
        }

        if (!Schema::hasTable('donations')) {
            return response()->json(['message' => 'donations table is missing.'], 500);
        }

        $deleted = DB::table('donations')->where('id', $id)->delete();
        if (!$deleted) {
            return response()->json(['message' => 'Donation not found.'], 404);
        }

        return response()->json(['message' => 'Donation deleted.']);
    }
}
