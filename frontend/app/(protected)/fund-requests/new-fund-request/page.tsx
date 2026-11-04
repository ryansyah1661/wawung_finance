"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface RabItem {
  id: string;
  component_id?: number | null;
  komponen: string;
  qty: number | string;
  satuan: string;
  freq: number | string;
  satuanFreq: string;
  biayaSatuan: number | string;
  total: number;
  keterangan: string;
  kodeKategori: string;
  remainingBudget?: number | null;
}

export default function NewFundRequestPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [applicantName, setApplicantName] = useState("");
  const [department, setDepartment] = useState("");
  const [programs, setPrograms] = useState<any[]>([]);
  const [purpose, setPurpose] = useState("");
  const [purposes, setPurposes] = useState<any[]>([]);
  const [rabCategories, setRabCategories] = useState<any[]>([]);
  const [neededDate, setNeededDate] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  // Hierarki LFA: Outcome -> Output -> Activity -> Components
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<number | "">("");
  const [selectedOutputId, setSelectedOutputId] = useState<number | "">("");
  const [selectedActivityId, setSelectedActivityId] = useState<number | "">("");
  const [availableComponents, setAvailableComponents] = useState<any[]>([]);
  const [loadingHierarchy, setLoadingHierarchy] = useState(false);

  // Tabel Komponen / RAB
  const [items, setItems] = useState<RabItem[]>([
    {
      id: "1",
      component_id: null,
      komponen: "",
      qty: 1,
      satuan: "",
      freq: 1,
      satuanFreq: "kali",
      biayaSatuan: "",
      total: 0,
      keterangan: "",
      kodeKategori: "",
      remainingBudget: null,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Filter Keperluan khusus untuk Program yang dipilih
  const filteredPurposes = purposes.filter((p: any) => {
    if (!department) return true;
    if (!p.detail || p.detail === "Semua Program" || p.detail === "Umum") return true;
    return p.detail.trim().toLowerCase() === department.trim().toLowerCase();
  });

  // Fetch Hierarchy for selected Program
  const fetchProgramHierarchy = async (programName: string, programList: any[] = programs) => {
    const prog = programList.find((p: any) => p.name === programName);
    if (!prog || !prog.id) {
      setOutcomes([]);
      setSelectedOutcomeId("");
      setSelectedOutputId("");
      setSelectedActivityId("");
      setAvailableComponents([]);
      return;
    }

    try {
      setLoadingHierarchy(true);
      const res = await api.get(`/programs/${prog.id}/hierarchy`);
      if (res.data?.success) {
        const oList = res.data.outcomes || [];
        setOutcomes(oList);
        setSelectedOutcomeId("");
        setSelectedOutputId("");
        setSelectedActivityId("");
        setAvailableComponents([]);
      }
    } catch (err) {
      console.error("Gagal mengambil hierarki program:", err);
      setOutcomes([]);
    } finally {
      setLoadingHierarchy(false);
    }
  };

  const handleProgramChange = (selectedProg: string) => {
    setDepartment(selectedProg);

    // Match Purpose
    const matching = purposes.filter((p: any) => {
      if (!p.detail || p.detail === "Semua Program" || p.detail === "Umum") return true;
      return p.detail.trim().toLowerCase() === selectedProg.trim().toLowerCase();
    });
    if (matching.length > 0) {
      setPurpose(matching[0].name);
    } else {
      setPurpose("");
    }

    // Fetch Hierarchy
    fetchProgramHierarchy(selectedProg);
  };

  // Outcome / Output / Activity Selection handlers
  const handleOutcomeChange = (oId: number | "") => {
    setSelectedOutcomeId(oId);
    setSelectedOutputId("");
    setSelectedActivityId("");
    setAvailableComponents([]);
  };

  const handleOutputChange = (outId: number | "") => {
    setSelectedOutputId(outId);
    setSelectedActivityId("");
    setAvailableComponents([]);
  };

  const handleActivityChange = (actId: number | "") => {
    setSelectedActivityId(actId);
    if (!actId) {
      setAvailableComponents([]);
      return;
    }

    const curOutcome = outcomes.find((o) => o.id === selectedOutcomeId);
    const curOutput = curOutcome?.outputs?.find((out: any) => out.id === selectedOutputId);
    const curActivity = curOutput?.activities?.find((a: any) => a.id === actId);

    const comps = curActivity?.components || [];
    setAvailableComponents(comps);
  };

  // Prefill applicant from localStorage & Fetch programs and purposes
  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    if (savedName) setApplicantName(savedName);

    const fetchDropdownData = async () => {
      let initialProg = "";
      let progList: any[] = [];

      // 1. Fetch Programs murni dari database
      try {
        const res = await api.get("/categories?type=programs&status=active");
        const data = res.data?.data || res.data;
        progList = Array.isArray(data) ? data : [];
        setPrograms(progList);
        if (progList.length > 0) {
          initialProg = progList[0].name;
          setDepartment(initialProg);
          fetchProgramHierarchy(initialProg, progList);
        }
      } catch (err) {
        console.error("Gagal mengambil program dari database:", err);
        setPrograms([]);
      }

      // 2. Fetch Purposes murni dari database
      try {
        const res = await api.get("/categories?type=purposes&status=active");
        const data = res.data?.data || res.data;
        const purpList = Array.isArray(data) ? data : [];
        setPurposes(purpList);
        if (purpList.length > 0 && initialProg) {
          const matched = purpList.filter((p: any) => {
            if (!p.detail || p.detail === "Semua Program" || p.detail === "Umum") return true;
            return p.detail.trim().toLowerCase() === initialProg.trim().toLowerCase();
          });
          if (matched.length > 0) {
            setPurpose(matched[0].name);
          } else {
            setPurpose(purpList[0].name);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil keperluan dari database:", err);
        setPurposes([]);
      }

      // 3. Fetch Kategori Transaksi / RAB murni dari database
      try {
        const res = await api.get("/categories?type=categories&status=active");
        const data = res.data?.data || res.data;
        const catList = Array.isArray(data) ? data : [];
        catList.sort((a: any, b: any) => {
          const numA = parseInt(a.code, 10);
          const numB = parseInt(b.code, 10);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return (a.code || "").localeCompare(b.code || "");
        });
        setRabCategories(catList);
      } catch (err) {
        console.error("Gagal mengambil kategori RAB:", err);
        setRabCategories([]);
      }
    };

    fetchDropdownData();
  }, []);

  // Hitung perkalian row total: Qty * Freq * Biaya Satuan
  const calculateRowTotal = (qty: number | string, freq: number | string, biayaSatuan: number | string): number => {
    const q = typeof qty === "string" ? parseFloat(qty.replace(/\D/g, "")) || 0 : qty || 0;
    const f = typeof freq === "string" ? parseFloat(freq.replace(/\D/g, "")) || 0 : freq || 0;
    const b = typeof biayaSatuan === "string" ? parseFloat(biayaSatuan.replace(/\D/g, "")) || 0 : biayaSatuan || 0;
    return q * f * b;
  };

  const handleItemChange = (index: number, field: keyof RabItem, value: any) => {
    setItems((prev) => {
      const next = [...prev];
      let formattedValue = value;

      if (field === "biayaSatuan") {
        const rawNum = value.replace(/\D/g, "");
        formattedValue = rawNum ? parseInt(rawNum, 10).toLocaleString("id-ID") : "";
      }

      const updated = { ...next[index], [field]: formattedValue };
      updated.total = calculateRowTotal(updated.qty, updated.freq, updated.biayaSatuan);
      next[index] = updated;
      return next;
    });
  };

  // Pilih dari komponen template RAB yang tersedia
  const handleSelectComponent = (index: number, componentIdStr: string) => {
    if (!componentIdStr || componentIdStr === "custom") {
      setItems((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          component_id: null,
          remainingBudget: null,
        };
        return next;
      });
      return;
    }

    const compId = parseInt(componentIdStr, 10);
    const selectedComp = availableComponents.find((c: any) => c.id === compId);
    if (!selectedComp) return;

    setItems((prev) => {
      const next = [...prev];
      const qty = selectedComp.qty || 1;
      const freq = selectedComp.freq || 1;
      const unitPrice = selectedComp.unit_price || 0;
      const total = qty * freq * unitPrice;

      next[index] = {
        ...next[index],
        component_id: selectedComp.id,
        komponen: selectedComp.name,
        qty: qty,
        satuan: selectedComp.unit || "paket",
        freq: freq,
        satuanFreq: selectedComp.freq_unit || "kali",
        biayaSatuan: Math.round(unitPrice).toLocaleString("id-ID"),
        total: total,
        keterangan: selectedComp.description || "",
        remainingBudget: selectedComp.remaining,
      };
      return next;
    });
  };

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        component_id: null,
        komponen: "",
        qty: 1,
        satuan: "",
        freq: 1,
        satuanFreq: "kali",
        biayaSatuan: "",
        total: 0,
        keterangan: "",
        kodeKategori: "",
        remainingBudget: null,
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Grand Total Biaya
  const grandTotal = items.reduce((sum, item) => sum + (item.total || 0), 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 2 * 1024 * 1024) {
        setValidationError("Ukuran file maksimal 2MB");
        return;
      }
      setAttachment(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicantName || !department || !purpose || !neededDate) {
      setErrorMsg("Harap lengkapi informasi utama (Pemohon, Program, Keperluan, Tanggal)!");
      return;
    }

    if (grandTotal <= 0) {
      setErrorMsg("Total pengajuan tidak boleh Rp 0. Harap isi rincian komponen biaya dengan benar.");
      return;
    }

    const filledItems = items.filter((item) => item.komponen.trim() !== "" || item.total > 0);

    if (filledItems.length === 0) {
      setErrorMsg("Minimal harus ada 1 komponen biaya yang diisi!");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const cleanItems = filledItems.map((item, idx) => ({
        no: idx + 1,
        component_id: item.component_id || null,
        komponen: item.komponen,
        qty: typeof item.qty === "string" ? parseFloat(item.qty) || 0 : item.qty,
        satuan: item.satuan,
        freq: typeof item.freq === "string" ? parseFloat(item.freq) || 0 : item.freq,
        satuan_freq: item.satuanFreq,
        biaya_satuan:
          typeof item.biayaSatuan === "string"
            ? parseInt(item.biayaSatuan.replace(/\D/g, "") || "0", 10)
            : item.biayaSatuan,
        total: item.total,
        keterangan: item.keterangan || "",
        kode_kategori: item.kodeKategori || "",
      }));

      const formData = new FormData();
      formData.append("purpose", purpose);
      formData.append("amount", grandTotal.toString());
      formData.append("need_date", neededDate);
      formData.append("applicant_name", applicantName);
      formData.append("department", department);
      formData.append("items", JSON.stringify(cleanItems));

      // Kirim id hierarki LFA jika dipilih
      if (selectedOutcomeId) formData.append("outcome_id", String(selectedOutcomeId));
      if (selectedOutputId) formData.append("output_id", String(selectedOutputId));
      if (selectedActivityId) formData.append("activity_id", String(selectedActivityId));

      if (description) formData.append("description", description);
      if (attachment) formData.append("attachment", attachment);

      await api.post("/fund-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowSuccessModal(true);
      setTimeout(() => {
        router.push("/fund-requests");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Gagal membuat pengajuan dana. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper untuk mendapatkan list output dan activity dari state hierarki
  const currentOutcome = outcomes.find((o) => o.id === selectedOutcomeId);
  const currentOutputs = currentOutcome?.outputs || [];
  const currentOutput = currentOutputs.find((out: any) => out.id === selectedOutputId);
  const currentActivities = currentOutput?.activities || [];
  const currentActivity = currentActivities.find((a: any) => a.id === selectedActivityId);

  return (
    <div className="max-w-[1080px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/fund-requests"
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pengajuan Dana Baru</h2>
          <p className="text-sm text-slate-500">Ajukan permintaan dana berdasarkan struktur hierarki proyek & RAB</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-600 text-[20px]">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-6">
        {/* Section 1: Informasi Utama */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="material-symbols-outlined text-primary text-[18px]">person</span>
            Informasi Pemohon & Program
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Nama Pemohon <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Contoh: Bangkit / Koordinator Lapangan"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Program <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={department}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer">
                <option value="" disabled>
                  Pilih Program...
                </option>
                {programs.map((prog: any) => (
                  <option key={prog.id || prog.code || prog.name} value={prog.name}>
                    {prog.name}
                  </option>
                ))}
              </select>

              {/* Info Sisa Pagu Anggaran Program */}
              {(() => {
                const prog = programs.find((p: any) => p.name === department);
                if (!prog || Number(prog.budget || 0) <= 0) return null;
                const remaining = Number(prog.remaining ?? (prog.budget || 0));
                const budget = Number(prog.budget || 0);
                const spent = Number(prog.spent || 0);
                const isOver = grandTotal > remaining;

                return (
                  <div className="mt-2 space-y-1.5">
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">
                          account_balance_wallet
                        </span>
                        <span>Sisa Anggaran:</span>
                        <strong className="text-emerald-700 font-mono font-bold">
                          Rp {remaining.toLocaleString("id-ID")}
                        </strong>
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        Anggaran: Rp {budget.toLocaleString("id-ID")} | Terpakai: Rp {spent.toLocaleString("id-ID")}
                      </div>
                    </div>
                    {isOver && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">warning</span>
                        <span>
                          <strong>Peringatan:</strong> Total pengajuan (Rp {grandTotal.toLocaleString("id-ID")})
                          melebihi sisa anggaran program ini (Rp {remaining.toLocaleString("id-ID")}).
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Keperluan <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer">
                {filteredPurposes.length === 0 ? (
                  <option value="" disabled>
                    Belum ada keperluan terdaftar untuk program ini
                  </option>
                ) : (
                  <>
                    <option value="" disabled>
                      Pilih Keperluan...
                    </option>
                    {filteredPurposes.map((purp: any) => (
                      <option key={purp.id || purp.code || purp.name} value={purp.name}>
                        {purp.code ? `[${purp.code}] ${purp.name}` : purp.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Tanggal Pengajuan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={neededDate}
                onChange={(e) => setNeededDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pemilihan Hierarki Proyek (Outcome -> Output -> Aktivitas) */}
        {outcomes.length > 0 && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">account_tree</span>
                Alokasi Hierarki LFA Proyek
              </h3>
              <span className="text-xs text-slate-400">Pilih aktivitas agar komponen biaya terisi otomatis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              {/* 1. Pilih Outcome */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  1. Outcome
                </label>
                <select
                  value={selectedOutcomeId}
                  onChange={(e) => handleOutcomeChange(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-primary">
                  <option value="">-- Pilih Outcome --</option>
                  {outcomes.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.code ? `[${o.code}] ` : ""}
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Pilih Output */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  2. Output
                </label>
                <select
                  disabled={!selectedOutcomeId}
                  value={selectedOutputId}
                  onChange={(e) => handleOutputChange(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-primary disabled:bg-slate-100 disabled:text-slate-400">
                  <option value="">-- Pilih Output --</option>
                  {currentOutputs.map((out: any) => (
                    <option key={out.id} value={out.id}>
                      {out.code ? `[${out.code}] ` : ""}
                      {out.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Pilih Aktivitas */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  3. Aktivitas Kunci
                </label>
                <select
                  disabled={!selectedOutputId}
                  value={selectedActivityId}
                  onChange={(e) => handleActivityChange(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-primary disabled:bg-slate-100 disabled:text-slate-400">
                  <option value="">-- Pilih Aktivitas --</option>
                  {currentActivities.map((act: any) => (
                    <option key={act.id} value={act.id}>
                      {act.code ? `[${act.code}] ` : ""}
                      {act.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Info Aktivitas Terpilih */}
            {currentActivity && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-base">task_alt</span>
                  <span className="font-semibold text-amber-900">Aktivitas: {currentActivity.name}</span>
                </div>
                <div className="font-mono text-amber-900 flex items-center gap-3">
                  <span>Pagu: Rp {Number(currentActivity.budget || 0).toLocaleString("id-ID")}</span>
                  <span>Serapan: Rp {Number(currentActivity.spent || 0).toLocaleString("id-ID")}</span>
                  <span className="font-bold text-emerald-800">
                    Sisa: Rp {Number(currentActivity.remaining || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 3: Tabel Rincian Anggaran Biaya (RAB) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">table_chart</span>
                Rincian Detail Biaya
              </h3>
              {availableComponents.length > 0 && (
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  ✓ Tersedia {availableComponents.length} komponen RAB dari aktivitas terpilih. Anda dapat memilihnya di
                  kolom Komponen.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors cursor-pointer self-start sm:self-auto">
              <span className="material-symbols-outlined text-[16px]">add</span>
              Tambah Baris Komponen
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs border-collapse min-w-[1180px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-2 w-8 text-center">No.</th>
                  {availableComponents.length > 0 && <th className="py-3 px-2 min-w-[170px]">Pilih Dari RAB</th>}
                  <th className="py-3 px-3 min-w-[190px]">Nama Komponen / Uraian</th>
                  <th className="py-3 px-2 w-20 text-center">Qty</th>
                  <th className="py-3 px-2 w-24">Satuan</th>
                  <th className="py-3 px-2 w-20 text-center">Freq</th>
                  <th className="py-3 px-2 w-24">Satuan</th>
                  <th className="py-3 px-2.5 min-w-[130px] text-right">Biaya Satuan (Rp)</th>
                  <th className="py-3 px-2.5 min-w-[140px] text-right">Total Biaya (Rp)</th>
                  <th className="py-3 px-3 min-w-[170px]">Keterangan</th>
                  <th className="py-3 px-2.5 min-w-[160px]">Kode Kategori</th>
                  <th className="py-3 px-2 w-12 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((item, index) => {
                  const isOverRemaining =
                    item.remainingBudget !== null &&
                    item.remainingBudget !== undefined &&
                    item.total > item.remainingBudget;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/70 transition-colors ${isOverRemaining ? "bg-amber-50/40" : ""}`}>
                      <td className="py-2.5 px-2 text-center text-slate-400 font-medium">{index + 1}</td>

                      {/* Dropdown template RAB jika ada aktivitas yang dipilih */}
                      {availableComponents.length > 0 && (
                        <td className="py-2.5 px-2">
                          <select
                            value={item.component_id || ""}
                            onChange={(e) => handleSelectComponent(index, e.target.value)}
                            className="w-full bg-emerald-50/50 border border-emerald-300 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-medium cursor-pointer">
                            <option value="">-- Pilih Template RAB --</option>
                            {availableComponents.map((c: any) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                            <option value="custom">(Item Kustom / Bebas)</option>
                          </select>
                        </td>
                      )}

                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={item.komponen}
                          onChange={(e) => handleItemChange(index, "komponen", e.target.value)}
                          placeholder="Contoh: Sewa ruangan / Tim Leader"
                          className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                        />
                        {isOverRemaining && (
                          <span className="text-[10px] text-amber-700 block mt-0.5 font-medium">
                            ⚠️ Melebihi sisa pagu komponen (Sisa: Rp{" "}
                            {Math.round(item.remainingBudget || 0).toLocaleString("id-ID")})
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                          placeholder="0"
                          className="w-full text-center bg-white border border-slate-200 rounded-md px-1.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono"
                        />
                      </td>

                      <td className="py-2.5 px-2">
                        <input
                          type="text"
                          value={item.satuan}
                          onChange={(e) => handleItemChange(index, "satuan", e.target.value)}
                          placeholder="orang, unit"
                          className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                        />
                      </td>

                      <td className="py-2.5 px-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.freq}
                          onChange={(e) => handleItemChange(index, "freq", e.target.value)}
                          placeholder="1"
                          className="w-full text-center bg-white border border-slate-200 rounded-md px-1.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono"
                        />
                      </td>

                      <td className="py-2.5 px-2">
                        <input
                          type="text"
                          value={item.satuanFreq}
                          onChange={(e) => handleItemChange(index, "satuanFreq", e.target.value)}
                          placeholder="bulan, kali"
                          className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                        />
                      </td>

                      <td className="py-2.5 px-2.5">
                        <input
                          type="text"
                          value={item.biayaSatuan}
                          onChange={(e) => handleItemChange(index, "biayaSatuan", e.target.value)}
                          placeholder="0"
                          className="w-full text-right bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs font-mono placeholder:text-slate-400"
                        />
                      </td>

                      <td className="py-2.5 px-2.5 text-right">
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          Rp {item.total.toLocaleString("id-ID")}
                        </span>
                      </td>

                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={item.keterangan}
                          onChange={(e) => handleItemChange(index, "keterangan", e.target.value)}
                          placeholder="Contoh: deffa / biaya sewa"
                          className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs placeholder:text-slate-400"
                        />
                      </td>

                      <td className="py-2.5 px-2.5">
                        <select
                          value={item.kodeKategori}
                          onChange={(e) => handleItemChange(index, "kodeKategori", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-slate-900 focus:outline-none focus:border-primary text-xs cursor-pointer font-mono">
                          <option value="">Pilih Kategori...</option>
                          {rabCategories.map((k: any) => (
                            <option key={k.id || k.code || k.name} value={k.code}>
                              {k.code} - {k.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2.5 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeRow(index)}
                          disabled={items.length <= 1}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Hapus baris">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50/80 border-t-2 border-slate-200">
                <tr>
                  <td
                    colSpan={availableComponents.length > 0 ? 8 : 7}
                    className="py-3 px-4 text-right font-bold text-slate-700 uppercase tracking-wider text-xs">
                    Total Biaya Komponen:
                  </td>
                  <td className="py-3 px-2.5 text-right">
                    <span className="font-mono font-bold text-primary text-sm">
                      Rp {grandTotal.toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Reference Card: Kode Kategori */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
            <span className="font-bold text-slate-700 block mb-1.5">Kode Kategori:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1.5 text-[11px]">
              {rabCategories.map((k: any) => (
                <div key={k.id || k.code || k.name} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold font-mono flex items-center justify-center text-[10px] shrink-0">
                    {k.code || k.id}
                  </span>
                  <span className="truncate text-slate-700 font-medium">{k.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Keterangan Tambahan & Lampiran */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Penjelasan / Catatan Keperluan (Opsional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail latar belakang kegiatan, kerangka acuan kegiatan (KAK), atau keterangan penting lainnya..."
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none h-24 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Lampiran Pendukung / Berkas KAK (WAJIB)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".png,.jpg,.jpeg,.pdf"
            />
            {attachment ? (
              <div className="relative border border-slate-200 rounded-lg p-3 flex items-center gap-4 bg-slate-50">
                {attachment.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(attachment)}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-lg border border-slate-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px]">picture_as_pdf</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{attachment.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(attachment.size / 1024 / 1024).toFixed(2)} MB • Siap diupload
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAttachment(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors cursor-pointer bg-slate-50/50">
                <span className="material-symbols-outlined text-slate-400 text-[26px]">attachment</span>
                <p className="text-sm text-slate-600 font-medium">Klik untuk upload berkas lampiran pendukung</p>
                <p className="text-xs text-slate-400">PNG, JPG, PDF maksimal 2MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0 mt-0.5">info</span>
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
            Pengajuan dana RAB ini akan tercatat dengan status <span className="font-semibold">Pending Approval</span>{" "}
            dan secara otomatis terhubung dengan serapan anggaran program setelah diverifikasi dan disetujui.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/fund-requests"
            className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:brightness-110 transition-colors cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2">
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Mengirim...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">send</span>
                Ajukan Dana
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal Sukses */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Berhasil Diajukan!</h3>
            <p className="text-slate-500 text-sm mb-6">Pengajuan dana beserta alokasi hierarki RAB berhasil dibuat.</p>
          </div>
        </div>
      )}

      {/* Validation / Error Modal */}
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pemberitahuan</h3>
            <p className="text-slate-500 text-sm mb-6">{validationError}</p>
            <button
              onClick={() => setValidationError("")}
              className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:brightness-110 transition-colors cursor-pointer">
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
