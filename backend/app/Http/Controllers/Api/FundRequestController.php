<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Controller;
use App\Models\FundRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FundRequestController extends Controller
{
    public function index()
    {
        $requests = FundRequest::with(['outcome', 'output', 'activity'])->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $requests
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'need_date'      => 'required|date',
            'applicant_name' => 'required|string|max:255',
            'department'     => 'required|string|max:255',
            'purpose'        => 'required|string',
            'description'    => 'nullable|string',
            'amount'         => 'required|numeric|min:0',
            'items'          => 'nullable',
            'attachment'     => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'outcome_id'     => 'nullable|integer',
            'output_id'      => 'nullable|integer',
            'activity_id'    => 'nullable|integer',
        ]);

        if (isset($validated['items']) && is_string($validated['items'])) {
            $validated['items'] = json_decode($validated['items'], true);
        }

        $dateCode = now()->format('Y-m');
        $lastRecord = FundRequest::where('request_number', 'like', "PD-{$dateCode}-%")->latest('id')->first();
        $nextNum = $lastRecord ? ((int) substr($lastRecord->request_number, -4)) + 1 : 1;
        $validated['request_number'] = sprintf('PD-%s-%04d', $dateCode, $nextNum);

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('attachments/fund-requests', 'public');
            $validated['attachment'] = $path;
        }

        $validated['status'] = 'Pending';

        $fundRequest = FundRequest::create($validated);

        ActivityLogController::log('create', "Membuat Fund Request baru #{$fundRequest->request_number}");

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan dana berhasil dibuat',
            'data'    => $fundRequest
        ], 201);
    }

    public function show($id)
    {
        $fundRequest = FundRequest::with(['outcome', 'output', 'activity'])->find($id);

        if (!$fundRequest) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $fundRequest], 200);
    }

    public function update(Request $request, $id)
    {
        $fundRequest = FundRequest::find($id);

        if (!$fundRequest) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'need_date'      => 'sometimes|date',
            'applicant_name' => 'sometimes|string|max:255',
            'department'     => 'sometimes|string|max:255',
            'purpose'        => 'sometimes|string',
            'description'    => 'nullable|string',
            'amount'         => 'sometimes|numeric|min:0',
            'items'          => 'nullable',
            'attachment'     => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'outcome_id'     => 'nullable|integer',
            'output_id'      => 'nullable|integer',
            'activity_id'    => 'nullable|integer',
        ]);

        if (isset($validated['items']) && is_string($validated['items'])) {
            $validated['items'] = json_decode($validated['items'], true);
        }

        if ($request->hasFile('attachment')) {
            if ($fundRequest->attachment) {
                Storage::disk('public')->delete($fundRequest->attachment);
            }
            $validated['attachment'] = $request->file('attachment')->store('attachments/fund-requests', 'public');
        }

        $fundRequest->update($validated);

        ActivityLogController::log('update', "Mengubah Fund Request #{$fundRequest->request_number}");

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan berhasil diperbarui',
            'data'    => $fundRequest
        ], 200);
    }

    public function updateStatus(Request $request, $id)
    {
        $fundRequest = FundRequest::find($id);

        if (!$fundRequest) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'status'                => 'required|in:Approved,Rejected,Pending,Reviewed,approved,rejected,pending,reviewed',
            'approval_note'         => 'nullable|string',
            'reviewer_name'         => 'nullable|string',
            'finance_approver_name' => 'nullable|string',
            'pm_approver_name'      => 'nullable|string',
        ]);

        // Normalisasi status ke Title Case (Approved, Rejected, Pending, Reviewed)
        $statusCapitalized = ucfirst(strtolower($validated['status']));

        $updateData = [
            'status'        => $statusCapitalized,
            'approval_note' => $validated['approval_note'] ?? $fundRequest->approval_note,
        ];

        if (!empty($validated['reviewer_name'])) {
            $updateData['reviewer_name'] = $validated['reviewer_name'];
            $updateData['reviewed_at'] = now();
        } elseif ($statusCapitalized === 'Reviewed') {
            $updateData['reviewed_at'] = now();
        }

        if (!empty($validated['finance_approver_name'])) {
            $updateData['finance_approver_name'] = $validated['finance_approver_name'];
        }

        if (!empty($validated['pm_approver_name'])) {
            $updateData['pm_approver_name'] = $validated['pm_approver_name'];
        }

        $fundRequest->update($updateData);

        // Tentukan jenis action dan deskripsi sesuai status
        $action = match ($statusCapitalized) {
            'Approved' => 'approve',
                        'Rejected' => 'reject',
            default    => 'update',
        };

        $statusText = match ($statusCapitalized) {
            'Approved' => 'Menyetujui',
            'Reviewed' => 'Memeriksa (Review)',
            'Rejected' => 'Menolak',
            default    => 'Mengubah status',
        };

        ActivityLogController::log($action, "{$statusText} Fund Request #{$fundRequest->request_number}");

        return response()->json([
            'success' => true,
            'message' => "Status pengajuan berhasil diubah menjadi {$validated['status']}",
            'data'    => $fundRequest
        ], 200);
    }

    public function destroy($id)
    {
        $fundRequest = FundRequest::find($id);

        if (!$fundRequest) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $reqNumber = $fundRequest->request_number;

        if ($fundRequest->attachment) {
            Storage::disk('public')->delete($fundRequest->attachment);
        }

        $fundRequest->delete();

        ActivityLogController::log('delete', "Menghapus Fund Request #{$reqNumber}");

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan berhasil dihapus'
        ], 200);
    }
}
