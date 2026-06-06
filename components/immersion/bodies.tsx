import React, { useEffect, useRef, useState } from 'react';
import {
  Star, Plus, Check, Eye, ChevronLeft, ChevronRight, Play, Pause, ShieldCheck,
  User, ArrowRight, CircleDot, Sparkles, Calendar, Building2, Send, Phone, MapPin,
  RotateCw, GitCompare, Clock, Compass, MousePointer2, Navigation,
} from 'lucide-react';
import { Icon } from '../iconRegistry';
import type { Product, Course, ContactInfo, JourneyStep, ThemeColors } from '../../content/schema';

const withAlpha = (color: string, a: number): string => {
  const m = /^#([0-9a-f]{6})$/i.exec(color);
  if (!m) return color;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const Eyebrow: React.FC<{ accent: string; children: React.ReactNode }> = ({ accent, children }) => (
  <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: accent }}>{children}</span>
);

const SubTitle: React.FC<{ colors: ThemeColors; children: React.ReactNode }> = ({ colors, children }) => (
  <div className="text-[10px] uppercase tracking-widest mb-2 font-semibold" style={{ color: colors.textMuted }}>{children}</div>
);

const Stars: React.FC<{ rating: number; accent: string }> = ({ rating, accent }) => (
  <span className="inline-flex items-center gap-0.5">
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} className="w-3.5 h-3.5" style={{ color: accent, fill: i < Math.round(rating) ? accent : 'transparent' }} />
    ))}
  </span>
);

