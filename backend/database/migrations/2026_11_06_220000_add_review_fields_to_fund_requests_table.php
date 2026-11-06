<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fund_requests', function (Blueprint $table) {
            $table->string('reviewer_name')->nullable()->after('approval_note');
            $table->string('finance_approver_name')->nullable()->after('reviewer_name');
            $table->string('pm_approver_name')->nullable()->after('finance_approver_name');
            $table->timestamp('reviewed_at')->nullable()->after('pm_approver_name');
        });
    }

    public function down(): void
    {
        Schema::table('fund_requests', function (Blueprint $table) {
            $table->dropColumn([
                'reviewer_name',
                'finance_approver_name',
                'pm_approver_name',
                'reviewed_at'
            ]);
        });
    }
};
