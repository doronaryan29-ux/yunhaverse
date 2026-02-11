# YUNHAverse Deployment (Render + Vercel)

This project should be deployed as:
- `server-laravel` -> Render Web Service (PHP/Laravel API)
- root frontend (`yunhaverse`) -> Vercel (React + Vite static site)

## 1. Pre-deploy checks (local)

Run from `yunhaverse`:

```bash
npm run build
```

Run from `yunhaverse/server-laravel`:

```bash
php artisan route:list
php artisan config:clear
php artisan cache:clear
```

## 2. Backend deploy on Render

Create a new **Web Service** from your repo with:

- Root Directory: `server-laravel`
- Environment: `PHP`
- Build Command:

```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

- Start Command:

```bash
php artisan migrate --force && php artisan serve --host 0.0.0.0 --port $PORT
```

Set Render environment variables (example keys):

- `APP_NAME=YUNHAverse`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://<your-render-service>.onrender.com`
- `DB_CONNECTION=mysql`
- `DB_HOST=<render-mysql-host>`
- `DB_PORT=3306`
- `DB_DATABASE=<db-name>`
- `DB_USERNAME=<db-user>`
- `DB_PASSWORD=<db-password>`
- `SESSION_DRIVER=file`
- `CACHE_STORE=file`
- `QUEUE_CONNECTION=sync`
- `CLIENT_ORIGIN=https://<your-vercel-domain>`
- `MAIL_MAILER=smtp`
- `MAIL_HOST=<smtp-host>`
- `MAIL_PORT=<smtp-port>`
- `MAIL_USERNAME=<smtp-user>`
- `MAIL_PASSWORD=<smtp-password>`
- `MAIL_FROM_ADDRESS=<from-email>`
- `MAIL_FROM_NAME=YUNHAverse`
- `MAIL_ENCRYPTION=tls`
- `GOOGLE_CLIENT_ID=<google-client-id>`
- `GOOGLE_CLIENT_SECRET=<google-client-secret>`
- `GOOGLE_REDIRECT_URI=https://<your-render-service>.onrender.com/auth/google/callback`
- `ADMIN_EMAIL=<initial-admin-email>`
- `ADMIN_PASSWORD=<strong-admin-password>`
- `ADMIN_FIRST_NAME=Admin`
- `ADMIN_LAST_NAME=User`

Also set a secure `APP_KEY`:

```bash
php artisan key:generate --show
```

Paste the generated value into `APP_KEY` in Render.

## 3. Frontend deploy on Vercel

Import the same repo in Vercel with:

- Root Directory: `yunhaverse`
- Build Command: `npm run build`
- Output Directory: `dist`

Set environment variables in Vercel:

- `VITE_API_BASE=https://<your-render-service>.onrender.com`
- `VITE_GOOGLE_CLIENT_ID=<google-client-id>`

If needed, override events endpoint:
- `VITE_EVENTS_API_URL=https://<your-render-service>.onrender.com/events`

## 4. Post-deploy verification

Check these URLs:

- Render health: `https://<your-render-service>.onrender.com/health`
- Public settings: `https://<your-render-service>.onrender.com/settings`
- Public events: `https://<your-render-service>.onrender.com/events`

Then test in Vercel:

- Login flow
- Home calendar events load
- Admin pages (settings, events, workflow)

## 5. Important security note

If any real credentials were ever committed in `.env`, rotate them now:
- DB password
- SMTP password
- Google OAuth secret
- admin bootstrap password

