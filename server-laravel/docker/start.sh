#!/usr/bin/env sh
set -eu

cd /var/www/html

if [ -z "${APP_KEY:-}" ]; then
  echo "APP_KEY is not set. Add APP_KEY in Render environment variables."
  exit 1
fi

php artisan config:clear
php artisan config:cache
php artisan view:cache
php artisan migrate --force
php artisan db:seed --force

exec php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
