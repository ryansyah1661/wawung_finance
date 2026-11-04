"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import TableSkeleton from "@/components/ui/TableSkeleton";

interface ComponentItem {
  id: number;
  activity_id: number;
  code?: string;
  name: string;
  group_name?: string;
  qty: number;
  unit: string;
  freq: number;
  freq_unit: string;
  unit_price: number;
  total_budget: number;
  spent: number;
  remaining: number;
  percent: number;
  is_over: boolean;
  description?: string;
}

interface ActivityItem {
  id: number;
  output_id: number;
  code?: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  remaining: number;
  percent: number;
  is_over: boolean;
  components: ComponentItem[];
}

interface OutputItem {
  id: number;
  outcome_id: number;
  code?: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  remaining: number;
  percent: number;
  is_over: boolean;
  activities: ActivityItem[];
}

interface OutcomeItem {
  id: number;
  program_id: number;
  code?: string;
  name: string;
  description?: string;
  budget: number;
  spent: number;
  remaining: number;
  percent: number;
  is_over: boolean;
  outputs: OutputItem[];
}

interface ProgramInfo {
  id: number;
  name: string;
  code?: string;
  budget: number;
  spent: number;
  remaining: number;
  percent: number;
}

function formatRupiah(amount: number) {
  return `Rp ${Math.round(amount || 0).toLocaleString("id-ID")}`;
}

