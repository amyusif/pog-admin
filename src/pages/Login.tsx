import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('admin@powerofgrace.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try real backend first
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.user, data.token);
        navigate('/dashboard');
        return;
      } else {
        const data = await response.json();
        // Demo fallback: allow demo credentials when backend is running but credentials wrong
        if (email === 'admin@powerofgrace.com' && password === 'admin123') {
          login({ id: 'demo', email, role: 'ADMIN', firstName: 'Admin', lastName: 'User' }, 'demo-token');
          navigate('/dashboard');
          return;
        }
        setError(data.error || 'Invalid email or password.');
      }
    } catch {
      // Backend offline — allow demo credentials
      if (email === 'admin@powerofgrace.com' && password === 'admin123') {
        login({ id: 'demo', email, role: 'ADMIN', firstName: 'Admin', lastName: 'User' }, 'demo-token');
        navigate('/dashboard');
        return;
      }
      setError('Cannot connect to server. Use admin@powerofgrace.com / admin123 for demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1a0a0a 100%)' }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Card */}
        <div className="flex justify-center mb-8">
          <div className="bg-white px-8 py-4 rounded-2xl shadow-2xl shadow-brand-gold/10">
            <img src="/logo.png" alt="Power of Grace Logo" className="h-16 w-auto object-contain" />
          </div>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl border border-slate-700/50 p-8 shadow-2xl"
          style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)' }}
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-main">Welcome Back</h1>
            <p className="text-text-muted mt-1 text-sm">Sign in to the POG Admin Dashboard</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-6">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-900/50 text-text-main placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all text-sm"
                  placeholder="admin@powerofgrace.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-slate-700 rounded-xl bg-slate-900/50 text-text-main placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold transition-all text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-slate-700 bg-slate-900 accent-brand-gold"
                />
                Remember me
              </label>
              <a href="#" className="text-brand-gold hover:text-brand-goldlight transition-colors text-xs font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: loading ? '#92400e' : 'linear-gradient(135deg, #7f1d1d, #d97706)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
