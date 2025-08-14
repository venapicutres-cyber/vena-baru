/*
  # Insert Default Data for Vena Pictures

  1. Default Profile Configuration
  2. Default Admin User
  3. Sample Project Status Configuration
  4. Default Cards and Pockets

  This migration sets up the basic data needed for the application to function.
*/

-- Insert default profile
INSERT INTO profile (
  full_name,
  email,
  phone,
  company_name,
  website,
  address,
  bank_account,
  authorized_signer,
  bio,
  income_categories,
  expense_categories,
  project_types,
  event_types,
  asset_categories,
  sop_categories,
  project_status_config,
  notification_settings,
  security_settings,
  briefing_template,
  terms_and_conditions
) VALUES (
  'Admin Vena Pictures',
  'admin@venapictures.com',
  '+62812345678',
  'Vena Pictures',
  'https://venapictures.com',
  'Jakarta, Indonesia',
  'BCA 1234567890 a.n. Vena Pictures',
  'Admin Vena Pictures',
  'Professional photography and videography services for your special moments.',
  '["DP Proyek", "Pelunasan Proyek", "Lainnya"]'::jsonb,
  '["Gaji Freelancer", "Transport", "Akomodasi", "Peralatan", "Lainnya"]'::jsonb,
  '["Pernikahan", "Prewedding", "Engagement", "Birthday", "Corporate"]'::jsonb,
  '["Meeting Klien", "Survey Lokasi", "Libur", "Workshop", "Lainnya"]'::jsonb,
  '["Kamera", "Lensa", "Lighting", "Audio", "Aksesoris", "Komputer", "Software"]'::jsonb,
  '["Fotografi", "Videografi", "Editing", "Client Service", "Administrasi"]'::jsonb,
  '[
    {"id": "status_1", "name": "Dikonfirmasi", "color": "#10b981", "note": "Proyek telah dikonfirmasi oleh klien", "subStatuses": []},
    {"id": "status_2", "name": "Briefing", "color": "#3b82f6", "note": "Tahap briefing dengan klien", "subStatuses": []},
    {"id": "status_3", "name": "Persiapan", "color": "#8b5cf6", "note": "Persiapan peralatan dan tim", "subStatuses": []},
    {"id": "status_4", "name": "Pelaksanaan", "color": "#f97316", "note": "Hari pelaksanaan acara", "subStatuses": []},
    {"id": "status_5", "name": "Editing", "color": "#06b6d4", "note": "Proses editing foto dan video", "subStatuses": [
      {"name": "Seleksi Foto", "note": "Memilih foto terbaik"},
      {"name": "Color Grading", "note": "Penyesuaian warna"},
      {"name": "Retouching", "note": "Perbaikan detail foto"}
    ]},
    {"id": "status_6", "name": "Review Klien", "color": "#eab308", "note": "Menunggu review dari klien", "subStatuses": []},
    {"id": "status_7", "name": "Printing", "color": "#6366f1", "note": "Proses cetak album dan foto", "subStatuses": []},
    {"id": "status_8", "name": "Dikirim", "color": "#ef4444", "note": "Pengiriman hasil ke klien", "subStatuses": []},
    {"id": "status_9", "name": "Selesai", "color": "#10b981", "note": "Proyek telah selesai", "subStatuses": []},
    {"id": "status_10", "name": "Dibatalkan", "color": "#6b7280", "note": "Proyek dibatalkan", "subStatuses": []}
  ]'::jsonb,
  '{"newProject": true, "paymentConfirmation": true, "deadlineReminder": true}'::jsonb,
  '{"twoFactorEnabled": false}'::jsonb,
  'Halo tim! Briefing untuk proyek [PROJECT_NAME] akan dilaksanakan pada [DATE] di [LOCATION]. Mohon persiapkan peralatan dan datang tepat waktu. Terima kasih!',
  '📜 SYARAT & KETENTUAN UMUM

📅 Jadwal & Waktu
- Jadwal yang telah disepakati tidak dapat diubah kecuali ada kesepakatan baru
- Keterlambatan dari pihak klien dapat mempengaruhi hasil dan jadwal penyerahan
- Force majeure (bencana alam, dll) akan dibicarakan secara terpisah

