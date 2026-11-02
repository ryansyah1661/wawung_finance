<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ProjectOutcome;
use App\Models\ProjectOutput;
use App\Models\ProjectActivity;
use App\Models\ActivityComponent;
use App\Models\FundRequest;
use App\Models\Reimbursement;
use App\Models\Transaction;
use Illuminate\Http\Request;

class ProjectHierarchyController extends Controller
{
    /**
     * Mengambil struktur lengkap hierarki Program (Outcome -> Output -> Activity -> Components)
     * beserta kalkulasi pagu, serapan, dan sisa per level.
     */
    public function getHierarchy($programId)
    {
        $program = Category::where('id', $programId)->where('type', 'programs')->first();
        if (!$program) {
            return response()->json(['success' => false, 'message' => 'Program tidak ditemukan'], 404);
        }

        $outcomes = ProjectOutcome::where('program_id', $programId)
            ->with(['outputs.activities.components'])
            ->orderBy('order_num')
            ->orderBy('id')
            ->get();

        // Ambil data pengeluaran (Approved) yang terkait dengan program ini
        $approvedRequests = FundRequest::where('department', $program->name)
            ->whereRaw('LOWER(status) = ?', ['approved'])
            ->get();

        // Hitung serapan dana per aktivitas dari items JSON fund_requests
        $activitySpentMap = [];
        $componentSpentMap = [];

        foreach ($approvedRequests as $req) {
            $actId = $req->activity_id;
            $items = is_array($req->items) ? $req->items : json_decode($req->items ?? '[]', true);

            if ($actId) {
                $activitySpentMap[$actId] = ($activitySpentMap[$actId] ?? 0) + (float) ($req->amount ?? 0);
            }

            if (is_array($items)) {
                foreach ($items as $item) {
                    $compId = $item['component_id'] ?? null;
                    $itemTotal = (float) ($item['total'] ?? 0);
                    if ($compId) {
                        $componentSpentMap[$compId] = ($componentSpentMap[$compId] ?? 0) + $itemTotal;
                    }
                }
            }
        }

        // Kalkulasi bertingkat: Komponen -> Aktivitas -> Output -> Outcome -> Total Program
        $totalProgramBudget = 0;
        $totalProgramSpent = 0;

        $treeData = $outcomes->map(function ($outcome) use (&$activitySpentMap, &$componentSpentMap, &$totalProgramBudget, &$totalProgramSpent) {
            $outcomeBudget = 0;
            $outcomeSpent = 0;

            $outputs = $outcome->outputs->map(function ($output) use (&$activitySpentMap, &$componentSpentMap, &$outcomeBudget, &$outcomeSpent) {
                $outputBudget = 0;
                $outputSpent = 0;

                $activities = $output->activities->map(function ($activity) use (&$activitySpentMap, &$componentSpentMap, &$outputBudget, &$outputSpent) {
                    $activityBudget = 0;
                    $activitySpent = (float) ($activitySpentMap[$activity->id] ?? 0);

                    $components = $activity->components->map(function ($comp) use (&$componentSpentMap, &$activityBudget) {
                        $budget = (float) ($comp->total_budget ?? ($comp->qty * $comp->freq * $comp->unit_price));
                        $spent = (float) ($componentSpentMap[$comp->id] ?? 0);
                        $remaining = $budget - $spent;
                        $percent = $budget > 0 ? round(($spent / $budget) * 100, 1) : 0;

                        $activityBudget += $budget;

                        return [
                            'id'           => $comp->id,
                            'activity_id'  => $comp->activity_id,
                            'code'         => $comp->code,
                            'name'         => $comp->name,
                            'group_name'   => $comp->group_name,
                            'qty'          => (float) $comp->qty,
                            'unit'         => $comp->unit,
                            'freq'         => (float) $comp->freq,
                            'freq_unit'    => $comp->freq_unit,
                            'unit_price'   => (float) $comp->unit_price,
                            'total_budget' => $budget,
                            'spent'        => $spent,
                            'remaining'    => $remaining,
                            'percent'      => $percent,
                            'is_over'      => $remaining < 0,
                            'description'  => $comp->description,
                        ];
                    });

                    $activityRemaining = $activityBudget - $activitySpent;
                    $activityPercent = $activityBudget > 0 ? round(($activitySpent / $activityBudget) * 100, 1) : 0;

                    $outputBudget += $activityBudget;
                    $outputSpent += $activitySpent;

                    return [
                        'id'          => $activity->id,
                        'output_id'   => $activity->output_id,
                        'code'        => $activity->code,
                        'name'        => $activity->name,
                        'description' => $activity->description,
                        'budget'      => $activityBudget,
                        'spent'       => $activitySpent,
                        'remaining'   => $activityRemaining,
                        'percent'     => $activityPercent,
                        'is_over'     => $activityRemaining < 0,
                        'components'  => $components,
                    ];
                });

                $outputRemaining = $outputBudget - $outputSpent;
                $outputPercent = $outputBudget > 0 ? round(($outputSpent / $outputBudget) * 100, 1) : 0;

                $outcomeBudget += $outputBudget;
                $outcomeSpent += $outputSpent;

                return [
                    'id'          => $output->id,
                    'outcome_id'  => $output->outcome_id,
                    'code'        => $output->code,
                    'name'        => $output->name,
                    'description' => $output->description,
                    'budget'      => $outputBudget,
                    'spent'       => $outputSpent,
                    'remaining'   => $outputRemaining,
                    'percent'     => $outputPercent,
                    'is_over'     => $outputRemaining < 0,
                    'activities'  => $activities,
                ];
            });

            $outcomeRemaining = $outcomeBudget - $outcomeSpent;
            $outcomePercent = $outcomeBudget > 0 ? round(($outcomeSpent / $outcomeBudget) * 100, 1) : 0;

            $totalProgramBudget += $outcomeBudget;
            $totalProgramSpent += $outcomeSpent;

            return [
                'id'          => $outcome->id,
                'program_id'  => $outcome->program_id,
                'code'        => $outcome->code,
                'name'        => $outcome->name,
                'description' => $outcome->description,
                'budget'      => $outcomeBudget,
                'spent'       => $outcomeSpent,
                'remaining'   => $outcomeRemaining,
                'percent'     => $outcomePercent,
                'is_over'     => $outcomeRemaining < 0,
                'outputs'     => $outputs,
            ];
        });

        // Sinkronkan pagu anggaran program di tabel categories jika ada komponen RAB
        if ($totalProgramBudget > 0 && abs((float)$program->budget - $totalProgramBudget) > 1) {
            $program->budget = $totalProgramBudget;
            $program->save();
        }

        return response()->json([
            'success' => true,
            'program' => [
                'id'        => $program->id,
                'name'      => $program->name,
                'code'      => $program->code,
                'budget'    => $totalProgramBudget > 0 ? $totalProgramBudget : (float) $program->budget,
                'spent'     => $totalProgramSpent,
                'remaining' => ($totalProgramBudget > 0 ? $totalProgramBudget : (float) $program->budget) - $totalProgramSpent,
                'percent'   => $totalProgramBudget > 0 ? round(($totalProgramSpent / $totalProgramBudget) * 100, 1) : 0,
            ],
            'outcomes' => $treeData,
        ]);
    }

