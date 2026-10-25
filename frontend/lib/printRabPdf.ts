/**
 * Utility to generate and print / download PDF for Rancangan Anggaran Biaya (RAB)
 * Formatted exactly to match the official Kawungpitu Institute Excel template.
 */

export interface FundRequestPrintData {
  id?: number | string;
  request_number?: string;
  applicant_name?: string;
  requester?: string;
  department?: string;
  purpose?: string;
  description?: string;
  amount: number | string;
  need_date?: string;
  created_at?: string;
  status?: string;
  items?: any;
}

export const KODE_KATEGORI_MAP: Record<string, string> = {
  '1': 'Biaya Transport',
  '2': 'Biaya Konsumsi',
  '3': 'Biaya Akomodasi',
  '4': 'Biaya Peralatan/Perlengkapan',
  '5': 'ATK',
  '6': 'Honorarium/Uang harian/Upah',
  '7': 'Lain-Lain',
};

export function printRabPdf(data: FundRequestPrintData) {
  const reqNumber = data.request_number || `#${data.id || '-'}`;
  const applicant = data.applicant_name || data.requester || 'Bangkit/ Koordinator Lapangan';
  const department = data.department || 'Operasional';
  const purpose = data.purpose || '-';

  // Format Dates
  const needDateObj = data.need_date ? new Date(data.need_date) : new Date();
  const formattedNeedDate = needDateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const createdDateObj = data.created_at ? new Date(data.created_at) : new Date();
  const formattedCreatedDate = createdDateObj.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Parse items
  let itemsList: any[] = [];
  if (Array.isArray(data.items)) {
    itemsList = data.items;
  } else if (typeof data.items === 'string') {
    try {
      itemsList = JSON.parse(data.items);
    } catch {
      itemsList = [];
    }
  }

  // Fallback if no items list
  if (!itemsList || itemsList.length === 0) {
    itemsList = [
      {
        no: 1,
        komponen: purpose,
        qty: 1,
        satuan: 'paket',
        freq: 1,
        satuan_freq: 'kegiatan',
        biaya_satuan: Number(data.amount) || 0,
        total: Number(data.amount) || 0,
        keterangan: data.description || '-',
        kode_kategori: '7',
      },
    ];
  }

  const grandTotal = itemsList.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0) || (Number(data.amount) || 0);

  // Generate table rows HTML
  const tableRowsHtml = itemsList
    .map((item, idx) => {
      const no = item.no || idx + 1;
      const komponen = item.komponen || '-';
      const qty = item.qty ?? '-';
      const satuan = item.satuan || '-';
      const freq = item.freq ?? '-';
      const satuanFreq = item.satuan_freq || item.satuanFreq || '-';
      const biayaSatuan = Number(item.biaya_satuan || item.biayaSatuan || 0).toLocaleString('id-ID');
      const totalNum = Number(item.total || 0);
      const totalStr = totalNum === 0 ? '-' : totalNum.toLocaleString('id-ID');
      const keterangan = item.keterangan || '-';
      const kodeKategori = item.kode_kategori || item.kodeKategori || '-';

      return `
        <tr>
          <td style="text-align: center;">${no}</td>
          <td>${komponen}</td>
          <td style="text-align: center;">${qty}</td>
          <td style="text-align: center;">${satuan}</td>
          <td style="text-align: center;">${freq}</td>
          <td style="text-align: center;">${satuanFreq}</td>
          <td style="text-align: right;">Rp ${biayaSatuan}</td>
          <td style="text-align: right; font-weight: 600;">Rp ${totalStr}</td>
          <td style="font-size: 9.5px; color: #374151;">${keterangan}</td>
          <td style="text-align: center; font-weight: bold;">${kodeKategori}</td>
        </tr>
      `;
    })
    .join('');

  // Open popup print window
  const printWindow = window.open('', '_blank', 'width=1050,height=800');
  if (!printWindow) {
    alert('Harap izinkan popup di browser Anda untuk mencetak / mendownload PDF.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>RAB_${reqNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 10mm 12mm;
        }
        * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        body {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10.5px;
          line-height: 1.35;
          color: #111827;
          margin: 0;
          padding: 16px;
          background: #fff;
        }

        /* Top Header */
        .doc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          border-bottom: 2px solid #70080b;
          padding-bottom: 12px;
        }
        .doc-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .doc-logo {
          width: 52px;
          height: 52px;
          object-fit: contain;
        }
        .doc-brand-text h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          color: #70080b;
          letter-spacing: -0.5px;
        }
        .doc-brand-text p {
          margin: 1px 0 0;
          font-size: 10px;
          font-weight: 700;
          color: #4b5563;
          letter-spacing: 1px;
        }

        .header-title {
          text-align: right;
        }
        .header-title h1 {
          font-size: 15px;
          font-weight: 900;
          margin: 0;
          color: #111;
          letter-spacing: 0.5px;
        }
        .header-title h2 {
          font-size: 12px;
          font-weight: 700;
          margin: 2px 0 0;
          color: #374151;
        }
        .header-title p {
          font-size: 10px;
          color: #6b7280;
          margin: 2px 0 0;
        }
        
        .meta-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14px;
        }
        .meta-table td {
          padding: 2.5px 4px;
          vertical-align: top;
          font-size: 10.5px;
        }
        .meta-table .label {
          width: 150px;
          font-weight: bold;
          color: #374151;
        }
        .meta-table .colon {
          width: 12px;
          font-weight: bold;
        }
        
        /* Table Layout Container */
        .table-container {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .rab-table {
          flex: 1;
          border-collapse: collapse;
        }
        .rab-table th, .rab-table td {
          border: 1px solid #374151;
          padding: 5px 6px;
          font-size: 10px;
        }
        .rab-table th {
          background-color: #f3f4f6 !important;
          font-weight: bold;
          text-align: center;
          color: #111827;
        }
        .rab-table tfoot td {
          font-weight: bold;
          background-color: #f9fafb !important;
        }

        /* Category Legend Box (As shown on Excel column L/M) */
        .category-legend {
          width: 190px;
          border: 1px solid #9ca3af;
          border-collapse: collapse;
          font-size: 9.5px;
          background: #fbfbfb;
          shrink: 0;
        }
        .category-legend th {
          background: #e5e7eb;
          border-bottom: 1px solid #9ca3af;
          padding: 4px 6px;
          text-align: left;
          font-weight: bold;
          font-size: 10px;
        }
        .category-legend td {
          padding: 3px 6px;
          border-bottom: 1px solid #e5e7eb;
        }
        .category-legend .cat-id {
          font-weight: bold;
          width: 20px;
          text-align: center;
        }

        .signatures-section {
          width: 100%;
          margin-top: 18px;
          page-break-inside: avoid;
        }
        .sig-date {
          text-align: left;
          margin-bottom: 10px;
          font-weight: 600;
          font-size: 10.5px;
        }
        .sig-grid {
          display: table;
          width: 100%;
          border-collapse: collapse;
        }
        .sig-col {
          display: table-cell;
          width: 25%;
          text-align: left;
          vertical-align: top;
          padding: 0 10px;
        }
        .sig-role-title {
          font-size: 10px;
          font-weight: 600;
          margin-bottom: 55px;
          color: #374151;
        }
        .sig-name {
          font-size: 10.5px;
          font-weight: bold;
          text-decoration: underline;
          color: #111;
        }
        .sig-position {
          font-size: 9.5px;
          color: #4b5563;
          margin-top: 1px;
        }

        .notes-section {
          margin-top: 20px;
          font-size: 9px;
          color: #4b5563;
          font-style: italic;
          border-top: 1px dashed #d1d5db;
          padding-top: 8px;
          page-break-inside: avoid;
        }

        /* Screen controls */
        .no-print-bar {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: -16px -16px 16px -16px;
        }
        .btn-print {
          background: #70080b;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 12px;
        }
        .btn-print:hover {
          background: #8e0b10;
        }
        @media print {
          .no-print-bar {
            display: none !important;
          }
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print-bar">
        <div style="font-weight: 600; color: #334155;">Preview Dokumen Rancangan Anggaran Biaya (RAB) — Format Resmi</div>
        <button class="btn-print" onclick="window.print()">Cetak / Simpan PDF</button>
      </div>

      <div class="doc-header">
        <div class="doc-brand">
          <img src="/images/kawung.png" class="doc-logo" alt="Logo Kawungpitu" onerror="this.style.display='none'" />
          <div class="doc-brand-text">
            <h3>KAWUNGPITU</h3>
            <p>INSTITUTE</p>
          </div>
        </div>
        <div class="header-title">
          <h1>RANCANGAN ANGGARAN BIAYA</h1>
          <h2>PROGRAM SURADIRA FOLU-NC4</h2>
          <p>No. Pengajuan: <strong>${reqNumber}</strong></p>
        </div>
      </div>

      <table class="meta-table">
        <tr>
          <td class="label">Kode</td>
          <td class="colon">:</td>
          <td><strong>${reqNumber}</strong></td>
        </tr>
        <tr>
          <td class="label">Nama /Jabatan</td>
          <td class="colon">:</td>
          <td><strong>${applicant}</strong></td>
        </tr>
        <tr>
          <td class="label">Program</td>
          <td class="colon">:</td>
          <td><strong>${department}</strong></td>
        </tr>
        <tr>
          <td class="label">Keperluan</td>
          <td class="colon">:</td>
          <td>${purpose}</td>
        </tr>
        <tr>
          <td class="label">Tanggal Kegiatan</td>
          <td class="colon">:</td>
          <td>${formattedNeedDate}</td>
        </tr>
        <tr>
          <td class="label">Kategori Biaya</td>
          <td class="colon">:</td>
          <td>Kegiatan Operasional</td>
        </tr>
      </table>

      <div class="table-container">
        <table class="rab-table">
          <thead>
            <tr>
              <th style="width: 28px;">No.</th>
              <th>Komponen</th>
              <th style="width: 45px;">Qty</th>
              <th style="width: 55px;">Satuan</th>
              <th style="width: 45px;">Freq</th>
              <th style="width: 55px;">Satuan</th>
              <th style="width: 105px;">Biaya Satuan</th>
              <th style="width: 110px;">Total Biaya</th>
              <th style="width: 140px;">Keterangan</th>
              <th style="width: 65px;">ID (Kode Kategori)</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7" style="text-align: right; padding-right: 12px; font-weight: bold; text-transform: uppercase;">
                TOTAL
              </td>
              <td style="text-align: right; font-weight: bold; color: #70080b; font-size: 11px;">
                Rp ${grandTotal.toLocaleString('id-ID')}
              </td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>

        <!-- Kode Kategori Legend (Like in Excel) -->
        <table class="category-legend">
          <thead>
            <tr>
              <th colspan="2">Kode Kategori:</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="cat-id">1</td><td>Biaya Transport</td></tr>
            <tr><td class="cat-id">2</td><td>Biaya Konsumsi</td></tr>
            <tr><td class="cat-id">3</td><td>Biaya Akomodasi</td></tr>
            <tr><td class="cat-id">4</td><td>Biaya Peralatan/Perlengkapan</td></tr>
            <tr><td class="cat-id">5</td><td>ATK</td></tr>
            <tr><td class="cat-id">6</td><td>Honorarium/Uang harian/Upah</td></tr>
            <tr><td class="cat-id">7</td><td>Lain-Lain</td></tr>
          </tbody>
        </table>
      </div>

      <div class="signatures-section">
        <div class="sig-date">Bogor, ${formattedCreatedDate}</div>
        <div class="sig-grid">
          <div class="sig-col">
            <div class="sig-role-title">Diajukan oleh,</div>
            <div class="sig-name">${applicant.split('/')[0].trim()}</div>
            <div class="sig-position">${department}</div>
          </div>
          <div class="sig-col">
            <div class="sig-role-title">Diperiksa oleh,</div>
            <div class="sig-name">Kintan Nur Afrilita</div>
            <div class="sig-position">Finance Admin</div>
          </div>
          <div class="sig-col">
            <div class="sig-role-title">Disetujui oleh,</div>
            <div class="sig-name">Yolan Yussy Sukaesih</div>
            <div class="sig-position">Pengelola Dana Operasional</div>
          </div>
          <div class="sig-col">
            <div class="sig-role-title">Disetujui oleh,</div>
            <div class="sig-name">B. Jagat Patria</div>
            <div class="sig-position">Koordinator Kegiatan</div>
          </div>
        </div>
      </div>

      <div class="notes-section">
        <div>* Formulir ini diisi untuk mengajukan Rancangan Anggaran Biaya (RAB).</div>
        <div>* RAB yang diajukan wajib disertai dengan Kerangka Acuan Kegiatan (KAK).</div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 350);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
