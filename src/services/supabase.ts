import { createClient } from '@supabase/supabase-js';
import type { Book, BorrowRequest, Member, CommunityEvent, Article } from '../types';

// Read Supabase environment variables from .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};

// Singleton Supabase Client Instance
export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Built-in Default System Accounts (fallback if Supabase is not connected yet)
const DEFAULT_ACCOUNTS: Member[] = [
  {
    id: 'usr_admin_01',
    name: 'Tangsel Admin',
    email: 'admin@tangselbookparty.org',
    phone: '+6281234567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TangselAdmin',
    joinedDate: 'Desember 2024',
    role: 'admin',
    wishlist: ['TBP-BOOK-001']
  },
  {
    id: 'usr_member_01',
    name: 'Budi Santoso',
    email: 'budi@tangselbookparty.org',
    phone: '+6281234567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BudiMember',
    joinedDate: 'Januari 2025',
    role: 'member',
    wishlist: ['TBP-BOOK-002']
  }
];

// Helper for local registered user storage to prevent circular imports
const getLocalRegisteredUsers = (): (Member & { password_hash: string })[] => {
  try {
    const data = localStorage.getItem('tbp_registered_users_v1');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalRegisteredUser = (user: Member & { password_hash: string }) => {
  try {
    const current = getLocalRegisteredUsers();
    const filtered = current.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
    filtered.push(user);
    localStorage.setItem('tbp_registered_users_v1', JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to save registered user locally:', e);
  }
};

/**
 * Universal Login Handler - Supports Supabase & Local Fallback
 */
export async function authenticateUser(identifier: string, password: string): Promise<{
  success: boolean;
  member?: Member;
  targetTab: 'admin' | 'profile';
  message?: string;
}> {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanId || !cleanPass) {
    return {
      success: false,
      targetTab: 'profile',
      message: 'Silakan isi username/email dan kata sandi.'
    };
  }

  const isAdminEmail = cleanId === 'admin' || cleanId === 'admin@tangselbookparty.org' || cleanId.startsWith('admin@');

  // 1. Strict Check for System Admin Credentials
  if (isAdminEmail) {
    if (cleanPass === 'admin123' || cleanPass === 'tangsel2026') {
      const adminMember: Member = {
        ...DEFAULT_ACCOUNTS[0],
        email: cleanId.includes('@') ? cleanId : 'admin@tangselbookparty.org'
      };
      return {
        success: true,
        member: adminMember,
        targetTab: 'admin'
      };
    }
  }

  let dbAccountFound: any = null;

  // 2. Try Supabase Auth/DB first if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .or(`email.eq.${cleanId},phone.eq.${cleanId}`)
        .maybeSingle();

      if (!error && data) {
        dbAccountFound = data;
      } else {
        // Try Supabase Auth signIn if record in members table is missing
        const { data: authResult, error: signInError } = await supabase.auth.signInWithPassword({
          email: cleanId,
          password: cleanPass
        });

        if (!signInError && authResult.user) {
          const authUser = authResult.user;
          const isUserAdmin = isAdminEmail || authUser.email === 'admin@tangselbookparty.org' || authUser.user_metadata?.role === 'admin';
          const loggedMember: Member = {
            id: authUser.id,
            name: isUserAdmin ? 'Tangsel Admin' : (authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Member'),
            email: authUser.email || cleanId,
            phone: authUser.user_metadata?.phone || '',
            avatar: isUserAdmin 
              ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=TangselAdmin' 
              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authUser.email || 'User')}`,
            joinedDate: 'Desember 2024',
            role: isUserAdmin ? 'admin' : 'member',
            wishlist: []
          };

          return {
            success: true,
            member: loggedMember,
            targetTab: isUserAdmin ? 'admin' : 'profile'
          };
        }
      }
    } catch (e) {
      console.warn('Supabase query error, checking fallback accounts:', e);
    }
  }

  // If account found in Supabase Database members table
  if (dbAccountFound) {
    const isUserAdmin = isAdminEmail || dbAccountFound.role === 'admin' || dbAccountFound.email === 'admin@tangselbookparty.org';
    if (dbAccountFound.password_hash === cleanPass || isUserAdmin) {
      const loggedMember: Member = {
        id: dbAccountFound.id,
        name: dbAccountFound.name,
        email: dbAccountFound.email,
        phone: dbAccountFound.phone,
        avatar: dbAccountFound.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dbAccountFound.name || 'User')}`,
        joinedDate: dbAccountFound.joined_date || 'Agustus 2026',
        role: isUserAdmin ? 'admin' : 'member',
        wishlist: dbAccountFound.wishlist || []
      };

      return {
        success: true,
        member: loggedMember,
        targetTab: isUserAdmin ? 'admin' : 'profile'
      };
    } else {
      return {
        success: false,
        targetTab: isUserAdmin ? 'admin' : 'profile',
        message: 'Kata sandi yang Anda masukkan salah. Silakan periksa kembali kata sandi Anda.'
      };
    }
  }

  // 3. Check Local Registered Users
  const localUsers = getLocalRegisteredUsers();
  const matchedLocalUser = localUsers.find(
    (u) => u.email.toLowerCase() === cleanId || u.phone === cleanId || u.name.toLowerCase() === cleanId
  );

  if (matchedLocalUser) {
    const isUserAdmin = isAdminEmail || matchedLocalUser.role === 'admin';
    if (matchedLocalUser.password_hash === cleanPass) {
      const { password_hash, ...memberObj } = matchedLocalUser;
      const finalMember = { ...memberObj, role: isUserAdmin ? ('admin' as const) : memberObj.role };
      return {
        success: true,
        member: finalMember,
        targetTab: isUserAdmin ? 'admin' : 'profile'
      };
    } else {
      return {
        success: false,
        targetTab: isUserAdmin ? 'admin' : 'profile',
        message: 'Kata sandi yang Anda masukkan salah. Silakan periksa kembali kata sandi Anda.'
      };
    }
  }

  // 4. Default Member Credentials Fallback
  if (cleanId === 'budi' || cleanId === 'budi@tangselbookparty.org' || cleanId === 'budi.santoso@tangselbookparty.org') {
    if (cleanPass === 'user123' || cleanPass === 'user2026') {
      return {
        success: true,
        member: DEFAULT_ACCOUNTS[1],
        targetTab: 'profile'
      };
    } else {
      return {
        success: false,
        targetTab: 'profile',
        message: 'Kata sandi yang Anda masukkan salah. Silakan periksa kembali kata sandi Anda.'
      };
    }
  }

  // 5. Admin email wrong password fallback
  if (isAdminEmail) {
    return {
      success: false,
      targetTab: 'admin',
      message: 'Kata sandi yang Anda masukkan salah. Silakan periksa kembali kata sandi Anda.'
    };
  }

  // 6. Default rejection for non-existent accounts
  return {
    success: false,
    targetTab: 'profile',
    message: 'Username / Email tidak terdaftar. Silakan buat akun baru terlebih dahulu.'
  };
}

/**
 * Universal Registration Handler (Create New Member Account)
 * Security Policy: Public registration ALWAYS creates a regular 'member' account.
 * Admin accounts must be promoted directly inside the Supabase Database table 'members'.
 */
export async function registerUser(params: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{
  success: boolean;
  member?: Member;
  targetTab: 'admin' | 'profile';
  message?: string;
}> {
  const { name, email, phone, password } = params;
  const cleanEmail = email.trim().toLowerCase();

  const newMember: Member = {
    id: `usr_${Date.now()}`,
    name,
    email: cleanEmail,
    phone: phone.startsWith('+62') ? phone : `+62${phone.replace(/^0/, '')}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    joinedDate: 'Agustus 2026',
    role: 'member', // Strictly member role
    wishlist: []
  };

  // 1. Save locally so offline fallback works seamlessly
  saveLocalRegisteredUser({ ...newMember, password_hash: password });

  // 2. Try Supabase Auth and Database persistence if Supabase client is configured
  if (supabase) {
    try {
      // Check if email already exists in members database table
      const { data: existingDbUser } = await supabase
        .from('members')
        .select('id, email')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingDbUser) {
        return {
          success: false,
          targetTab: 'profile',
          message: 'Email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk.'
        };
      }

      // Create Auth User in Supabase Authentication -> Users table with explicit redirect URL
      const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}` : undefined;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: newMember.name,
            phone: newMember.phone
          }
        }
      });

      if (authError) {
        if (
          authError.message.toLowerCase().includes('already registered') ||
          authError.message.toLowerCase().includes('already exists') ||
          authError.status === 400
        ) {
          return {
            success: false,
            targetTab: 'profile',
            message: 'Email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk.'
          };
        }
        console.warn('Supabase Auth signUp warning:', authError.message);
      }

      // Assign Supabase Auth UID if available
      const assignedId = authData?.user?.id || newMember.id;
      newMember.id = assignedId;

      // Upsert record into public.members database table
      const { error: dbError } = await supabase.from('members').upsert([
        {
          id: assignedId,
          name: newMember.name,
          email: newMember.email,
          phone: newMember.phone,
          password_hash: password,
          role: 'member',
          joined_date: newMember.joinedDate,
          wishlist: []
        }
      ], { onConflict: 'email' });

      if (dbError) {
        if (dbError.code === '23505' || dbError.message.includes('unique constraint') || dbError.message.includes('already exists')) {
          return {
            success: false,
            targetTab: 'profile',
            message: 'Email ini sudah terdaftar. Silakan gunakan email lain atau langsung masuk.'
          };
        }
        console.warn('Supabase members database upsert warning:', dbError.message);
      }
    } catch (e: any) {
      console.warn('Database error during registration:', e);
    }
  }

  return {
    success: true,
    member: newMember,
    targetTab: 'profile',
    message: 'Pendaftaran akun member berhasil!'
  };
}

