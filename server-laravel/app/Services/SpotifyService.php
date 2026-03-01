<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class SpotifyService
{
    public function getAccessToken(): string
    {
        return Cache::remember('spotify_token', 3500, function () {
            $clientId = (string) config('services.spotify.client_id', '');
            $clientSecret = (string) config('services.spotify.client_secret', '');

            if ($clientId === '' || $clientSecret === '') {
                throw new \RuntimeException('Spotify client credentials are missing');
            }

            $basicAuth = base64_encode("{$clientId}:{$clientSecret}");
            $response = Http::withHeaders([
                'Authorization' => "Basic {$basicAuth}",
                'Content-Type' => 'application/x-www-form-urlencoded',
            ])->asForm()->post('https://accounts.spotify.com/api/token', [
                'grant_type' => 'client_credentials',
            ]);

            if (!$response->ok()) {
                throw new \RuntimeException('Unable to fetch Spotify access token');
            }

            $token = (string) $response->json('access_token', '');
            if ($token === '') {
                throw new \RuntimeException('Spotify token not found in response');
            }

            return $token;
        });
    }

    public function getFeaturedTrack(): array
    {
        $trackId = $this->normalizeSpotifyId((string) config('services.spotify.featured_track_id', ''), 'track');
        if ($trackId === '') {
            throw new \RuntimeException('FEATURED_TRACK_ID is missing');
        }

        $token = $this->getAccessToken();
        $response = Http::withToken($token)->acceptJson()->get("https://api.spotify.com/v1/tracks/{$trackId}");

        if (!$response->ok()) {
            throw new \RuntimeException('Unable to fetch featured Spotify track');
        }

        $item = $response->json();
        $id = (string) ($item['id'] ?? $trackId);
        $artist = (string) ($item['artists'][0]['name'] ?? '');
        $albumCover = (string) ($item['album']['images'][0]['url'] ?? '');

        return [
            'trackId' => $id,
            'title' => (string) ($item['name'] ?? ''),
            'artist' => $artist,
            'albumCover' => $albumCover,
            'spotifyUrl' => (string) ($item['external_urls']['spotify'] ?? ''),
            'embedUrl' => "https://open.spotify.com/embed/track/{$id}?utm_source=generator&theme=0",
        ];
    }

    public function getArtistTracks(): array
    {
        $artistId = $this->normalizeSpotifyId((string) config('services.spotify.artist_id', ''), 'artist');
        if ($artistId === '') {
            throw new \RuntimeException('UNIS_ARTIST_ID is missing');
        }

        $token = $this->getAccessToken();
        $albums = [];
        $offset = 0;
        $pageLimit = 20; // Spotify artist albums endpoint max limit is 20.

        while (count($albums) < 50) {
            $albumsResponse = Http::withToken($token)->acceptJson()->get("https://api.spotify.com/v1/artists/{$artistId}/albums", [
                'include_groups' => 'single,album',
                'market' => 'PH',
                'limit' => $pageLimit,
                'offset' => $offset,
            ]);

            if (!$albumsResponse->ok()) {
                throw new \RuntimeException(sprintf(
                    'Unable to fetch artist albums (status %s): %s',
                    (string) $albumsResponse->status(),
                    substr((string) $albumsResponse->body(), 0, 300)
                ));
            }

            $items = $albumsResponse->json('items', []);
            if (!is_array($items) || $items === []) {
                break;
            }

            $albums = array_merge($albums, $items);
            $offset += $pageLimit;

            if (count($items) < $pageLimit) {
                break;
            }
        }

        $albums = array_slice($albums, 0, 50);
        $tracks = [];
        $seen = [];

        foreach ($albums as $album) {
            $albumId = (string) ($album['id'] ?? '');
            if ($albumId === '') {
                continue;
            }

            $albumTracks = Cache::remember("album_{$albumId}", 86400, function () use ($token, $albumId) {
                $response = Http::withToken($token)->acceptJson()->get("https://api.spotify.com/v1/albums/{$albumId}/tracks", [
                    'market' => 'PH',
                    'limit' => 50,
                ]);

                if (!$response->ok()) {
                    return [];
                }

                return $response->json('items', []);
            });

            $albumName = (string) ($album['name'] ?? '');
            $albumCover = (string) ($album['images'][0]['url'] ?? '');
            $releaseDate = (string) ($album['release_date'] ?? '');

            foreach ($albumTracks as $item) {
                $trackId = (string) ($item['id'] ?? '');
                if ($trackId === '' || isset($seen[$trackId])) {
                    continue;
                }

                $seen[$trackId] = true;
                $artist = (string) ($item['artists'][0]['name'] ?? ($album['artists'][0]['name'] ?? ''));

                $tracks[] = [
                    'trackId' => $trackId,
                    'title' => (string) ($item['name'] ?? ''),
                    'artist' => $artist,
                    'albumName' => $albumName,
                    'albumCover' => $albumCover,
                    'spotifyUrl' => (string) ($item['external_urls']['spotify'] ?? ''),
                    'embedUrl' => "https://open.spotify.com/embed/track/{$trackId}?utm_source=generator&theme=0",
                    'releaseDate' => $releaseDate,
                ];
            }
        }

        usort($tracks, fn ($a, $b) => strcmp((string) ($b['releaseDate'] ?? ''), (string) ($a['releaseDate'] ?? '')));

        return $tracks;
    }

    private function normalizeSpotifyId(string $raw, string $type): string
    {
        $value = trim($raw);
        if ($value === '') {
            return '';
        }

        $withoutQuery = strtok($value, '?');
        $trimmed = rtrim((string) $withoutQuery, '/');
        $parts = explode('/', $trimmed);
        $typeIndex = array_search($type, $parts, true);

        if ($typeIndex !== false && isset($parts[$typeIndex + 1])) {
            return (string) $parts[$typeIndex + 1];
        }

        return str_contains($trimmed, '/') ? '' : $trimmed;
    }
}
