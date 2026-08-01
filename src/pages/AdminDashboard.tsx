import React, { useState } from 'react';
import { Shield, BookOpen, Clock, AlertTriangle, CheckCircle2, XCircle, QrCode, Plus, MessageSquare, Search, RotateCcw, Users, Printer } from 'lucide-react';
import type { Book, BorrowRequest, ReservationQueueItem } from '../types';

interface AdminDashboardProps {
  books: Book[];
  requests: BorrowRequest[];
  queues: ReservationQueueItem[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onReturnBook: (bookId: string) => void;
  onOpenAddBook: () => void;
  onOpenScanner: () => void;
  onShowQR: (book: Book) => void;
  onOpenWAReminder: (request: BorrowRequest, type: 'due_soon' | 'overdue' | 'approval') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  books,
  requests,
  queues,
  onApproveRequest,
  onRejectRequest,
  onReturnBook,
  onOpenAddBook,
  onOpenScanner,
  onShowQR,
  onOpenWAReminder
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'active_loans' | 'inventory' | 'queues'>('requests');
  const [inventorySearch, setInventorySearch] = useState('');

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const activeLoans = requests.filter((r) => r.status === 'borrowed' || r.status === 'approved');

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueLoans = activeLoans.filter((r) => r.dueDate && r.dueDate < todayStr);
  const activeQueues = queues.filter((q) => q.status === 'waiting');

  const filteredInventory = books.filter(
    (b) =>
      b.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.author.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.ownerName.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.shelfLocation.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Header */}
      <div className="bg-[#053D27] text-white rounded-3xl p-6 sm:p-8 border border-[#FFBF00]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#03321F] text-[#D0DF00] text-xs font-extrabold border border-[#D0DF00]/40">
            <Shield className="w-3.5 h-3.5 text-[#FFBF00]" />
            <span>ADMIN & CARETAKER CONTROL PANEL</span>
          </div>
          <h1 className="font-anton text-3xl sm:text-4xl text-white tracking-wide">TANGSEL BOOK PARTY MANAGEMENT</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
            Approve borrowing requests, record book returns, generate QR sticker labels, and track reservation queues.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenScanner}
            className="py-2.5 px-4 bg-[#FFBF00] text-[#03321F] hover:bg-[#D0DF00] rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch QR Scanner</span>
          </button>

          <button
            onClick={onOpenAddBook}
            className="py-2.5 px-4 bg-[#03321F] text-white hover:bg-[#FFBF00] hover:text-[#03321F] rounded-2xl text-xs font-extrabold flex items-center gap-2 border border-[#FFBF00]/40 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4 text-[#D0DF00]" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards (White Cards for Light Contrast) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1 text-slate-900">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Books</span>
            <BookOpen className="w-5 h-5 text-[#053D27]" />
          </div>
          <div className="font-anton text-3xl text-slate-900">{books.length}</div>
          <p className="text-[11px] text-slate-500 font-medium">In Community Inventory</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm space-y-1 text-slate-900">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Requests</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="font-anton text-3xl text-amber-600">{pendingRequests.length}</div>
          <p className="text-[11px] text-slate-500 font-medium">Awaiting Approval</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-200 shadow-sm space-y-1 text-slate-900">
          <div className="flex items-center justify-between text-[#053D27]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Loans</span>
            <Users className="w-5 h-5 text-[#053D27]" />
          </div>
          <div className="font-anton text-3xl text-[#053D27]">{activeLoans.length}</div>
          <p className="text-[11px] text-slate-500 font-medium">Currently Borrowed</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-200 shadow-sm space-y-1 text-slate-900">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overdue Items</span>
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="font-anton text-3xl text-rose-600">{overdueLoans.length}</div>
          <p className="text-[11px] text-slate-500 font-medium">Past Return Due Date</p>
        </div>

      </div>

