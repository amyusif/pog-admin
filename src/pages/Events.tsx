import { useState, useEffect } from 'react';
import { Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import api from '../services/api';
import { EventsLoader } from '../components/PageLoader';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const inputStyle: React.CSSProperties = {
  background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
  color: '#f8fafc', padding: '10px 12px', fontSize: '14px',
  outline: 'none', width: '100%', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const EVENT_TYPES = ['Wedding', 'Corporate Event', 'Birthday', 'Fashion', 'Private Party', 'Concert/Festival', 'Other'];
const TYPE_COLORS: Record<string, string> = {
  'Wedding': '#7f1d1d', 'Corporate Event': '#d97706', 'Birthday': '#7c3aed',
  'Fashion': '#1d4ed8', 'Private Party': '#059669', 'Concert/Festival': '#ea580c', 'Other': '#475569',
};

const emptyForm = { title: '', date: '', time: '18:00', venue: '', type: '', staff: '4', color: '#d97706' };

export default function Events() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const eventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const upcomingEvents = [...events]
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  // Auto-set color when type changes
  const handleTypeChange = (type: string) => {
    setForm(f => ({ ...f, type, color: TYPE_COLORS[type] || '#d97706' }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.title || !form.date || !form.time || !form.venue || !form.type) {
      setFormError('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/events', { ...form, staff: Number(form.staff) });
      setShowAdd(false);
      setForm(emptyForm);
      fetchEvents();
    } catch (err: any) {
      setFormError(err?.response?.data?.error || 'Failed to add event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        setSelectedEvent(null);
        fetchEvents();
      } catch (err) {
        console.error('Failed to delete event', err);
      }
    }
  };

  if (loading) return <EventsLoader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#f8fafc' }}>Events Calendar</h1>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>{events.length} scheduled events</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          background: 'linear-gradient(135deg, #7f1d1d, #d97706)',
          color: 'white', border: 'none', padding: '10px 20px',
          borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Plus size={16} /> New Event
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        {/* Calendar */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #1e293b' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>{MONTHS[month]} {year}</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={prevMonth} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', display: 'flex' }}><ChevronLeft size={16} /></button>
              <button onClick={nextMonth} style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', display: 'flex' }}><ChevronRight size={16} /></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #1e293b' }}>
            {DAYS.map(d => (
              <div key={d} style={{ padding: '10px 0', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: '100px', borderRight: '1px solid #1e293b', borderBottom: '1px solid #1e293b' }} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = eventsForDay(day);
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
              const col = (firstDay + i) % 7;
              return (
                <div key={day} style={{
                  minHeight: '100px',
                  borderRight: col === 6 ? 'none' : '1px solid #1e293b',
                  borderBottom: '1px solid #1e293b', padding: '8px',
                  background: isToday ? 'rgba(217,119,6,0.05)' : 'transparent',
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '26px', height: '26px', borderRadius: '50%', fontSize: '13px',
                    fontWeight: isToday ? 700 : 400,
                    background: isToday ? '#d97706' : 'transparent',
                    color: isToday ? 'white' : '#94a3b8', marginBottom: '6px',
                  }}>{day}</span>
                  {dayEvents.map(ev => (
                    <div key={ev.id} onClick={() => setSelectedEvent(ev)} style={{
                      fontSize: '10px', fontWeight: 600, padding: '3px 6px', borderRadius: '4px', marginBottom: '3px',
                      background: `${ev.color}30`, color: ev.color, borderLeft: `2px solid ${ev.color}`,
                      cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{ev.title}</div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>Upcoming Events</h3>
            {upcomingEvents.length === 0 ? (
              <p style={{ color: '#475569', fontSize: '13px' }}>No upcoming events.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {upcomingEvents.map(ev => (
                  <div key={ev.id} onClick={() => setSelectedEvent(ev)} style={{
                    padding: '12px', borderRadius: '12px', cursor: 'pointer',
                    background: '#1e293b', borderLeft: `3px solid ${ev.color}`,
                  }}>
                    <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{ev.title}</p>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={10} />{ev.date} @ {ev.time}
                    </span>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={10} />{ev.venue?.split(',')[0]}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}><Users size={10} />{ev.staff} staff</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>Event Types</h3>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color }} />
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Add Event Modal ── */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}
          onClick={() => setShowAdd(false)}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '36px', width: '540px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>New Event</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Schedule a new event on the calendar</p>
              </div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Event Title *</label>
                <input style={inputStyle} placeholder="e.g. Mensah Wedding Reception"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>

              <div>
                <label style={labelStyle}>Event Type *</label>
                <select style={inputStyle} value={form.type} onChange={e => handleTypeChange(e.target.value)}>
                  <option value="">Select type...</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Color preview */}
              {form.type && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#1e293b', borderRadius: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: form.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Calendar colour: <strong style={{ color: form.color }}>{form.type}</strong></span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Date *</label>
                  <input style={inputStyle} type="date"
                    value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Start Time *</label>
                  <input style={inputStyle} type="time"
                    value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Venue *</label>
                <input style={inputStyle} placeholder="e.g. Kempinski Hotel, Accra"
                  value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))} />
              </div>

              <div>
                <label style={labelStyle}>Staff Required *</label>
                <input style={inputStyle} type="number" min="1" max="50" placeholder="e.g. 8"
                  value={form.staff} onChange={e => setForm(f => ({ ...f, staff: e.target.value }))} />
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
                  {submitting ? 'Saving...' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Event Detail Modal ── */}
      {selectedEvent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}
          onClick={() => setSelectedEvent(null)}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', width: '480px', maxWidth: '92vw', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            
            {/* Modal header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0f1a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>Event Details</h2>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: `${selectedEvent.color}20`, color: selectedEvent.color }}>
                  {selectedEvent.type}
                </span>
              </div>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', lineHeight: 1 }}>
                <X size={18} />
              </button>
            </div>

            {/* Details grid */}
            <div style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>{selectedEvent.title}</h3>
              {[
                ['Date & Time', `${new Date(selectedEvent.date).toLocaleDateString('en-GH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at ${selectedEvent.time}`],
                ['Venue', selectedEvent.venue],
                ['Staff Required', `${selectedEvent.staff} members`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #1e293b' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0, marginRight: '12px' }}>{label}</span>
                  <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 500, textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ padding: '16px 24px 20px', display: 'flex', gap: '10px', justifyContent: 'flex-end', background: '#0a0f1a', borderTop: '1px solid #1e293b' }}>
              <button
                onClick={() => { if (confirm('Delete this event?')) { handleDelete(selectedEvent.id); setSelectedEvent(null); } }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '9px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              >
                <Trash2 size={14} /> Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
