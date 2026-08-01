import React, { useState, useMemo } from 'react';
import { X, Calendar, Sparkles, CheckCircle2, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import type { CommunityEvent } from '../types';
import { calculateEventReadinessScore } from '../utils/scoring';
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
  const [date, setDate] = useState(eventToEdit?.date || 'Sabtu, 15 Agustus 2026');
  const [location, setLocation] = useState(eventToEdit?.location || 'Taman Bintaro Sektor 7');
  const [description, setDescription] = useState(eventToEdit?.description || '');
  const [image, setImage] = useState(
    eventToEdit?.image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80'
  );

  // ERP Event Operations States
  const [eventCode, setEventCode] = useState(eventToEdit?.eventCode || `EVT-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [eventType, setEventType] = useState<'Read & Chill' | 'Book Swap' | 'Author Talk' | 'Workshop' | 'Gathering'>(eventToEdit?.eventType || 'Read & Chill');
  const [startTime, setStartTime] = useState(eventToEdit?.startTime || '15:30');
  const [endTime, setEndTime] = useState(eventToEdit?.endTime || '18:00');
  const [venueAddress, setVenueAddress] = useState(eventToEdit?.venueAddress || 'Jl. Bintaro Utama 3A, Pd. Karya, Kec. Pd. Aren, Tangsel');
  const [googleMapsUrl, setGoogleMapsUrl] = useState(eventToEdit?.googleMapsUrl || 'https://maps.google.com/?q=Taman+Bintaro+Sektor+7');
  const [maxCapacity, setMaxCapacity] = useState(eventToEdit?.maxCapacity || 30);
  const [ticketPrice, setTicketPrice] = useState(eventToEdit?.ticketPrice || 0);
  const [registrationDeadline, setRegistrationDeadline] = useState(eventToEdit?.registrationDeadline || 'Jumat, 14 Agustus 2026 - 23:59 WIB');
  const [hostCaretakerName, setHostCaretakerName] = useState(eventToEdit?.hostCaretakerName || 'Fian (Markas Bintaro)');
  const [showChecklistDetails, setShowChecklistDetails] = useState(false);

  const sampleImages = [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
  ];

  // Live Event Readiness Score Calculation
  const readinessResult = useMemo(() => {
    return calculateEventReadinessScore({
      title,
      location,
      venueAddress,
      googleMapsUrl,
      startTime,
      endTime,
      registrationDeadline,
      maxCapacity: Number(maxCapacity),
      hostCaretakerName,
      image,
      description
    });
  }, [title, location, venueAddress, googleMapsUrl, startTime, endTime, registrationDeadline, maxCapacity, hostCaretakerName, image, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;

    onSaveEvent({
      id: eventToEdit?.id,
      title,
      date,
      location,
      description,
      image,
      eventCode,
      eventType: eventType as any,
      startTime,
      endTime,
      venueAddress,
      googleMapsUrl,
      maxCapacity: Number(maxCapacity),
      ticketPrice: Number(ticketPrice),
      registrationDeadline,
      hostCaretakerName,
      readinessScore: readinessResult.score,
      status: readinessResult.score >= 80 ? 'registration_open' : 'draft'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in">
      
      {/* Sticky Fullscreen Topbar Header */}
      <div className="sticky top-0 z-20 bg-[#03321F] text-white px-4 sm:px-8 py-4 border-b border-[#FFBF00]/30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-2xl bg-[#053D27] hover:bg-[#085a3a] text-emerald-100 hover:text-white border border-[#FFBF00]/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            title="Kembali ke Dashboard CMS"
          >
            <ArrowLeft className="w-4 h-4 text-[#FFBF00]" />
            <span className="hidden sm:inline">Kembali ke Dashboard</span>
          </button>

          <div className="h-6 w-px bg-emerald-800/60 hidden sm:block" />

          <div>
            <h3 className="font-anton text-lg sm:text-xl tracking-wide text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#FFBF00]" />
              <span>{eventToEdit ? 'EDIT ACARA KOMUNITAS' : 'TAMBAH ACARA KOMUNITAS BARU'}</span>
            </h3>
            <p className="text-[11px] text-emerald-200 hidden sm:block font-medium">Logistics & Operational Readiness Score System</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-rose-900/60 text-emerald-200 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-rose-300" />
        </button>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6 pb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

          {/* Live Event Readiness Score Gauge Banner */}
          <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono border ${
              readinessResult.score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
              readinessResult.score >= 50 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
              'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}>
              {readinessResult.score}
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>Event Readiness Score:</span>
                <span className="text-emerald-300 font-normal">{readinessResult.ratingLabel}</span>
              </div>
              <p className="text-[10px] text-slate-400">Skor kelengkapan logistik & operasional pendaftaran</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowChecklistDetails(!showChecklistDetails)}
            className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showChecklistDetails ? 'Sembunyikan Audit' : 'Audit Logistik'}</span>
          </button>
        </div>

        {/* Expanded Audit Checklist */}
        {showChecklistDetails && (
          <div className="bg-slate-950 p-4 border-b border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-300 text-[11px] uppercase tracking-wider">Hasil Auditing Logistik Event:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {readinessResult.checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {item.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-slate-200 text-[11px]">
                      {item.rule} <span className="text-slate-400 font-normal">(+{item.points} pt)</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{item.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
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
              <label className="text-xs font-bold text-slate-700">Kode Event *</label>
              <input
                type="text"
                required
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tipe Acara *</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-medium"
              >
                <option value="Read & Chill">Read & Chill (Piknik Baca)</option>
                <option value="Book Swap">Book Swap (Tukar Buku)</option>
                <option value="Author Talk">Author Talk (Diskusi Penulis)</option>
                <option value="Workshop">Workshop & Belajar</option>
                <option value="Gathering">Gathering Caretaker</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Host Caretaker *</label>
              <input
                type="text"
                required
                value={hostCaretakerName}
                onChange={(e) => setHostCaretakerName(e.target.value)}
                placeholder="Fian (Markas Bintaro)"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Tanggal Acara *</label>
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Sabtu, 15 Agustus 2026"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Jam Mulai</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="15:30"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Jam Selesai</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="18:00"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* ERP Logistics Box */}
          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#053D27]">Nama Venue / Tempat *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Taman Bintaro Sector 7"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#053D27]">Pin Location (Google Maps URL)</label>
                <input
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#053D27]">Alamat Lengkap Venue</label>
              <input
                type="text"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                placeholder="Jl. Bintaro Utama 3A, Tangsel"
                className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#053D27]">Kapasitas Kursi (Pax)</label>
                <input
                  type="number"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(Number(e.target.value))}
                  placeholder="30"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#053D27]">HTM / Tiket (IDR)</label>
                <input
                  type="number"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(Number(e.target.value))}
                  placeholder="0 (Gratis)"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#053D27]">Deadline Registrasi</label>
                <input
                  type="text"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  placeholder="Jumat, 14 Agt - 23:59"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Deskripsi Acara & Rundown Kegiatan</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan aktivitas meetup, piknik baca, dan serah terima buku..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#053D27] focus:outline-none"
            />
          </div>

          {/* Cover Image Uploader */}
          <ImageUploader
            label="Poster / Banner Event Acara *"
            value={image}
            onChange={setImage}
            sampleImages={sampleImages}
          />

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-500 font-medium">
              Readiness: <span className="font-bold text-[#053D27]">{readinessResult.score}/100</span>
            </div>
            <div className="flex items-center gap-2">
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
          </div>

        </form>

        </div>
      </div>
    </div>
  );
};

