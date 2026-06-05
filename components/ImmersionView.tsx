import React, { useEffect } from 'react';
import { X, ArrowRight, Check, Plus, Eye, Play, ShieldCheck, CircleDot, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Icon } from './iconRegistry';

export type ImmersionTarget = { type: 'section' | 'product' | 'course'; id: string } | null;

const withAlpha = (color: string, a: number): string => {
  const m = /^#([0-9a-f]{6})$/i.exec(color);
  if (!m) return color;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

interface Props {
  target: ImmersionTarget;
  onClose: () => void;
  onTeleport: (progress: number) => void;
  onToggleCart: (id: string) => void;
  isInCart: (id: string) => boolean;
  onPreview: (id: string) => void;
  currency: string;
}

export const ImmersionView: React.FC<Props> = ({
  target,
  onClose,
  onTeleport,
  onToggleCart,
  isInCart,
  onPreview,
  currency,
}) => {
  const content = useContent();
  const { theme } = content;
  const colors = theme.colors;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!target) return null;

  const blur = Math.round(theme.glass * 26);
  const panelStyle: React.CSSProperties = {
    background: 'rgba(14,18,26,0.86)',
    border: `1px solid ${colors.border}`,
    borderRadius: theme.radius,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
  };

  let accent = colors.accent;
  let body: React.ReactNode = null;

  if (target.type === 'section') {
    const step = content.journey.find((s) => s.id === target.id);
    if (step) {
      accent = step.accent;
      const related =
        step.key === 'shop' ? content.products : step.key === 'learn' ? content.courses : [];
      body = (
        <>
          <Header accent={accent} colors={colors} eyebrow={`${content.meta.brandName} · Acte ${step.short}`} icon={step.icon} title={step.detail.title} />
          <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>{step.detail.body}</p>
          <ul className="mt-5 space-y-2">
            {step.detail.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CircleDot className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          {related.length > 0 && (
            <div className="mt-6">
              <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>À découvrir dans cette zone</div>
              <div className="flex flex-wrap gap-2">
                {related.map((r: any) => (
                  <span key={r.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: withAlpha(accent, 0.12), border: `1px solid ${withAlpha(accent, 0.3)}` }}>
                    <Icon name={r.icon || 'BookOpen'} className="w-3.5 h-3.5" style={{ color: accent }} />
                    {r.name || r.title}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-7 flex gap-3">
            <button onClick={() => { onTeleport(step.center); onClose(); }} className="px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, color: colors.background }}>
              {step.detail.ctaLabel || 'Y aller'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      );
    }
  } else if (target.type === 'product') {
    const p = content.products.find((x) => x.id === target.id);
    if (p) {
      accent = colors.secondary;
      const inCart = isInCart(p.id);
      body = (
        <>
          <Header accent={accent} colors={colors} eyebrow={`Boutique · ${p.badge}`} icon={p.icon} title={p.name} />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="relative flex items-center justify-center h-44 rounded-2xl mb-4 overflow-hidden" style={{ background: `radial-gradient(circle at 50% 40%, ${withAlpha(accent, 0.2)}, rgba(0,0,0,0.2))`, border: `1px solid ${colors.border}` }}>
                <div className="ar-float ar-orbit" style={{ transformStyle: 'preserve-3d' }}>
                  <Icon name={p.icon} className="w-20 h-20" style={{ color: colors.text }} />
                </div>
                <span className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-sm font-bold" style={{ background: 'rgba(12,15,22,0.85)', border: `1px solid ${withAlpha(accent, 0.5)}`, color: accent }}>{p.price} {p.currency || currency}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>{p.longDescription}</p>
            </div>
            <div>
              <SubTitle title="Spécifications" colors={colors} />
              <div className="space-y-2 mb-5">
                {p.specs.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}` }}>
                    <span className="flex items-center gap-2" style={{ color: colors.textMuted }}><Icon name={s.icon} className="w-4 h-4" style={{ color: accent }} />{s.label}</span>
                    <span className="font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
              <SubTitle title="Points forts" colors={colors} />
              <ul className="space-y-1.5 mb-5">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />{f}</li>
                ))}
              </ul>
              <div className="text-xs" style={{ color: colors.textMuted }}>Compatibilité : <span style={{ color: accent }}>{p.compat.join(' · ')}</span></div>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => onToggleCart(p.id)} className="px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: inCart ? withAlpha(accent, 0.2) : `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, border: inCart ? `1px solid ${accent}` : 'none', color: inCart ? accent : colors.background }}>
              {inCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {inCart ? 'Dans le panier' : 'Ajouter au panier'}
            </button>
            <button onClick={() => onPreview(p.id)} className="px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.5)}`, color: accent }}>
              <Eye className="w-4 h-4" /> Aperçu AR
            </button>
          </div>
        </>
      );
    }
  } else if (target.type === 'course') {
    const c = content.courses.find((x) => x.id === target.id);
    if (c) {
      accent = c.accent;
      body = (
        <>
          <Header accent={accent} colors={colors} eyebrow={`Formation · ${c.level}`} icon="GraduationCap" title={c.title} />
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden flex items-center justify-center mb-4" style={{ background: `radial-gradient(circle at 50% 40%, ${withAlpha(accent, 0.2)}, #0a0d14)`, border: `1px solid ${colors.border}` }}>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:26px_26px]" />
                <button className="relative w-16 h-16 rounded-full flex items-center justify-center border-2 ar-target-pulse" style={{ borderColor: accent }}><Play className="w-7 h-7" style={{ color: accent }} /></button>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>{c.longDescription}</p>
              <div className="flex gap-2 mt-3 text-[10px]">
                {[c.duration, `${c.modulesCount} modules`, c.certifying ? 'Certifiant' : 'Libre'].map((t, i) => (
                  <span key={i} className="px-2 py-1 rounded" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, color: colors.textMuted }}>{t}</span>
                ))}
              </div>
            </div>
            <div>
              <SubTitle title="Ce que vous saurez faire" colors={colors} />
              <ul className="space-y-1.5 mb-5">
                {c.outcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />{o}</li>
                ))}
              </ul>
              <SubTitle title="Programme" colors={colors} />
              <div className="space-y-2">
                {c.modules.map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-sm rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}` }}>
                    <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: withAlpha(accent, 0.2), color: accent }}>{i + 1}</span>{m.title}</span>
                    <span style={{ color: colors.textMuted }}>{m.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-7 flex items-center gap-3">
            <button onClick={onClose} className="px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, color: colors.background }}>
              <ShieldCheck className="w-4 h-4" /> S’inscrire {c.price ? `· ${c.price} ${currency}` : ''}
            </button>
          </div>
        </>
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/55 ar-fade-in" style={{ backdropFilter: 'blur(3px)' }} onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto scrollbar-none p-6 md:p-8 ar-immersion-in" style={panelStyle}>
        <button onClick={onClose} aria-label="Fermer" className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.06)', color: colors.text }}>
          <X className="w-5 h-5" />
        </button>
        {body}
      </div>
    </div>
  );
};

const Header: React.FC<{ accent: string; colors: any; eyebrow: string; icon: string; title: string }> = ({ accent, colors, eyebrow, icon, title }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: accent }}>{eyebrow}</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: withAlpha(accent, 0.16), border: `1px solid ${withAlpha(accent, 0.4)}` }}>
        <Icon name={icon} className="w-6 h-6" style={{ color: accent }} />
      </div>
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>{title}</h1>
    </div>
  </div>
);

const SubTitle: React.FC<{ title: string; colors: any }> = ({ title, colors }) => (
  <div className="text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: colors.textMuted }}>{title}</div>
);
