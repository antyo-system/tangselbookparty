import React, { useState } from 'react';
import { X, Calendar, Sparkles } from 'lucide-react';
import type { CommunityEvent } from '../types';

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
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    onSaveEvent({
      id: eventToEdit?.id,
      title,
      date,
      location,
      description,
      image
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-0 sm:my-auto">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#053D27] text-white px-6 py-4 border-b border-[#03321F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FFBF00]" />
            <h3 className="font-anton text-xl tracking-wide text-white">
              {eventToEdit ? 'EDIT ACARA (CMS)' : 'TAMBAH ACARA BARU (CMS)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#03321F] text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Acara / Meetup *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Misal: Tangsel Weekend Book Party @ Taman Bintaro"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tanggal & Waktu *</label>
            <input
              type="text"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Misal: Sabtu, 15 Agustus 2026 - 15:30 WIB"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Lokasi Acara *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Misal: Taman Bintaro Sector 7 (Dekat Bintaro Plaza)"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Deskripsi Acara</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan aktivitas meetup, piknik baca, dan serah terima buku..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Cover Event URL *</label>
            <input
              type="text"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />

            {/* Image Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] font-bold text-slate-400">Sample Image:</span>
              {sampleImages.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImage(imgUrl)}
                  className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 hover:border-[#053D27] flex-shrink-0"
                >
                  <img src={imgUrl} alt="sample" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#FFBF00] hover:bg-[#053D27] hover:text-[#D0DF00] text-[#03321F] rounded-xl text-xs font-extrabold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simpan Acara</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
