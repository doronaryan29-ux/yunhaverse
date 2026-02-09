<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->dateTime('start_at');
            $table->dateTime('end_at')->nullable();
            $table->string('location', 255)->nullable();
            $table->string('timezone', 64)->default('Asia/Manila');
            $table->string('image_url', 500)->nullable();
            $table->string('link_url', 500)->nullable();
            $table->string('type', 40)->default('streaming');
            $table->string('status', 40)->default('published');
            $table->timestamps();

            $table->index('start_at');
            $table->index('title');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
