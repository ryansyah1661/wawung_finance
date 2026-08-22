<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('reimbursements', function (Blueprint $table) {
        $table->id();
        $table->string('request_id')->unique(); // contoh: RB-2023-001
        $table->string('user_name');
        $table->date('date');
        $table->decimal('amount', 15, 2);
        $table->string('status')->default('Pending'); // Pending, Approved, Rejected
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('reimbursements');
    }
};
