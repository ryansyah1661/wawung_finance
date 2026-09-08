<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:categories,code',
            'name' => 'required|string',
            'type' => 'required|string',
            'status' => 'string'
        ]);

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        
        $validated = $request->validate([
            'code' => 'string|unique:categories,code,' . $category->id,
            'name' => 'string',
            'type' => 'string',
            'status' => 'string'
        ]);

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return response()->json(null, 204);
    }
}