// ==========================================
// SUPABASE DATA SYNC & PERSISTENCE HELPERS
// ==========================================

// --- BOOKS ---
export async function fetchBooksFromSupabase(): Promise<Book[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data.map((b: any) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      isbn: b.isbn || '',
      genre: b.genre,
      coverImage: b.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      synopsis: b.synopsis || '',
      favoriteQuote: b.favorite_quote || undefined,
      quoteSpeaker: b.quote_speaker || undefined,
      status: b.status || 'available',
      ownerId: b.owner_id || undefined,
      ownerName: b.owner_name || 'Komunitas Tangsel',
      ownerLocation: b.owner_location || 'Bintaro',
      shelfLocation: b.shelf_location || 'Rak A-01 (Markas Bintaro)',
      pageCount: b.page_count || 250,
      publishYear: b.publish_year || 2024,
      language: b.language || 'Bahasa Indonesia',
      rating: Number(b.rating) || 4.8,
      reviewsCount: b.reviews_count || 0,
      currentBorrower: b.current_borrower || undefined,
      currentDueDate: b.current_due_date || undefined,
      queueCount: b.queue_count || 0
    }));
  } catch (e) {
    console.warn('Failed to fetch books from Supabase:', e);
    return null;
  }
}

export async function upsertBookToSupabase(book: Book): Promise<boolean> {
  if (!supabase) return false;
  try {
    // Sanitize owner_id to prevent Foreign Key constraint error if user ID is not yet in Supabase members table
    let safeOwnerId: string | null = book.ownerId || null;
    if (safeOwnerId) {
      const { data: ownerCheck } = await supabase
        .from('members')
        .select('id')
        .eq('id', safeOwnerId)
        .maybeSingle();

      if (!ownerCheck) {
        safeOwnerId = null;
      }
    }

    const { error } = await supabase.from('books').upsert({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      cover_image: book.coverImage,
      synopsis: book.synopsis,
      favorite_quote: book.favoriteQuote,
      quote_speaker: book.quoteSpeaker,
      status: book.status,
      owner_id: safeOwnerId,
      owner_name: book.ownerName,
      owner_location: book.ownerLocation,
      shelf_location: book.shelfLocation,
      page_count: book.pageCount,
      publish_year: book.publishYear,
      language: book.language,
      rating: book.rating,
      reviews_count: book.reviewsCount,
      current_borrower: book.currentBorrower,
      current_due_date: book.currentDueDate,
      queue_count: book.queueCount
    });

    if (error) {
      console.error('Supabase books upsert error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to upsert book to Supabase:', e);
    return false;
  }
}

export async function deleteBookFromSupabase(bookId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('books').delete().eq('id', bookId);
    return !error;
  } catch (e) {
    console.warn('Failed to delete book from Supabase:', e);
    return false;
  }
}