    // ==================== OUTCOME CRUD ====================
    public function storeOutcome(Request $request, $programId)
    {
        $validated = $request->validate([
            'code'        => 'nullable|string',
            'name'        => 'required|string',
            'description' => 'nullable|string',
            'order_num'   => 'nullable|integer',
        ]);
        $validated['program_id'] = $programId;

        $outcome = ProjectOutcome::create($validated);
        return response()->json(['success' => true, 'data' => $outcome], 201);
    }

    public function updateOutcome(Request $request, $id)
    {
        $outcome = ProjectOutcome::findOrFail($id);
        $validated = $request->validate([
            'code'        => 'nullable|string',
            'name'        => 'sometimes|string',
            'description' => 'nullable|string',
            'order_num'   => 'nullable|integer',
        ]);
        $outcome->update($validated);
        return response()->json(['success' => true, 'data' => $outcome]);
    }

    public function deleteOutcome($id)
    {
        $outcome = ProjectOutcome::findOrFail($id);
        $outcome->delete();
        return response()->json(['success' => true, 'message' => 'Outcome berhasil dihapus']);
    }

    // ==================== OUTPUT CRUD ====================
    public function storeOutput(Request $request, $outcomeId)
    {
        $validated = $request->validate([
            'code'        => 'nullable|string',
            'name'        => 'required|string',
            'description' => 'nullable|string',
            'order_num'   => 'nullable|integer',
        ]);
        $validated['outcome_id'] = $outcomeId;

        $output = ProjectOutput::create($validated);
        return response()->json(['success' => true, 'data' => $output], 201);
    }