💰 Pembayaran
- DP minimal 30% dari total biaya saat penandatanganan kontrak
- Pelunasan paling lambat H-3 sebelum hari pelaksanaan
- Pembayaran melalui transfer bank ke rekening yang telah ditentukan
- Biaya tambahan di luar paket akan dikenakan sesuai kesepakatan

📦 Hasil & Penyerahan
- Hasil foto/video diserahkan sesuai timeline yang disepakati
- Revisi minor dapat dilakukan maksimal 2x tanpa biaya tambahan
- Revisi major atau perubahan konsep akan dikenakan biaya tambahan
- Hak cipta tetap milik vendor, namun klien berhak menggunakan untuk keperluan pribadi

⏱ Pembatalan
- Pembatalan dari pihak klien: DP tidak dapat dikembalikan
- Pembatalan H-7 sebelum acara: klien wajib membayar 50% dari total biaya
- Pembatalan dari pihak vendor: DP dikembalikan 100% + kompensasi

➕ Lain-lain
- Vendor tidak bertanggung jawab atas kehilangan/kerusakan barang pribadi klien
- Klien wajib menyediakan akses lokasi dan fasilitas yang dibutuhkan
- Perubahan detail acara wajib dikomunikasikan minimal H-3'
) ON CONFLICT (id) DO NOTHING;

-- Insert default admin user
INSERT INTO users (
  email,
  password,
  full_name,
  role,
  permissions
) VALUES (
  'admin@venapictures.com',
  'admin123',
  'Admin Vena Pictures',
  'Admin',
  '[]'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Insert default cards
INSERT INTO cards (
  id,
  card_holder_name,
  bank_name,
  card_type,
  last_four_digits,
  balance,
  color_gradient
) VALUES 
  ('card_1', 'Vena Pictures', 'BCA', 'Debit', '1234', 5000000, 'from-blue-500 to-sky-400'),
  ('card_2', 'Vena Pictures', 'Mandiri', 'Kredit', '5678', 2500000, 'from-purple-500 to-pink-400'),
  ('card_cash', 'Cash', 'Tunai', 'Debit', '0000', 1000000, 'from-slate-600 to-slate-400')
ON CONFLICT (id) DO NOTHING;

-- Insert default financial pockets
INSERT INTO financial_pockets (
  id,
  name,
  description,
  icon,
  type,
  amount,
  goal_amount
) VALUES 
  ('pocket_1', 'Dana Darurat', 'Simpanan untuk keperluan mendesak', 'piggy-bank', 'Nabung & Bayar', 0, 10000000),
  ('pocket_2', 'Upgrade Peralatan', 'Tabungan untuk membeli peralatan baru', 'lock', 'Terkunci', 0, 25000000),
  ('pocket_3', 'Operasional Harian', 'Dana untuk operasional sehari-hari', 'clipboard-list', 'Anggaran Pengeluaran', 0, 5000000),
  ('pocket_4', 'Reward Pool', 'Pool hadiah untuk freelancer', 'star', 'Tabungan Hadiah Freelancer', 0, NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert sample package
INSERT INTO packages (
  name,
  price,
  physical_items,
  digital_items,
  processing_time,
  photographers,
  videographers
) VALUES (
  'Paket Wedding Basic',
  8500000,
  '[{"name": "Album 20x30 (20 halaman)", "price": 500000}, {"name": "Foto cetak 4R (50 lembar)", "price": 200000}]'::jsonb,
  '["300+ foto edit terbaik", "File RAW semua foto", "Video highlight 3-5 menit"]'::jsonb,
  '30 hari kerja',
  '2 Fotografer',
  '1 Videografer'
) ON CONFLICT DO NOTHING;

-- Insert sample add-ons
INSERT INTO add_ons (name, price) VALUES 
  ('Drone Photography', 1500000),
  ('Same Day Edit Video', 2000000),
  ('Extra Album', 750000),
  ('Cetak Foto Tambahan (100 lembar)', 300000)
ON CONFLICT DO NOTHING;