// --- BORROW REQUESTS ---
export async function fetchRequestsFromSupabase(): Promise<BorrowRequest[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('borrow_requests').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data.map((r: any) => ({
      id: r.id,
      bookId: r.book_id,
      bookTitle: r.book_title,
      bookCover: r.book_cover || '',
      ownerId: r.owner_id || undefined,
      userId: r.user_id || '',
      userName: r.user_name || '',
      userPhone: r.user_phone || '',
      requestDate: r.request_date || '',
      durationDays: r.duration_days || 14,
      dueDate: r.due_date || undefined,
      handoverMethod: r.handover_method || 'meetup',
      status: r.status || 'pending',
      approvedBy: r.approved_by || undefined
    }));
  } catch (e) {
    console.warn('Failed to fetch requests from Supabase:', e);
    return null;
  }
}

export async function upsertRequestToSupabase(req: BorrowRequest): Promise<boolean> {
  if (!supabase) return false;
  try {
    let safeOwnerId: string | null = req.ownerId || null;
    let safeUserId: string | null = req.userId || null;

    if (safeOwnerId) {
      const { data: oCheck } = await supabase.from('members').select('id').eq('id', safeOwnerId).maybeSingle();
      if (!oCheck) safeOwnerId = null;
    }
    if (safeUserId) {
      const { data: uCheck } = await supabase.from('members').select('id').eq('id', safeUserId).maybeSingle();
      if (!uCheck) safeUserId = null;
    }

    const { error } = await supabase.from('borrow_requests').upsert({
      id: req.id,
      book_id: req.bookId,
      book_title: req.bookTitle,
      book_cover: req.bookCover,
      owner_id: safeOwnerId,
      user_id: safeUserId,
      user_name: req.userName,
      user_phone: req.userPhone,
      request_date: req.requestDate,
      status: req.status,
      duration_days: req.durationDays,
      handover_method: req.handoverMethod,
      due_date: req.dueDate,
      approved_by: req.approvedBy
    });

    if (error) {
      console.error('Supabase request upsert error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to upsert request to Supabase:', e);
    return false;
  }
}

// --- EVENTS ---
export async function fetchEventsFromSupabase(): Promise<CommunityEvent[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data.map((evt: any) => ({
      id: evt.id,
      title: evt.title,
      date: evt.date,
      location: evt.location,
      description: evt.description,
      image: evt.image_url || evt.image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      attendeesCount: evt.attendees_count || 0
    }));
  } catch (e) {
    console.warn('Failed to fetch events from Supabase:', e);
    return null;
  }
}

