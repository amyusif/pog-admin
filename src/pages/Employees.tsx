import { useState, useEffect } from 'react';
import { Search, Plus, Phone, Mail, Star, X, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import api from '../services/api';
import { EmployeesLoader } from '../components/PageLoader';

const departmentColors: Record<string, string> = {
  'Rhythm Section': '#7f1d1d',
  'Vocals': '#d97706',
  'Melody': '#1d4ed8',
  'Brass': '#059669',
  'Management': '#7c3aed',
  'Technical': '#475569',
};

const DEPARTMENTS = ['Rhythm Section', 'Vocals', 'Melody', 'Brass', 'Management', 'Technical'];

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
  name: '', role: '', department: '', phone: '', email: '',
  available: true as boolean, avatar: '', joinDate: '',
};

export default function Employees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const departments = ['All', ...DEPARTMENTS];

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  // Auto-generate avatar initials from name
  const handleNameChange = (name: string) => {
    const initials = name.trim().split(' ').map(w => w[0]?.toUpperCase() || '').join('').slice(0, 2);
    setForm(f => ({ ...f, name, avatar: initials }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.role || !form.department || !form.email) {
      setFormError('Name, role, department and email are required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/employees', form);
      setShowAdd(false);
      setForm(emptyForm);
      fetchEmployees();
    } catch (err: any) {
      setFormError(err?.response?.data?.error || 'Failed to add team member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        await api.delete(`/employees/${id}`);
        setSelectedEmp(null);
        fetchEmployees();
      } catch (err) {
        console.error('Failed to delete employee', err);
      }
    }
  };

  if (loading) return <EmployeesLoader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#f8fafc' }}>Team Members</h1>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>{employees.length} members in your roster</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          background: 'linear-gradient(135deg, #7f1d1d, #d97706)',
          color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px',
          fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', border: '1px solid #1e293b', padding: '8px 16px', borderRadius: '10px', width: '260px' }}>
          <Search size={18} color="#64748b" />
          <input type="text" placeholder="Search team..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '14px', width: '100%', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {departments.map(d => (
            <button key={d} onClick={() => setDeptFilter(d)} style={{
              background: deptFilter === d ? '#1e293b' : 'transparent',
              border: deptFilter === d ? '1px solid #334155' : '1px solid transparent',
              color: deptFilter === d ? '#f8fafc' : '#94a3b8',
              padding: '6px 12px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
            }}>{d}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filtered.map(emp => (
          <div key={emp.id} onClick={() => setSelectedEmp(emp)}
            style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#334155'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: `linear-gradient(135deg, ${departmentColors[emp.department] || '#475569'}, #0f172a)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#fff',
              }}>
                {emp.avatar || emp.name.substring(0, 2).toUpperCase()}
              </div>
              {emp.available
                ? <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', background: '#10b98120', padding: '4px 8px', borderRadius: '12px', fontWeight: 600 }}><CheckCircle size={12} /> Available</span>
                : <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#ef4444', background: '#ef444420', padding: '4px 8px', borderRadius: '12px', fontWeight: 600 }}><XCircle size={12} /> Busy</span>
              }
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600, color: '#f8fafc' }}>{emp.name}</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#94a3b8' }}>{emp.role}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', background: '#1e293b', color: '#cbd5e1', padding: '4px 8px', borderRadius: '6px' }}>{emp.department}</span>
              <span style={{ fontSize: '11px', background: '#1e293b', color: '#cbd5e1', padding: '4px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={10} color="#eab308" /> {emp.rating || '—'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '48px', textAlign: 'center', color: '#475569' }}>No team members found.</div>
      )}

      {/* ── Add Member Modal ── */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)' }}
          onClick={() => setShowAdd(false)}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '36px', width: '540px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>Add Team Member</h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Add a new band member or staff to your roster</p>
              </div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Avatar preview */}
            {form.name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', padding: '14px', background: '#1e293b', borderRadius: '12px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${departmentColors[form.department] || '#475569'}, #0f172a)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#fff',
                }}>
                  {form.avatar || '??'}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#f8fafc' }}>{form.name}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>{form.role || 'Role not set'} · {form.department || 'Dept. not set'}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input style={inputStyle} placeholder="e.g. Akua Mensah"
                    value={form.name} onChange={e => handleNameChange(e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Role / Instrument *</label>
                  <input style={inputStyle} placeholder="e.g. Lead Vocalist"
                    value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Department *</label>
                <select style={inputStyle} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  <option value="">Select department...</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Email Address *</label>
                <input style={inputStyle} type="email" placeholder="e.g. akua@pog.com.gh"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input style={inputStyle} placeholder="+233 2XX XXX XXXX"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Join Date</label>
                  <input style={inputStyle} placeholder="e.g. Jan 2023"
                    value={form.joinDate} onChange={e => setForm(f => ({ ...f, joinDate: e.target.value }))} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Availability</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[{ label: 'Available', value: true }, { label: 'Busy', value: false }].map(opt => (
                    <button key={String(opt.value)} type="button"
                      onClick={() => setForm(f => ({ ...f, available: opt.value }))}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        border: `1px solid ${form.available === opt.value ? (opt.value ? '#10b981' : '#ef4444') : '#334155'}`,
                        background: form.available === opt.value ? (opt.value ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)') : 'transparent',
                        color: form.available === opt.value ? (opt.value ? '#10b981' : '#ef4444') : '#94a3b8',
                      }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
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
                  {submitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Member Modal ── */}
      {selectedEmp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedEmp(null)}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '32px', width: '420px', maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `linear-gradient(135deg, ${departmentColors[selectedEmp.department] || '#475569'}, #0f172a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                  {selectedEmp.avatar || selectedEmp.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>{selectedEmp.name}</h2>
                  <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#94a3b8' }}>{selectedEmp.role}</p>
                  <span style={{ fontSize: '11px', background: `${departmentColors[selectedEmp.department] || '#475569'}30`, color: departmentColors[selectedEmp.department] || '#94a3b8', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    {selectedEmp.department}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => handleDelete(selectedEmp.id)} title="Delete Member" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                <button onClick={() => setSelectedEmp(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedEmp.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#1e293b', borderRadius: '12px' }}>
                  <Phone size={16} color="#94a3b8" />
                  <span style={{ fontSize: '14px', color: '#f8fafc' }}>{selectedEmp.phone}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#1e293b', borderRadius: '12px' }}>
                <Mail size={16} color="#94a3b8" />
                <span style={{ fontSize: '14px', color: '#f8fafc' }}>{selectedEmp.email}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#1e293b', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#94a3b8' }}>Events</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#f8fafc' }}>{selectedEmp.events}</p>
                </div>
                <div style={{ padding: '12px', background: '#1e293b', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#94a3b8' }}>Rating</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#eab308' }}>{selectedEmp.rating || '—'}</p>
                </div>
                <div style={{ padding: '12px', background: '#1e293b', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#94a3b8' }}>Status</p>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: selectedEmp.available ? '#10b981' : '#ef4444' }}>
                    {selectedEmp.available ? 'Available' : 'Busy'}
                  </p>
                </div>
              </div>
              {selectedEmp.joinDate && (
                <p style={{ margin: 0, fontSize: '12px', color: '#475569', textAlign: 'center' }}>
                  Member since {selectedEmp.joinDate}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
