import React, { useState } from 'react';
import { X, User, Lock, Eye, EyeOff, LogIn, UserPlus, Phone, Mail, CheckCircle2 } from 'lucide-react';
import type { Member } from '../types';
import { authenticateUser, registerUser } from '../services/supabase';

interface LoginModalProps {
  currentMember: Member;
  onClose: () => void;
  onLoginSuccess: (member: Member, targetTab: 'catalog' | 'profile' | 'admin') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Silakan isi username/email dan kata sandi.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authenticateUser(identifier, password);
      if (res.success && res.member) {
        onLoginSuccess(res.member, res.targetTab);
      } else {
        setErrorMessage(res.message || 'Username atau password salah.');
      }
    } catch (err) {
      setErrorMessage('Terjadi kendala jaringan saat otentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Silakan lengkapi nama, email, dan kata sandi.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({
        name: regName,
        email: regEmail,
        phone: regPhone || '+6281234567890',
        password: regPassword
      });

      if (res.success && res.member) {
        setSuccessMessage('Pendaftaran berhasil! Mengarahkan ke portal...');
        setTimeout(() => {
          onLoginSuccess(res.member!, res.targetTab);
        }, 800);
      } else {
        setErrorMessage(res.message || 'Gagal mendaftar akun.');
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan sistem saat mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col md:flex-row w-full h-full min-h-screen overflow-y-auto animate-fade-in font-sans">
      
      {/* Left Side Branding Hero (Visible on Desktop) */}
      <div className="hidden md:flex md:w-5/12 bg-[#03321F] text-white p-8 lg:p-12 flex-col justify-between relative overflow-hidden border-r border-[#FFBF00]/20 shrink-0">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#053D27] rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute top-12 right-12 w-64 h-64 bg-[#D0DF00]/10 rounded-full blur-2xl opacity-40 pointer-events-none" />

        {/* Brand Top */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#FFBF00] bg-[#022416] p-0.5 shadow-lg">
            <img src="/tbp-logo.png" alt="Tangsel Book Party Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-anton text-2xl tracking-wider text-white">
              TANGSEL <span className="text-[#FFBF00]">BOOK PARTY</span>
            </h2>
            <p className="text-xs text-emerald-200 font-medium">CMS & Keanggotaan Perpustakaan Komunitas</p>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="relative z-10 space-y-4 my-auto py-12">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#FFBF00] text-[#03321F] uppercase tracking-wider inline-block">
            Komunitas Baca Bintaro & Tangsel
          </span>
          <h1 className="font-anton text-4xl lg:text-5xl text-white tracking-wide leading-tight">
            Ruang Baca Gratis & Peminjaman Buku Fisik Independent.
          </h1>
          <p className="text-sm text-emerald-100 font-medium leading-relaxed max-w-md">
            Masuk ke portal keanggotaan untuk meminjam koleksi buku fisik, mengelola wishlist, dan mengakses portal pengurus Caretaker TBP.
          </p>
        </div>

        {/* Hero Footer */}
        <div className="relative z-10 border-t border-emerald-800/60 pt-6 text-xs text-emerald-300 flex items-center justify-between font-medium">
          <span>© 2026 Tangsel Book Party</span>
          <span className="text-[#FFBF00]">Tangerang Selatan, Banten</span>
        </div>
      </div>

      {/* Right Side Form View (Full Screen Height) */}
      <div className="flex-1 bg-white p-6 sm:p-12 flex flex-col justify-between min-h-screen overflow-y-auto w-full">
        
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5 md:hidden">
            <img src="/tbp-logo.png" alt="TBP Logo" className="w-8 h-8 rounded-lg border border-[#FFBF00]" />
            <span className="font-anton text-lg tracking-wide text-[#03321F]">TANGSEL BOOK PARTY</span>
          </div>

          <div className="ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-[#03321F] text-slate-700 hover:text-white border border-slate-200 hover:border-[#03321F] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              title="Kembali ke Halaman Utama"
            >
              <X className="w-4 h-4 text-slate-500 hover:text-[#FFBF00]" />
              <span>Kembali ke Website</span>
            </button>
          </div>
        </div>

        {/* Center Main Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          
          {/* Mode Selector Tabs (Login vs Register) */}
          <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                authMode === 'login'
                  ? 'bg-white text-[#03321F] shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4 text-[#053D27]" />
              <span>Masuk Akun</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                authMode === 'register'
                  ? 'bg-[#FFBF00] text-[#03321F] shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4 text-[#03321F]" />
              <span>Daftar Baru</span>
            </button>
          </div>
        </div>

        {/* MODE 1: LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div className="text-center pb-1">
              <h4 className="text-base font-bold text-slate-800">Selamat Datang Kembali</h4>
              <p className="text-xs text-slate-500 mt-0.5">Masukkan username/email dan password terdaftar Anda</p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold animate-in fade-in">
                {errorMessage}
              </div>
            )}

            {/* Username / Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Username / Email</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan username atau email (contoh: admin atau budi)"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:bg-white focus:outline-none transition-all"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Kata Sandi (Password)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:bg-white focus:outline-none transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#053D27] rounded border-slate-300 focus:ring-[#053D27]"
                />
                <span>Ingat saya</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Fitur pemulihan sandi dikirim via email terdaftar.')}
                className="text-[#053D27] font-bold hover:underline"
              >
                Lupa sandi?
              </button>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#053D27] hover:bg-[#022416] text-[#D0DF00] rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-[#D0DF00] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
              </button>
            </div>

            {/* Switch to Register */}
            <div className="text-center pt-2 text-xs text-slate-500">
              Belum memiliki akun?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="text-[#053D27] font-extrabold hover:underline"
              >
                Daftar Member Baru
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: REGISTER FORM */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3">
            <div className="text-center pb-1">
              <h4 className="text-base font-bold text-slate-800">Daftar Akun Member Baru</h4>
              <p className="text-xs text-slate-500 mt-0.5">Bergabung dengan komunitas perpustakaan fisik Tangsel</p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold animate-in fade-in">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Nama Lengkap *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Alamat Email *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="budi@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Nomor WhatsApp *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+6281234567890"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Buat Kata Sandi *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#FFBF00] hover:bg-[#053D27] hover:text-[#D0DF00] text-[#03321F] rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-[#03321F] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Mendaftarkan...' : 'Buat Akun Sekarang'}</span>
              </button>
            </div>

            {/* Switch to Login */}
            <div className="text-center pt-1 text-xs text-slate-500">
              Sudah memiliki akun?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-[#053D27] font-extrabold hover:underline"
              >
                Masuk Sekarang
              </button>
            </div>
          </form>
        )}

        </div>
      </div>
    </div>
  );
};
