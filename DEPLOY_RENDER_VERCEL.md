# Deploy Guide: Laravel on Render + React on Vercel

This project is split:
- Frontend: React/Vite (`yunhaverse/`)
- Backend: Laravel API (`yunhaverse/server-laravel`)

Use Render for backend and Vercel for frontend.

## 1) Deploy Laravel API on Render

1. Push your repo to GitHub.
2. In Render dashboard, click `New +` -> `Web Service`.
3. Select your repo.
4. Configure service:
   - `Root Directory`: `server-laravel`
   - `Environment`: `PHP`
   - `Build Command`: `composer install --no-dev --optimize-autoloader`
   - `Start Command`: `php artisan serve --host 0.0.0.0 --port $PORT`

5. Add a Render PostgreSQL database (recommended on Render).
6. Set backend environment variables in Render:

```env
APP_NAME=Laravel
APP_ENV=production
APP_DEBUG=false
APP_URL=https://<your-render-api-domain>
APP_KEY=<generate-with-php-artisan-key-generate-show>

DB_CONNECTION=pgsql
DB_HOST=<render-postgres-host>
DB_PORT=5432
DB_DATABASE=<render-postgres-database>
DB_USERNAME=<render-postgres-user>
DB_PASSWORD=<render-postgres-password>
DB_SSLMODE=require

CLIENT_ORIGIN=https://<your-vercel-frontend-domain>
GOOGLE_REDIRECT_URI=https://<your-render-api-domain>/auth/google/callback

MAIL_MAILER=smtp
MAIL_HOST=<your-smtp-host>
MAIL_PORT=<your-smtp-port>
MAIL_USERNAME=<your-smtp-user>
MAIL_PASSWORD=<your-smtp-pass>
MAIL_FROM_ADDRESS=<your-from-email>
MAIL_FROM_NAME="YUNHAverse"
MAIL_ENCRYPTION=tls

OTP_TTL_MINUTES=10
OTP_COOLDOWN_SECONDS=60
OTP_MAX_ATTEMPTS=5

ADMIN_EMAIL=<admin-email>
ADMIN_PASSWORD=<admin-password>
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User
```

7. After first deploy, run migrations on Render shell:

```bash
php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder --force
```

8. Confirm backend health:
- `https://<your-render-api-domain>/health` should return `{ "ok": true }`.

## 2) Configure Google OAuth

In Google Cloud Console (OAuth client):
- Authorized JavaScript origins:
  - `https://<your-vercel-frontend-domain>`
- Authorized redirect URIs:
  - `https://<your-render-api-domain>/auth/google/callback`

## 3) Configure Frontend on Vercel

In Vercel project -> `Settings` -> `Environment Variables`, add:

```env
VITE_API_BASE=https://<your-render-api-domain>
VITE_GOOGLE_CLIENT_ID=<google-client-id>.apps.googleusercontent.com
```

Optional:

```env
VITE_EVENTS_API_URL=https://<your-render-api-domain>/events/api_events.php
```

Set each variable for `Production`, `Preview`, and `Development`.

Redeploy the Vercel project after adding env vars.

## 4) Final checks

1. Open frontend URL.
2. Login as admin and creative/copywriter/sns users.
3. Verify no `Failed to fetch` in browser console.
4. Verify redirects are to your deployed domains (not `localhost` / `127.0.0.1`).

## 5) Common failure causes

- Missing `VITE_API_BASE` in Vercel.
- `CLIENT_ORIGIN` still set to localhost in Render backend.
- Google OAuth redirect URI mismatched.
- DB vars missing/wrong, so backend errors on login endpoints.

