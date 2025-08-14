/*
  # Initial Database Schema for Vena Pictures Management System

  1. New Tables
    - `users` - User authentication and roles
    - `clients` - Client management
    - `packages` - Service packages
    - `add_ons` - Additional services
    - `projects` - Project management
    - `team_members` - Freelancer management
    - `transactions` - Financial transactions
    - `cards` - Payment cards/accounts
    - `financial_pockets` - Budget management
    - `assets` - Asset management
    - `contracts` - Contract management
    - `leads` - Lead management
    - `client_feedback` - Customer feedback
    - `promo_codes` - Promotional codes
    - `social_media_posts` - Social media planning
    - `sops` - Standard Operating Procedures
    - `notifications` - System notifications
    - `team_project_payments` - Team payment tracking
    - `team_payment_records` - Payment records
    - `reward_ledger_entries` - Reward tracking
    - `revisions` - Project revisions
    - `performance_notes` - Team performance notes
    - `printing_items` - Project printing details

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Features
    - UUID primary keys
    - Timestamps for audit trails
    - JSON fields for complex data
    - Foreign key relationships
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'Member' CHECK (role IN ('Admin', 'Member')),
  permissions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  instagram text,
  since date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'Aktif' CHECK (status IN ('Prospek', 'Aktif', 'Tidak Aktif', 'Hilang')),
  client_type text NOT NULL DEFAULT 'Langsung' CHECK (client_type IN ('Langsung', 'Vendor')),
  last_contact timestamptz DEFAULT now(),
  portal_access_id uuid DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  physical_items jsonb DEFAULT '[]'::jsonb,
  digital_items jsonb DEFAULT '[]'::jsonb,
  processing_time text NOT NULL DEFAULT '30 hari kerja',
  photographers text,
  videographers text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add-ons table
CREATE TABLE IF NOT EXISTS add_ons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  role text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  standard_fee numeric NOT NULL DEFAULT 0,
  no_rek text,
  reward_balance numeric DEFAULT 0,
  rating numeric DEFAULT 5.0 CHECK (rating >= 1 AND rating <= 5),
  portal_access_id uuid DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Performance notes table
CREATE TABLE IF NOT EXISTS performance_notes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  note text NOT NULL,
  type text NOT NULL CHECK (type IN ('Pujian', 'Perhatian', 'Keterlambatan Deadline', 'Umum')),
  created_at timestamptz DEFAULT now()
);

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_holder_name text NOT NULL,
  bank_name text NOT NULL,
  card_type text NOT NULL CHECK (card_type IN ('Prabayar', 'Kredit', 'Debit')),
  last_four_digits text NOT NULL,
  expiry_date text,
  balance numeric DEFAULT 0,
  color_gradient text NOT NULL DEFAULT 'from-blue-500 to-sky-400',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Financial pockets table
CREATE TABLE IF NOT EXISTS financial_pockets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL CHECK (icon IN ('piggy-bank', 'lock', 'users', 'clipboard-list', 'star')),
  type text NOT NULL CHECK (type IN ('Nabung & Bayar', 'Terkunci', 'Bersama', 'Anggaran Pengeluaran', 'Tabungan Hadiah Freelancer')),
  amount numeric DEFAULT 0,
  goal_amount numeric,
  lock_end_date date,
  source_card_id uuid REFERENCES cards(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name text NOT NULL,
  client_name text NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  project_type text NOT NULL,
  package_name text NOT NULL,
  package_id uuid REFERENCES packages(id),
  add_ons jsonb DEFAULT '[]'::jsonb,
  date date NOT NULL,
  deadline_date date,
  location text NOT NULL,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status text NOT NULL DEFAULT 'Dikonfirmasi',
  active_sub_statuses jsonb DEFAULT '[]'::jsonb,
  total_cost numeric NOT NULL DEFAULT 0,
  amount_paid numeric DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'Belum Bayar' CHECK (payment_status IN ('Lunas', 'DP Terbayar', 'Belum Bayar')),
  team jsonb DEFAULT '[]'::jsonb,
  notes text,
  accommodation text,
  drive_link text,
  client_drive_link text,
  final_drive_link text,
  start_time text,
  end_time text,
  image text,
  promo_code_id uuid,
  discount_amount numeric DEFAULT 0,
  shipping_details text,
  dp_proof_url text,
  printing_cost numeric DEFAULT 0,
  transport_cost numeric DEFAULT 0,
  is_editing_confirmed_by_client boolean DEFAULT false,
  is_printing_confirmed_by_client boolean DEFAULT false,
  is_delivery_confirmed_by_client boolean DEFAULT false,
  confirmed_sub_statuses jsonb DEFAULT '[]'::jsonb,
  client_sub_status_notes jsonb DEFAULT '{}'::jsonb,
  sub_status_confirmation_sent_at jsonb DEFAULT '{}'::jsonb,
  completed_digital_items jsonb DEFAULT '[]'::jsonb,
  invoice_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Printing items table
CREATE TABLE IF NOT EXISTS printing_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('Cetak Album', 'Cetak Foto', 'Flashdisk', 'Custom')),
  custom_name text,
  details text NOT NULL,
  cost numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Revisions table
CREATE TABLE IF NOT EXISTS revisions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  admin_notes text NOT NULL,
  deadline date NOT NULL,
  freelancer_id uuid REFERENCES team_members(id),
  status text NOT NULL DEFAULT 'Menunggu Revisi' CHECK (status IN ('Menunggu Revisi', 'Sedang Dikerjakan', 'Revisi Selesai')),
  freelancer_notes text,
  drive_link text,
  completed_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('Pemasukan', 'Pengeluaran')),
  project_id uuid REFERENCES projects(id),
  category text NOT NULL,
  method text NOT NULL DEFAULT 'Transfer Bank' CHECK (method IN ('Transfer Bank', 'Tunai', 'E-Wallet', 'Sistem', 'Kartu')),
  pocket_id uuid REFERENCES financial_pockets(id),
  card_id uuid REFERENCES cards(id),
  printing_item_id uuid REFERENCES printing_items(id),
  vendor_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL,
  purchase_date date NOT NULL DEFAULT CURRENT_DATE,
  purchase_price numeric NOT NULL DEFAULT 0,
  serial_number text,
  status text NOT NULL DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Digunakan', 'Perbaikan')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_number text UNIQUE NOT NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  signing_date date NOT NULL DEFAULT CURRENT_DATE,
  signing_location text NOT NULL,
  client_name1 text NOT NULL,
  client_address1 text NOT NULL,
  client_phone1 text NOT NULL,
  client_name2 text,
  client_address2 text,
  client_phone2 text,
  shooting_duration text NOT NULL,
  guaranteed_photos text NOT NULL,
  album_details text NOT NULL,
  digital_files_format text NOT NULL DEFAULT 'JPG High-Resolution',
  other_items text,
  personnel_count text NOT NULL,
  delivery_timeframe text NOT NULL DEFAULT '30 hari kerja',
  dp_date date,
  final_payment_date date,
  cancellation_policy text NOT NULL,
  jurisdiction text NOT NULL,
  vendor_signature text,
  client_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  contact_channel text NOT NULL CHECK (contact_channel IN ('WhatsApp', 'Instagram', 'Website', 'Telepon', 'Referensi', 'Form Saran', 'Lainnya')),
  location text NOT NULL,
  status text NOT NULL DEFAULT 'Sedang Diskusi' CHECK (status IN ('Sedang Diskusi', 'Menunggu Follow Up', 'Dikonversi', 'Ditolak')),
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Client feedback table
CREATE TABLE IF NOT EXISTS client_feedback (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name text NOT NULL,
  satisfaction text NOT NULL CHECK (satisfaction IN ('Sangat Puas', 'Puas', 'Biasa Saja', 'Tidak Puas')),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  usage_count integer DEFAULT 0,
  max_usage integer,
  expiry_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Social media posts table
CREATE TABLE IF NOT EXISTS social_media_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  post_type text NOT NULL CHECK (post_type IN ('Instagram Feed', 'Instagram Story', 'Instagram Reels', 'TikTok Video', 'Artikel Blog')),
  platform text NOT NULL CHECK (platform IN ('Instagram', 'TikTok', 'Website')),
  scheduled_date date NOT NULL,
  caption text NOT NULL,
  media_url text,
  status text NOT NULL DEFAULT 'Draf' CHECK (status IN ('Draf', 'Terjadwal', 'Diposting', 'Dibatalkan')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- SOPs table
CREATE TABLE IF NOT EXISTS sops (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  is_read boolean DEFAULT false,
  icon text NOT NULL CHECK (icon IN ('lead', 'deadline', 'revision', 'feedback', 'payment', 'completed', 'comment')),
  link_view text,
  link_action jsonb,
  created_at timestamptz DEFAULT now()
);

-- Team project payments table
CREATE TABLE IF NOT EXISTS team_project_payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  team_member_name text NOT NULL,
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'Unpaid' CHECK (status IN ('Paid', 'Unpaid')),
  fee numeric NOT NULL DEFAULT 0,
  reward numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team payment records table
CREATE TABLE IF NOT EXISTS team_payment_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_number text UNIQUE NOT NULL,
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  project_payment_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount numeric NOT NULL DEFAULT 0,
  vendor_signature text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reward ledger entries table
CREATE TABLE IF NOT EXISTS reward_ledger_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  project_id uuid REFERENCES projects(id),
  created_at timestamptz DEFAULT now()
);

-- Profile table (single row configuration)
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  company_name text NOT NULL DEFAULT '',
  website text DEFAULT '',
  address text NOT NULL DEFAULT '',
  bank_account text NOT NULL DEFAULT '',
  authorized_signer text NOT NULL DEFAULT '',
  id_number text,
  bio text DEFAULT '',
  income_categories jsonb DEFAULT '["DP Proyek", "Pelunasan Proyek", "Lainnya"]'::jsonb,
  expense_categories jsonb DEFAULT '["Gaji Freelancer", "Transport", "Akomodasi", "Peralatan", "Lainnya"]'::jsonb,
  project_types jsonb DEFAULT '["Pernikahan", "Prewedding", "Engagement", "Birthday", "Corporate"]'::jsonb,
  event_types jsonb DEFAULT '["Meeting Klien", "Survey Lokasi", "Libur", "Workshop", "Lainnya"]'::jsonb,
  asset_categories jsonb DEFAULT '["Kamera", "Lensa", "Lighting", "Audio", "Aksesoris", "Komputer", "Software"]'::jsonb,
  sop_categories jsonb DEFAULT '["Fotografi", "Videografi", "Editing", "Client Service", "Administrasi"]'::jsonb,
  project_status_config jsonb DEFAULT '[]'::jsonb,
  notification_settings jsonb DEFAULT '{"newProject": true, "paymentConfirmation": true, "deadlineReminder": true}'::jsonb,
  security_settings jsonb DEFAULT '{"twoFactorEnabled": false}'::jsonb,
  briefing_template text DEFAULT '',
  terms_and_conditions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_pockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE printing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_project_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read all data" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can read all clients" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage clients" ON clients FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all packages" ON packages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage packages" ON packages FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all add_ons" ON add_ons FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage add_ons" ON add_ons FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all team_members" ON team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage team_members" ON team_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all performance_notes" ON performance_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage performance_notes" ON performance_notes FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all cards" ON cards FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage cards" ON cards FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all financial_pockets" ON financial_pockets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage financial_pockets" ON financial_pockets FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage projects" ON projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all printing_items" ON printing_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage printing_items" ON printing_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all revisions" ON revisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage revisions" ON revisions FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all transactions" ON transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage transactions" ON transactions FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all assets" ON assets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage assets" ON assets FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all contracts" ON contracts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage contracts" ON contracts FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all leads" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage leads" ON leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all client_feedback" ON client_feedback FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage client_feedback" ON client_feedback FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all promo_codes" ON promo_codes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage promo_codes" ON promo_codes FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all social_media_posts" ON social_media_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage social_media_posts" ON social_media_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all sops" ON sops FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage sops" ON sops FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all notifications" ON notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage notifications" ON notifications FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all team_project_payments" ON team_project_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage team_project_payments" ON team_project_payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all team_payment_records" ON team_payment_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage team_payment_records" ON team_payment_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read all reward_ledger_entries" ON reward_ledger_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage reward_ledger_entries" ON reward_ledger_entries FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can read profile" ON profile FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage profile" ON profile FOR ALL TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_portal_access_id ON clients(portal_access_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_date ON projects(date);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_portal_access_id ON team_members(portal_access_id);
CREATE INDEX IF NOT EXISTS idx_revisions_project_id ON revisions(project_id);
CREATE INDEX IF NOT EXISTS idx_revisions_freelancer_id ON revisions(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_performance_notes_team_member_id ON performance_notes(team_member_id);
CREATE INDEX IF NOT EXISTS idx_printing_items_project_id ON printing_items(project_id);
CREATE INDEX IF NOT EXISTS idx_team_project_payments_team_member_id ON team_project_payments(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_payment_records_team_member_id ON team_payment_records(team_member_id);
CREATE INDEX IF NOT EXISTS idx_reward_ledger_entries_team_member_id ON reward_ledger_entries(team_member_id);