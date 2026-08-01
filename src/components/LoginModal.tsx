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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto relative">
        
        {/* Header Banner */}
        <div className="bg-[#03321F] p-6 text-white text-center relative border-b border-[#FFBF00]/30">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#053D27] text-emerald-200 hover:text-white hover:bg-[#022416] transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 overflow-hidden border-2 border-[#FFBF00] shadow-lg shadow-[#FFBF00]/20 bg-[#022416]">
            <img src="/tbp-logo.png" alt="Tangsel Book Party Logo" className="w-full h-full object-cover" />
          </div>

          <h3 className="font-anton text-2xl tracking-wider text-white">
            TANGSEL <span className="text-[#FFBF00]">BOOK PARTY</span>
          </h3>
          <p className="text-xs text-emerald-200 mt-0.5 font-medium">Perpustakaan Fisik Komunitas Tangerang Selatan</p>
        </div>

        {/* Mode Selector Tabs (Login vs Register) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1 rounded-2xl">
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
  );
};