export default function ProjectRabPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.programId as string;

  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<ProgramInfo | null>(null);
  const [outcomes, setOutcomes] = useState<OutcomeItem[]>([]);
  const [userRole, setUserRole] = useState<string>("superadmin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = (localStorage.getItem("user_role") || "superadmin").toLowerCase();
      setUserRole(role);
    }
  }, []);

  const canEditRAB = ["superadmin", "director", "pm"].includes(userRole);

  // Expand / collapse states
  const [collapsedOutcomes, setCollapsedOutcomes] = useState<Record<number, boolean>>({});
  const [collapsedOutputs, setCollapsedOutputs] = useState<Record<number, boolean>>({});
  const [collapsedActivities, setCollapsedActivities] = useState<Record<number, boolean>>({});

  // Modals for Outcome, Output, Activity (structural levels)
  const [modalType, setModalType] = useState<"outcome" | "output" | "activity" | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeParentId, setActiveParentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form states for Outcome / Output / Activity
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
  });

  // Inline Table Row for Komponen Biaya (Tampilan seperti Gambar 1)
  const [addingCompActivityId, setAddingCompActivityId] = useState<number | null>(null);
  const [newRow, setNewRow] = useState({
    code: "",
    name: "",
    qty: "1",
    unit: "paket",
    freq: "1",
    freq_unit: "kali",
    unit_price: "",
    description: "",
  });

  const [editingCompId, setEditingCompId] = useState<number | null>(null);
  const [editRow, setEditRow] = useState({
    id: 0,
    code: "",
    name: "",
    qty: "1",
    unit: "paket",
    freq: "1",
    freq_unit: "kali",
    unit_price: "",
    description: "",
  });

  const [isSavingRow, setIsSavingRow] = useState(false);

  // UX Feedback Modals
  const [infoModal, setInfoModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "info" | "success" | "warning";
  }>({
    show: false,
    title: "",
    message: "",
    type: "info",
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "outcome" | "output" | "activity" | "component";
    id: number;
    title: string;
  } | null>(null);

  const fetchHierarchy = async (showSkeleton = false) => {
    if (!programId) return;
    try {
      if (showSkeleton) setLoading(true);
      const res = await api.get(`/programs/${programId}/hierarchy`);
      if (res.data?.success) {
        setProgram(res.data.program);
        setOutcomes(res.data.outcomes || []);
      }
    } catch (err: any) {
      console.error(err);
      setInfoModal({
        show: true,
        title: "Gagal Mengambil Data",
        message: err?.response?.data?.message || "Terjadi kesalahan saat memuat hierarki proyek.",
        type: "warning",
      });
    } finally {
      if (showSkeleton) setLoading(false);
    }
  };

  useEffect(() => {
    fetchHierarchy(true);
  }, [programId]);

  // Toggle helpers
  const toggleOutcome = (id: number) => {
    setCollapsedOutcomes((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleOutput = (id: number) => {
    setCollapsedOutputs((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleActivity = (id: number) => {
    setCollapsedActivities((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    setCollapsedOutcomes({});
    setCollapsedOutputs({});
    setCollapsedActivities({});
  };

  const collapseAll = () => {
    const oMap: Record<number, boolean> = {};
    const outMap: Record<number, boolean> = {};
    const aMap: Record<number, boolean> = {};

    outcomes.forEach((o) => {
      oMap[o.id] = true;
      o.outputs.forEach((out) => {
        outMap[out.id] = true;
        out.activities.forEach((a) => {
          aMap[a.id] = true;
        });
      });
    });

    setCollapsedOutcomes(oMap);
    setCollapsedOutputs(outMap);
    setCollapsedActivities(aMap);
  };

  // Open Add Modals for Structure
  const handleOpenAddOutcome = () => {
    setModalType("outcome");
    setModalMode("create");
    setEditingItem(null);
    setFormData({
      code: `Outcome ${outcomes.length + 1}`,
      name: "",
      description: "",
    });
  };

  const handleOpenAddOutput = (outcomeId: number, currentOutputsCount: number) => {
    setModalType("output");
    setModalMode("create");
    setActiveParentId(outcomeId);
    setEditingItem(null);
    setFormData({
      code: `Output ${currentOutputsCount + 1}`,
      name: "",
      description: "",
    });
  };

  const handleOpenAddActivity = (outputId: number, currentActivitiesCount: number) => {
    setModalType("activity");
    setModalMode("create");
    setActiveParentId(outputId);
    setEditingItem(null);
    setFormData({
      code: `Aktivitas ${currentActivitiesCount + 1}`,
      name: "",
      description: "",
    });
  };

  // Open Edit Modals for Structure
  const handleOpenEdit = (type: "outcome" | "output" | "activity", item: any) => {
    setModalType(type);
    setModalMode("edit");
    setEditingItem(item);
    setFormData({
      code: item.code || "",
      name: item.name || "",
      description: item.description || "",
    });
  };

  // Submit Modal Form (Outcome / Output / Activity)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === "outcome") {
        if (modalMode === "create") {
          await api.post(`/programs/${programId}/outcomes`, {
            code: formData.code,
            name: formData.name,
            description: formData.description,
          });
        } else {
          await api.put(`/outcomes/${editingItem.id}`, {
            code: formData.code,
            name: formData.name,
            description: formData.description,
          });
        }
      } else if (modalType === "output") {
        if (modalMode === "create") {
          await api.post(`/outcomes/${activeParentId}/outputs`, {
            code: formData.code,
            name: formData.name,
            description: formData.description,
          });
        } else {
          await api.put(`/outputs/${editingItem.id}`, {
            code: formData.code,
            name: formData.name,
            description: formData.description,
          });
        }
      } else if (modalType === "activity") {
        if (modalMode === "create") {
          await api.post(`/outputs/${activeParentId}/activities`, {
            code: formData.code,
            name: formData.name,
            description: formData.description,
          });
        } else {
          await api.put(`/activities/${editingItem.id}`, {
            code: formData.code,
            name: formData.name,
            description: formData.description,
          });
        }
      }

      setModalType(null);
      await fetchHierarchy(false);
      setInfoModal({
        show: true,
        title: "Berhasil",
        message: "Data berhasil disimpan!",
        type: "success",
      });
    } catch (err: any) {
      console.error(err);
      setInfoModal({
        show: true,
        title: "Gagal Menyimpan",
        message: err?.response?.data?.message || "Terjadi kesalahan saat menyimpan data.",
        type: "warning",
      });
    }
  };

  // INLINE TABLE ROW OPERATIONS FOR KOMPONEN BIAYA (GAMBAR 1)
  const handleStartAddRow = (activityId: number) => {
    setAddingCompActivityId(activityId);
    setEditingCompId(null);
    setNewRow({
      code: "",
      name: "",
      qty: "1",
      unit: "paket",
      freq: "1",
      freq_unit: "kali",
      unit_price: "",
      description: "",
    });
  };

  const handleCancelAddRow = () => {
    setAddingCompActivityId(null);
  };

  // Helper penyimpanan baris baru ke server (tanpa skeleton reload)
  const saveNewRowToServer = async (activityId: number): Promise<boolean> => {
    if (!newRow.name.trim()) {
      alert("Nama komponen biaya harus diisi!");
      return false;
    }

    const priceNum = parseFloat(String(newRow.unit_price).replace(/\D/g, "")) || 0;
    if (priceNum <= 0) {
      alert("Harga satuan harus lebih dari Rp 0!");
      return false;
    }

    try {
      setIsSavingRow(true);
      const payload = {
        code: newRow.code || null,
        name: newRow.name.trim(),
        qty: parseFloat(String(newRow.qty)) || 1,
        unit: newRow.unit || "paket",
        freq: parseFloat(String(newRow.freq)) || 1,
        freq_unit: newRow.freq_unit || "kali",
        unit_price: priceNum,
        description: newRow.description || null,
      };

      await api.post(`/activities/${activityId}/components`, payload);
      await fetchHierarchy(false);
      return true;
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal menyimpan baris komponen.");
      return false;
    } finally {
      setIsSavingRow(false);
    }
  };

  // Tombol "+ Tambah Baris Komponen":
  // Jika sedang mengisi baris di activity ini, simpan baris tersebut lalu langsung buka baris baru di bawahnya!
  // Jika belum, buka form baris baru tanpa mereset jika tidak sengaja tertekan.
  const handleAddOrContinueRow = async (activityId: number) => {
    if (addingCompActivityId === activityId) {
      if (newRow.name.trim() || newRow.unit_price) {
        const saved = await saveNewRowToServer(activityId);
        if (saved) {
          // Reset form dan tetap buka form input baris berikutnya
          setNewRow({
            code: "",
            name: "",
            qty: "1",
            unit: "paket",
            freq: "1",
            freq_unit: "kali",
            unit_price: "",
            description: "",
          });
          setAddingCompActivityId(activityId);
        }
      }
    } else {
      handleStartAddRow(activityId);
    }
  };

  // Simpan baris ini dan tutup form input baris baru
  const handleSaveAndFinishRow = async (activityId: number) => {
    const saved = await saveNewRowToServer(activityId);
    if (saved) {
      setAddingCompActivityId(null);
    }
  };

  const handleSaveNewRow = async (activityId: number) => {
    await handleSaveAndFinishRow(activityId);
  };

  const handleStartEditRow = (comp: ComponentItem) => {
    setAddingCompActivityId(null);
    setEditingCompId(comp.id);
    setEditRow({
      id: comp.id,
      code: comp.code || "",
      name: comp.name,
      qty: String(comp.qty),
      unit: comp.unit || "paket",
      freq: String(comp.freq),
      freq_unit: comp.freq_unit || "kali",
      unit_price: Math.round(comp.unit_price).toLocaleString("id-ID"),
      description: comp.description || "",
    });
  };

  const handleCancelEditRow = () => {
    setEditingCompId(null);
  };

  const handleSaveEditRow = async () => {
    if (!editRow.name.trim()) {
      alert("Nama komponen biaya harus diisi!");
      return;
    }

    const priceNum = parseFloat(String(editRow.unit_price).replace(/\D/g, "")) || 0;
    if (priceNum <= 0) {
      alert("Harga satuan harus lebih dari Rp 0!");
      return;
    }

    try {
      setIsSavingRow(true);
      const payload = {
        code: editRow.code || null,
        name: editRow.name,
        qty: parseFloat(String(editRow.qty)) || 1,
        unit: editRow.unit || "paket",
        freq: parseFloat(String(editRow.freq)) || 1,
        freq_unit: editRow.freq_unit || "kali",
        unit_price: priceNum,
        description: editRow.description || null,
      };

      await api.put(`/components/${editRow.id}`, payload);
      setEditingCompId(null);
      await fetchHierarchy(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Gagal memperbarui baris komponen.");
    } finally {
      setIsSavingRow(false);
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { type, id } = deleteConfirm;
      if (type === "outcome") {
        await api.delete(`/outcomes/${id}`);
      } else if (type === "output") {
        await api.delete(`/outputs/${id}`);
      } else if (type === "activity") {
        await api.delete(`/activities/${id}`);
      } else if (type === "component") {
        await api.delete(`/components/${id}`);
      }

      setDeleteConfirm(null);
      await fetchHierarchy(false);
      setInfoModal({
        show: true,
        title: "Berhasil",
        message: "Item berhasil dihapus!",
        type: "success",
      });
    } catch (err: any) {
      console.error(err);
      setDeleteConfirm(null);
      setInfoModal({
        show: true,
        title: "Gagal Menghapus",
        message: err?.response?.data?.message || "Terjadi kesalahan saat menghapus item.",
        type: "warning",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <Link href="/master-data" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Master Data Program
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{program?.name || "Memuat..."}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Struktur LFA & Rencana Anggaran (RAB)</span>
            {program?.code && (
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                {program.code}
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola hierarki proyek: Outcome &rarr; Output &rarr; Aktivitas &rarr; Komponen Biaya (Item RAB).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={expandAll}
            className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            title="Buka semua level">
            <span className="material-symbols-outlined text-sm">unfold_more</span>
            Buka Semua
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            title="Tutup semua level">
            <span className="material-symbols-outlined text-sm">unfold_less</span>
            Tutup Semua
          </button>
          {canEditRAB && (
            <button
              onClick={handleOpenAddOutcome}
              className="px-4 py-2 text-xs sm:text-sm font-semibold bg-primary text-white rounded-xl hover:bg-primary-dark transition-all flex items-center gap-1.5 shadow-sm shadow-primary/20 cursor-pointer">
              <span className="material-symbols-outlined text-base">add</span>
              Tambah Outcome
            </button>
          )}
        </div>
      </div>

            {/* Read-Only Notice jika role bukan superadmin, director, pm */}
      {!canEditRAB && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3 text-amber-900 text-xs shadow-xs">
          <span className="material-symbols-outlined text-xl text-amber-600">lock</span>
          <div>
            <span className="font-bold">Mode Tinjauan (Read-Only):</span> Anda saat ini masuk dengan role{" "}
            <span className="font-mono uppercase font-bold bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
              {userRole}
            </span>
            . Input dan perubahan hierarki LFA & RAB hanya dapat dilakukan oleh{" "}
            <strong>Superadmin, Director, dan PM</strong>.
          </div>
        </div>
      )}

      {/* Program Summary KPI Cards */}
      {program && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Pagu Program</span>
              <span className="material-symbols-outlined text-slate-400 text-lg">account_balance_wallet</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">{formatRupiah(program.budget)}</div>
            <p className="text-xs text-slate-400 mt-1">Alokasi keseluruhan RAB</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500">Total Realisasi / Serapan</span>
              <span className="material-symbols-outlined text-rose-400 text-lg">payments</span>
            </div>
            <div className="text-xl font-bold font-mono text-rose-600">{formatRupiah(program.spent)}</div>
            <p className="text-xs text-slate-400 mt-1">Dari Payment Request disetujui</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Sisa Anggaran</span>
              <span
                className={`material-symbols-outlined text-lg ${
                  program.remaining < 0 ? "text-rose-500" : "text-emerald-500"
                }`}>
                {program.remaining < 0 ? "warning" : "check_circle"}
              </span>
            </div>
            <div
              className={`text-xl font-bold font-mono ${
                program.remaining < 0 ? "text-rose-600 font-extrabold" : "text-emerald-700"
              }`}>
              {formatRupiah(program.remaining)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {program.remaining < 0 ? "⚠️ Melebihi Pagu Anggaran!" : "Dana masih tersedia"}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Persentase Serapan</span>
              <span className="material-symbols-outlined text-slate-400 text-lg">analytics</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900">{program.percent}%</div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  program.percent > 100
                    ? "bg-rose-500"
                    : program.percent > 85
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(program.percent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Hierarchy Container */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs">
            <TableSkeleton columns={5} />
          </div>
        ) : outcomes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">account_tree</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Struktur LFA Belum Dibuat</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Mulai dengan menambahkan <strong>Outcome</strong> pertama untuk program ini. Di bawah Outcome, Anda dapat
              menambahkan Output, Aktivitas, dan Komponen Biaya (RAB).
            </p>
            {canEditRAB && (
              <button
                onClick={handleOpenAddOutcome}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-sm cursor-pointer">
                <span className="material-symbols-outlined text-lg">add</span>
                Tambah Outcome Baru
              </button>
            )}
          </div>
        ) : (
          outcomes.map((outcome, oIdx) => {
            const isOutcomeCollapsed = collapsedOutcomes[outcome.id];

            return (
              <div
                key={outcome.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
                {/* OUTCOME HEADER */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4.5 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleOutcome(outcome.id)}
                      className="text-slate-300 hover:text-white transition-colors p-1 -ml-1 rounded-lg hover:bg-slate-700/50 cursor-pointer">
                      <span className="material-symbols-outlined text-xl">
                        {isOutcomeCollapsed ? "expand_more" : "expand_less"}
                      </span>
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-white/20 text-white font-mono text-xs font-bold px-2 py-0.5 rounded border border-white/20">
                          {outcome.code || `Outcome ${oIdx + 1}`}
                        </span>
                        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{outcome.name}</h2>
                      </div>
                      {outcome.description && (
                        <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">{outcome.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 pl-8 md:pl-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-300">Pagu: {formatRupiah(outcome.budget)}</div>
                      <div className="text-xs font-mono">
                        Realisasi:{" "}
                        <span className="text-rose-300 font-bold">{formatRupiah(outcome.spent)}</span>
                        <span className="text-slate-400 mx-1">|</span>
                        Sisa:{" "}
                        <span
                          className={`font-bold ${
                            outcome.remaining < 0 ? "text-rose-400" : "text-emerald-300"
                          }`}>
                          {formatRupiah(outcome.remaining)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 border-l border-slate-700 pl-3">
                      <button
                        onClick={() => handleOpenAddOutput(outcome.id, outcome.outputs.length)}
                        className="bg-primary/90 hover:bg-primary text-white text-xs px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Tambah Output di Outcome ini">
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span className="hidden sm:inline">Output</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit("outcome", outcome)}
                        className="text-slate-300 hover:text-white hover:bg-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Edit Outcome">
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: "outcome",
                            id: outcome.id,
                            title: `Outcome: ${outcome.name}`,
                          })
                        }
                        className="text-slate-300 hover:text-rose-400 hover:bg-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Outcome">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* OUTCOME CONTENT (OUTPUTS) */}
                {!isOutcomeCollapsed && (
                  <div className="p-4 sm:p-5 space-y-4 bg-slate-50/60">
                    {outcome.outputs.length === 0 ? (
                      <div className="p-6 text-center bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-xs sm:text-sm text-slate-500 mb-2">
                          Belum ada Output pada Outcome ini.
                        </p>
                        <button
                          onClick={() => handleOpenAddOutput(outcome.id, 0)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark cursor-pointer">
                          <span className="material-symbols-outlined text-base">add</span>
                          Tambah Output Sekarang
                        </button>
                      </div>
                    ) : (
                      outcome.outputs.map((output, outIdx) => {
                        const isOutputCollapsed = collapsedOutputs[output.id];

                        return (
                          <div
                            key={output.id}
                            className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                            {/* OUTPUT HEADER */}
                            <div className="bg-slate-100/80 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleOutput(output.id)}
                                  className="text-slate-500 hover:text-slate-800 transition-colors p-0.5 rounded cursor-pointer">
                                  <span className="material-symbols-outlined text-lg">
                                    {isOutputCollapsed ? "chevron_right" : "expand_more"}
                                  </span>
                                </button>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-slate-200 text-slate-800 font-mono text-xs font-bold px-2 py-0.5 rounded">
                                      {output.code || `Output ${oIdx + 1}.${outIdx + 1}`}
                                    </span>
                                    <h3 className="text-sm font-bold text-slate-800">{output.name}</h3>
                                  </div>
                                  {output.description && (
                                    <p className="text-xs text-slate-400 mt-0.5">{output.description}</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-3 pl-6 md:pl-0">
                                <div className="text-xs text-right">
                                  <span className="text-slate-500">Pagu:</span>{" "}
                                  <span className="font-mono font-medium text-slate-700">
                                    {formatRupiah(output.budget)}
                                  </span>{" "}
                                  <span className="text-slate-300 mx-1">|</span>
                                  <span className="text-slate-500">Serapan:</span>{" "}
                                  <span className="font-mono text-rose-600 font-medium">
                                    {formatRupiah(output.spent)}
                                  </span>
                                </div>

                                {canEditRAB && (
                                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                                    <button
                                      onClick={() => handleOpenAddActivity(output.id, output.activities.length)}
                                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs px-2 py-1 rounded font-medium flex items-center gap-1 transition-colors cursor-pointer"
                                      title="Tambah Aktivitas">
                                      <span className="material-symbols-outlined text-sm">add</span>
                                      <span className="hidden sm:inline">Aktivitas</span>
                                    </button>
                                    <button
                                      onClick={() => handleOpenEdit("output", output)}
                                      className="text-slate-400 hover:text-slate-700 p-1 rounded cursor-pointer"
                                      title="Edit Output">
                                      <span className="material-symbols-outlined text-base">edit</span>
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteConfirm({
                                          type: "output",
                                          id: output.id,
                                          title: `Output: ${output.name}`,
                                        })
                                      }
                                      className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                                      title="Hapus Output">
                                      <span className="material-symbols-outlined text-base">delete</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* OUTPUT CONTENT (ACTIVITIES) */}
                            {!isOutputCollapsed && (
                              <div className="p-3 sm:p-4 space-y-4 bg-slate-50/40">
                                {output.activities.length === 0 ? (
                                  <div className="p-4 text-center text-xs text-slate-400">
                                    Belum ada aktivitas. Klik <strong>+ Aktivitas</strong> di atas untuk menambahkan.
                                  </div>
                                ) : (
                                  output.activities.map((activity, aIdx) => {
                                    const isActivityCollapsed = collapsedActivities[activity.id];
                                    const isAddingThis = addingCompActivityId === activity.id;

                                    return (
                                      <div
                                        key={activity.id}
                                        className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                                        {/* ACTIVITY HEADER */}
                                        <div className="bg-amber-50/60 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-amber-200/60">
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() => toggleActivity(activity.id)}
                                              className="text-amber-800 hover:text-amber-950 transition-colors p-0.5 rounded cursor-pointer">
                                              <span className="material-symbols-outlined text-lg">
                                                {isActivityCollapsed ? "chevron_right" : "expand_more"}
                                              </span>
                                            </button>
                                            <div>
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <span className="bg-amber-100 text-amber-900 font-mono text-xs font-bold px-2 py-0.5 rounded border border-amber-300">
                                                  {activity.code || `Aktivitas ${oIdx + 1}.${outIdx + 1}.${aIdx + 1}`}
                                                </span>
                                                <h4 className="text-sm font-bold text-slate-800">
                                                  {activity.name}
                                                </h4>
                                              </div>
                                              {activity.description && (
                                                <p className="text-xs text-slate-400 mt-0.5">{activity.description}</p>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex items-center justify-between md:justify-end gap-3 pl-6 md:pl-0">
                                            <div className="text-xs text-right">
                                              <span className="text-slate-500">Pagu:</span>{" "}
                                              <span className="font-mono font-bold text-slate-800">
                                                {formatRupiah(activity.budget)}
                                              </span>{" "}
                                              <span className="text-slate-300 mx-1">|</span>
                                              <span className="text-slate-500">Serapan:</span>{" "}
                                              <span className="font-mono font-medium text-rose-600">
                                                {formatRupiah(activity.spent)}
                                              </span>{" "}
                                              <span className="text-slate-300 mx-1">|</span>
                                              <span
                                                className={`font-mono text-xs font-bold ${
                                                  activity.remaining < 0 ? "text-rose-600" : "text-emerald-700"
                                                }`}>
                                                Sisa: {formatRupiah(activity.remaining)}
                                              </span>
                                            </div>

                                            {canEditRAB && (
                                              <div className="flex items-center gap-1 border-l border-amber-200 pl-2">
                                                <button
                                                  onClick={() => handleOpenEdit("activity", activity)}
                                                  className="text-slate-400 hover:text-slate-700 p-1 rounded cursor-pointer"
                                                  title="Edit Aktivitas">
                                                  <span className="material-symbols-outlined text-base">edit</span>
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    setDeleteConfirm({
                                                      type: "activity",
                                                      id: activity.id,
                                                      title: `Aktivitas: ${activity.name}`,
                                                    })
                                                  }
                                                  className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                                                  title="Hapus Aktivitas">
                                                  <span className="material-symbols-outlined text-base">delete</span>
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        {/* ACTIVITY CONTENT: TABEL PENGISIAN KOMPONEN BIAYA (SEPERTI GAMBAR 1) */}
                                        {!isActivityCollapsed && (
                                          <div className="p-4 space-y-3 bg-white">
                                            {/* Subheader persis seperti Gambar 1 */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
                                              <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-[18px]">
                                                  table_chart
                                                </span>
                                                <h5 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                                                  Rincian Anggaran Biaya (RAB)
                                                </h5>
                                                <span className="text-xs text-slate-400 font-normal">
                                                  ({activity.components.length} Komponen)
                                                </span>
                                              </div>
                                              {canEditRAB && (
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  <button
                                                    type="button"
                                                    disabled={isSavingRow}
                                                    onClick={() => handleAddOrContinueRow(activity.id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50">
                                                    <span className="material-symbols-outlined text-[16px]">add</span>
                                                    {isSavingRow && isAddingThis ? "Menyimpan..." : "Tambah Baris Komponen"}
                                                  </button>
                                                  {isAddingThis && (
                                                    <button
                                                      type="button"
                                                      disabled={isSavingRow}
                                                      onClick={() => handleSaveAndFinishRow(activity.id)}
                                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer shadow-xs"
                                                      title="Simpan baris ini dan selesai input">
                                                      <span className="material-symbols-outlined text-[16px]">check</span>
                                                      Simpan Selesai
                                                    </button>
                                                  )}
                                                </div>
                                              )}
                                            </div>

                                            {/* TABEL SESUAI GAMBAR 1 */}
                                            <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
                                              <table className="w-full text-left text-xs border-collapse min-w-[980px]">
                                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                                                  <tr>
                                                    <th className="py-3 px-2 w-8 text-center">No.</th>
                                                    <th className="py-3 px-3 min-w-[180px]">Nama Komponen / Uraian</th>
                                                    <th className="py-3 px-2 w-20 text-center">Qty</th>
                                                    <th className="py-3 px-2 w-24">Satuan</th>
                                                    <th className="py-3 px-2 w-20 text-center">Freq</th>
                                                    <th className="py-3 px-2 w-24">Satuan</th>
                                                    <th className="py-3 px-2.5 min-w-[130px] text-right">
                                                      Biaya Satuan (Rp)
                                                    </th>
                                                    <th className="py-3 px-2.5 min-w-[140px] text-right">
                                                      Total Biaya (Rp)
                                                    </th>
                                                    <th className="py-3 px-3 min-w-[160px]">Keterangan</th>
                                                    <th className="py-3 px-2 w-16 text-center">Aksi</th>
                                                  </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 bg-white">
                                                  {activity.components.length === 0 && !isAddingThis && (
                                                    <tr>
                                                      <td
                                                        colSpan={10}
                                                        className="py-8 text-center text-slate-400 text-xs">
                                                        Belum ada rincian komponen biaya. Klik tombol{" "}
                                                        <button
                                                          onClick={() => handleStartAddRow(activity.id)}
                                                          className="text-primary font-semibold hover:underline">
                                                          + Tambah Baris Komponen
                                                        </button>{" "}
                                                        untuk mulai mengisi.
                                                      </td>
                                                    </tr>
                                                  )}

                                                  {activity.components.map((comp, cIdx) => {
                                                    const isEditingThis = editingCompId === comp.id;

                                                    if (isEditingThis) {
                                                      const curQty = parseFloat(String(editRow.qty)) || 0;
                                                      const curFreq = parseFloat(String(editRow.freq)) || 0;
                                                      const curPrice =
                                                        parseFloat(String(editRow.unit_price).replace(/\D/g, "")) || 0;
                                                      const curTotal = curQty * curFreq * curPrice;

                                                      return (
                                                        <tr key={comp.id} className="bg-amber-50/50">
                                                          <td className="py-2.5 px-2 text-center font-mono text-slate-400">
                                                            {cIdx + 1}
                                                          </td>
                                                          <td className="py-2.5 px-3">
                                                            <input
                                                              type="text"
                                                              value={editRow.name}
                                                              onChange={(e) =>
                                                                setEditRow({ ...editRow, name: e.target.value })
                                                              }
                                                              placeholder="Contoh: Tim Leader / Sewa Kapal"
                                                              className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs"
                                                            />
                                                          </td>
                                                          <td className="py-2.5 px-2">
                                                            <input
                                                              type="number"
                                                              min="0.01"
                                                              step="any"
                                                              value={editRow.qty}
                                                              onChange={(e) =>
                                                                setEditRow({ ...editRow, qty: e.target.value })
                                                              }
                                                              className="w-full text-center bg-white border border-slate-300 rounded-md px-1.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono"
                                                            />
                                                          </td>
                                                          <td className="py-2.5 px-2">
                                                            <input
                                                              type="text"
                                                              value={editRow.unit}
                                                              onChange={(e) =>
                                                                setEditRow({ ...editRow, unit: e.target.value })
                                                              }
                                                              placeholder="paket, orang"
                                                              className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs"
                                                            />
                                                          </td>
                                                          <td className="py-2.5 px-2">
                                                            <input
                                                              type="number"
                                                              min="0.01"
                                                              step="any"
                                                              value={editRow.freq}
                                                              onChange={(e) =>
                                                                setEditRow({ ...editRow, freq: e.target.value })
                                                              }
                                                              className="w-full text-center bg-white border border-slate-300 rounded-md px-1.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono"
                                                            />
                                                          </td>
                                                          <td className="py-2.5 px-2">
                                                            <input
                                                              type="text"
                                                              value={editRow.freq_unit}
                                                              onChange={(e) =>
                                                                setEditRow({ ...editRow, freq_unit: e.target.value })
                                                              }
                                                              placeholder="kali, bulan"
                                                              className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs"
                                                            />
                                                          </td>
                                                          <td className="py-2.5 px-2.5">
                                                            <input
                                                              type="text"
                                                              value={editRow.unit_price}
                                                              onChange={(e) => {
                                                                const raw = e.target.value.replace(/\D/g, "");
                                                                const fmt = raw ? parseInt(raw, 10).toLocaleString("id-ID") : "";
                                                                setEditRow({ ...editRow, unit_price: fmt });
                                                              }}
                                                              placeholder="0"
                                                              className="w-full text-right bg-white border border-slate-300 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono"
                                                            />
                                                          </td>
                                                          <td className="py-2.5 px-2.5 text-right font-mono font-bold text-slate-900">
                                                            {formatRupiah(curTotal)}
                                                          </td>
                                                          <td className="py-2.5 px-3">
                                                            <input
                                                              type="text"
                                                              value={editRow.description}
                                                              onChange={(e) =>
                                                                setEditRow({ ...editRow, description: e.target.value })
                                                              }
                                                              placeholder="Catatan / PIC..."
                                                              className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs"
                                                            />
                                                          </td>
                                                          <td className="py-2.5 px-2 text-center">
                                                            <div className="flex items-center justify-center gap-1">
                                                              <button
                                                                type="button"
                                                                disabled={isSavingRow}
                                                                onClick={handleSaveEditRow}
                                                                className="p-1 text-emerald-600 hover:bg-emerald-100 rounded cursor-pointer"
                                                                title="Simpan perubahan">
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                  check
                                                                </span>
                                                              </button>
                                                              <button
                                                                type="button"
                                                                onClick={handleCancelEditRow}
                                                                className="p-1 text-slate-400 hover:bg-slate-100 rounded cursor-pointer"
                                                                title="Batal">
                                                                <span className="material-symbols-outlined text-[18px]">
                                                                  close
                                                                </span>
                                                              </button>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      );
                                                    }

                                                    return (
                                                      <tr
                                                        key={comp.id}
                                                        className={`hover:bg-slate-50/70 transition-colors ${
                                                          comp.is_over ? "bg-rose-50/40" : ""
                                                        }`}>
                                                        <td className="py-2.5 px-2 text-center text-slate-400 font-medium">
                                                          {cIdx + 1}
                                                        </td>
                                                        <td className="py-2.5 px-3 font-medium text-slate-900">
                                                          <div>
                                                            {comp.name}
                                                            {comp.is_over && (
                                                              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 font-bold">
                                                                Over Budget!
                                                              </span>
                                                            )}
                                                          </div>
                                                        </td>
                                                        <td className="py-2.5 px-2 text-center text-slate-700 font-mono">
                                                          {comp.qty}
                                                        </td>
                                                        <td className="py-2.5 px-2 text-slate-700">
                                                          {comp.unit}
                                                        </td>
                                                        <td className="py-2.5 px-2 text-center text-slate-700 font-mono">
                                                          {comp.freq}
                                                        </td>
                                                        <td className="py-2.5 px-2 text-slate-700">
                                                          {comp.freq_unit}
                                                        </td>
                                                        <td className="py-2.5 px-2.5 text-right font-mono text-slate-800">
                                                          {formatRupiah(comp.unit_price)}
                                                        </td>
                                                        <td className="py-2.5 px-2.5 text-right font-mono font-bold text-slate-900">
                                                          {formatRupiah(comp.total_budget)}
                                                        </td>
                                                        <td className="py-2.5 px-3 text-slate-500 text-[11px] truncate max-w-[200px]">
                                                          {comp.description || "-"}
                                                        </td>
                                                        <td className="py-2.5 px-2 text-center">
                                                          {canEditRAB ? (
                                                            <div className="flex items-center justify-center gap-1">
                                                              <button
                                                                type="button"
                                                                onClick={() => handleStartEditRow(comp)}
                                                                className="p-1 text-slate-400 hover:text-primary hover:bg-slate-100 rounded transition-colors cursor-pointer"
                                                                title="Edit Komponen">
                                                                <span className="material-symbols-outlined text-[17px]">
                                                                  edit
                                                                </span>
                                                              </button>
                                                              <button
                                                                type="button"
                                                                onClick={() =>
                                                                  setDeleteConfirm({
                                                                    type: "component",
                                                                    id: comp.id,
                                                                    title: `Komponen: ${comp.name}`,
                                                                  })
                                                                }
                                                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                                                title="Hapus Komponen">
                                                                <span className="material-symbols-outlined text-[17px]">
                                                                  delete
                                                                </span>
                                                              </button>
                                                            </div>
                                                          ) : (
                                                            <span className="text-slate-300">-</span>
                                                          )}
                                                        </td>
                                                      </tr>
                                                    );
                                                  })}

                                                  {/* BARIS INPUT BARU LANGSUNG DI TABEL (IDENTIK GAMBAR 1) */}
                                                  {isAddingThis && (
                                                    <tr className="bg-emerald-50/40 border-2 border-emerald-300">
                                                      <td className="py-2.5 px-2 text-center font-mono text-emerald-700 font-bold">
                                                        {activity.components.length + 1}
                                                      </td>
                                                      <td className="py-2.5 px-3">
                                                        <input
                                                          type="text"
                                                          autoFocus
                                                          value={newRow.name}
                                                          onChange={(e) =>
                                                            setNewRow({ ...newRow, name: e.target.value })
                                                          }
                                                          placeholder="Contoh: Tim Leader / Sewa Ruangan"
                                                          className="w-full bg-white border border-emerald-400 rounded-md px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs placeholder:text-slate-400"
                                                        />
                                                      </td>
                                                      <td className="py-2.5 px-2">
                                                        <input
                                                          type="number"
                                                          min="0.01"
                                                          step="any"
                                                          value={newRow.qty}
                                                          onChange={(e) =>
                                                            setNewRow({ ...newRow, qty: e.target.value })
                                                          }
                                                          placeholder="1"
                                                          className="w-full text-center bg-white border border-slate-300 rounded-md px-1.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono"
                                                        />
                                                      </td>
                                                      <td className="py-2.5 px-2">
                                                        <input
                                                          type="text"
                                                          value={newRow.unit}
                                                          onChange={(e) =>
                                                            setNewRow({ ...newRow, unit: e.target.value })
                                                          }
                                                          placeholder="paket, orang"
                                                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                                                        />
                                                      </td>
                                                      <td className="py-2.5 px-2">
                                                        <input
                                                          type="number"
                                                          min="0.01"
                                                          step="any"
                                                          value={newRow.freq}
                                                          onChange={(e) =>
                                                            setNewRow({ ...newRow, freq: e.target.value })
                                                          }
                                                          placeholder="1"
                                                          className="w-full text-center bg-white border border-slate-300 rounded-md px-1.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono"
                                                        />
                                                      </td>
                                                      <td className="py-2.5 px-2">
                                                        <input
                                                          type="text"
                                                          value={newRow.freq_unit}
                                                          onChange={(e) =>
                                                            setNewRow({ ...newRow, freq_unit: e.target.value })
                                                          }
                                                          placeholder="kali, bulan"
                                                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                                                        />
                                                      </td>
                                                      <td className="py-2.5 px-2.5">
                                                        <input
                                                          type="text"
                                                          value={newRow.unit_price}
                                                          onChange={(e) => {
                                                            const raw = e.target.value.replace(/\D/g, "");
                                                            const fmt = raw ? parseInt(raw, 10).toLocaleString("id-ID") : "";
                                                            setNewRow({ ...newRow, unit_price: fmt });
                                                          }}
                                                          placeholder="0"
                                                          className="w-full text-right bg-white border border-slate-300 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono placeholder:text-slate-400"
                                                        />
                                                      </td>
                                                      <td className="py-2.5 px-2.5 text-right font-mono font-bold text-slate-900">
                                                        {(() => {
                                                          const q = parseFloat(String(newRow.qty)) || 0;
                                                          const f = parseFloat(String(newRow.freq)) || 0;
                                                          const p = parseFloat(String(newRow.unit_price).replace(/\D/g, "")) || 0;
                                                          return formatRupiah(q * f * p);
                                                        })()}
                                                      </td>
                                                      <td className="py-2.5 px-3">
                                                        <input
                                                          type="text"
                                                          value={newRow.description}
                                                          onChange={(e) =>
                                                            setNewRow({ ...newRow, description: e.target.value })
                                                          }
                                                          placeholder="Keterangan / PIC..."
                                                          className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                                                        />
                                                      </td>
                                                      <td className="py-2.5 px-2 text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                          <button
                                                            type="button"
                                                            disabled={isSavingRow}
                                                            onClick={() => handleSaveNewRow(activity.id)}
                                                            className="p-1.5 text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                                                            title="Simpan Baris Komponen">
                                                            <span className="material-symbols-outlined text-[18px]">
                                                              check
                                                            </span>
                                                          </button>
                                                          <button
                                                            type="button"
                                                            onClick={handleCancelAddRow}
                                                            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                                                            title="Batal">
                                                            <span className="material-symbols-outlined text-[18px]">
                                                              close
                                                            </span>
                                                          </button>
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  )}
                                                </tbody>
                                                <tfoot className="bg-slate-50/80 border-t-2 border-slate-200">
                                                  <tr>
                                                    <td
                                                      colSpan={7}
                                                      className="py-3 px-4 text-right font-bold text-slate-700 uppercase tracking-wider text-xs">
                                                      Total Biaya Komponen:
                                                    </td>
                                                    <td className="py-3 px-2.5 text-right font-mono font-bold text-primary text-sm">
                                                      {formatRupiah(activity.budget)}
                                                    </td>
                                                    <td colSpan={2}></td>
                                                  </tr>
                                                </tfoot>
                                              </table>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* MODAL FORM HANYA UNTUK STRUKTUR: OUTCOME / OUTPUT / AKTIVITAS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {modalMode === "create" ? "Tambah" : "Edit"}{" "}
                {modalType === "outcome"
                  ? "Outcome"
                  : modalType === "output"
                  ? "Output"
                  : "Aktivitas"}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg cursor-pointer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Kode / No
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Contoh: 1.1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Nama / Uraian <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={"Nama " + modalType}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Keterangan / Deskripsi
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Informasi tambahan atau tujuan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 cursor-pointer">
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-sm cursor-pointer">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Hapus Item?</h3>
            <p className="text-xs text-slate-500 mb-6">
              Yakin ingin menghapus <strong>{deleteConfirm.title}</strong>? Seluruh sub-level di bawahnya juga akan
              ikut terhapus.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer">
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition-all cursor-pointer">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INFO / FEEDBACK MODAL */}
      {infoModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                infoModal.type === "success"
                  ? "bg-emerald-50 text-emerald-600"
                  : infoModal.type === "warning"
                  ? "bg-rose-50 text-rose-600"
                  : "bg-blue-50 text-blue-600"
              }`}>
              <span className="material-symbols-outlined text-2xl">
                {infoModal.type === "success" ? "check_circle" : "info"}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">{infoModal.title}</h3>
            <p className="text-xs text-slate-500 mb-6">{infoModal.message}</p>
            <button
              onClick={() => setInfoModal({ ...infoModal, show: false })}
              className="w-full py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