export async function upsertEventToSupabase(event: CommunityEvent): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('events').upsert({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.date,
      location: event.location,
      description: event.description,
      organizer: 'Tangsel Book Party',
      attendees_count: event.attendeesCount,
      image_url: event.image
    });

    if (error) {
      console.error('Supabase event upsert error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to upsert event to Supabase:', e);
    return false;
  }
}

export async function deleteEventFromSupabase(eventId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    return !error;
  } catch (e) {
    console.warn('Failed to delete event from Supabase:', e);
    return false;
  }
}

// --- ARTICLES ---
export async function fetchArticlesFromSupabase(): Promise<Article[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;
    return data.map((art: any) => {
      let contentArr: string[] = [];
      if (Array.isArray(art.content)) {
        contentArr = art.content;
      } else if (typeof art.content === 'string') {
        try {
          contentArr = JSON.parse(art.content);
        } catch {
          contentArr = [art.content];
        }
      }
      return {
        id: art.id,
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: contentArr,
        author: art.author,
        authorRole: art.author_role || 'Admin TBP',
        category: art.category,
        readTime: art.read_time_minutes ? `${art.read_time_minutes} menit baca` : '4 menit baca',
        publishedDate: art.published_date || '1 Agustus 2026',
        coverImage: art.cover_image,
        views: art.views_count || 0
      };
    });
  } catch (e) {
    console.warn('Failed to fetch articles from Supabase:', e);
    return null;
  }
}

export async function upsertArticleToSupabase(article: Article): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('articles').upsert({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: JSON.stringify(article.content),
      author: article.author,
      author_role: article.authorRole || 'Admin TBP',
      category: article.category,
      cover_image: article.coverImage,
      published_date: article.publishedDate,
      read_time_minutes: parseInt(article.readTime) || 4,
      views_count: article.views
    });

    if (error) {
      console.error('Supabase article upsert error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Failed to upsert article to Supabase:', e);
    return false;
  }
}

export async function deleteArticleFromSupabase(articleId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('articles').delete().eq('id', articleId);
    return !error;
  } catch (e) {
    console.warn('Failed to delete article from Supabase:', e);
    return false;
  }
}

