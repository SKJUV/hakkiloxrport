import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Palette,
  Type,
  Route as RouteIcon,
  ShoppingBag,
  GraduationCap,
  Radar,
  ExternalLink,
  RotateCcw,
  LogOut,
  Check,
  Loader2,
  Construction,
} from 'lucide-react';
import { useContentContext } from '../context/ContentContext';
import { PasswordGate, isAdminUnlocked } from './PasswordGate';
import { ThemeEditor } from './sections/ThemeEditor';
import { IdentityEditor } from './sections/IdentityEditor';

type SectionId = 'dashboard' | 'theme' | 'identity' | 'journey' | 'shop' | 'courses' | 'contact';

const NAV: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }>; phase4?: boolean }[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'theme', label: 'Thème & couleurs', icon: Palette },
  { id: 'identity', label: 'Identité & textes', icon: Type },
  { id: 'journey', label: 'Parcours & étapes', icon: RouteIcon, phase4: true },
  { id: 'shop', label: 'Boutique', icon: ShoppingBag, phase4: true },
  { id: 'courses', label: 'Formations', icon: GraduationCap, phase4: true },
  { id: 'contact', label: 'Contact B2B', icon: Radar, phase4: true },
];

const Placeholder: React.FC<{ label: string }> = ({ label }) => (
  <div
    className="rounded-2xl border p-10 text-center backdrop-blur-md"
    style={{ background: 'var(--ar-surface)', borderColor: 'var(--ar-border)' }}
  >
    <Construction className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--ar-tertiary)' }} />
    <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'Space Grotesk' }}>
      {label}
    </h2>
    <p className="text-sm" style={{ color: 'var(--ar-text-muted)' }}>
      Édition complète (CRUD) disponible en Phase 4. La structure de données est déjà en place.
    </p>
  </div>
);

const Dashboard: React.FC = () => {
  const { content } = useContentContext();
  const stats = [
    { label: 'Étapes du parcours', value: content.journey.length, color: 'var(--ar-accent)' },
    { label: 'Produits', value: content.products.length, color: 'var(--ar-secondary)' },
    { label: 'Formations', value: content.courses.length, color: 'var(--ar-tertiary)' },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>
          Bonjour 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--ar-text-muted)' }}>
          Gérez tout le contenu de la plateforme {content.meta.brandName} depuis cet espace.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border p-5 backdrop-blur-md"
            style={{ background: 'var(--ar-surface)', borderColor: 'var(--ar-border)' }}
          >
            <div className="text-3xl font-bold" style={{ color: s.color, fontFamily: 'Space Grotesk' }}>
              {s.value}
            </div>
            <div className="text-sm mt-1" style={{ color: 'var(--ar-text-muted)' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div
        className="rounded-2xl border p-5 backdrop-blur-md"
        style={{ background: 'var(--ar-surface)', borderColor: 'var(--ar-border)' }}
      >
        <p className="text-sm" style={{ color: 'var(--ar-text-muted)' }}>
          Astuce : modifiez le <strong style={{ color: 'var(--ar-text)' }}>Thème</strong> ou l’
          <strong style={{ color: 'var(--ar-text)' }}>Identité</strong> et ouvrez le site pour voir le résultat appliqué en direct.
        </p>
      </div>
    </div>
  );
};

export const AdminApp: React.FC = () => {
  const { content, saving, reset } = useContentContext();
  const [unlocked, setUnlocked] = useState(isAdminUnlocked());
  const [section, setSection] = useState<SectionId>('dashboard');

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const logout = () => {
    try {
      sessionStorage.removeItem('ar_admin_auth');
    } catch {
      /* ignore */
    }
    setUnlocked(false);
  };

  const renderSection = () => {
    switch (section) {
      case 'dashboard':
        return <Dashboard />;
      case 'theme':
        return <ThemeEditor />;
      case 'identity':
        return <IdentityEditor />;
      case 'journey':
        return <Placeholder label="Parcours & étapes" />;
      case 'shop':
        return <Placeholder label="Boutique" />;
      case 'courses':
        return <Placeholder label="Formations" />;
      case 'contact':
        return <Placeholder label="Contact B2B" />;
    }
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: 'var(--ar-bg)', color: 'var(--ar-text)' }}>
      {/* Barre latérale */}
      <aside
        className="w-64 flex-shrink-0 border-r flex flex-col p-4 sticky top-0 h-screen"
        style={{ borderColor: 'var(--ar-border)', background: 'rgba(0,0,0,0.18)' }}
      >
        <div className="flex items-center gap-2 px-2 mb-6">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
            style={{ background: 'var(--ar-accent)', color: 'var(--ar-bg)', fontFamily: 'Space Grotesk' }}
          >
            {content.meta.brandName.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold leading-tight" style={{ fontFamily: 'Space Grotesk' }}>
              {content.meta.brandName}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--ar-text-muted)' }}>
              Back-office
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors text-left"
                style={{
                  background: active ? 'var(--ar-accent)' : 'transparent',
                  color: active ? 'var(--ar-bg)' : 'var(--ar-text-muted)',
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {item.phase4 && !active && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'var(--ar-border)' }}>
                    P4
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 pt-3 border-t" style={{ borderColor: 'var(--ar-border)' }}>
          <Link
            to="/"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors"
            style={{ color: 'var(--ar-text-muted)' }}
          >
            <ExternalLink className="w-4 h-4" /> Voir le site
          </Link>
          <button
            onClick={() => {
              if (confirm('Réinitialiser tout le contenu aux valeurs par défaut ?')) reset();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors"
            style={{ color: 'var(--ar-text-muted)' }}
          >
            <RotateCcw className="w-4 h-4" /> Réinitialiser
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors"
            style={{ color: 'var(--ar-danger)' }}
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu */}
      <main className="flex-1 min-w-0">
        <header
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-3.5 border-b backdrop-blur-xl"
          style={{ borderColor: 'var(--ar-border)', background: 'rgba(0,0,0,0.25)' }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--ar-text-muted)' }}>
            {NAV.find((n) => n.id === section)?.label}
          </span>
          <span
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
            style={{ background: 'var(--ar-surface)', color: saving ? 'var(--ar-tertiary)' : 'var(--ar-success)' }}
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {saving ? 'Enregistrement…' : 'Enregistré'}
          </span>
        </header>
        <div className="p-6 max-w-4xl mx-auto">{renderSection()}</div>
      </main>
    </div>
  );
};