      {/* Tabs Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'requests'
              ? 'bg-[#053D27] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Pending Approvals ({pendingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active_loans')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'active_loans'
              ? 'bg-[#053D27] text-[#D0DF00] shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Active Loans ({activeLoans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'inventory'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Book Inventory ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('queues')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'queues'
              ? 'bg-[#053D27] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Reservation Queues ({activeQueues.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        
        {/* Pending Approvals Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {pendingRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-slate-800">All borrow requests are up to date!</p>
                <p className="text-xs">No pending requests waiting for admin approval.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <img
                        src={req.bookCover}
                        alt={req.bookTitle}
                        className="w-12 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-[#03321F] bg-[#FFBF00] px-2 py-0.5 rounded">
                            {req.id}
                          </span>
                          <span className="text-xs text-slate-400">Requested: {req.requestDate}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{req.bookTitle}</h3>
                        <p className="text-xs text-slate-700">
                          Borrower: <strong className="text-[#053D27]">{req.userName}</strong> ({req.userPhone})
                        </p>
                        <p className="text-xs text-slate-600">
                          Duration: <strong className="text-[#053D27]">{req.durationDays} Days</strong> • Method: <strong className="capitalize text-slate-900">{req.handoverMethod}</strong>
                        </p>
                        {req.notes && (
                          <p className="text-[11px] text-slate-500 italic">"{req.notes}"</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => onOpenWAReminder(req, 'approval')}
                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-[#053D27] border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        title="Open WhatsApp notification link"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      <button
                        onClick={() => onRejectRequest(req.id)}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => onApproveRequest(req.id)}
                        className="py-2 px-4 bg-[#FFBF00] hover:bg-[#053D27] hover:text-[#D0DF00] text-[#03321F] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Borrow</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Loans Tab */}
        {activeTab === 'active_loans' && (
          <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {activeLoans.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No books currently on loan.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeLoans.map((req) => {
                  const isOverdue = req.dueDate && req.dueDate < todayStr;

                  return (
                    <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <img
                          src={req.bookCover}
                          alt={req.bookTitle}
                          className="w-12 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{req.bookTitle}</h3>
                            {isOverdue && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> OVERDUE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-700">
                            Borrower: <strong className="text-[#053D27]">{req.userName}</strong> ({req.userPhone})
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <span>Due Date: <strong className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-900 font-bold'}>{req.dueDate}</strong></span>
                            <span>Handover: <strong className="capitalize text-slate-900">{req.handoverMethod}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => onOpenWAReminder(req, isOverdue ? 'overdue' : 'due_soon')}
                          className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-[#053D27] border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Send WA Reminder</span>
                        </button>

                        <button
                          onClick={() => onReturnBook(req.bookId)}
                          className="py-2 px-4 bg-[#053D27] hover:bg-[#FFBF00] hover:text-[#03321F] text-[#D0DF00] rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Record Return</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search inventory by title, author, shelf, or owner..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white text-slate-900 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#053D27]"
              />
            </div>

            <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider">
                      <th className="p-4">Book Details</th>
                      <th className="p-4">Shelf Location</th>
                      <th className="p-4">Owner</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={b.coverImage} alt={b.title} className="w-10 h-14 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                            <div>
                              <span className="font-mono text-[10px] text-[#03321F] bg-[#FFBF00] px-1.5 py-0.5 rounded font-bold">{b.id}</span>
                              <h4 className="font-bold text-slate-900 text-xs mt-0.5">{b.title}</h4>
                              <p className="text-[11px] text-slate-500">by {b.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-800">{b.shelfLocation}</td>
                        <td className="p-4 text-slate-600">{b.ownerName}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            b.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => onShowQR(b)}
                            className="py-1.5 px-3 bg-slate-100 hover:bg-[#053D27] hover:text-[#D0DF00] text-slate-800 border border-slate-200 rounded-xl font-bold flex items-center gap-1 ml-auto"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>QR Label</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Reservation Queues Tab */}
        {activeTab === 'queues' && (
          <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {activeQueues.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No active reservation queue items.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeQueues.map((q) => (
                  <div key={q.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#053D27] border border-emerald-200 font-extrabold text-sm flex items-center justify-center">
                        #{q.queuePosition}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-[#053D27] bg-emerald-100 px-2 py-0.5 rounded">
                          Position #{q.queuePosition}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">{q.bookTitle}</h4>
                        <p className="text-xs text-slate-600">
                          Member: <strong className="text-[#053D27]">{q.userName}</strong> ({q.userPhone})
                        </p>
                        <p className="text-xs text-[#053D27] font-bold">
                          Est. Available: {q.estimatedAvailableDate}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const waMsg = encodeURIComponent(`Halo kak ${q.userName}! Buku "${q.bookTitle}" yang kak ikuti di antrian Tangsel Book Party sudah tersedia. Silakan lakukan konfirmasi peminjaman ya! 📚✨`);
                        window.open(`https://wa.me/${q.userPhone.replace(/[^0-9]/g, '')}?text=${waMsg}`, '_blank');
                      }}
                      className="py-2 px-3 bg-[#053D27] hover:bg-[#FFBF00] text-[#D0DF00] hover:text-[#03321F] rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Notify Available via WA</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