/* ============================ PRODUIT — showroom 360 + comparateur ============================ */
export const ProductImmersion: React.FC<{
  product: Product;
  allProducts: Product[];
  currency: string;
  colors: ThemeColors;
  accent: string;
  isInCart: boolean;
  onToggleCart: () => void;
  onPreview: () => void;
}> = ({ product, allProducts, currency, colors, accent, isInCart, onToggleCart, onPreview }) => {
  const [angle, setAngle] = useState(0);
  const [auto, setAuto] = useState(true);
  const [variant, setVariant] = useState(0);
  const [compareId, setCompareId] = useState<string>('');
  const compare = allProducts.find((p) => p.id === compareId);
  const variants = product.variants || [];
  const variantColor = variants[variant]?.color || accent;

  useEffect(() => {
    if (!auto) return;
    let raf = 0;
    const loop = () => { setAngle((a) => (a + 0.4) % 360); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [auto]);

  return (
    <>
      <div className="mb-5"><Eyebrow accent={accent}>Boutique · {product.badge}</Eyebrow>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: 'Space Grotesk' }}>{product.name}</h1>
        <p className="text-xs mt-1" style={{ color: colors.textMuted }}>{product.tagline}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* viewer 360 */}
        <div>
          <div className="relative h-56 rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: `radial-gradient(circle at 50% 45%, ${withAlpha(variantColor, 0.28)}, rgba(0,0,0,0.25))`, border: `1px solid ${colors.border}` }}>
            <span className="absolute w-40 h-40 rounded-full border border-dashed" style={{ borderColor: withAlpha(accent, 0.3), transform: `rotate(${angle}deg)` }} />
            <div style={{ transform: `rotateY(${angle}deg)`, transformStyle: 'preserve-3d', transition: auto ? 'none' : 'transform 0.3s ease' }}>
              <Icon name={product.icon} className="w-24 h-24" style={{ color: colors.text, filter: `drop-shadow(0 0 18px ${withAlpha(variantColor, 0.6)})` }} />
            </div>
            {/* tags flottants de specs */}
            {product.specs.map((s, i) => {
              const pos = [{ top: '12%', left: '6%' }, { top: '12%', right: '6%' }, { bottom: '12%', left: '6%' }][i] || { bottom: '12%', right: '6%' };
              return (
                <div key={i} className="absolute flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] ar-float" style={{ ...pos, background: 'rgba(12,15,22,0.85)', border: `1px solid ${withAlpha(accent, 0.4)}`, color: colors.text }}>
                  <Icon name={s.icon} className="w-3 h-3" style={{ color: accent }} /> {s.value}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1.5">
              <button onClick={() => { setAuto(false); setAngle((a) => a - 45); }} className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ borderColor: colors.border, color: colors.text }}><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setAuto((v) => !v)} className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ borderColor: colors.border, color: auto ? accent : colors.text }} title="Rotation auto"><RotateCw className="w-4 h-4" /></button>
              <button onClick={() => { setAuto(false); setAngle((a) => a + 45); }} className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ borderColor: colors.border, color: colors.text }}><ChevronRight className="w-4 h-4" /></button>
            </div>
            <span className="px-3 py-1.5 rounded-lg text-sm font-bold" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.5)}`, color: accent }}>{product.price} {product.currency || currency}</span>
          </div>

          {variants.length > 0 && (
            <div className="mt-4">
              <SubTitle colors={colors}>Finition · {variants[variant]?.name}</SubTitle>
              <div className="flex gap-2">
                {variants.map((v, i) => (
                  <button key={i} onClick={() => setVariant(i)} title={v.name} className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110" style={{ background: v.color, borderColor: variant === i ? accent : 'transparent', boxShadow: variant === i ? `0 0 12px ${withAlpha(accent, 0.6)}` : 'none' }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* infos */}
        <div>
          {typeof product.rating === 'number' && (
            <div className="flex items-center gap-2 mb-3 text-xs"><Stars rating={product.rating} accent={accent} /><span className="font-bold">{product.rating.toFixed(1)}</span><span style={{ color: colors.textMuted }}>· {product.reviews ?? 0} avis</span></div>
          )}
          <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>{product.longDescription}</p>

          <div className="mt-4"><SubTitle colors={colors}>Points forts</SubTitle>
            <ul className="space-y-1.5">{product.features.map((f, i) => (<li key={i} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />{f}</li>))}</ul>
          </div>
          <div className="mt-4 text-xs" style={{ color: colors.textMuted }}>Compatibilité : <span style={{ color: accent }}>{product.compat.join(' · ')}</span></div>

          {/* comparateur */}
          <div className="mt-5">
            <SubTitle colors={colors}><span className="inline-flex items-center gap-1"><GitCompare className="w-3.5 h-3.5" /> Comparer</span></SubTitle>
            <select value={compareId} onChange={(e) => setCompareId(e.target.value)} className="w-full text-xs rounded-lg px-3 py-2 outline-none" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${colors.border}`, color: colors.text }}>
              <option value="">Choisir un produit à comparer…</option>
              {allProducts.filter((p) => p.id !== product.id).map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
            {compare && (
              <div className="mt-3 grid grid-cols-3 gap-1 text-[10px] rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}` }}>
                <span className="font-bold" style={{ color: colors.textMuted }}>Critère</span>
                <span className="font-bold text-center" style={{ color: accent }}>{product.name}</span>
                <span className="font-bold text-center" style={{ color: colors.textMuted }}>{compare.name}</span>
                <span style={{ color: colors.textMuted }}>Prix</span><span className="text-center font-bold">{product.price} {currency}</span><span className="text-center">{compare.price} {currency}</span>
                {product.specs.map((s, i) => (
                  <React.Fragment key={i}>
                    <span style={{ color: colors.textMuted }}>{s.label}</span>
                    <span className="text-center font-bold">{s.value}</span>
                    <span className="text-center">{compare.specs[i]?.value || '—'}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <button onClick={onToggleCart} className="px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: isInCart ? withAlpha(accent, 0.2) : `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, border: isInCart ? `1px solid ${accent}` : 'none', color: isInCart ? accent : colors.background }}>
          {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {isInCart ? 'Dans le panier' : 'Ajouter au panier'}
        </button>
        <button onClick={onPreview} className="px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: withAlpha(accent, 0.14), border: `1px solid ${withAlpha(accent, 0.5)}`, color: accent }}>
          <Eye className="w-4 h-4" /> Aperçu AR sur le décor
        </button>
      </div>
    </>
  );
};

/* ============================ COURS — salle de classe + curriculum ============================ */
export const CourseImmersion: React.FC<{
  course: Course;
  currency: string;
  colors: ThemeColors;
  accent: string;
}> = ({ course, currency, colors, accent }) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) { if (timerRef.current) window.clearInterval(timerRef.current); return; }
    timerRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { setPlaying(false); setDone((d) => new Set(d).add(current)); return 100; }
        return p + 2;
      });
    }, 120);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [playing, current]);

  const selectModule = (i: number) => { setCurrent(i); setProgress(0); setPlaying(false); };
  const completion = Math.round((done.size / Math.max(1, course.modules.length)) * 100);

  return (
    <>
      <div className="mb-5"><Eyebrow accent={accent}>Formation · {course.level}</Eyebrow>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: 'Space Grotesk' }}>{course.title}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {/* lecteur */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: `radial-gradient(circle at 50% 40%, ${withAlpha(accent, 0.22)}, #0a0d14)`, border: `1px solid ${colors.border}` }}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:26px_26px]" />
            <button onClick={() => setPlaying((v) => !v)} className="relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-transform hover:scale-105" style={{ borderColor: accent }}>
              {playing ? <Pause className="w-7 h-7" style={{ color: accent }} /> : <Play className="w-7 h-7" style={{ color: accent }} />}
            </button>
            <span className="absolute bottom-2 left-3 text-[10px]" style={{ color: colors.textMuted }}>Module {current + 1} · {course.modules[current]?.title}</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: colors.border }}>
            <div style={{ width: `${progress}%`, background: accent, height: '100%', transition: 'width 0.1s linear' }} />
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            {typeof course.rating === 'number' && (
              <div className="rounded-lg py-2" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}` }}>
                <div className="text-sm font-bold" style={{ color: accent }}>{course.rating.toFixed(1)}</div><div className="text-[9px]" style={{ color: colors.textMuted }}>note</div>
              </div>
            )}
            {typeof course.students === 'number' && (
              <div className="rounded-lg py-2" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}` }}>
                <div className="text-sm font-bold">{course.students.toLocaleString('fr-FR')}</div><div className="text-[9px]" style={{ color: colors.textMuted }}>inscrits</div>
              </div>
            )}
            <div className="rounded-lg py-2" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}` }}>
              <div className="text-sm font-bold">{course.duration}</div><div className="text-[9px]" style={{ color: colors.textMuted }}>durée</div>
            </div>
          </div>

          {course.instructor && (
            <div className="flex items-center gap-3 mt-4 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: withAlpha(accent, 0.2) }}><User className="w-5 h-5" style={{ color: accent }} /></div>
              <div><div className="text-sm font-bold">{course.instructor.name}</div><div className="text-[10px]" style={{ color: colors.textMuted }}>{course.instructor.role}</div></div>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>{course.longDescription}</p>

          <div className="mt-4"><SubTitle colors={colors}>Objectifs</SubTitle>
            <ul className="space-y-1.5">{course.outcomes.map((o, i) => (<li key={i} className="flex items-start gap-2 text-sm"><Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />{o}</li>))}</ul>
          </div>

          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="mt-4"><SubTitle colors={colors}>Prérequis</SubTitle>
              <div className="flex flex-wrap gap-1.5">{course.prerequisites.map((p, i) => (<span key={i} className="px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, color: colors.textMuted }}>{p}</span>))}</div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <SubTitle colors={colors}>Programme</SubTitle>
            <span className="text-[10px]" style={{ color: accent }}>{completion}% terminé</span>
          </div>
          <div className="space-y-1.5">
            {course.modules.map((m, i) => {
              const isDone = done.has(i);
              const active = current === i;
              return (
                <button key={i} onClick={() => selectModule(i)} className="w-full flex items-center justify-between text-sm rounded-lg px-3 py-2 transition-colors" style={{ background: active ? withAlpha(accent, 0.14) : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? withAlpha(accent, 0.5) : colors.border}` }}>
                  <span className="flex items-center gap-2 text-left">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: isDone ? accent : withAlpha(accent, 0.2), color: isDone ? colors.background : accent }}>{isDone ? <Check className="w-3 h-3" /> : i + 1}</span>
                    {m.title}
                  </span>
                  <span className="text-[10px] flex items-center gap-1 flex-shrink-0" style={{ color: colors.textMuted }}><Clock className="w-3 h-3" />{m.duration}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center gap-3 flex-wrap">
        <button className="px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, color: colors.background }}>
          <ShieldCheck className="w-4 h-4" /> S’inscrire {course.price ? `· ${course.price} ${currency}` : ''}
        </button>
        {course.certifying && <span className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full" style={{ background: withAlpha(accent, 0.12), border: `1px solid ${withAlpha(accent, 0.4)}`, color: accent }}><ShieldCheck className="w-3.5 h-3.5" /> Formation certifiante</span>}
      </div>
    </>
  );
};

