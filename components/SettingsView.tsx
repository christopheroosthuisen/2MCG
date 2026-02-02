
import React, { useState } from 'react';
import { AppPreferences, LinkedAccount, ThemeMode, Language, MeasurementUnit } from '../types';
import { COLORS, MOCK_PREFERENCES, MOCK_LINKED_ACCOUNTS } from '../constants';
import { ScreenHeader } from './UIComponents';
import { SubscriptionView } from './SubscriptionView';

const SettingsToggle: React.FC<{ label: string; description?: string; value: boolean; onChange: (value: boolean) => void; icon?: string; }> = ({ label, description, value, onChange, icon }) => (
    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
      <div className="flex items-center gap-3">
        {icon && <span className="text-xl">{icon}</span>}
        <div>
          <div className="font-medium text-sm">{label}</div>
          {description && <div className="text-xs text-gray-500">{description}</div>}
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-7 rounded-full p-1 transition-colors ${value ? 'bg-green-500' : 'bg-gray-300'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
);

const SettingsSelector: React.FC<{ label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void; icon?: string; }> = ({ label, value, options, onChange, icon }) => (
    <div className="p-3 bg-white rounded-lg">
      <div className="flex items-center gap-3 mb-2">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${value === option.value ? `bg-orange-50 text-orange-600 border-orange-200` : `bg-white text-gray-600 border-gray-200 hover:bg-gray-50`}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
);

const SettingsMenuItem: React.FC<{ icon: string; label: string; description?: string; value?: string; badge?: string; badgeColor?: string; onPress: () => void; }> = ({ icon, label, description, value, badge, badgeColor, onPress }) => (
    <button onClick={onPress} className="w-full flex items-center gap-3 p-4 bg-white border-b border-gray-100 last:border-0 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors">
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <div className="font-medium text-sm text-gray-900">{label}</div>
        {description && <div className="text-xs text-gray-500">{description}</div>}
      </div>
      {value && <span className="text-sm text-gray-500">{value}</span>}
      {badge && <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: badgeColor || COLORS.primary }}>{badge}</span>}
      <span className="text-gray-400">›</span>
    </button>
);

const AppPreferencesEditor: React.FC<{ preferences: AppPreferences; onUpdate: (updates: Partial<AppPreferences>) => void; }> = ({ preferences, onUpdate }) => (
    <div className="space-y-3">
      <SettingsSelector label="Theme" icon="🎨" value={preferences.theme} options={[{ value: 'light', label: '☀️ Light' }, { value: 'dark', label: '🌙 Dark' }, { value: 'system', label: '⚙️ System' }]} onChange={(v) => onUpdate({ theme: v as ThemeMode })} />
      <SettingsSelector label="Distance Unit" icon="📏" value={preferences.distanceUnit} options={[{ value: 'yards', label: 'Yards' }, { value: 'meters', label: 'Meters' }]} onChange={(v) => onUpdate({ distanceUnit: v as MeasurementUnit })} />
      
      <div className="px-1 pt-2 pb-1 text-xs font-bold text-gray-500 uppercase tracking-wider">AI Coach</div>
      <SettingsSelector 
        label="Voice Style" 
        icon="🗣️" 
        value={(preferences as any).coachVoice || 'friendly'} 
        options={[{ value: 'friendly', label: 'Friendly' }, { value: 'technical', label: 'Technical' }, { value: 'strict', label: 'Strict' }]} 
        onChange={(v) => onUpdate({ coachVoice: v } as any)} 
      />
      <SettingsSelector 
        label="Analysis Depth" 
        icon="🧠" 
        value={(preferences as any).analysisDepth || 'balanced'} 
        options={[{ value: 'quick', label: 'Quick Tips' }, { value: 'balanced', label: 'Balanced' }, { value: 'deep', label: 'Deep Dive' }]} 
        onChange={(v) => onUpdate({ analysisDepth: v } as any)} 
      />

      <SettingsToggle label="Haptic Feedback" icon="📳" value={preferences.hapticFeedback} onChange={(v) => onUpdate({ hapticFeedback: v })} />
      <SettingsToggle label="Sound Effects" icon="🔊" value={preferences.soundEffects} onChange={(v) => onUpdate({ soundEffects: v })} />
    </div>
);

const LinkedAccountCard: React.FC<{ account: LinkedAccount; onConnect: () => void; onDisconnect: () => void; }> = ({ account, onConnect, onDisconnect }) => {
  const info: any = { google: { name: 'Google', icon: '🔵', color: '#4285F4' }, apple: { name: 'Apple', icon: '⚫', color: '#000000' } }[account.provider] || { name: account.name || account.provider, icon: '🔗', color: '#555' };
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{info.icon}</span>
        <div>
          <div className="font-bold text-sm text-gray-900">{info.name}</div>
          {account.connected && <div className="text-xs text-green-600">Connected</div>}
        </div>
      </div>
      <button onClick={account.connected ? onDisconnect : onConnect} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${account.connected ? 'border-gray-200 text-gray-500 hover:bg-gray-50' : `border-transparent text-white`}`} style={!account.connected ? { backgroundColor: info.color } : {}}>
        {account.connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
};

export const SettingsHub: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [section, setSection] = useState<'MAIN' | 'PREFS' | 'ACCOUNTS' | 'SUBSCRIPTION'>('MAIN');
  const [prefs, setPrefs] = useState(MOCK_PREFERENCES);
  const [accounts, setAccounts] = useState(MOCK_LINKED_ACCOUNTS);

  if (section === 'SUBSCRIPTION') {
      return <SubscriptionView onBack={() => setSection('MAIN')} />;
  }

  return (
    <div className="bg-[#F5F5F7] min-h-screen pb-20 animate-in slide-in-from-right duration-300">
      <ScreenHeader 
        title={section === 'MAIN' ? 'Settings' : section === 'PREFS' ? 'Preferences' : 'Accounts'} 
        leftAction={<button onClick={section === 'MAIN' ? onBack : () => setSection('MAIN')} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></button>}
      />

      <div className="px-4 py-4 space-y-6">
        {section === 'MAIN' && (
          <>
            <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Account</div>
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                    <SettingsMenuItem icon="🔗" label="Linked Accounts" description="Google, Wearables" onPress={() => setSection('ACCOUNTS')} />
                    <SettingsMenuItem icon="⭐" label="Subscription" badge="Premium" onPress={() => setSection('SUBSCRIPTION')} />
                </div>
            </div>
            <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">App</div>
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                    <SettingsMenuItem icon="⚙️" label="Preferences" description="Theme, units, haptics" onPress={() => setSection('PREFS')} />
                    <SettingsMenuItem icon="🔒" label="Privacy" onPress={() => {}} />
                </div>
            </div>
            <button className="w-full p-4 bg-white text-red-500 font-bold rounded-2xl border border-red-100 hover:bg-red-50 transition-colors">Sign Out</button>
          </>
        )}

        {section === 'PREFS' && (
            <AppPreferencesEditor preferences={prefs} onUpdate={(u) => setPrefs({...prefs, ...u})} />
        )}

        {section === 'ACCOUNTS' && (
            <div className="space-y-3">
                {accounts.map(acc => (
                    <LinkedAccountCard key={acc.provider} account={acc} onConnect={() => {}} onDisconnect={() => {}} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
