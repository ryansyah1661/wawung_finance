'use client';

import React, { useState } from 'react';

const INITIAL_NOTIFS = [
    { id: 1, label: 'Pengajuan baru menunggu approval', desc: 'Dapatkan notifikasi saat ada fund request atau reimbursement baru', enabled: true },
    { id: 2, label: 'Invoice jatuh tempo', desc: 'Pengingat 3 hari sebelum invoice jatuh tempo', enabled: true },
    { id: 3, label: 'Transaksi besar', desc: 'Notifikasi untuk transaksi di atas Rp 10.000.000', enabled: false },
    { id: 4, label: 'Ringkasan mingguan', desc: 'Laporan ringkas performa keuangan tiap Senin pagi', enabled: true },
];

export default function NotificationTab() {
    const [notifications, setNotifications] = useState(INITIAL_NOTIFS);

    const toggleNotif = (id: number) => {
        setNotifications((prev) =>
            prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
        );
    };

    return (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 space-y-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-5">Preferensi Notifikasi</h3>

            {notifications.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                    <div className="pr-4">
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => toggleNotif(item.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${item.enabled ? 'bg-primary' : 'bg-slate-200'
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${item.enabled ? 'left-5' : 'left-0.5'
                                }`}
                        ></span>
                    </button>
                </div>
            ))}
        </div>
    );
}