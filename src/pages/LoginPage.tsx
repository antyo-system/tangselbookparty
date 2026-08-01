import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, UserPlus, Phone, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import type { Member } from '../types';
import { authenticateUser, registerUser } from '../services/supabase';

interface LoginPageProps {
  onLoginSuccess: (member: Member, targetTab: 'catalog' | 'profile' | 'admin') => void;
  onNavigateToCatalog: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToCatalog
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
        setSuccessMessage('Pendaftaran berhasil! Mengarahkan...');
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
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden my-2 sm:my-4 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Full-height Hero Image with Quote (5 cols on Desktop) */}
        <div className="hidden lg:block lg:col-span-5 relative overflow-hidden bg-[#03321F]">
          <img
            src="/tbp-community-reading.png"
            alt="Tangsel Book Party Community"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022416] via-[#03321F]/40 to-transparent flex flex-col justify-between p-8 text-white">
            <div>
              <button
                type="button"
                onClick={onNavigateToCatalog}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors border border-white/20 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Katalog Utama</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/tbp-logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover border border-[#FFBF00]" />
                <span className="font-anton text-lg tracking-wider text-white">
                  TANGSEL <span className="text-[#FFBF00]">BOOK PARTY</span>
                </span>
              </div>
              
              <blockquote className="text-sm font-medium text-emerald-100 leading-relaxed italic border-l-2 border-[#FFBF00] pl-3">
                "Membaca bersama, mempererat silaturahmi literasi di Tangerang Selatan."
              </blockquote>
              
              <p className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider">
                Perpustakaan Fisik Komunitas Independen
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Clean MVP Authentication Form (7 cols on Desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-12 flex flex-col justify-center max-w-xl mx-auto w-full">
          
          {/* Mobile Back Button */}
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={onNavigateToCatalog}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#053D27] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog</span>
            </button>
          </div>

          {/* Form Heading */}
          <div className="text-center mb-8 space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {authMode === 'login' ? 'Selamat Datang Kembali' : 'Daftar Akun Member'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {authMode === 'login'
                ? 'Masukkan username/email dan kata sandi akun Anda'
                : 'Lengkapi data diri untuk bergabung dengan perpustakaan komunitas'}
            </p>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-bold animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: LOGIN */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email / Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Username / Email</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="nama@email.com atau username"
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#053D27] focus:bg-white focus:outline-none transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#053D27] focus:bg-white focus:outline-none transition-all font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
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
                  onClick={() => alert('Informasi pemulihan sandi dikirim via email.')}
                  className="text-[#053D27] font-bold hover:underline cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#053D27] hover:bg-[#022416] text-[#D0DF00] rounded-2xl text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 cursor-pointer"
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
              <div className="text-center pt-4 text-xs text-slate-500">
                Belum memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[#053D27] font-extrabold hover:underline cursor-pointer ml-1"
                >
                  Daftar Akun Baru
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: REGISTER */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Nama Lengkap *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#053D27] focus:outline-none transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#053D27] focus:outline-none transition-all"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#053D27] focus:outline-none transition-all font-mono"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#053D27] focus:outline-none transition-all font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#FFBF00] hover:bg-[#053D27] hover:text-[#D0DF00] text-[#03321F] rounded-2xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-[#03321F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  <span>{isLoading ? 'Mendaftarkan...' : 'Buat Akun Member Sekarang'}</span>
                </button>
              </div>

              {/* Switch to Login */}
              <div className="text-center pt-3 text-xs text-slate-500">
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-[#053D27] font-extrabold hover:underline cursor-pointer ml-1"
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
