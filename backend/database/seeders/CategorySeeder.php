<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // Programs
            ['code' => 'PRG-001', 'name' => 'SURADIRA FOLU-NC4', 'detail' => 'Program Utama', 'type' => 'programs', 'status' => 'active'],
            ['code' => 'PRG-002', 'name' => 'REHABILITASI MANGROVE', 'detail' => 'Program Konservasi', 'type' => 'programs', 'status' => 'active'],
            ['code' => 'PRG-003', 'name' => 'PEMBERDAYAAN MASYARAKAT', 'detail' => 'Program Sosial', 'type' => 'programs', 'status' => 'active'],
            ['code' => 'PRG-004', 'name' => 'KONSERVASI HUTAN', 'detail' => 'Program Konservasi', 'type' => 'programs', 'status' => 'active'],
            ['code' => 'PRG-005', 'name' => 'PENDAMPINGAN DESA', 'detail' => 'Program Wilayah', 'type' => 'programs', 'status' => 'active'],

            // Purposes / Keperluan
            ['code' => 'KPR-001', 'name' => 'Visioning dan penyusunan rancangan teknis rehabilitasi mangrove', 'detail' => 'Rantek', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'KPR-002', 'name' => 'Sosialisasi program kepada masyarakat', 'detail' => 'Sosialisasi', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'KPR-003', 'name' => 'Pelatihan teknis lapangan', 'detail' => 'Pelatihan', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'KPR-004', 'name' => 'Monitoring dan evaluasi kegiatan', 'detail' => 'Monev', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'KPR-005', 'name' => 'Rapat koordinasi internal', 'detail' => 'Rakor', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'KPR-006', 'name' => 'Pengadaan peralatan lapangan', 'detail' => 'Pengadaan', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'KPR-007', 'name' => 'Perjalanan dinas / kunjungan lapangan', 'detail' => 'Perdin', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'KPR-008', 'name' => 'Workshop dan seminar', 'detail' => 'Event', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'KPR-009', 'name' => 'Penyusunan laporan kegiatan', 'detail' => 'Pelaporan', 'type' => 'purposes', 'status' => 'active'],
            ['code' => 'KPR-010', 'name' => 'Biaya operasional kantor', 'detail' => 'Operasional', 'type' => 'purposes', 'status' => 'active'],

            // Kategori Barang Inventaris (Berdasarkan WhatsApp)
            ['code' => 'INV-CAT-001', 'name' => 'Barang Habis Pakai', 'detail' => 'Berdasarkan Masa Pemakaian', 'type' => 'inventory_categories', 'status' => 'active'],
            ['code' => 'INV-CAT-002', 'name' => 'Barang Tidak Habis Pakai', 'detail' => 'Berdasarkan Masa Pemakaian', 'type' => 'inventory_categories', 'status' => 'active'],
            ['code' => 'INV-CAT-003', 'name' => 'Barang Bergerak', 'detail' => 'Berdasarkan Mobilitas', 'type' => 'inventory_categories', 'status' => 'active'],
            ['code' => 'INV-CAT-004', 'name' => 'Barang Tidak Bergerak', 'detail' => 'Berdasarkan Mobilitas', 'type' => 'inventory_categories', 'status' => 'active'],
        ];

        foreach ($items as $item) {
            Category::updateOrCreate(
                ['code' => $item['code']],
                $item
            );
        }
    }
}
