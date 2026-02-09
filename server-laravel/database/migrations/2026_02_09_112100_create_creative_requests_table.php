<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creative_requests', function (Blueprint $table) {
            $table->id();
            $table->string('title', 190);
            $table->text('description')->nullable();
            $table->unsignedBigInteger('requested_by')->nullable();
            $table->unsignedBigInteger('assigned_to')->nullable();
            $table->string('status', 40)->default('open');
            $table->string('priority', 20)->default('medium');
            $table->dateTime('due_at')->nullable();
            $table->timestamps();

            $table->index('requested_by');
            $table->index('assigned_to');
            $table->foreign('requested_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('assigned_to')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creative_requests');
    }
};
