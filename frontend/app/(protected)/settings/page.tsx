'use client';

import React, { useState } from 'react';
import ProfileTab from '@/components/settings/ProfileTab';
import CompanyTab from '@/components/settings/CompanyTab';
import SecurityTab from '@/components/settings/SecurityTab';
import NotificationTab from '@/components/settings/NotificationTab';

type TabKey = 'profile' | 'company' | 'security' | 'notifications';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'profile', label: 'Profil', icon: 'person' },
  { key: 'company', label: 'Perusahaan', icon: 'apartment' },
  { key: 'security', label: 'Keamanan', icon: 'lock' },
  { key: 'notifications', label: 'Notifikasi', icon: 'notifications' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  return (
    <div className="max-w-250 mx-auto space-y-6">

      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola profil, perusahaan, dan preferensi aplikasi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-1.5 flex lg:flex-col gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'company' && <CompanyTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'notifications' && <NotificationTab />}
        </div>

      </div>

    </div>
  );
}