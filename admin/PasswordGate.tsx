import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const AUTH_KEY = 'ar_admin_auth';

export function isAdminUnlocked(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === '1';
  } catch {
    return false;
  }
}

export const PasswordGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const content = useContent();
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === content.admin.passphrase) {
      try {
        sessionStorage.setItem(AUTH_KEY, '1');
      } catch {
        /* ignore */
      }
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ background: 'var(--ar-bg)', color: 'var(--ar-text)' }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-sm p-8 rounded-3xl border backdrop-blur-xl"
        style={{ background: 'var(--ar-surface)', borderColor: 'var(--ar-border)' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'var(--ar-accent)', color: 'var(--ar-bg)' }}
        >
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
          Back-office {content.meta.brandName}
        </h1>
        <p className="text-sm mt-1 mb-6" style={{ color: 'var(--ar-text-muted)' }}>
          Saisissez le mot de passe pour gérer la plateforme.
        </p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Mot de passe"
          className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition-colors"
          style={{
            background: 'rgba(0,0,0,0.25)',
            borderColor: error ? 'var(--ar-danger)' : 'var(--ar-border)',
            color: 'var(--ar-text)',
          }}
        />
        {error && (
          <p className="text-xs mt-2" style={{ color: 'var(--ar-danger)' }}>
            Mot de passe incorrect.
          </p>
        )}
        <button
          type="submit"
          className="mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95"
          style={{ background: 'var(--ar-accent)', color: 'var(--ar-bg)' }}
        >
          Entrer <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[11px] mt-4 text-center" style={{ color: 'var(--ar-text-muted)' }}>
          Astuce démo : le mot de passe par défaut est « {content.admin.passphrase} ».
        </p>
      </form>
    </div>
  );
};
