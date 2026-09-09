<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FundRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FundRequestController extends Controller
{
    // GET: List semua pengajuan dana
    public function index()
    {
        $requests = FundRequest::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $requests
        ], 200);
    }

    // POST: Buat pengajuan dana baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'need_date'      => 'required|date',
            'applicant_name' => 'required|string|max:255',
            'department'     => 'required|string|max:255',
            'purpose'        => 'required|string',
            'amount'         => 'required|numeric|min:0',
            'attachment'     => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        // Auto-generate request_number (Contoh: PD-2026-09-0001)
        $dateCode = now()->format('Y-m');
        $lastRecord = FundRequest::where('request_number', 'like', "PD-{$dateCode}-%")->latest('id')->first();
        $nextNum = $lastRecord ? ((int) substr($lastRecord->request_number, -4)) + 1 : 1;
        $validated['request_number'] = sprintf('PD-%s-%04d', $dateCode, $nextNum);

        // Upload attachment jika ada
        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('attachments/fund-requests', 'public');
            $validated['attachment'] = $path;
        }

        $validated['status'] = 'Pending';

        $fundRequest = FundRequest::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan dana berhasil dibuat',
            'data'    => $fundRequest
        ], 201);
    }

    // GET: Detail 1 pengajuan dana
    public function show($id)
    {
        $fundRequest = FundRequest::find($id);

        if (!$fundRequest) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $fundRequest], 200);
    }

    // PUT: Update data (sebelum diapprove/direject)
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
            'amount'         => 'sometimes|numeric|min:0',
            'attachment'     => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($request->hasFile('attachment')) {
            if ($fundRequest->attachment) {
                Storage::disk('public')->delete($fundRequest->attachment);
            }
            $validated['attachment'] = $request->file('attachment')->store('attachments/fund-requests', 'public');
        }

        $fundRequest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan berhasil diperbarui',
            'data'    => $fundRequest
        ], 200);
    }

    // PUT/PATCH: Fitur khusus Approval / Rejection dari Superadmin
    public function updateStatus(Request $request, $id)
    {
        $fundRequest = FundRequest::find($id);

        if (!$fundRequest) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'status'        => 'required|in:Approved,Rejected,Pending',
            'approval_note' => 'nullable|string',
        ]);

        $fundRequest->update([
            'status'        => $validated['status'],
            'approval_note' => $validated['approval_note'] ?? $fundRequest->approval_note,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Status pengajuan berhasil diubah menjadi {$validated['status']}",
            'data'    => $fundRequest
        ], 200);
    }

    // DELETE: Hapus pengajuan
    public function destroy($id)
    {
        $fundRequest = FundRequest::find($id);

        if (!$fundRequest) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        if ($fundRequest->attachment) {
            Storage::disk('public')->delete($fundRequest->attachment);
        }

        $fundRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan berhasil dihapus'
        ], 200);
    }
}