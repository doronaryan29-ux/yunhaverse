<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SpotifyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class SpotifyController extends Controller
{
    public function __construct(private readonly SpotifyService $spotifyService)
    {
    }

    public function featuredTrack(): JsonResponse
    {
        try {
            return response()->json($this->spotifyService->getFeaturedTrack());
        } catch (\Throwable $e) {
            Log::error('Spotify featuredTrack failed', ['message' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to fetch featured track'], 500);
        }
    }

    public function tracks(): JsonResponse
    {
        try {
            return response()->json($this->spotifyService->getArtistTracks());
        } catch (\Throwable $e) {
            Log::error('Spotify tracks failed', ['message' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to fetch Spotify tracks',
                'error' => app()->isLocal() ? $e->getMessage() : null,
            ], 500);
        }
    }
}