/* ============================ CONTACT — flux multi-étapes + calendrier ============================ */
export const ContactImmersion: React.FC<{
  contact: ContactInfo;
  colors: ThemeColors;
  accent: string;
}> = ({ contact, colors, accent }) => {
  const [step, setStep] = useState(0);
  const [need, setNeed] = useState('');
  const [form, setForm] = useState({ company: '', email: '', phone: '' });
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const needs = contact.needs || ['Démonstration', 'Devis', 'Formation', 'Partenariat'];
  const slots = contact.slots || ['09:00', '11:00', '14:00', '16:00'];

  const days: Date[] = [];
  let cur = new Date();
  while (days.length < 8) { cur = new Date(cur.getTime() + 86400000); const wd = cur.getDay(); if (wd !== 0 && wd !== 6) days.push(new Date(cur)); }

  const steps = ['Besoin', 'Coordonnées', 'Créneau', 'Confirmation'];
  const canNext = step === 0 ? !!need : step === 1 ? !!form.company.trim() && /.+@.+/.test(form.email) : step === 2 ? !!date && !!slot : true;

  return (
    <>
      <div className="mb-5"><Eyebrow accent={accent}>Contact B2B</Eyebrow>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: 'Space Grotesk' }}>{contact.headline}</h1>
      </div>

      {/* progression */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: i <= step ? accent : 'rgba(255,255,255,0.06)', color: i <= step ? colors.background : colors.textMuted }}>{i < step ? <Check className="w-3 h-3" /> : i + 1}</span>
              <span className="text-[10px] hidden sm:inline" style={{ color: i === step ? accent : colors.textMuted }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px" style={{ background: i < step ? accent : colors.border }} />}
          </React.Fragment>
        ))}
      </div>

      <div className="min-h-[220px]">
        {step === 0 && (
          <div>
            <SubTitle colors={colors}>Quel est votre besoin ?</SubTitle>
            <div className="grid grid-cols-2 gap-3">
              {needs.map((n) => (
                <button key={n} onClick={() => setNeed(n)} className="px-4 py-4 rounded-xl text-sm font-semibold text-left transition-colors" style={{ background: need === n ? withAlpha(accent, 0.16) : 'rgba(255,255,255,0.04)', border: `1px solid ${need === n ? accent : colors.border}`, color: need === n ? accent : colors.text }}>
                  <CircleDot className="w-4 h-4 mb-2" style={{ color: accent }} />{n}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <label className="flex flex-col gap-1 text-[10px]" style={{ color: colors.textMuted }}>
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" style={{ color: accent }} /> Entreprise</span>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Votre société" className="rounded-lg px-3 py-2.5 text-sm outline-none" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${colors.border}`, color: colors.text }} />
            </label>
            <label className="flex flex-col gap-1 text-[10px]" style={{ color: colors.textMuted }}>
              <span className="flex items-center gap-1"><Send className="w-3 h-3" style={{ color: accent }} /> Email professionnel</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="vous@entreprise.com" className="rounded-lg px-3 py-2.5 text-sm outline-none" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${colors.border}`, color: colors.text }} />
            </label>
            <label className="flex flex-col gap-1 text-[10px]" style={{ color: colors.textMuted }}>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" style={{ color: accent }} /> Téléphone (optionnel)</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+33…" className="rounded-lg px-3 py-2.5 text-sm outline-none" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${colors.border}`, color: colors.text }} />
            </label>
          </div>
        )}
        {step === 2 && (
          <div>
            <SubTitle colors={colors}><span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Choisissez une date</span></SubTitle>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {days.map((d, i) => {
                const key = d.toISOString().slice(0, 10);
                const label = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
                return (
                  <button key={i} onClick={() => setDate(key)} className="px-2 py-2 rounded-lg text-[10px] font-semibold capitalize transition-colors" style={{ background: date === key ? withAlpha(accent, 0.18) : 'rgba(255,255,255,0.04)', border: `1px solid ${date === key ? accent : colors.border}`, color: date === key ? accent : colors.text }}>{label}</button>
                );
              })}
            </div>
            <SubTitle colors={colors}>Créneau horaire</SubTitle>
            <div className="flex flex-wrap gap-2">
              {slots.map((sl) => (
                <button key={sl} onClick={() => setSlot(sl)} className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors" style={{ background: slot === sl ? withAlpha(accent, 0.18) : 'rgba(255,255,255,0.04)', border: `1px solid ${slot === sl ? accent : colors.border}`, color: slot === sl ? accent : colors.text }}>{sl}</button>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col items-center text-center gap-3 py-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: withAlpha(colors.success, 0.16) }}><ShieldCheck className="w-9 h-9" style={{ color: colors.success }} /></div>
            <h2 className="text-xl font-extrabold">Demande prête à être envoyée</h2>
            <div className="text-sm space-y-1" style={{ color: colors.textMuted }}>
              <p><b style={{ color: colors.text }}>{form.company || '—'}</b> · {need}</p>
              <p>{date ? new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : '—'} à {slot || '—'}</p>
              <p className="flex items-center justify-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {contact.bookingNote} · {contact.responseTime}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 disabled:opacity-30 border" style={{ borderColor: colors.border, color: colors.text }}>
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>
        {step < 3 ? (
          <button onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext} className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 disabled:opacity-40 transition-transform hover:scale-105 active:scale-95" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, color: colors.background }}>
            Continuer <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95" style={{ background: colors.success, color: colors.background }}>
            <Send className="w-4 h-4" /> Envoyer la demande
          </button>
        )}
      </div>
    </>
  );
};

/* ============================ SECTION — manifeste / aperçu de zone ============================ */
export const SectionImmersion: React.FC<{
  step: JourneyStep;
  related: { id: string; name?: string; title?: string; icon?: string }[];
  colors: ThemeColors;
  accent: string;
  brandName: string;
  onTeleport: (p: number) => void;
  onClose: () => void;
}> = ({ step, related, colors, accent, brandName, onTeleport, onClose }) => {
  if (step.key === 'start') {
    const tips = [
      { icon: MousePointer2, title: 'Avancez au scroll', text: 'La molette fait rouler la balade. Tout est réversible, prenez votre temps.' },
      { icon: Compass, title: 'Regard libre', text: 'Bougez la souris pour pivoter le regard de ±30° autour de la zone active.' },
      { icon: Navigation, title: 'Téléportation', text: 'Le compas à droite vous emmène instantanément vers n’importe quelle étape.' },
    ];
    return (
      <>
        <div className="mb-5"><Eyebrow accent={accent}>{brandName} · Bienvenue</Eyebrow>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1" style={{ fontFamily: 'Space Grotesk' }}>{step.detail.title}</h1>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>{step.detail.body}</p>
        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          {tips.map((t, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}` }}>
              <t.icon className="w-6 h-6 mb-2" style={{ color: accent }} />
              <div className="text-sm font-bold mb-1">{t.title}</div>
              <p className="text-[11px]" style={{ color: colors.textMuted }}>{t.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6"><button onClick={() => { onTeleport(0.33); onClose(); }} className="px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, color: colors.background }}>{step.detail.ctaLabel || 'Commencer'} <ArrowRight className="w-4 h-4" /></button></div>
      </>
    );
  }

  return (
    <>
      <div className="mb-5 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: withAlpha(accent, 0.16), border: `1px solid ${withAlpha(accent, 0.4)}` }}><Icon name={step.icon} className="w-6 h-6" style={{ color: accent }} /></div>
        <div><Eyebrow accent={accent}>Acte {step.short} · {step.zone}</Eyebrow>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>{step.detail.title}</h1>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>{step.detail.body}</p>
      <ul className="mt-5 space-y-2">{step.detail.bullets.map((b, i) => (<li key={i} className="flex items-start gap-2 text-sm"><CircleDot className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent }} />{b}</li>))}</ul>
      {related.length > 0 && (
        <div className="mt-6"><SubTitle colors={colors}>À découvrir dans cette zone</SubTitle>
          <div className="flex flex-wrap gap-2">{related.map((r) => (<span key={r.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: withAlpha(accent, 0.12), border: `1px solid ${withAlpha(accent, 0.3)}` }}><Icon name={r.icon || 'BookOpen'} className="w-3.5 h-3.5" style={{ color: accent }} />{r.name || r.title}</span>))}</div>
        </div>
      )}
      <div className="mt-7"><button onClick={() => { onTeleport(step.center); onClose(); }} className="px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 active:scale-95" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, color: colors.background }}>{step.detail.ctaLabel || 'Y aller'} <ArrowRight className="w-4 h-4" /></button></div>
    </>
  );
};
