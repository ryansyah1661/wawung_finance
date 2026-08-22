<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::create('transactions', function (Blueprint $table) {
        $table->id();
        $table->date('date');
        $table->string('description');
        $table->string('category'); // Operations, IT & Tech, dll
        $table->string('account');  // BCA Utama, Kas Kecil, dll
        $table->string('type');     // Income / Expense
        $table->decimal('amount', 15, 2); // Jumlah uang
        $table->string('status')->default('Verified'); // Verified / Pending
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
