'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LineItem {
  id: number;
  description: string;
  qty: number;
  price: number;
}

export default function CreateInvoicePage() {
  const [client, setClient] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: '', qty: 1, price: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', qty: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="max-w-[900px] mx-auto space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/invoices"
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Buat Invoice Baru</h2>
          <p className="text-sm text-slate-500">Terbitkan tagihan baru untuk klien</p>
        </div>
      </div>

      {/* Client & Dates */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Informasi Klien</h3>
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Klien</label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Contoh: PT Alpha"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tanggal Terbit</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Jatuh Tempo</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Item Tagihan</h3>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Tambah Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                placeholder="Deskripsi item/jasa"
                className="flex-1 w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm placeholder-slate-400"
              />
              <input
                type="number"
                value={item.qty}
                onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                placeholder="Qty"
                className="w-full sm:w-20 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-mono"
              />
              <input
                type="text"
                value={item.price ? item.price.toLocaleString('id-ID') : ''}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  updateItem(item.id, 'price', rawValue ? parseInt(rawValue, 10) : 0);
                }}
                placeholder="Harga satuan"
                className="w-full sm:w-40 bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-mono"
              />
              <span className="w-full sm:w-40 text-right font-mono text-sm font-medium text-slate-900">
                Rp {(item.qty * item.price).toLocaleString('id-ID')}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total</span>
          <span className="text-2xl font-bold text-primary font-mono">Rp {total.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Catatan Tambahan (Opsional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Instruksi pembayaran, terms & conditions, dsb..."
          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none h-20 placeholder-slate-400"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/invoices"
          className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
        >
          Batal
        </Link>
        <button className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
          Simpan sebagai Draft
        </button>
        <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:brightness-110 transition-colors cursor-pointer shadow-sm">
          Terbitkan Invoice
        </button>
      </div>

    </div>
  );
}