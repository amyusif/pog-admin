import { useState, useEffect } from 'react';
import { Search, Plus, X, Trash2, Phone, Mail, Check } from 'lucide-react';
import api from '../services/api';
import { BookingsLoader } from '../components/PageLoader';

const statusConfig: Record<string, { bg: string; color: string }> = {
  CONFIRMED: { bg: 'rgba(5,150,105,0.15)',  color: '#10b981' },
  PENDING:   { bg: 'rgba(217,119,6,0.15)',   color: '#f59e0b' },
  CANCELLED: { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444' },
  COMPLETED: { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8' },
};

const inputStyle: React.CSSProperties = {
  background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
  color: '#f8fafc', padding: '10px 12px', fontSize: '14px',
  outline: 'none', width: '100%', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const emptyForm = {
  client: '', event: '', date: '', location: '', budget: '', clientBudget: '',
  bookingType: '', subType: '', phone: '', email: '', status: 'PENDING', assignedTo: ''
};

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/bookings/${id}`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (err) {
        console.error('Failed to delete booking', err);
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.client || !form.bookingType || !form.event || !form.date || !form.location || !form.budget) {
      setFormError('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/bookings', form);
      setShowAdd(false);
      setForm(emptyForm);
      fetchBookings();
    } catch (err: any) {
      setFormError(err?.response?.data?.error || 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  const statuses = ['All', 'CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED'];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.client.toLowerCase().includes(search.toLowerCase()) ||
      b.event.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedBookings = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <BookingsLoader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#f8fafc' }}>Bookings</h1>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>{bookings.length} total bookings</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: 'linear-gradient(135deg, #7f1d1d, #d97706)',
            color: 'white', border: 'none', padding: '10px 20px',
            borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          <Plus size={16} /> New Booking
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total',     count: bookings.length,                                       color: '#94a3b8' },
          { label: 'Confirmed', count: bookings.filter(b => b.status === 'CONFIRMED').length, color: '#10b981' },
          { label: 'Pending',   count: bookings.filter(b => b.status === 'PENDING').length,   color: '#f59e0b' },
          { label: 'Completed', count: bookings.filter(b => b.status === 'COMPLETED').length, color: '#818cf8' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px 20px' }}>
            <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#94a3b8' }}>{stat.label}</p>
            <p style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input
            type="text"
            placeholder="Search by client, event, or ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            style={{ ...inputStyle, background: '#0f172a', border: '1px solid #1e293b', padding: '9px 12px 9px 36px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }} style={{
              padding: '8px 14px', borderRadius: '8px', fontSize: '13px',
              border: `1px solid ${statusFilter === s ? '#d97706' : '#1e293b'}`,
              background: statusFilter === s ? 'rgba(217,119,6,0.15)' : '#0f172a',
              color: statusFilter === s ? '#f59e0b' : '#94a3b8',
              cursor: 'pointer', fontWeight: statusFilter === s ? 600 : 400, transition: 'all 0.15s',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b' }}>
                {['Client', 'Booking / Service', 'Date', 'Location', 'Package / Services', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#0a0f1a' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((b, i) => {
                const sc = statusConfig[b.status] || { bg: '#1e293b', color: '#94a3b8' };
                return (
                  <tr key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    style={{
                      borderBottom: i < paginatedBookings.length - 1 ? '1px solid #1e293b' : 'none',
                      transition: 'background 0.1s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#1e293b')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#f8fafc', fontWeight: 500 }}>{b.client}</p>
                      {(b.phone || b.email) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
                          {b.phone && <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={10} /> {b.phone}</p>}
                          {b.email && <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={10} /> {b.email}</p>}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'block', fontSize: '13px', color: '#f8fafc', fontWeight: 500, marginBottom: '2px' }}>{b.bookingType || '—'}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{b.subType || b.event}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#cbd5e1', whiteSpace: 'nowrap' }}>{new Date(b.date).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#94a3b8', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.location}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#d97706', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.budget}>{b.budget}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color }}>{b.status}</span>
                    </td>
                  </tr>
                );
              })}
              {paginatedBookings.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#475569' }}>No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} entries
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ background: '#1e293b', border: '1px solid #334155', color: currentPage === 1 ? '#475569' : '#f8fafc', padding: '6px 12px', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '13px' }}
              >Previous</button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ background: '#1e293b', border: '1px solid #334155', color: currentPage === totalPages ? '#475569' : '#f8fafc', padding: '6px 12px', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px' }}
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Booking Modal ── */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}
          onClick={() => setShowAdd(false)}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '36px', width: '540px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>New Booking</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Fill in the details to create a booking request</p>
              </div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Client Name *</label>
                <input style={inputStyle} placeholder="e.g. Kwame & Ama Mensah"
                  value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input style={inputStyle} type="tel" placeholder="e.g. +233 24 123 4567"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input style={inputStyle} type="email" placeholder="e.g. kwame@example.com"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Booking Type *</label>
                  <select style={inputStyle} value={form.bookingType} onChange={e => setForm(f => ({ ...f, bookingType: e.target.value, subType: '' }))}>
                    <option value="">Select type...</option>
                    <option value="Live Band">Live Band</option>
                    <option value="LED Screens">LED Screens</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Sub-type (if Live Band)</label>
                  <select style={inputStyle} value={form.subType} onChange={e => setForm(f => ({ ...f, subType: e.target.value }))} disabled={form.bookingType !== 'Live Band'}>
                    <option value="">—</option>
                    <option value="Live Event">Live Event</option>
                    <option value="Musical Instrument Rentals">Musical Instrument Rentals</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Service (Event) *</label>
                  <select style={inputStyle} value={form.event} onChange={e => setForm(f => ({ ...f, event: e.target.value }))}>
                    <option value="">Select service...</option>
                    {['Wedding', 'Corporate Event', 'Private Party', 'Concert/Festival', 'Birthday', 'Other'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Event Date *</label>
                  <input style={inputStyle} type="date"
                    value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Package / Services *</label>
                  <select style={inputStyle} value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}>
                    <option value="">Select package...</option>
                    <option value="Standard Package">Standard Package</option>
                    <option value="Premium Package">Premium Package</option>
                    <option value="Luxury Experience">Luxury Experience</option>
                    <option value="Custom Setup">Custom Setup</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Client Budget (GH₵)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 5000"
                    value={form.clientBudget} onChange={e => setForm(f => ({ ...f, clientBudget: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Venue / Location *</label>
                  <input style={inputStyle} placeholder="e.g. Kempinski Hotel, Accra"
                    value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Assigned To</label>
                <input style={inputStyle} placeholder="e.g. The Groove Ensemble (optional)"
                  value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} />
              </div>

              {formError && (
                <p style={{ margin: 0, color: '#ef4444', fontSize: '13px', background: 'rgba(239,68,68,0.1)', padding: '10px 14px', borderRadius: '8px' }}>{formError}</p>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowAdd(false)}
                  style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '10px 24px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  style={{ background: 'linear-gradient(135deg, #7f1d1d, #d97706)', color: 'white', border: 'none', padding: '10px 28px', borderRadius: '10px', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Creating...' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Booking Detail Mini Modal ── */}
      {selectedBooking && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}
          onClick={() => setSelectedBooking(null)}
        >
          <div
            style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', width: '480px', maxWidth: '92vw', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0f1a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>Booking Details</h2>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: statusConfig[selectedBooking.status]?.bg, color: statusConfig[selectedBooking.status]?.color }}>
                  {selectedBooking.status}
                </span>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', lineHeight: 1 }}>
                <X size={18} />
              </button>
            </div>

            {/* Details grid */}
            <div style={{ padding: '16px 24px' }}>
              {[
                ['Client', selectedBooking.client],
                ['Booking Type', selectedBooking.bookingType || '—'],
                ['Sub-type / Service', selectedBooking.subType ? `${selectedBooking.subType} · ${selectedBooking.event}` : selectedBooking.event],
                ['Event Date', new Date(selectedBooking.date).toLocaleDateString('en-GH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })],
                ['Location', selectedBooking.location],
                ['Package / Services', selectedBooking.budget],
                ['Client Budget', selectedBooking.clientBudget ? `GH₵${selectedBooking.clientBudget}` : '—'],
                ['Phone', selectedBooking.phone || '—'],
                ['Email', selectedBooking.email || '—'],
                ['Assigned To', selectedBooking.assignedTo || 'Unassigned'],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, marginRight: '12px' }}>{label}</span>
                  <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 500, textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Action buttons — always visible */}
            <div style={{ padding: '16px 24px 20px', display: 'flex', gap: '10px', justifyContent: 'flex-end', background: '#0a0f1a', borderTop: '1px solid #1e293b' }}>
              <button
                onClick={() => { if (confirm('Delete this booking?')) { handleDelete(selectedBooking.id); setSelectedBooking(null); } }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '9px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                <Trash2 size={14} /> Delete
              </button>

              {selectedBooking.status !== 'CANCELLED' && selectedBooking.status !== 'COMPLETED' && (
                <button
                  onClick={() => { handleUpdateStatus(selectedBooking.id, 'CANCELLED'); setSelectedBooking(null); }}
                  style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '9px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  Reject
                </button>
              )}

              {(selectedBooking.status === 'PENDING' || selectedBooking.status === 'CANCELLED') && (
                <button
                  onClick={() => { handleUpdateStatus(selectedBooking.id, 'CONFIRMED'); setSelectedBooking(null); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #059669, #10b981)', border: 'none', color: '#fff', padding: '9px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  <Check size={14} /> Approve
                </button>
              )}

              {selectedBooking.status === 'CONFIRMED' && (
                <button
                  onClick={() => { handleUpdateStatus(selectedBooking.id, 'COMPLETED'); setSelectedBooking(null); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #4f46e5, #818cf8)', border: 'none', color: '#fff', padding: '9px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                >
                  <Check size={14} /> Mark Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
