import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  BookOpenCheck,
  ChevronRight,
  Music,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Bookings', href: '/bookings', icon: BookOpenCheck },
  { name: 'Events', href: '/events', icon: CalendarDays },
  { name: 'Employees', href: '/employees', icon: Users },
];

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard Overview',
  '/bookings': 'Bookings Management',
  '/events': 'Events & Calendar',
  '/employees': 'Team & Employees',
  '/settings': 'Settings',
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pageTitle = pageTitles[location.pathname] || 'POG Admin';
  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'AD';
  const fullName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Admin User';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#020617' }}>
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: '256px',
          minWidth: '256px',
          background: '#0f172a',
          borderRight: '1px solid #1e293b',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            borderBottom: '1px solid #1e293b',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <div style={{ background: 'white', padding: '6px 10px', borderRadius: '10px', flexShrink: 0 }}>
            <img src="/logo.png" alt="POG" style={{ height: '32px', objectFit: 'contain', display: 'block' }} />
          </div>
          <div>
            <p style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px', margin: 0, lineHeight: 1.2 }}>
              Power of Grace
            </p>
            <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>Admin Panel</p>
          </div>
        </div>

        {/* Nav Label */}
        <div style={{ padding: '24px 20px 8px', flexShrink: 0 }}>
          <p style={{ color: '#475569', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
            Main Menu
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '11px 12px',
                  borderRadius: '10px',
                  marginBottom: '2px',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(127,29,29,0.4), rgba(217,119,6,0.2))'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(217,119,6,0.3)' : '1px solid transparent',
                  color: isActive ? '#f59e0b' : '#94a3b8',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(30,41,59,0.8)';
                    e.currentTarget.style.color = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 400, flex: 1 }}>
                  {item.name}
                </span>
                {isActive && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div style={{ padding: '12px', borderTop: '1px solid #1e293b', flexShrink: 0 }}>
          <Link
            to="/settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: location.pathname === '/settings' ? '#f59e0b' : '#94a3b8',
              marginBottom: '2px',
              transition: 'all 0.15s',
              background: location.pathname === '/settings'
                ? 'linear-gradient(135deg, rgba(127,29,29,0.4), rgba(217,119,6,0.2))'
                : 'transparent',
              border: location.pathname === '/settings' ? '1px solid rgba(217,119,6,0.3)' : '1px solid transparent',
            } as React.CSSProperties}
          >
            <Settings size={18} />
            <span style={{ fontSize: '14px' }}>Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'transparent',
              border: '1px solid transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.15s',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(127,29,29,0.2)';
              e.currentTarget.style.color = '#f87171';
              e.currentTarget.style.borderColor = 'rgba(127,29,29,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#94a3b8';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top Navbar */}
        <header
          style={{
            height: '72px',
            background: '#0f172a',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            flexShrink: 0,
            gap: '16px',
          }}
        >
          {/* Page Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Music size={18} style={{ color: '#d97706' }} />
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#f8fafc' }}>
              {pageTitle}
            </h2>
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input
                type="search"
                placeholder="Search..."
                style={{
                  background: '#020617',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  padding: '8px 12px 8px 36px',
                  fontSize: '13px',
                  outline: 'none',
                  width: '220px',
                }}
              />
            </div>

            {/* Notifications */}
            <button
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '10px',
              }}
            >
              <Bell size={20} />
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                border: '2px solid #0f172a',
              }} />
            </button>

            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #1e293b', paddingLeft: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7f1d1d, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '13px',
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{fullName}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{user?.role || 'ADMIN'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#020617' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
