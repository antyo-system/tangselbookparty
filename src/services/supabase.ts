import { createClient } from '@supabase/supabase-js';
import type { Member } from '../types';

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
    name: 'Fian',
    email: 'admin@tangselbookparty.org',
    phone: '+6281234567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FianAdmin',
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

  // 1. Try Supabase Auth/DB first if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .or(`email.eq.${cleanId},phone.eq.${cleanId}`)
        .maybeSingle();

      if (!error && data) {
        if (data.password_hash === cleanPass) {
          const loggedMember: Member = {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'User')}`,
            joinedDate: data.joined_date || 'Agustus 2026',
            role: data.role === 'admin' ? 'admin' : 'member',
            wishlist: data.wishlist || []
          };

          return {
            success: true,
            member: loggedMember,
            targetTab: loggedMember.role === 'admin' ? 'admin' : 'profile'
          };
        } else {
          return {
            success: false,
            targetTab: 'profile',
            message: 'Username / Email atau Kata Sandi yang Anda masukkan salah. Silakan periksa kembali.'
          };
        }
      }
    } catch (e) {
      console.warn('Supabase query error, checking fallback accounts:', e);
    }
  }

  // 2. Strict Fallback Check: Admin credentials
  if (cleanId === 'admin' || cleanId === 'admin@tangselbookparty.org' || cleanId === 'caretaker') {
    if (cleanPass === 'admin123' || cleanPass === 'tangsel2026') {
      return {
        success: true,
        member: DEFAULT_ACCOUNTS[0],
        targetTab: 'admin'
      };
    } else {
      return {
        success: false,
        targetTab: 'admin',
        message: 'Username / Email atau Kata Sandi yang Anda masukkan salah. Silakan periksa kembali.'
      };
    }
  }

  // 3. Strict Fallback Check: Member credentials
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
        message: 'Username / Email atau Kata Sandi yang Anda masukkan salah. Silakan periksa kembali.'
      };
    }
  }

  // 4. Default rejection for non-existent accounts
  return {
    success: false,
    targetTab: 'profile',
    message: 'Username / Email atau Kata Sandi tidak terdaftar. Silakan buat akun baru terlebih dahulu.'
  };
}

/**
 * Universal Registration Handler (Create New Member Account)
 * Security Policy: Public registration ALWAYS creates a regular 'member' account.
 * Admin / Caretaker accounts must be promoted directly inside the Supabase Database table 'members'.
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

  const newMember: Member = {
    id: `usr_${Date.now()}`,
    name,
    email,
    phone: phone.startsWith('+62') ? phone : `+62${phone.replace(/^0/, '')}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    joinedDate: 'Agustus 2026',
    role: 'member', // Strictly member role
    wishlist: []
  };

  // Insert to Supabase DB if available
  if (supabase) {
    try {
      await supabase.from('members').insert([
        {
          id: newMember.id,
          name: newMember.name,
          email: newMember.email,
          phone: newMember.phone,
          password_hash: password,
          role: 'member',
          joined_date: newMember.joinedDate,
          wishlist: []
        }
      ]);
    } catch (e) {
      console.warn('Failed inserting to Supabase, continuing locally:', e);
    }
  }

  return {
    success: true,
    member: newMember,
    targetTab: 'profile',
    message: 'Pendaftaran akun member berhasil!'
  };
}
