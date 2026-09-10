<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InventoryController extends Controller
{
    public function index()
    {
        return response()->json(Inventory::orderBy('created_at', 'desc')->get());
    }

    public function show($code)
    {
        $inventory = Inventory::where('code', $code)->firstOrFail();
        return response()->json($inventory);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'location' => 'required|string',
            'qty' => 'integer',
            'unit' => 'nullable|string',
            'status' => 'string',
            'value' => 'integer',
            'addedDate' => 'nullable|date',
            'notes' => 'nullable|string',
            'photo' => 'nullable|image|max:5120', // Max 5MB
        ]);

        $latestId = Inventory::max('id') ?? 0;
        $nextId = $latestId + 1;
        $validated['code'] = 'INV-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('inventory-photos', 'public');
            $validated['photo'] = asset('storage/' . $path);
        }

        $inventory = Inventory::create($validated);

        ActivityLogController::log('create', "Menambahkan inventory: {$inventory->name} ({$inventory->code})");

        return response()->json($inventory, 201);
    }

    public function update(Request $request, $code)
    {
        $inventory = Inventory::where('code', $code)->firstOrFail();
        
        $validated = $request->validate([
            'name' => 'string',
            'category' => 'string',
            'location' => 'string',
            'qty' => 'integer',
            'unit' => 'nullable|string',
            'status' => 'string',
            'value' => 'integer',
            'addedDate' => 'nullable|date',
            'notes' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($inventory->photo) {
                // Determine relative path inside storage/app/public/
                $oldPath = str_replace(asset('storage/'), '', $inventory->photo);
                $oldPath = ltrim($oldPath, '/');
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('photo')->store('inventory-photos', 'public');
            $validated['photo'] = asset('storage/' . $path);
        }

        $inventory->update($validated);

        ActivityLogController::log('update', "Memperbarui inventory: {$inventory->name} ({$inventory->code})");

        return response()->json($inventory);
    }

    public function destroy($code)
    {
        $inventory = Inventory::where('code', $code)->firstOrFail();
        
        if ($inventory->photo) {
            $oldPath = str_replace(asset('storage/'), '', $inventory->photo);
            $oldPath = ltrim($oldPath, '/');
            Storage::disk('public')->delete($oldPath);
        }
        
        $inventory->delete();

        ActivityLogController::log('delete', "Menghapus inventory: {$inventory->name} ({$inventory->code})");

        return response()->json(null, 204);
    }
}