    public function updateOutput(Request $request, $id)
    {
        $output = ProjectOutput::findOrFail($id);
        $validated = $request->validate([
            'code'        => 'nullable|string',
            'name'        => 'sometimes|string',
            'description' => 'nullable|string',
            'order_num'   => 'nullable|integer',
        ]);
        $output->update($validated);
        return response()->json(['success' => true, 'data' => $output]);
    }

    public function deleteOutput($id)
    {
        $output = ProjectOutput::findOrFail($id);
        $output->delete();
        return response()->json(['success' => true, 'message' => 'Output berhasil dihapus']);
    }

    // ==================== ACTIVITY CRUD ====================
    public function storeActivity(Request $request, $outputId)
    {
        $validated = $request->validate([
            'code'        => 'nullable|string',
            'name'        => 'required|string',
            'description' => 'nullable|string',
            'order_num'   => 'nullable|integer',
        ]);
        $validated['output_id'] = $outputId;

        $activity = ProjectActivity::create($validated);
        return response()->json(['success' => true, 'data' => $activity], 201);
    }

    public function updateActivity(Request $request, $id)
    {
        $activity = ProjectActivity::findOrFail($id);
        $validated = $request->validate([
            'code'        => 'nullable|string',
            'name'        => 'sometimes|string',
            'description' => 'nullable|string',
            'order_num'   => 'nullable|integer',
        ]);
        $activity->update($validated);
        return response()->json(['success' => true, 'data' => $activity]);
    }

    public function deleteActivity($id)
    {
        $activity = ProjectActivity::findOrFail($id);
        $activity->delete();
        return response()->json(['success' => true, 'message' => 'Activity berhasil dihapus']);
    }

    // ==================== COMPONENT CRUD ====================
    public function getComponents($activityId)
    {
        $components = ActivityComponent::where('activity_id', $activityId)
            ->orderBy('order_num')
            ->orderBy('id')
            ->get();

        return response()->json(['success' => true, 'data' => $components]);
    }

    public function storeComponent(Request $request, $activityId)
    {
        $validated = $request->validate([
            'code'        => 'nullable|string',
            'name'        => 'required|string',
            'group_name'  => 'nullable|string',
            'qty'         => 'required|numeric|min:0.01',
            'unit'        => 'required|string',
            'freq'        => 'required|numeric|min:0.01',
            'freq_unit'   => 'required|string',
            'unit_price'  => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'order_num'   => 'nullable|integer',
        ]);

        $validated['activity_id'] = $activityId;
        $validated['total_budget'] = $validated['qty'] * $validated['freq'] * $validated['unit_price'];

        $component = ActivityComponent::create($validated);
        return response()->json(['success' => true, 'data' => $component], 201);
    }

    public function updateComponent(Request $request, $id)
    {
        $comp = ActivityComponent::findOrFail($id);
        $validated = $request->validate([
            'code'        => 'nullable|string',
            'name'        => 'sometimes|string',
            'group_name'  => 'nullable|string',
            'qty'         => 'sometimes|numeric|min:0.01',
            'unit'        => 'sometimes|string',
            'freq'        => 'sometimes|numeric|min:0.01',
            'freq_unit'   => 'sometimes|string',
            'unit_price'  => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'order_num'   => 'nullable|integer',
        ]);

        $qty = $validated['qty'] ?? $comp->qty;
        $freq = $validated['freq'] ?? $comp->freq;
        $price = $validated['unit_price'] ?? $comp->unit_price;
        $validated['total_budget'] = $qty * $freq * $price;

        $comp->update($validated);
        return response()->json(['success' => true, 'data' => $comp]);
    }

    public function deleteComponent($id)
    {
        $comp = ActivityComponent::findOrFail($id);
        $comp->delete();
        return response()->json(['success' => true, 'message' => 'Komponen berhasil dihapus']);
    }
}
