<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('fund_requests', function (Blueprint $table) {
        $table->id();
        $table->string('request_number')->unique(); // contoh: PD-2023-10-001
        $table->date('need_date');
        $table->string('applicant_name');
        $table->string('department');
        $table->text('purpose');
        $table->decimal('amount', 15, 2);
        $table->string('attachment')->nullable(); // path file nota/lampiran
        $table->string('status')->default('Pending'); // Pending, Approved, Rejected
        $table->text('approval_note')->nullable();
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('fund_requests');
    }
};
