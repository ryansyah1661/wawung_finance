<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Outcomes (Sasaran / Hasil)
        Schema::create('project_outcomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->constrained('categories')->onDelete('cascade');
            $table->string('code')->nullable(); // e.g. OC-1, Outcome 1
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('order_num')->default(0);
            $table->timestamps();
        });

        // 2. Outputs (Keluaran)
        Schema::create('project_outputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outcome_id')->constrained('project_outcomes')->onDelete('cascade');
            $table->string('code')->nullable(); // e.g. Output 1, OP-1.1
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('order_num')->default(0);
            $table->timestamps();
        });

        // 3. Activities (Aktivitas / Kegiatan)
        Schema::create('project_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('output_id')->constrained('project_outputs')->onDelete('cascade');
            $table->string('code')->nullable(); // e.g. 1.1, 2.1, 3.1
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('order_num')->default(0);
            $table->timestamps();
        });

        // 4. Activity Components (Komponen Pembiayaan / Item RAB)
        Schema::create('activity_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('project_activities')->onDelete('cascade');
            $table->string('code')->nullable(); // e.g. a, b, 1, 2
            $table->string('name'); // e.g. Tim Leader, Expert Sosial, Alat & Bahan
            $table->string('group_name')->nullable(); // e.g. Sub-grup kegiatan
            $table->decimal('qty', 10, 2)->default(1);
            $table->string('unit')->default('Orang'); // Orang, Paket, Unit, ha
            $table->decimal('freq', 10, 2)->default(1);
            $table->string('freq_unit')->default('Kali'); // Bulan, Hari, Kali, Paket, PP
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('total_budget', 15, 2)->default(0); // qty * freq * unit_price
            $table->text('description')->nullable(); // catatan personel / teknis
            $table->integer('order_num')->default(0);
            $table->timestamps();
        });

        // 5. Tambahkan kolom relasi ke fund_requests untuk melacak pengajuan spesifik per aktivitas
        Schema::table('fund_requests', function (Blueprint $table) {
            $table->foreignId('outcome_id')->nullable()->constrained('project_outcomes')->nullOnDelete();
            $table->foreignId('output_id')->nullable()->constrained('project_outputs')->nullOnDelete();
            $table->foreignId('activity_id')->nullable()->constrained('project_activities')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('fund_requests', function (Blueprint $table) {
            $table->dropForeign(['outcome_id']);
            $table->dropForeign(['output_id']);
            $table->dropForeign(['activity_id']);
            $table->dropColumn(['outcome_id', 'output_id', 'activity_id']);
        });

        Schema::dropIfExists('activity_components');
        Schema::dropIfExists('project_activities');
        Schema::dropIfExists('project_outputs');
        Schema::dropIfExists('project_outcomes');
    }
};
