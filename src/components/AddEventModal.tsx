import React, { useState } from 'react';
import { X, Calendar, Save, PlusCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] border border-slate-200 flex flex-col overflow-hidden my-auto relative">
        {/* Header */}
        <div className="bg-[#03321F] text-white px-6 py-4 border-b border-[#FFBF00]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#053D27] border border-[#FFBF00]/40 flex items-center justify-center text-[#FFBF00] shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-anton text-xl tracking-wide text-white">
                {eventToEdit ? 'Edit Acara Komunitas' : 'Buat Acara / Gathering Komunitas Baru'}
              </h2>
              <p className="text-[11px] text-emerald-200">
                Jadwalkan sesi piknik baca dan tukar buku Tangsel Book Party
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nama Acara / Gathering <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Tangsel Weekend Book Party @ Taman Bintaro"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Waktu & Tanggal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Sabtu, 15 Agustus 2026 - 15:30 WIB"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Lokasi Event <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Taman Bintaro Sector 7 / Taman Kota BSD"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Deskripsi Acara & Aktivitas <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan aktivitas acara (misal: piknik baca santai, serah terima buku, diskusi novel)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#053D27] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Foto Header / Poster Event</label>
            <ImageUploader
              value={image}
              onChange={(url) => setImage(url)}
              sampleImages={sampleImages}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#053D27] hover:bg-[#03321F] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              {eventToEdit ? <Save className="w-4 h-4 text-[#FFBF00]" /> : <PlusCircle className="w-4 h-4 text-[#FFBF00]" />}
              <span>{eventToEdit ? 'Simpan Perubahan' : 'Buat Acara'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
