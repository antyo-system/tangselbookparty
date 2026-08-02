import React, { useState } from 'react';
import { X, User, Phone, MapPin, Check, Sparkles } from 'lucide-react';
import type { Member } from '../types';

interface EditProfileModalProps {
  member: Member;
  onClose: () => void;
  onSave: (updatedMember: Member) => void;
}

export const TANGSEL_DOMISILI_OPTIONS = [
  'Bintaro',
  'BSD City',
  'Pamulang',
  'Ciputat',
  'Serpong',
  'Setu',
  'Pondok Aren',
  'Serpong Utara'
];

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Anton',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nadia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rian',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ member, onClose, onSave }) => {
  const [name, setName] = useState(member.name || '');
  const [phone, setPhone] = useState(member.phone || '');
  const [domisili, setDomisili] = useState(member.domisili || 'Bintaro');
  const [avatar, setAvatar] = useState(member.avatar || AVATAR_PRESETS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...member,
      name: name.trim(),
      phone: phone.trim(),
      domisili,
      avatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#03321F]/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden font-sans transition-all my-auto">
        {/* Header */}
        <div className="bg-[#03321F] text-white px-6 py-5 border-b border-[#FFBF00]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#053D27] border border-[#FFBF00]/40 flex items-center justify-center text-[#FFBF00] shrink-0 shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-anton text-xl tracking-wide text-white">Edit Data Profil Anggota</h2>
              <p className="text-xs text-emerald-200/90 pt-0.5">
                Perbarui nama, nomor kontak, dan area domisili Tangsel Anda
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            title="Tutup Modal"
          >
            <X className="w-5 h-5 text-emerald-200" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">Pilih Avatar Profil</label>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {AVATAR_PRESETS.map((presetUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(presetUrl)}
                  className={`relative w-12 h-12 rounded-2xl p-1 border-2 transition-all shrink-0 cursor-pointer ${
                    avatar === presetUrl
                      ? 'border-[#053D27] bg-emerald-50 scale-105 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <img src={presetUrl} alt={`Avatar ${idx}`} className="w-full h-full rounded-xl object-cover" />
                  {avatar === presetUrl && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#053D27] text-[#FFBF00] flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
              />
            </div>
          </div>

          {/* Nomor Telepon / WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nomor WhatsApp / Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
              />
            </div>
          </div>

          {/* Domisili / Kecamatan Area Tangsel */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Kecamatan / Area Domisili Tangsel</span>
            </label>
            <select
              value={domisili}
              onChange={(e) => setDomisili(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none bg-white font-bold text-slate-800 cursor-pointer"
            >
              {TANGSEL_DOMISILI_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Domisili Anda akan digunakan sebagai lokasi bawaan (*default*) ketika Anda mendaftarkan buku fisik.
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#053D27] hover:bg-[#03321F] text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-[#053D27]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FFBF00]" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
