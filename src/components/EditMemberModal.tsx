import React, { useState } from 'react';
import { X, Shield, MapPin, Phone, AlertTriangle, Sparkles, FileText } from 'lucide-react';
import type { Member } from '../types';
import { TANGSEL_LOCATION_DATA } from './EditProfileModal';

interface EditMemberModalProps {
  member: Member;
  onClose: () => void;
  onSaveMember: (updatedMember: Member) => void;
}

export const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, onClose, onSaveMember }) => {
  const [phone, setPhone] = useState(member.phone || '');
  const [adminNotes, setAdminNotes] = useState(member.adminNotes || '');
  const [borrowingRestricted, setBorrowingRestricted] = useState(member.borrowingRestricted || false);
  const [isBlacklisted, setIsBlacklisted] = useState(member.isBlacklisted || false);

  // Initial location setup
  const initialKec = member.domisiliKecamatan || (member.domisili ? member.domisili.split(',').pop()?.trim() : 'Ciputat Timur') || 'Ciputat Timur';
  const initialKel = member.domisiliKelurahan || (member.domisili ? member.domisili.split(',')[0]?.trim() : 'Pisangan') || 'Pisangan';

  const [kecamatan, setKecamatan] = useState<string>(
    TANGSEL_LOCATION_DATA.some((d) => d.kecamatan === initialKec) ? initialKec : 'Ciputat Timur'
  );
  const [kelurahan, setKelurahan] = useState<string>(initialKel);

  const selectedKecData = TANGSEL_LOCATION_DATA.find((d) => d.kecamatan === kecamatan) || TANGSEL_LOCATION_DATA[1];
  const kelurahanList = selectedKecData.kelurahan;

  const handleKecamatanChange = (newKec: string) => {
    setKecamatan(newKec);
    const targetData = TANGSEL_LOCATION_DATA.find((d) => d.kecamatan === newKec);
    if (targetData && targetData.kelurahan.length > 0) {
      setKelurahan(targetData.kelurahan[0]);
    } else {
      setKelurahan('Lainnya');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedDomisili = kelurahan && kelurahan !== 'Lainnya' ? `${kelurahan}, ${kecamatan}` : kecamatan;

    onSaveMember({
      ...member,
      phone: phone.trim(),
      domisili: formattedDomisili,
      domisiliKecamatan: kecamatan,
      domisiliKelurahan: kelurahan,
      adminNotes: adminNotes.trim() || undefined,
      borrowingRestricted,
      isBlacklisted
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#03321F]/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden font-sans transition-all my-auto">
        {/* Header Bar */}
        <div className="bg-[#03321F] text-white px-6 py-5 border-b border-[#FFBF00]/30 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <img src={member.avatar} alt={member.name} className="w-11 h-11 rounded-2xl border border-[#FFBF00]/40 object-cover shadow-md" />
            <div>
              <h2 className="font-anton text-xl tracking-wide text-white">Kelola Data Anggota</h2>
              <p className="text-xs text-emerald-200/90 pt-0.5">
                {member.name} • <span className="font-mono">{member.email}</span>
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
          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Nomor WhatsApp / Telepon Member
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

          {/* Domisili Area Tangsel */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Area Domisili Tangsel Member</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Kecamatan (Subdistrict)
                </label>
                <select
                  value={kecamatan}
                  onChange={(e) => handleKecamatanChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none bg-white font-bold text-slate-800 cursor-pointer"
                >
                  {TANGSEL_LOCATION_DATA.map((loc) => (
                    <option key={loc.kecamatan} value={loc.kecamatan}>
                      {loc.kecamatan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Kelurahan (Village)
                </label>
                <select
                  value={kelurahan}
                  onChange={(e) => setKelurahan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none bg-white font-bold text-slate-800 cursor-pointer"
                >
                  {kelurahanList.map((kel) => (
                    <option key={kel} value={kel}>
                      {kel}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Catatan Internal Caretaker Admin */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#053D27]" />
              <span>Catatan Rekam Jejak Internal Caretaker Admin</span>
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Catatan internal pengurus (contoh: Member aktif cabang Bintaro, sangat responsif)..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-amber-50/40 text-slate-800 font-medium resize-none"
            />
          </div>

          {/* Status Moderasi & Akses Security */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-600" />
              <span>Status Governance & Moderasi SOP</span>
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-amber-200 bg-amber-50/60 cursor-pointer hover:bg-amber-50 transition-all">
                <input
                  type="checkbox"
                  checked={borrowingRestricted}
                  onChange={(e) => setBorrowingRestricted(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">Batasi Peminjaman (Restriction)</span>
                  <span className="text-[10px] text-amber-700 block">Member sementara tidak dapat mengajukan pinjaman baru.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-rose-200 bg-rose-50/60 cursor-pointer hover:bg-rose-50 transition-all">
                <input
                  type="checkbox"
                  checked={isBlacklisted}
                  onChange={(e) => setIsBlacklisted(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-rose-900 block flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600 inline" />
                    Blacklist Anggota (SOP Violation)
                  </span>
                  <span className="text-[10px] text-rose-700 block">Status ter-blacklist untuk pelanggaran berat SOP / hilang buku.</span>
                </div>
              </label>
            </div>
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
              <span>Simpan Perubahan Member</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
