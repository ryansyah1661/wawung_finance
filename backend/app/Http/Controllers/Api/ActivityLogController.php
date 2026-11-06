<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::query();

        if ($request->filled('action') && $request->action !== 'all') {
            $query->where('action', $request->action);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('user_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($logs);
    }

    // Helper static function untuk mencatat log otomatis dari controller lain
    public static function log($action, $description)
    {
        try {
            $allowedActions = ['create', 'update', 'approve', 'reject', 'delete', 'login'];
            $safeAction = in_array($action, $allowedActions) ? $action : 'update';

            ActivityLog::create([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()?->name ?? 'System',
                'action' => $safeAction,
                'description' => $description,
                'ip_address' => request()->ip(),
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("ActivityLog failed: " . $e->getMessage());
        }
    }
}