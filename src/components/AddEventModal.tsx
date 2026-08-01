import React, { useState } from 'react';
import { X, Calendar, Save, PlusCircle, Clock, Sparkles } from 'lucide-react';
import type { CommunityEvent } from '../types';
import { ImageUploader } from './ImageUploader';

interface AddEventModalProps {
  eventToEdit?: CommunityEvent | null;
  onClose: () => void;
  onSaveEvent: (eventData: Omit<CommunityEvent, 'id' | 'attendeesCount'> & { id?: string }) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  eventToEdit,
  onClose,
  onSaveEvent
}) => {
  const [title, setTitle] = useState(eventToEdit?.title || '');
  const [date, setDate] = useState(eventToEdit?.date || 'Sabtu, 15 Agustus 2026 - 15:30 WIB');
  const [location, setLocation] = useState(eventToEdit?.location || 'Taman Bintaro Sector 7');
  const [description, setDescription] = useState(eventToEdit?.description || '');
  const [image, setImage] = useState(
    eventToEdit?.image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  );

  const sampleImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !description.trim()) return;

    onSaveEvent({
      id: eventToEdit?.id,
      title: title.trim(),
      date: date.trim(),
      location: location.trim(),
      description: description.trim(),
      image: image || sampleImages[0]
    });

    onClose();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 w-full overflow-hidden font-sans transition-all my-4">
      {/* Header Bar */}
      <div className="bg-[#03321F] text-white px-6 py-5 border-b border-[#FFBF00]/30 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#053D27] border border-[#FFBF00]/40 flex items-center justify-center text-[#FFBF00] shrink-0 shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-anton text-xl tracking-wide text-white">
                {eventToEdit ? 'Edit Acara Komunitas' : 'Buat Acara / Gathering Komunitas Baru'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFBF00] text-[#03321F] uppercase tracking-wider">
                {eventToEdit ? `ID: ${eventToEdit.id}` : 'Jadwal Baru'}
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 pt-0.5">
              Jadwalkan sesi piknik baca dan gathering tukar buku Tangsel Book Party
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          type="button"
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
          title="Tutup & Kembali"
        >
          <X className="w-5 h-5 text-emerald-200" />
        </button>
      </div>

      {/* Unified Form Body */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        
        {/* Matrix Banner */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFBF00] text-[#03321F] flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#03321F] uppercase tracking-wider flex items-center gap-2">
                Piknik Baca & Book Swap Event
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Gratis Terbuka
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Lokasi: <span className="font-bold text-[#053D27]">{location || 'Taman Tangsel'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700">
            <span className="px-3 py-1 bg-white border border-amber-300/60 rounded-xl shadow-xs flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {date}
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Nama Acara / Gathering Komunitas <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Tangsel Weekend Book Party #12 @ Taman Bintaro"
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Waktu & Tanggal Pelaksanaan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Sabtu, 15 Agustus 2026 - 15:30 WIB"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Lokasi Gathering / Titik Kumpul <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Taman Bintaro Sector 7 / Taman Kota BSD"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Deskripsi Acara & Agenda Aktivitas <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan aktivitas acara (misal: piknik baca outdoor, sesi tukar buku fisik gratis, diskusi buku terfavorit)..."
            className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs focus:ring-4 focus:ring-[#053D27]/10 focus:border-[#053D27] outline-none transition-all bg-white leading-relaxed font-medium"
          />
        </div>

        <div>
          <ImageUploader
            label="Poster / Gambar Banner Event *"
            value={image}
            onChange={(url) => setImage(url)}
            sampleImages={sampleImages}
          />
        </div>

        {/* Action Footer */}
        <div className="pt-6 border-t border-slate-200/80 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <span>Form Event Siap Disimpan</span>
          </div>

          <div className="flex items-center gap-3">
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
              {eventToEdit ? <Save className="w-4 h-4 text-[#FFBF00]" /> : <PlusCircle className="w-4 h-4 text-[#FFBF00]" />}
              <span>{eventToEdit ? 'Simpan Perubahan Event' : 'Buat Acara Baru'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
