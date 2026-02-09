<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->string('app_name')->default('YunhaVerse');
            $table->string('logo_url')->nullable();
            $table->string('homepage_headline')->nullable();
            $table->string('homepage_subheadline')->nullable();
            $table->string('primary_color', 20)->default('#0f172a');
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('app_settings');
    }
};
