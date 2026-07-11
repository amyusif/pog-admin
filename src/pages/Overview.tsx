import { useState, useEffect } from 'react';
import { DollarSign, Users, CalendarCheck, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../services/api';

const eventTypeData = [
  { name: 'Corporate', value: 38, color: '#d97706' },
  { name: 'Wedding', value: 29, color: '#7f1d1d' },
  { name: 'Private', value: 21, color: '#1d4ed8' },
  { name: 'Festival', value: 12, color: '#059669' },
];

const statusColors: Record<string, string> = {
  PENDING: '#d97706',
  CONFIRMED: '#059669',
  CANCELLED: '#ef4444',
  COMPLETED: '#1d4ed8'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ margin: '0 0 6px', color: '#94a3b8', fontSize: '12px' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ margin: '2px 0', color: p.color, fontSize: '13px', fontWeight: 600 }}>
            {p.name === 'revenue' ? `₦${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Overview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ color: '#f8fafc' }}>Loading dashboard...</div>;
  }

  const kpis = [
    { title: 'Total Revenue', value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`, change: '+20.1%', up: true, icon: DollarSign, color: '#d97706' },
    { title: 'Active Bookings', value: stats?.activeBookings || 0, change: '+18.1%', up: true, icon: CalendarCheck, color: '#059669' },
    { title: 'Total Clients', value: stats?.totalClients || 0, change: '+9.4%', up: true, icon: Users, color: '#1d4ed8' },
    { title: 'Conversion Rate', value: '24.3%', change: '-2.1%', up: false, icon: TrendingUp, color: '#7f1d1d' },
  ];

  // Map API bookings to chart data
  const revenueDataMap = (stats?.bookingsData || []).reduce((acc: any, booking: any) => {
    const month = new Date(booking.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) acc[month] = { name: month, revenue: 0, bookings: 0 };
    acc[month].revenue += Number(booking.budget) || 0;
    acc[month].bookings += 1;
    return acc;
  }, {});

  const revenueData = Object.values(revenueDataMap);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#f8fafc' }}>Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>Welcome back! Here's what's happening.</p>
        </div>
        <button
          style={{
            background: 'linear-gradient(135deg, #7f1d1d, #d97706)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          + New Booking
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>{kpi.title}</p>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `${kpi.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={18} style={{ color: kpi.color }} />
                </div>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 700, color: '#f8fafc' }}>{kpi.value}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {kpi.up
                  ? <ArrowUpRight size={14} style={{ color: '#10b981' }} />
                  : <ArrowDownRight size={14} style={{ color: '#ef4444' }} />}
                <span style={{ fontSize: '12px', color: kpi.up ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  {kpi.change}
                </span>
                <span style={{ fontSize: '12px', color: '#475569' }}>from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Revenue Area Chart */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>Revenue Analytics</h3>
          </div>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={2.5} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 24px', fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>Event Types</h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {eventTypeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
