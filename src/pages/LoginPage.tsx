import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, UserPlus, Phone, Mail, CheckCircle2, ArrowLeft, KeyRound, Send, AlertCircle, X, Sparkles } from 'lucide-react';
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

  // Lupa Kata Sandi Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

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
        setErrorMessage(res.message || 'Username / Email atau Kata Sandi yang Anda masukkan tidak sesuai.');
      }
    } catch (err) {
      setErrorMessage('Terjadi kendala jaringan saat otentikasi. Silakan coba beberapa saat lagi.');
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
        // Direct instant login without email activation modal barrier
        onLoginSuccess(res.member, res.targetTab);
      } else {
        setErrorMessage(res.message || 'Gagal mendaftar akun baru.');
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan sistem saat mendaftar akun.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Lupa Kata Sandi Submission
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden my-2 sm:my-4 font-sans relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Side: Hero Banner with Community Graphic */}
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

        {/* Right Side: Form View */}
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
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-bold flex items-start gap-2.5 animate-in fade-in shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-bold flex items-center gap-2.5 animate-in fade-in shadow-xs">
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

              {/* Options & Forgot Password Link */}
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
                  onClick={() => {
                    setForgotEmail(identifier || '');
                    setForgotSubmitted(false);
                    setShowForgotModal(true);
                  }}
                  className="text-[#053D27] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-600 inline" />
                  <span>Lupa kata sandi?</span>
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
                    <LogIn className="w-4 h-4 text-[#FFBF00]" />
                  )}
                  <span>{isLoading ? 'Memverifikasi Data...' : 'Masuk Sekarang'}</span>
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

      {/* ========================================== */}
      {/* MODAL 1: LUPA KATA SANDI MODAL */}
      {/* ========================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative space-y-5">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Pemulihan Kata Sandi</h3>
                <p className="text-xs text-slate-500">Layanan reset kata sandi Tangsel Book Party</p>
              </div>
            </div>

            {!forgotSubmitted ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Masukkan alamat email yang terdaftar pada akun Anda. Kami akan mengirimkan instruksi dan tautan pemulihan kata sandi.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Email Akun *</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none transition-all"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-[11px] text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Catatan Layanan Email Automasi</span>
                  </div>
                  <p className="text-amber-800 leading-normal">
                    Layanan pengiriman email pemulihan via SMTP server berada dalam tahap integrasi. Apabila tidak menerima email dalam 5 menit, silakan hubungi pengurus komunitas.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 bg-[#053D27] hover:bg-[#022416] text-[#D0DF00] rounded-xl text-xs font-extrabold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {forgotLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-[#D0DF00] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{forgotLoading ? 'Mengirim...' : 'Kirim Tautan Pemulihan'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-extrabold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tautan Pemulihan Dikirim!</span>
                  </div>
                  <p className="leading-relaxed">
                    Kami telah menginstruksikan pengiriman tautan reset kata sandi ke email{' '}
                    <span className="font-bold underline">{forgotEmail}</span>. Silakan periksa folder <strong>Kotak Masuk (Inbox)</strong> atau <strong>Spam</strong> Anda.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3 bg-[#053D27] text-[#D0DF00] rounded-2xl text-xs font-extrabold cursor-pointer hover:bg-[#022416] transition-colors"
                >
                  Kembali ke Halaman Log In
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
