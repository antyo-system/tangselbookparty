-- ========================================================
-- TANGSEL BOOK PARTY — SUPABASE DATABASE SCHEMA (PRD v1.1)
-- Copy and paste this script directly into Supabase SQL Editor
-- ========================================================

-- 1. MEMBERS / USERS TABLE
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'member', -- 'member' or 'admin'
    joined_date TEXT NOT NULL,
    wishlist TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BOOKS INVENTORY TABLE (Peer-to-Peer Community Library)
CREATE TABLE IF NOT EXISTS public.books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    genre TEXT NOT NULL,
    cover_image TEXT,
    synopsis TEXT,
    favorite_quote TEXT,
    quote_speaker TEXT,
    status TEXT NOT NULL DEFAULT 'available', -- 'available', 'borrowed', 'reserved', 'delisted'
    owner_id TEXT REFERENCES public.members(id) ON DELETE SET NULL, -- Owner of book (Admin or Member)
    owner_name TEXT NOT NULL,
    owner_location TEXT, -- e.g. "Bintaro", "BSD", "Pamulang"
    shelf_location TEXT NOT NULL,
    page_count INT DEFAULT 250,
    publish_year INT DEFAULT 2024,
    language TEXT DEFAULT 'Bahasa Indonesia',
    rating NUMERIC(3,2) DEFAULT 4.8,
    reviews_count INT DEFAULT 0,
    current_borrower TEXT,
    current_borrower_id TEXT REFERENCES public.members(id) ON DELETE SET NULL,
    current_due_date TEXT,
    queue_count INT DEFAULT 0,
    allowed_handover TEXT[] DEFAULT '{"meetup"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BORROW REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.borrow_requests (
    id TEXT PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE,
    book_title TEXT NOT NULL,
    book_cover TEXT,
    owner_id TEXT REFERENCES public.members(id) ON DELETE SET NULL, -- ID of book owner
    user_id TEXT REFERENCES public.members(id) ON DELETE SET NULL, -- ID of borrower
    user_name TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    request_date TEXT NOT NULL,
    duration_days INT DEFAULT 14,
    due_date TEXT,
    return_date TEXT,
    handover_method TEXT NOT NULL DEFAULT 'meetup', -- 'meetup' or 'courier'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'borrowed', 'returned'
    notes TEXT,
    approved_by TEXT, -- 'owner' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. RESERVATION QUEUES TABLE
CREATE TABLE IF NOT EXISTS public.reservation_queues (
    id TEXT PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE,
    book_title TEXT,
    user_id TEXT REFERENCES public.members(id) ON DELETE CASCADE,
    user_name TEXT,
    user_phone TEXT,
    queue_position INT NOT NULL DEFAULT 1,
    duration_days INT DEFAULT 14,
    requested_at TEXT NOT NULL,
    estimated_available_date TEXT,
    status TEXT NOT NULL DEFAULT 'waiting', -- 'waiting', 'ready_for_pickup', 'fulfilled', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BOOK REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.book_reviews (
    id TEXT PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    rating INT NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- 6. COMMUNITY EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    organizer TEXT DEFAULT 'Tangsel Book Party',
    attendees_count INT DEFAULT 0,
    max_capacity INT DEFAULT 30,
    image_url TEXT,
    is_joined BOOLEAN DEFAULT FALSE,
    category TEXT DEFAULT 'Meetup Baca Buku',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ARTICLES & SEO BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    author_role TEXT DEFAULT 'Admin TBP',
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    cover_image TEXT NOT NULL,
    published_date TEXT NOT NULL,
    read_time_minutes INT DEFAULT 5,
    views_count INT DEFAULT 0,
    meta_description TEXT,
    keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable RLS initially for seamless API access
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrow_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservation_queues DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;

-- Explicit permissive RLS policies (in case RLS is manually enabled in Supabase Dashboard)
DROP POLICY IF EXISTS "Allow public all members" ON public.members;
CREATE POLICY "Allow public all members" ON public.members FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all books" ON public.books;
CREATE POLICY "Allow public all books" ON public.books FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all borrow_requests" ON public.borrow_requests;
CREATE POLICY "Allow public all borrow_requests" ON public.borrow_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all reservation_queues" ON public.reservation_queues;
CREATE POLICY "Allow public all reservation_queues" ON public.reservation_queues FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all book_reviews" ON public.book_reviews;
CREATE POLICY "Allow public all book_reviews" ON public.book_reviews FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all events" ON public.events;
CREATE POLICY "Allow public all events" ON public.events FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all articles" ON public.articles;
CREATE POLICY "Allow public all articles" ON public.articles FOR ALL USING (true) WITH CHECK (true);

-- SEED INITIAL SYSTEM ACCOUNTS (Admin & Sample Member)
INSERT INTO public.members (id, name, email, phone, password_hash, avatar, role, joined_date)
VALUES 
  ('usr_admin_01', 'Tangsel Admin', 'admin@tangselbookparty.org', '+6281234567890', 'admin123', 'https://api.dicebear.com/7.x/avataaars/svg?seed=TangselAdmin', 'admin', 'Desember 2024'),
  ('usr_member_01', 'Budi Santoso', 'budi@tangselbookparty.org', '+6281234567890', 'user123', 'https://api.dicebear.com/7.x/avataaars/svg?seed=BudiMember', 'member', 'Januari 2025')
ON CONFLICT (email) DO NOTHING;
