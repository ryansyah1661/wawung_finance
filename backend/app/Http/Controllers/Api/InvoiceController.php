<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::latest()->get();
        return response()->json([
            'success' => true,
            'data' => $invoices
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_number' => 'required|string|unique:invoices,invoice_number',
            'client_name'    => 'required|string',
            'issue_date'     => 'required|date',
            'due_date'       => 'required|date',
            'amount'         => 'required|numeric',
            'status'         => 'nullable|string',
        ]);

        $invoice = Invoice::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Invoice berhasil dibuat',
            'data'    => $invoice
        ], 201);
    }

    public function show($id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $invoice
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'invoice_number' => 'sometimes|required|string|unique:invoices,invoice_number,' . $id,
            'client_name'    => 'sometimes|required|string',
            'issue_date'     => 'sometimes|required|date',
            'due_date'       => 'sometimes|required|date',
            'amount'         => 'sometimes|required|numeric',
            'status'         => 'sometimes|required|string',
        ]);

        $invoice->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Invoice berhasil diperbarui',
            'data'    => $invoice
        ], 200);
    }

    public function destroy($id)
    {
        $invoice = Invoice::find($id);

        if (!$invoice) {
            return response()->json(['message' => 'Invoice tidak ditemukan'], 404);
        }

        $invoice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Invoice berhasil dihapus'
        ], 200);
    }
}
