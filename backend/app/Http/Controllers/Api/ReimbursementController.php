<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reimbursement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReimbursementController extends Controller
{
    // GET: List semua reimbursement
    public function index()
    {
        $data = Reimbursement::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $data
        ], 200);
    }

    // POST: Buat reimbursement baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_name'   => 'required|string|max:255',
            'department'  => 'nullable|string|max:255',
            'description' => 'required|string',
            'date'        => 'required|date',
            'amount'      => 'required|numeric|min:0',
            'proof_file'  => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        // Auto-generate request_id (Contoh: RB-2026-001)
        $year = now()->format('Y');
        $lastRecord = Reimbursement::where('request_id', 'like', "RB-{$year}-%")->latest('id')->first();
        $nextNum = $lastRecord ? ((int) substr($lastRecord->request_id, -3)) + 1 : 1;
        $validated['request_id'] = sprintf('RB-%s-%03d', $year, $nextNum);

        if ($request->hasFile('proof_file')) {
            $validated['proof_file'] = $request->file('proof_file')->store('attachments/reimbursements', 'public');
        }

        $validated['status'] = 'Pending';

        $reimbursement = Reimbursement::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Reimbursement berhasil diajukan',
            'data'    => $reimbursement
        ], 201);
    }

    // GET: Detail reimbursement
    public function show($id)
    {
        $reimbursement = Reimbursement::find($id);

        if (!$reimbursement) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $reimbursement], 200);
    }

    // PUT/PATCH: Update status (Approve/Reject)
    public function updateStatus(Request $request, $id)
    {
        $reimbursement = Reimbursement::find($id);

        if (!$reimbursement) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:Approved,Rejected,Pending',
        ]);

        $reimbursement->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Status reimbursement berhasil diubah',
            'data'    => $reimbursement
        ], 200);
    }

    // DELETE: Hapus reimbursement
    public function destroy($id)
    {
        $reimbursement = Reimbursement::find($id);

        if (!$reimbursement) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        if ($reimbursement->proof_file) {
            Storage::disk('public')->delete($reimbursement->proof_file);
        }

        $reimbursement->delete();

        return response()->json(['success' => true, 'message' => 'Data berhasil dihapus'], 200);
    }
}