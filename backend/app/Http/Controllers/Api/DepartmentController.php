<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Department::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('code', 'like', '%' . $request->search . '%');
        }

        return response()->json([
            'success' => true,
            'data'    => $query->orderBy('name', 'asc')->get()
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:departments,code',
        ]);

        $department = Department::create($validated);

        ActivityLogController::log('create', "Menambahkan departemen baru: {$department->name}");

        return response()->json([
            'success' => true,
            'message' => 'Departemen berhasil ditambahkan',
            'data'    => $department
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $department], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50|unique:departments,code,' . $id,
        ]);

        $department->update($validated);

        ActivityLogController::log('update', "Mengubah departemen: {$department->name}");

        return response()->json([
            'success' => true,
            'message' => 'Departemen berhasil diperbarui',
            'data'    => $department
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $department = Department::find($id);

        if (!$department) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $name = $department->name;
        $department->delete();

        ActivityLogController::log('delete', "Menghapus departemen: {$name}");

        return response()->json([
            'success' => true,
            'message' => 'Departemen berhasil dihapus'
        ], 200);
    }
}
