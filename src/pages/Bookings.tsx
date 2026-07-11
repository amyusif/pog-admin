import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Check, X, Calendar as CalIcon, MapPin, DollarSign, User, FileText, MoreVertical, Trash2 } from 'lucide-react';
import api from '../services/api';

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

const emptyForm = { client: '', event: '', date: '', location: '', budget: '', assignedTo: '' };

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
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
    if (!form.client || !form.event || !form.date || !form.location || !form.budget) {
      setFormError('Please fill in all required fields.');
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

  if (loading) return <div style={{ color: '#f8fafc', padding: '40px' }}>Loading bookings...</div>;

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
                {['Client', 'Event', 'Date', 'Location', 'Package / Services', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#0a0f1a' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((b, i) => {
                const sc = statusConfig[b.status] || { bg: '#1e293b', color: '#94a3b8' };
                return (
                  <tr key={b.id} style={{ borderBottom: i < paginatedBookings.length - 1 ? '1px solid #1e293b' : 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#1e293b')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#f8fafc', fontWeight: 500 }}>{b.client}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Assigned: {b.assignedTo || '—'}</p>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#cbd5e1' }}>{b.event}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#cbd5e1', whiteSpace: 'nowrap' }}>{new Date(b.date).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#94a3b8', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.location}</td>
                    <td style={{ padding: '14px 16px', fontSize: '13px', color: '#d97706', fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={b.budget}>{b.budget}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: sc.bg, color: sc.color }}>{b.status}</span>
                    </td>
                    <td style={{ padding: '14px 16px', position: 'relative' }}>
                      <button onClick={() => setOpenActionMenu(openActionMenu === b.id ? null : b.id)}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}>
                        <MoreVertical size={16} />
                      </button>
                      
                      {openActionMenu === b.id && (
                        <>
                          <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={() => setOpenActionMenu(null)} />
                          <div style={{ position: 'absolute', right: '30px', top: '40px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '4px', zIndex: 10, width: '140px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
                            <button onClick={() => { setSelectedBooking(b); setOpenActionMenu(null); }}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '13px', cursor: 'pointer', textAlign: 'left', borderRadius: '4px' }}>
                              <Eye size={14} /> View Details
                            </button>
                            <button onClick={() => { handleUpdateStatus(b.id, b.status === 'CONFIRMED' ? 'PENDING' : 'CONFIRMED'); setOpenActionMenu(null); }}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '13px', cursor: 'pointer', textAlign: 'left', borderRadius: '4px' }}>
                              <Check size={14} /> Toggle Status
                            </button>
                            <div style={{ height: '1px', background: '#334155', margin: '4px 0' }} />
                            <button onClick={() => { handleDelete(b.id); setOpenActionMenu(null); }}
                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', textAlign: 'left', borderRadius: '4px' }}>
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {paginatedBookings.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#475569' }}>No bookings found.</td>
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
              <div>
                <label style={labelStyle}>Event Type *</label>
                <select style={inputStyle} value={form.event} onChange={e => setForm(f => ({ ...f, event: e.target.value }))}>
                  <option value="">Select event type...</option>
                  {['Wedding', 'Corporate Event', 'Private Party', 'Concert/Festival', 'Birthday', 'Other'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Event Date *</label>
                  <input style={inputStyle} type="date"
                    value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
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
              </div>
              <div>
                <label style={labelStyle}>Venue / Location *</label>
                <input style={inputStyle} placeholder="e.g. Kempinski Hotel, Accra"
                  value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
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

      {/* ── View / Approve Booking Modal ── */}
      {selectedBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedBooking(null)}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '32px', width: '500px', maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Booking Details</h2>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: statusConfig[selectedBooking.status]?.bg, color: statusConfig[selectedBooking.status]?.color }}>{selectedBooking.status}</span>
              </div>
              <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {[
              ['Client', selectedBooking.client],
              ['Event Type', selectedBooking.event],
              ['Date', new Date(selectedBooking.date).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
              ['Location', selectedBooking.location],
              ['Package / Services', selectedBooking.budget],
              ['Assigned To', selectedBooking.assignedTo || 'Unassigned'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
                <span style={{ fontSize: '13px', color: '#64748b', flexShrink: 0, marginRight: '16px' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 500, textAlign: 'right' }}>{value}</span>
              </div>
            ))}

            {selectedBooking.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button onClick={() => { handleUpdateStatus(selectedBooking.id, 'CANCELLED'); setSelectedBooking(null); }}
                  style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Reject
                </button>
                <button onClick={() => { handleUpdateStatus(selectedBooking.id, 'CONFIRMED'); setSelectedBooking(null); }}
                  style={{ background: '#10b981', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  Approve Booking
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
