<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creative_request_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('request_id');
            $table->string('action', 60);
            $table->string('from_stage', 40)->nullable();
            $table->string('to_stage', 40)->nullable();
            $table->unsignedBigInteger('from_assigned_to')->nullable();
            $table->unsignedBigInteger('to_assigned_to')->nullable();
            $table->string('from_status', 40)->nullable();
            $table->string('to_status', 40)->nullable();
            $table->unsignedBigInteger('actor_user_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('request_id');
            $table->index('actor_user_id');
            $table->foreign('request_id')->references('id')->on('creative_requests')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creative_request_histories');
    }
};
