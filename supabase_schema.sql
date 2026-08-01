-- ========================================================
-- TANGSEL BOOK PARTY — SUPABASE DATABASE SCHEMA
-- Copy and paste this script directly into Supabase SQL Editor
-- ========================================================

-- 1. MEMBERS / USERS TABLE
CREATE TABLE IF NOT EXISTS public.members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member', -- 'member' or 'admin'
    joined_date TEXT NOT NULL,
    wishlist TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. BOOKS INVENTORY TABLE
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
    status TEXT NOT NULL DEFAULT 'available', -- 'available' or 'borrowed'
    owner_name TEXT NOT NULL,
    shelf_location TEXT NOT NULL,
    page_count INT DEFAULT 250,
    publish_year INT DEFAULT 2024,
    language TEXT DEFAULT 'Bahasa Indonesia',
    rating NUMERIC(3,2) DEFAULT 4.8,
    reviews_count INT DEFAULT 0,
    current_borrower TEXT,
    current_due_date TEXT,
    queue_count INT DEFAULT 0,
    reading_time_hours NUMERIC(3,1) DEFAULT 4.0,
    community_recommendation_score INT DEFAULT 95,
    why_read_options TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BORROW REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.borrow_requests (
    id TEXT PRIMARY KEY,
    book_id TEXT REFERENCES public.books(id) ON DELETE CASCADE,
    book_title TEXT NOT NULL,
    book_cover TEXT,
    user_name TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    request_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'returned'
    duration_days INT DEFAULT 14,
    handover_method TEXT NOT NULL DEFAULT 'cod',
    due_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. COMMUNITY EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    organizer TEXT NOT NULL,
    attendees_count INT DEFAULT 0,
    max_capacity INT DEFAULT 30,
    image_url TEXT,
    is_joined BOOLEAN DEFAULT FALSE,
    category TEXT DEFAULT 'Meetup Baca Buku',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ARTICLES & SEO BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    author_role TEXT DEFAULT 'Caretaker TBP',
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

-- Disable RLS initially for seamless API access or create public read/write policies
ALTER TABLE public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrow_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;

-- SEED INITIAL SYSTEM ACCOUNTS
INSERT INTO public.members (id, name, email, phone, password_hash, role, joined_date)
VALUES 
  ('usr_admin_01', 'Fian Caretaker', 'admin@tangselbookparty.org', '+6281234567890', 'admin123', 'admin', 'Desember 2024'),
  ('usr_member_01', 'Budi Santoso', 'budi@tangselbookparty.org', '+6281234567890', 'user123', 'member', 'Januari 2025')
ON CONFLICT (email) DO NOTHING;
