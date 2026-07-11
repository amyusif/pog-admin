import { useState, useEffect } from 'react';
import { DollarSign, Users, CalendarCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import api from '../services/api';

const eventTypeData = [
  { name: 'Corporate', value: 38, color: '#d97706' },
  { name: 'Wedding', value: 29, color: '#7f1d1d' },
  { name: 'Private', value: 21, color: '#1d4ed8' },
  { name: 'Festival', value: 12, color: '#059669' },
];



const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ margin: '0 0 6px', color: '#94a3b8', fontSize: '12px' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ margin: '2px 0', color: p.color, fontSize: '13px', fontWeight: 600 }}>
            {p.name === 'revenue' ? `GH₵${p.value.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Overview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  const cards = [
    { title: 'Total Revenue', value: `GH₵${(stats?.totalRevenue || 0).toLocaleString()}`, change: '+20.1%', up: true, icon: DollarSign, color: '#d97706' },
    { title: 'Active Bookings', value: stats?.activeBookings || 0, change: '+12%', up: true, icon: CalendarCheck, color: '#059669' },
    { title: 'Team Members', value: stats?.totalEmployees || 0, change: '+4', up: true, icon: Users, color: '#1d4ed8' },
    { title: 'Completion Rate', value: '94%', change: '+2.4%', up: true, icon: TrendingUp, color: '#7c3aed' },
  ];

  const chartData = [
    { name: 'Jan', revenue: 400000, bookings: 12 },
    { name: 'Feb', revenue: 300000, bookings: 8 },
    { name: 'Mar', revenue: 550000, bookings: 15 },
    { name: 'Apr', revenue: 450000, bookings: 10 },
    { name: 'May', revenue: 700000, bookings: 22 },
    { name: 'Jun', revenue: 850000, bookings: 28 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#f8fafc' }}>Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>Welcome back to your control center.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {cards.map(card => (
          <div key={card.title} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>{card.title}</p>
                <h3 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#f8fafc' }}>{card.value}</h3>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${card.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                <card.icon size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
              <span style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: card.up ? '#10b981' : '#ef4444', background: card.up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.change}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Revenue Chart */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#f8fafc' }}>Revenue Overview</h3>
            <select style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', padding: '4px 8px', fontSize: '12px', outline: 'none' }}>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `GH₵${(v / 1000).toFixed(0)}k`} />
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
