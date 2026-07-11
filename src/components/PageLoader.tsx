import React from 'react';

/* ── Shimmer keyframe injected once ── */
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .skeleton {
    background: linear-gradient(90deg, #1e293b 25%, #273548 50%, #1e293b 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
    border-radius: 6px;
  }
  @keyframes spin-dash {
    0%   { stroke-dashoffset: 140; }
    50%  { stroke-dashoffset: 35;  }
    100% { stroke-dashoffset: 140; }
  }
  @keyframes rotate {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('#pog-loader-style')) {
  style.id = 'pog-loader-style';
  document.head.appendChild(style);
}

/* ── Skeleton bar helper ── */
const Sk = ({ w = '100%', h = 14, mb = 0 }: { w?: string | number; h?: number; mb?: number }) => (
  <div className="skeleton" style={{ width: w, height: h, marginBottom: mb }} />
);

/* ── Bookings table skeleton ── */
export function BookingsLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Sk w={140} h={24} />
          <Sk w={100} h={14} />
        </div>
        <Sk w={130} h={38} />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Sk w={60} h={12} />
            <Sk w={40} h={28} />
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1.5fr 1fr', gap: '0', background: '#0a0f1a', padding: '14px 16px', borderBottom: '1px solid #1e293b' }}>
          {[80, 60, 60, 90, 120, 60].map((w, i) => (
            <Sk key={i} w={w} h={11} />
          ))}
        </div>

        {/* Body rows */}
        {[...Array(7)].map((_, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1.5fr 1fr', gap: '0', padding: '16px', borderBottom: i < 6 ? '1px solid #1e293b' : 'none', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Sk w="70%" h={13} />
              <Sk w="50%" h={11} />
            </div>
            <Sk w="65%" h={13} />
            <Sk w="55%" h={13} />
            <Sk w="80%" h={13} />
            <Sk w="60%" h={13} />
            <Sk w={64} h={22} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Events calendar skeleton ── */
export function EventsLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Sk w={120} h={24} />
        <Sk w={120} h={38} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>
        {/* Calendar */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Sk w={40} h={36} />
            <Sk w={160} h={20} />
            <Sk w={40} h={36} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '8px 0' }}>
                <Sk w={20} h={12} />
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {[...Array(35)].map((_, i) => (
              <div key={i} style={{ minHeight: '80px', border: '1px solid #1e293b', borderRadius: '4px', padding: '6px' }}>
                <Sk w={20} h={20} />
                {i % 7 === 2 || i % 9 === 0 ? <Sk w="90%" h={10} /> : null}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Sk w={120} h={15} mb={4} />
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: '#1e293b', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Sk w="75%" h={13} />
                <Sk w="55%" h={11} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Employees card grid skeleton ── */
export function EmployeesLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Sk w={160} h={24} />
        <Sk w={150} h={38} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Sk w={48} h={48} />
              <Sk w={72} h={22} />
            </div>
            <Sk w="65%" h={16} />
            <Sk w="45%" h={13} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Sk w={70} h={24} />
              <Sk w={50} h={24} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Generic spinner (fallback) ── */
export function SpinnerLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '20px' }}>
      <svg
        width="52" height="52" viewBox="0 0 52 52"
        style={{ animation: 'rotate 1.2s linear infinite', transformOrigin: 'center' }}
      >
        <circle
          cx="26" cy="26" r="22"
          fill="none" stroke="#1e293b" strokeWidth="3"
        />
        <circle
          cx="26" cy="26" r="22"
          fill="none" stroke="url(#grad)" strokeWidth="3"
          strokeLinecap="round" strokeDasharray="138"
          style={{ animation: 'spin-dash 1.4s ease-in-out infinite' }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
      <span style={{ fontSize: '14px', color: '#475569', letterSpacing: '0.05em' }}>{label}</span>
    </div>
  );
}
