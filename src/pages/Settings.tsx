import { useState } from 'react';
import { Save, User, Bell, Shield, CreditCard, Building, ChevronRight } from 'lucide-react';

const sections = [
  { id: 'business', label: 'Business Info', icon: Building },
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

export default function Settings() {
  const [active, setActive] = useState('business');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const InputField = ({ label, defaultValue, type = 'text', placeholder = '' }: any) => (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={{
          width: '100%', background: '#020617', border: '1px solid #1e293b', borderRadius: '10px',
          color: '#f8fafc', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
        }}
        onFocus={e => e.currentTarget.style.borderColor = '#d97706'}
        onBlur={e => e.currentTarget.style.borderColor = '#1e293b'}
      />
    </div>
  );

  const Toggle = ({ label, description, defaultChecked = false }: any) => {
    const [on, setOn] = useState(defaultChecked);
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #1e293b' }}>
        <div>
          <p style={{ margin: 0, fontSize: '14px', color: '#f8fafc', fontWeight: 500 }}>{label}</p>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{description}</p>
        </div>
        <button
          onClick={() => setOn(!on)}
          style={{
            width: '44px', height: '24px', borderRadius: '12px', border: 'none',
            background: on ? '#d97706' : '#1e293b', cursor: 'pointer',
            position: 'relative', transition: 'background 0.2s', flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute', top: '3px',
            left: on ? '23px' : '3px',
            width: '18px', height: '18px', borderRadius: '50%',
            background: 'white', transition: 'left 0.2s',
          }} />
        </button>
      </div>
    );
  };

  const renderContent = () => {
    switch (active) {
      case 'business':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Business Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <InputField label="Company Name" defaultValue="Power of Grace Events and Trading Ltd." />
              <InputField label="Tagline" defaultValue="Power of Groove" />
              <InputField label="Business Email" type="email" defaultValue="info@powerofgrace.ng" />
              <InputField label="Phone Number" defaultValue="+234 800 123 4567" />
              <InputField label="Website" defaultValue="https://powerofgrace.ng" />
              <InputField label="Instagram" defaultValue="@powerofgrace_ng" />
            </div>
            <InputField label="Business Address" defaultValue="14 Oxford Street, Osu, Accra, Ghana" />
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                About / Bio
              </label>
              <textarea
                defaultValue="Power of Grace Events and Trading Limited is Ghana's premier live band and event production company, delivering world-class musical experiences for corporate events, weddings, private parties, and festivals."
                style={{
                  width: '100%', background: '#020617', border: '1px solid #1e293b', borderRadius: '10px',
                  color: '#f8fafc', padding: '10px 14px', fontSize: '14px', outline: 'none',
                  resize: 'vertical', minHeight: '100px', boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        );

      case 'account':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Account Settings</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <InputField label="First Name" defaultValue="Admin" />
              <InputField label="Last Name" defaultValue="User" />
              <InputField label="Email Address" type="email" defaultValue="admin@powerofgrace.com" />
              <InputField label="Role" defaultValue="Administrator" />
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h2 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Notification Preferences</h2>
            <Toggle label="New Booking Alerts" description="Get notified when a new booking is submitted" defaultChecked={true} />
            <Toggle label="Payment Confirmations" description="Receive alerts when payments are processed" defaultChecked={true} />
            <Toggle label="Event Reminders" description="Reminders 24hrs before each event" defaultChecked={true} />
            <Toggle label="Staff Assignments" description="Notified when staff are assigned or removed" defaultChecked={false} />
            <Toggle label="Email Digest" description="Daily summary of all activity" defaultChecked={false} />
          </div>
        );

      case 'security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Security</h2>
            <InputField label="Current Password" type="password" placeholder="••••••••" />
            <InputField label="New Password" type="password" placeholder="••••••••" />
            <InputField label="Confirm New Password" type="password" placeholder="••••••••" />
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', color: '#f8fafc', fontWeight: 500 }}>Two-Factor Authentication</p>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>Add an extra layer of security</p>
              </div>
              <button style={{
                background: 'linear-gradient(135deg, #7f1d1d, #d97706)', color: 'white',
                border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer',
              }}>
                Enable
              </button>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Payment Configuration</h2>
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>P</div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#f8fafc', fontWeight: 600 }}>Paystack</p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Ghanaian payment gateway</p>
                  </div>
                </div>
                <span style={{ background: 'rgba(5,150,105,0.15)', color: '#10b981', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px' }}>
                  Connected
                </span>
              </div>
              <InputField label="Public Key" defaultValue="pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <InputField label="Bank Name" defaultValue="GCB Bank" />
              <InputField label="Account Number" defaultValue="0012345678" />
              <InputField label="Account Name" defaultValue="Power of Grace Ltd" />
              <InputField label="Default Currency" defaultValue="GHS (GH₵)" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#f8fafc' }}>Settings</h1>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>Manage your business and account preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Sidebar Nav */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
          {sections.map(s => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '14px 16px', background: isActive ? 'rgba(217,119,6,0.1)' : 'transparent',
                  border: 'none', borderLeft: isActive ? '3px solid #d97706' : '3px solid transparent',
                  color: isActive ? '#f59e0b' : '#94a3b8', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Icon size={16} />
                  <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 400 }}>{s.label}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px' }}>
          {renderContent()}
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleSave}
              style={{
                background: 'linear-gradient(135deg, #7f1d1d, #d97706)', color: 'white',
                border: 'none', padding: '11px 24px', borderRadius: '10px',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <Save size={15} /> Save Changes
            </button>
            {saved && (
              <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 500 }}>
                ✓ Changes saved!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
