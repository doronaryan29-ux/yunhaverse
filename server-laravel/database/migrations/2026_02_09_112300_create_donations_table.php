<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('name', 190)->nullable();
            $table->string('email', 255)->nullable();
            $table->decimal('amount', 12, 2);
            $table->char('currency', 3)->default('PHP');
            $table->string('channel', 60)->nullable();
            $table->string('status', 40)->default('completed');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
