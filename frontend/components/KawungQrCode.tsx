'use client';

import React, { useEffect, useState } from 'react';
import { generateQrWithLogo } from '@/lib/qrWithLogo';

interface KawungQrCodeProps {
  value: string;
  size?: number;
  className?: string;
  downloadFileName?: string;
  showDownloadButton?: boolean;
  badgeStyle?: 'black' | 'maroon' | 'white';
  onReady?: (dataUrl: string) => void;
}

export default function KawungQrCode({
  value,
  size = 240,
  className = '',
  downloadFileName = 'qr-kawung.png',
  showDownloadButton = true,
  badgeStyle = 'black',
  onReady,
}: KawungQrCodeProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    setLoading(true);
    generateQrWithLogo(value, {
      size: 600, // High resolution for ultra crisp scan & print
      logoUrl: '/kawung-icon.png',
      badgeStyle,
      badgeSizePercent: 0.23,
      iconScaleInBadge: 0.74,
    })
      .then((url) => {
        if (isMounted) {
          setQrUrl(url);
          setLoading(false);
          onReady?.(url);
        }
      })
      .catch((err) => {
        console.error('Error generating Kawung QR code:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [value, badgeStyle, onReady]);

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className="relative bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center overflow-hidden"
        style={{ width: size, height: size }}
      >
        {loading || !qrUrl ? (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
            <span className="material-symbols-outlined text-[28px] animate-spin text-primary">
              progress_activity
            </span>
            <span className="text-[11px] font-medium text-slate-400">Menyiapkan QR...</span>
          </div>
        ) : (
          <img
            src={qrUrl}
            alt="QR Code Kawung"
            className="w-full h-full object-contain select-none"
          />
        )}
      </div>

      <p className="text-xs text-slate-400 text-center font-medium">
        Scan untuk membuka halaman ini
      </p>

      {showDownloadButton && (
        <a
          href={qrUrl || '#'}
          download={downloadFileName}
          className={`w-full text-center px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs flex items-center justify-center gap-1.5 ${
            !qrUrl ? 'pointer-events-none opacity-50' : 'cursor-pointer'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-slate-500">download</span>
          Download QR
        </a>
      )}
    </div>
  );
}
