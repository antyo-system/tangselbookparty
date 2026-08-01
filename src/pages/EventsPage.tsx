import React, { useState } from 'react';
import { Calendar, MapPin, Users, CheckCircle2, Sparkles, Coffee } from 'lucide-react';
import type { CommunityEvent } from '../types';

interface EventsPageProps {
  events: CommunityEvent[];
}

export const EventsPage: React.FC<EventsPageProps> = ({ events }) => {
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>([]);

  const toggleJoin = (eventId: string) => {
    if (joinedEventIds.includes(eventId)) {
      setJoinedEventIds(joinedEventIds.filter((id) => id !== eventId));
    } else {
      setJoinedEventIds([...joinedEventIds, eventId]);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-[#053D27] text-white rounded-3xl p-6 sm:p-10 border border-[#FFBF00]/30 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#03321F] text-[#D0DF00] text-xs font-extrabold border border-[#D0DF00]/30">
          <Coffee className="w-3.5 h-3.5 text-[#FFBF00]" />
          <span>AGENDA KUMPUL & TUKAR BUKU TANGSEL</span>
        </div>
        <h1 className="font-anton text-3xl sm:text-4xl text-white tracking-wide">JADWAL BOOK PARTY & EVENT KOMUNITAS</h1>
        <p className="text-sm text-emerald-100/90 max-w-xl">
          Kumpul santai sesama pecinta buku di Taman Bintaro, Taman Kota 1 BSD, dan Alun-Alun Pamulang. Ambil buku pinjaman secara langsung atau bawa koleksi favoritmu untuk saling tukar cerita!
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => {
          const isJoined = joinedEventIds.includes(evt.id);
          const totalAttendees = evt.attendeesCount + (isJoined ? 1 : 0);

          return (
            <div key={evt.id} className="bg-white text-slate-900 rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
              
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#053D27]/90 backdrop-blur-md text-[#D0DF00] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <Calendar className="w-3.5 h-3.5 text-[#FFBF00]" />
                  <span>{evt.date}</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-anton text-xl text-slate-900 leading-snug tracking-wide">
                    {evt.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#053D27]">
                    <MapPin className="w-4 h-4 flex-shrink-0 text-[#053D27]" />
                    <span>{evt.location}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    {evt.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Users className="w-4 h-4 text-[#053D27]" />
                    <span>{totalAttendees} Anggota Hadir</span>
                  </div>

                  <button
                    onClick={() => toggleJoin(evt.id)}
                    className={`py-2 px-4 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                      isJoined
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#FFBF00] hover:bg-[#053D27] hover:text-[#D0DF00] text-[#03321F] shadow-sm'
                    }`}
                  >
                    {isJoined ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isJoined ? 'Hadir (RSVP OK)' : 'Ikut Hadir (RSVP)'}</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
