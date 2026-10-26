<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // Kategori Transaksi / RAB (Sesuai template resmi Excel: 1 s/d 7)
            ['code' => '1', 'name' => 'Biaya Transport', 'detail' => 'Transportasi & Perjalanan', 'type' => 'categories', 'status' => 'active'],
            ['code' => '2', 'name' => 'Biaya Konsumsi', 'detail' => 'Konsumsi Rapat & Lapangan', 'type' => 'categories', 'status' => 'active'],
            ['code' => '3', 'name' => 'Biaya Akomodasi', 'detail' => 'Penginapan & Akomodasi', 'type' => 'categories', 'status' => 'active'],
            ['code' => '4', 'name' => 'Biaya Peralatan/Perlengkapan', 'detail' => 'Alat & Perlengkapan Kerja', 'type' => 'categories', 'status' => 'active'],
            ['code' => '5', 'name' => 'ATK', 'detail' => 'Alat Tulis Kantor & Cetak', 'type' => 'categories', 'status' => 'active'],
            ['code' => '6', 'name' => 'Honorarium/Uang harian/Upah', 'detail' => 'Honorarium, Upah Kerja & Uang Harian', 'type' => 'categories', 'status' => 'active'],
            ['code' => '7', 'name' => 'Lain-Lain', 'detail' => 'Pengeluaran Lainnya', 'type' => 'categories', 'status' => 'active'],

            // Programs
            ['code' => 'PRG-001', 'name' => 'SURADIRA FOLU-NC4', 'detail' => 'Program Utama', 'type' => 'programs', 'status' => 'active'],
            ['code' => 'PRG-002', 'name' => 'REHABILITASI MANGROVE', 'detail' => 'Program Konservasi', 'type' => 'programs', 'status' => 'active'],
            ['code' => 'PRG-003', 'name' => 'PEMBERDAYAAN MASYARAKAT', 'detail' => 'Program Sosial', 'type' => 'programs', 'status' => 'active'],
            ['code' => 'PRG-004', 'name' => 'KONSERVASI HUTAN', 'detail' => 'Program Konservasi', 'type' => 'programs', 'status' => 'active'],
            ['code' => 'PRG-005', 'name' => 'PENDAMPINGAN DESA', 'detail' => 'Program Wilayah', 'type' => 'programs', 'status' => 'active'],

            // Purposes / Keperluan (Dihubungkan ke Program masing-masing via kolom 'detail')
            // Program: SURADIRA FOLU-NC4
            ['code' => 'B.2.2.1', 'name' => 'Visioning dan penyusunan rancangan teknis rehabilitasi mangrove', 'detail' => 'SURADIRA FOLU-NC4', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'B.2.2.2', 'name' => 'Sosialisasi program FOLU-NC4 kepada masyarakat', 'detail' => 'SURADIRA FOLU-NC4', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'B.2.2.3', 'name' => 'Pelatihan teknis lapangan tim pelaksana', 'detail' => 'SURADIRA FOLU-NC4', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'B.2.2.4', 'name' => 'Monitoring dan evaluasi berkala kegiatan', 'detail' => 'SURADIRA FOLU-NC4', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'B.2.2.5', 'name' => 'Rapat koordinasi stakeholder FOLU-NC4', 'detail' => 'SURADIRA FOLU-NC4', 'type' => 'purposes', 'status' => 'active'],

            // Program: REHABILITASI MANGROVE
            ['code' => 'MNG-001', 'name' => 'Pengadaan bibit mangrove dan peralatan tanam', 'detail' => 'REHABILITASI MANGROVE', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'MNG-002', 'name' => 'Aksi penanaman mangrove bersama komunitas', 'detail' => 'REHABILITASI MANGROVE', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'MNG-003', 'name' => 'Perjalanan dinas survei pesisir dan lokasi tanam', 'detail' => 'REHABILITASI MANGROVE', 'type' => 'purposes', 'status' => 'active'],

            // Program: PEMBERDAYAAN MASYARAKAT
            ['code' => 'PM-001', 'name' => 'Workshop kewirausahaan desa binaan', 'detail' => 'PEMBERDAYAAN MASYARAKAT', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'PM-002', 'name' => 'Fasilitasi bantuan sarana ekonomi kelompok warga', 'detail' => 'PEMBERDAYAAN MASYARAKAT', 'type' => 'purposes', 'status' => 'active'],

            // Program: KONSERVASI HUTAN
            ['code' => 'KH-001', 'name' => 'Patroli pengamanan kawasan hutan', 'detail' => 'KONSERVASI HUTAN', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'KH-002', 'name' => 'Pemasangan plang dan batas kawasan konservasi', 'detail' => 'KONSERVASI HUTAN', 'type' => 'purposes', 'status' => 'active'],

            // Program: PENDAMPINGAN DESA
            ['code' => 'PD-001', 'name' => 'Musyawarah desa dan pemetaan potensi wilayah', 'detail' => 'PENDAMPINGAN DESA', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'PD-002', 'name' => 'Penyusunan rencana kerja tindak lanjut desa', 'detail' => 'PENDAMPINGAN DESA', 'type' => 'purposes', 'status' => 'active'],

            // Kategori Barang Inventaris (Aset Tetap / Peralatan Modal)
            ['code' => 'INV-CAT-001', 'name' => 'Elektronik & IT', 'detail' => 'Peralatan Komputer, Laptop, Printer & Gadget', 'type' => 'inventory_categories', 'status' => 'active'],
            ['code' => 'INV-CAT-002', 'name' => 'Peralatan Lapangan & Riset', 'detail' => 'Alat Survei, GPS, Drone, Kamera Trap & Tenda', 'type' => 'inventory_categories', 'status' => 'active'],
            ['code' => 'INV-CAT-003', 'name' => 'Mesin & Alat Kerja Berat', 'detail' => 'Genset, Pompa Air & Mesin Pengolah/Potong', 'type' => 'inventory_categories', 'status' => 'active'],
            ['code' => 'INV-CAT-004', 'name' => 'Kendaraan Operasional', 'detail' => 'Mobil Dinas, Motor Lapangan & Perahu', 'type' => 'inventory_categories', 'status' => 'active'],
            ['code' => 'INV-CAT-005', 'name' => 'Furnitur & Sarana Kantor', 'detail' => 'Meja Rapat, Lemari Besi, AC & Fasilitas Kantor', 'type' => 'inventory_categories', 'status' => 'active'],
        ];

        foreach ($items as $item) {
            Category::updateOrCreate(
                ['code' => $item['code']],
                $item
            );
        }
    }
}
