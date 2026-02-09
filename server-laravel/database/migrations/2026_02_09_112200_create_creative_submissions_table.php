<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('creative_submissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('request_id')->nullable();
            $table->string('title', 190);
            $table->unsignedBigInteger('submitted_by')->nullable();
            $table->text('submission_url')->nullable();
            $table->text('notes')->nullable();
            $table->string('status', 40)->default('pending_review');
            $table->timestamps();

            $table->index('request_id');
            $table->index('submitted_by');
            $table->foreign('request_id')->references('id')->on('creative_requests')->onDelete('set null');
            $table->foreign('submitted_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('creative_submissions');
    }
};
