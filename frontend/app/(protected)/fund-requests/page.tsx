'use client';

import React, { useState } from 'react';

export default function FundRequestsPage() {
  const [approvalNote, setApprovalNote] = useState('');

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      
      {/* Page Header & Print Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Detail Pengajuan Dana #PD-001</h2>
            <div className="px-2.5 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-700 flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">hourglass_empty</span>
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Approval</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">Created on Oct 24, 2023 at 09:45 AM</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all text-sm font-semibold shadow-sm cursor-pointer self-start sm:self-auto">
          <span className="material-symbols-outlined text-[18px]">print</span>
          Print Document
        </button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Informasi Utama & Lampiran */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Informasi Utama Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">info</span>
              Informasi Utama
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nomor Pengajuan</p>
                <p className="font-mono text-sm font-medium text-slate-900">PD-2023-10-001</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tanggal Kebutuhan</p>
                <p className="text-sm text-slate-900 font-medium">26 Oktober 2023</p>
              </div>
              
              <div className="col-span-full">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pemohon</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    DR
                  </div>
                  <div>
                    <p className="text-sm text-slate-900 font-medium">Dina Rahmawati</p>
                    <p className="text-xs text-slate-500">Marketing Department</p>
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Keperluan</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 leading-relaxed">
                  Biaya transportasi kunjungan klien PT. Maju Bersama di kawasan Sudirman, termasuk bensin dan tol.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Jumlah Pengajuan</p>
              <p className="text-2xl lg:text-3xl text-primary font-bold font-mono tracking-tight">
                Rp 350.000
              </p>
            </div>
          </div>

          {/* Lampiran Pendukung Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">attachment</span>
              Lampiran Pendukung
            </h3>
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50 group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">image</span>
                </div>
                <div>
                  <p className="text-sm text-slate-900 font-medium group-hover:text-primary transition-colors">nota_transport.jpg</p>
                  <p className="text-xs text-slate-500">1.2 MB • Uploaded Oct 24</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-colors cursor-pointer shadow-sm" title="Preview">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                </button>
                <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-colors cursor-pointer shadow-sm" title="Download">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Approval Action & Timeline */}
        <div className="space-y-6">
          
          {/* Approval Action Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Approval Action</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Catatan Approval (Opsional)</label>
                <textarea 
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none h-24 transition-all" 
                  placeholder="Masukkan catatan atau alasan..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-2.5 px-4 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  Reject
                </button>
                <button className="flex-1 py-2.5 px-4 bg-primary text-white hover:brightness-110 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  Approve
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Timeline</h3>
            <div className="relative pl-4 space-y-6 before:absolute before:inset-y-2 before:left-[7px] before:w-px before:bg-slate-200">
              
              <div className="relative">
                <div className="absolute -left-[23px] w-3 h-3 bg-primary rounded-full ring-4 ring-white shadow-sm"></div>
                <p className="text-sm text-slate-900 font-medium">Pending Approval</p>
                <p className="text-xs text-slate-500 mt-0.5">Menunggu respon Superadmin</p>
              </div>

              <div className="relative">
                <div className="absolute -left-[23px] w-3 h-3 bg-slate-100 border-2 border-slate-300 rounded-full ring-4 ring-white"></div>
                <p className="text-sm text-slate-500 font-medium">Created</p>
                <p className="text-xs text-slate-500 mt-0.5">Oleh Dina Rahmawati</p>
                <p className="font-mono text-xs text-slate-400 mt-1">Oct 24, 09:45 AM</p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}