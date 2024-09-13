<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cervical_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->onDelete('cascade');
            $table->integer('cervical_length');
            $table->string('internal_os_condition');
            $table->string('external_os_condition');
            $table->string('cervical_consistency');
            $table->boolean('presence_of_cervical_suture');
            $table->boolean('amniotic_fluid_membrane_protrusion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cervical_assessments');
    }
};
