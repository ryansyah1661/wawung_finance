<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        // Filter 'type' (Mendukung single type atau multiple via comma: ?type=categories,accounts)
        if ($request->has('type') && !empty($request->type)) {
            $types = explode(',', $request->type);
            $query->whereIn('type', array_map('trim', $types));
        }

        // Filter 'status' (Opsional jika ingin memfilter data aktif saja: ?status=active)
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        $categories = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code'   => 'required|string|unique:categories,code',
            'name'   => 'required|string',
            'type'   => 'required|string|in:accounts,categories,departments,vendors',
            'status' => 'nullable|string|in:active,inactive'
        ]);

        if (!isset($validated['status'])) {
            $validated['status'] = 'active';
        }

        $category = Category::create($validated);

        ActivityLogController::log('create', "Menambahkan kategori baru: {$category->name} ({$category->type})");

        return response()->json([
            'success' => true,
            'data'    => $category
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'code'   => 'sometimes|string|unique:categories,code,' . $category->id,
            'name'   => 'sometimes|string',
            'type'   => 'sometimes|string|in:accounts,categories,departments,vendors',
            'status' => 'sometimes|string|in:active,inactive'
        ]);

        $category->update($validated);

        ActivityLogController::log('update', "Mengubah kategori: {$category->name}");

        return response()->json([
            'success' => true,
            'data'    => $category
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $name = $category->name;

        $category->delete();

        ActivityLogController::log('delete', "Menghapus kategori: {$name}");

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dihapus'
        ], 200);
    }
}
