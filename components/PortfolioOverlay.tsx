import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  ChevronDown,
  ShieldCheck,
  ShoppingCart,
  Eye,
  CreditCard,
  Package,
  Info,
  Search,
  X,
  Play,
  Plus,
  Check,
  Building2,
  Calendar,
  Send,
  MapPin,
  ScanLine,
  Unlock,
  Navigation,
  MousePointer2,
  ArrowRight,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useContent } from '../context/ContentContext';
import { Icon } from './iconRegistry';
import { ImmersionView, ImmersionTarget } from './ImmersionView';
import type { Course, Product } from '../content/schema';

/* ---------- sons doux ---------- */
const chirp = (frequency = 700, type: OscillatorType = 'sine', duration = 0.14) => {
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* ignore */
  }
};
const chirpSuccess = () => {
  chirp(520, 'sine', 0.14);
  setTimeout(() => chirp(700, 'sine', 0.16), 90);
  setTimeout(() => chirp(880, 'sine', 0.22), 180);
};

/* ---------- util couleur ---------- */
const withAlpha = (color: string, a: number): string => {
  const m = /^#([0-9a-f]{6})$/i.exec(color);
  if (!m) return color;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/* effets d'aperçu produit sur le décor (doux) */
const previewEffects: Record<string, (set: (k: string, v: number) => void) => void> = {
  vortex: (set) => { set('slider_zoom', 2.0); set('slider_atmosphereDensity', 0.45); },
  spectra: (set) => { set('slider_colorEffectStrength', 1.7); set('slider_zoom', 1.0); },
  neogrip: (set) => { set('slider_atmosphereDensity', 0.12); set('slider_brightness', 1.2); },
};

export const PortfolioOverlay: React.FC = () => {
  const {
    portfolioScroll,
    devMode,
    setDevMode,
    soundConfig,
    handleSoundConfigChange,
    handleUniformChange,
    handleUniformsCommit,
  } = useAppContext();

  const content = useContent();
  const { theme, journey, products, courses, contact, ui, meta } = content;
  const colors = theme.colors;

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cart, setCart] = useState<string[]>([]);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'purchasing' | 'success'>('cart');
  const [immersion, setImmersion] = useState<ImmersionTarget>(null);
  const [scannerUnlocked, setScannerUnlocked] = useState(false);
  const [contactForm, setContactForm] = useState({ company: '', email: '', slot: '' });
  const [contactSent, setContactSent] = useState(false);

  // panier initial : premier produit en stock
  useEffect(() => {
    if (products.length > 0 && cart.length === 0) setCart([products[0].id]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setMousePos({ x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const activeIdx = useMemo(() => {
    let idx = 0;
    let best = Infinity;
    journey.forEach((s, i) => {
      const d = Math.abs(portfolioScroll - s.center);
      if (d < best) { best = d; idx = i; }
    });
    return idx;
  }, [portfolioScroll, journey]);

  const activeAccent = journey[activeIdx]?.accent || colors.accent;

  if (devMode) return null;

  const teleportTo = (progress: number) => {
    chirp(820, 'sine', 0.16);
    const el = document.getElementById('ar-scroll-rail');
    if (!el) return;
    const total = el.scrollHeight - el.clientHeight;
    if (total > 0) el.scrollTo({ top: progress * total, behavior: 'smooth' });
  };

  /* immersion : plongée vers le contenu détaillé d'une zone/objet */
  const openImmersion = (t: ImmersionTarget) => {
    chirp(760, 'sine', 0.18);
    handleUniformChange('slider_zoom', 1.65); // léger zoom cinématique
    handleUniformsCommit?.();
    setImmersion(t);
  };
  const closeImmersion = () => {
    chirp(420, 'sine', 0.12);
    handleUniformChange('slider_zoom', 1.2);
    handleUniformsCommit?.();
    setImmersion(null);
  };

  const handleFreeFlight = () => {
    chirp(440, 'sine', 0.3);
    if (!soundConfig.enabled) {
      handleSoundConfigChange('enabled', true);
      handleSoundConfigChange('masterVolume', 0.5);
    }
    setDevMode(true);
  };

  /* boutique */
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return [p.name, p.tagline, p.description, p.badge].some((s) => s.toLowerCase().includes(q));
  });
  const toggleCart = (id: string) => {
    chirp(640, 'sine', 0.1);
    setCart((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const previewProduct = (id: string) => {
    chirp(900, 'sine', 0.2);
    previewEffects[id]?.(handleUniformChange);
    handleUniformsCommit?.();
  };
  const cartTotal = cart.reduce((acc, id) => acc + (products.find((p) => p.id === id)?.price || 0), 0);
  const currency = products[0]?.currency || '€';
  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('purchasing');
    chirp(360, 'sine', 0.35);
    setTimeout(() => { setCheckoutStep('success'); chirpSuccess(); }, 1500);
  };

  /* contact */
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.company.trim() || !contactForm.email.trim()) return;
    chirpSuccess();
    setContactSent(true);
  };

  /* style des panneaux (verre doux) */
  const blur = Math.round(theme.glass * 22);
  const panel = (accent: string): React.CSSProperties => ({
    background: 'rgba(16,20,29,0.62)',
    border: `1px solid ${colors.border}`,
    borderRadius: theme.radius,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    boxShadow: `0 14px 48px rgba(0,0,0,0.34), 0 0 ${Math.round(46 * theme.glowIntensity)}px ${withAlpha(accent, 0.16)}`,
  });

  const getCardStyle = (idx: number): React.CSSProperties => {
    const step = journey[idx];
    const d = portfolioScroll - step.center;
    const win = idx === 0 ? 0.17 : idx === journey.length - 1 ? 0.2 : 0.16;
    const opacity = Math.max(0, Math.min(1, 1 - Math.abs(d) / win));
    const tiltX = -mousePos.y * 5;
    const tiltY = mousePos.x * 6;
    return {
      transform: `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${-d * 120}px) scale(${0.94 + opacity * 0.06})`,
      transformStyle: 'preserve-3d',
      opacity,
      transition: 'transform 0.2s cubic-bezier(0.25,1,0.5,1), opacity 0.35s ease-out',
      pointerEvents: activeIdx === idx && opacity > 0.45 ? 'auto' : 'none',
    };
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden select-none" style={{ color: colors.text }}>
      {/* teinte douce de la zone active */}
      <div className="absolute inset-0 transition-all duration-700 ease-out" style={{ background: `radial-gradient(circle at 50% 62%, ${withAlpha(activeAccent, 0.1)} 0%, transparent 58%)` }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_46%,rgba(12,15,22,0.66)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      {/* ligne directrice douce au sol */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[44vh] w-full z-[5] pointer-events-none transition-opacity duration-700" style={{ opacity: 0.4 }}>
        <line x1="50" y1="0" x2="24" y2="100" stroke={activeAccent} strokeWidth="0.18" opacity="0.45" />
        <line x1="50" y1="0" x2="76" y2="100" stroke={activeAccent} strokeWidth="0.18" opacity="0.45" />
        <line x1="50" y1="3" x2="50" y2="100" stroke={activeAccent} strokeWidth="0.45" className="ar-dash-stream" opacity="0.7" />
        {[30, 50, 72].map((y, i) => {
          const spread = (y / 100) * 22 + 2;
          return <polyline key={i} points={`${50 - spread},${y - 3} 50,${y} ${50 + spread},${y - 3}`} fill="none" stroke={activeAccent} strokeWidth="0.32" opacity={0.2 + (y / 100) * 0.4} />;
        })}
      </svg>

      {/* barre d'état haut gauche */}
      <div className="absolute top-4 left-4 md:left-6 z-30 pointer-events-auto flex items-center gap-2.5">
        <div className="px-4 py-2 rounded-full flex items-center gap-2 text-[10px] uppercase tracking-widest font-medium transition-colors duration-500" style={{ background: 'rgba(16,20,29,0.6)', border: `1px solid ${withAlpha(activeAccent, 0.4)}`, color: activeAccent, backdropFilter: `blur(${blur}px)` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: activeAccent }} />
          {meta.brandName} · {journey[activeIdx]?.zone}
        </div>
      </div>

      {/* compas / téléportation à droite */}
      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5 text-[8px] tracking-[0.25em] uppercase" style={{ color: colors.textMuted }}>
          <Compass className="w-3.5 h-3.5" style={{ color: activeAccent }} /> {ui.compassLabel}
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-2xl" style={{ background: 'rgba(16,20,29,0.55)', border: `1px solid ${colors.border}`, backdropFilter: `blur(${blur}px)` }}>
          {journey.map((step, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button key={step.id} onClick={() => teleportTo(step.center)} title={`${step.short} · ${step.label}`} className="group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border" style={{ borderColor: isActive ? step.accent : 'transparent', background: isActive ? withAlpha(step.accent, 0.18) : 'rgba(255,255,255,0.03)', boxShadow: isActive ? `0 0 16px ${withAlpha(step.accent, 0.4)}` : 'none' }}>
                <Icon name={step.icon} className="w-5 h-5" style={{ color: isActive ? step.accent : colors.textMuted }} />
                <span className="absolute right-full mr-3 px-2.5 py-1.5 rounded-lg text-[9px] uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'rgba(12,15,22,0.92)', border: `1px solid ${colors.border}`, color: step.accent }}>
                  {step.short} · {step.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="h-24 w-[2px] rounded-full overflow-hidden" style={{ background: colors.border }}>
          <div className="w-full transition-all duration-100" style={{ height: `${portfolioScroll * 100}%`, background: `linear-gradient(${colors.accent}, ${colors.secondary}, ${colors.tertiary})` }} />
        </div>
      </div>

      {/* cartes des actes */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-start px-4 md:px-20 pointer-events-none">

        {journey.map((step, idx) => (
          <div key={step.id} className={`absolute w-full ${step.key === 'shop' || step.key === 'learn' ? 'max-w-5xl' : step.key === 'contact' ? 'max-w-3xl flex flex-col items-center text-center' : 'max-w-xl md:max-w-2xl flex flex-col items-center md:items-start text-center md:text-left'}`} style={getCardStyle(idx)}>
            <ScanReveal active={activeIdx === idx} color={step.accent} radius={theme.radius} />

            {/* ----- HERO (start / générique) ----- */}
            {(step.key === 'start' || (step.key !== 'shop' && step.key !== 'learn' && step.key !== 'contact')) && (
              <div className="relative p-7 md:p-9 pointer-events-auto" style={panel(step.accent)}>
                <Corners color={step.accent} radius={theme.radius} />
                <div className="space-y-6 relative" style={{ transform: 'translateZ(20px)' }}>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <span className="text-[9.5px] uppercase tracking-[0.3em] font-semibold" style={{ color: step.accent }}>{meta.brandName} · Acte {step.short}</span>
                    <span className="h-px w-12" style={{ background: withAlpha(step.accent, 0.5) }} />
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight" style={{ fontFamily: theme.fontDisplay }}>{step.headline}</h1>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: colors.textMuted }}>{step.intro}</p>
                  <div className="pt-1 flex flex-col md:flex-row items-center gap-4">
                    <button onClick={() => teleportTo(journey[Math.min(idx + 1, journey.length - 1)].center)} className="px-6 py-3 rounded-2xl font-semibold text-xs tracking-wider uppercase transition-transform hover:scale-105 active:scale-95 flex items-center gap-2" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, color: colors.background, boxShadow: `0 0 24px ${withAlpha(step.accent, 0.35)}` }}>
                      {ui.startCta} <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => openImmersion({ type: 'section', id: step.id })} className="px-5 py-3 rounded-2xl font-semibold text-xs tracking-wider uppercase transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 border" style={{ borderColor: withAlpha(step.accent, 0.5), color: step.accent, background: withAlpha(step.accent, 0.1) }}>
                      <Search className="w-4 h-4" /> En savoir plus
                    </button>
                    <div className="flex items-center gap-2 text-[10px]" style={{ color: colors.textMuted }}>
                      <span className="relative inline-flex w-4 h-6 border rounded-full justify-center pt-1" style={{ borderColor: withAlpha(step.accent, 0.5) }}>
                        <span className="w-0.5 h-1.5 rounded-full ar-wheel-hint" style={{ background: step.accent }} />
                      </span>
                      {ui.scrollHint}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs ar-float pointer-events-none" style={{ color: colors.textMuted }}>
                  <ChevronDown className="w-4 h-4" style={{ color: step.accent }} /> {ui.immersionHint}
                </div>
              </div>
            )}

            {/* ----- BOUTIQUE ----- */}
            {step.key === 'shop' && (
              <div className="relative p-5 md:p-6 pointer-events-auto w-full" style={panel(step.accent)}>
                <Corners color={step.accent} radius={theme.radius} />
                <div className="space-y-4 relative" style={{ transform: 'translateZ(20px)' }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: colors.border }}>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] font-semibold" style={{ color: step.accent }}>Acte {step.short} · {step.zone}</span>
                      <h2 className="text-2xl font-extrabold flex items-center gap-2 tracking-tight" style={{ fontFamily: theme.fontDisplay }}>
                        <Icon name={step.icon} className="w-5 h-5" style={{ color: step.accent }} /> {step.headline}
                      </h2>
                    </div>
                    <button onClick={() => openImmersion({ type: 'section', id: step.id })} className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-bold border transition active:scale-95" style={{ borderColor: withAlpha(step.accent, 0.5), color: step.accent, background: withAlpha(step.accent, 0.1) }}>
                      <Search className="w-3.5 h-3.5" /> Découvrir la zone
                    </button>
                  </div>
                  <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search className="w-4 h-4" style={{ color: step.accent }} /></span>
                    <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); }} placeholder="Rechercher un produit…" className="w-full text-xs rounded-xl py-2 pl-9 pr-8 outline-none" style={{ background: 'rgba(0,0,0,0.28)', border: `1px solid ${colors.border}`, color: colors.text }} />
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 flex items-center pr-3" style={{ color: colors.textMuted }}><X className="w-3.5 h-3.5" /></button>}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {filteredProducts.length === 0 ? (
                        <div className="md:col-span-3 flex flex-col items-center justify-center p-8 rounded-xl text-center gap-2" style={{ background: 'rgba(0,0,0,0.2)', border: `1px dashed ${colors.border}`, color: colors.textMuted }}>
                          <Search className="w-5 h-5" style={{ color: step.accent }} />
                          <p className="text-xs">Aucun produit ne correspond.</p>
                          <button onClick={() => setSearchQuery('')} className="px-3 py-1.5 text-[9px] uppercase tracking-wider rounded-lg border" style={{ borderColor: step.accent, color: step.accent }}>Réinitialiser</button>
                        </div>
                      ) : (
                        filteredProducts.map((product) => (
                          <ProductCard key={product.id} product={product} accent={step.accent} colors={colors} currency={currency} inCart={cart.includes(product.id)} expanded={expandedProduct === product.id} onToggleSpecs={() => { chirp(700, 'sine', 0.08); setExpandedProduct(expandedProduct === product.id ? null : product.id); }} onPreview={() => previewProduct(product.id)} onToggleCart={() => toggleCart(product.id)} onOpen={() => openImmersion({ type: 'product', id: product.id })} />
                        ))
                      )}
                    </div>

                    {/* panier */}
                    <div className="lg:col-span-4 rounded-xl p-3.5 flex flex-col justify-between text-[10.5px]" style={{ background: 'rgba(0,0,0,0.28)', border: `1px solid ${colors.border}` }}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[9px] border-b pb-1.5 font-bold" style={{ borderColor: colors.border, color: colors.textMuted }}>
                          <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" style={{ color: step.accent }} /> Panier</span>
                          <span style={{ color: step.accent }}>{cart.length} art.</span>
                        </div>
                        <div className="space-y-2 min-h-[80px]">
                          {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center gap-1" style={{ color: colors.textMuted }}><Package className="w-6 h-6 opacity-50" /><span>Panier vide</span></div>
                          ) : (
                            cart.map((id) => {
                              const item = products.find((p) => p.id === id);
                              if (!item) return null;
                              return (
                                <div key={id} className="flex items-center justify-between border-b py-1 text-[9.5px]" style={{ borderColor: colors.border }}>
                                  <span className="flex items-center gap-1.5"><Icon name={item.icon} className="w-3.5 h-3.5" style={{ color: step.accent }} />{item.name}</span>
                                  <span className="flex items-center gap-1.5"><span className="font-bold" style={{ color: colors.text }}>{item.price} {item.currency}</span><button onClick={() => toggleCart(id)} style={{ color: colors.danger }}>×</button></span>
                                </div>
                              );
                            })
                          )}
                        </div>
                        <div className="border-t pt-2 flex justify-between text-[11px] font-bold" style={{ borderColor: colors.border }}>
                          <span style={{ color: step.accent }}>Total</span><span style={{ color: step.accent }}>{cartTotal} {currency}</span>
                        </div>
                      </div>
                      <div className="pt-3">
                        {checkoutStep === 'cart' && <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full px-3 py-2.5 rounded-xl font-bold text-[9.5px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-40" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, color: colors.background }}><CreditCard className="w-3.5 h-3.5" /> Valider l’achat</button>}
                        {checkoutStep === 'purchasing' && <div className="w-full px-3 py-2.5 rounded-xl border text-[9px] uppercase tracking-wider flex items-center justify-center gap-2" style={{ borderColor: step.accent, color: step.accent }}><span className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: step.accent, borderTopColor: 'transparent' }} /> Traitement…</div>}
                        {checkoutStep === 'success' && <div className="w-full p-2 rounded-xl text-[9px] uppercase tracking-wider space-y-1" style={{ background: withAlpha(colors.success, 0.12), border: `1px solid ${colors.success}`, color: colors.success }}><div className="flex items-center justify-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Commande confirmée</div><button onClick={() => { chirp(600, 'sine', 0.1); setCheckoutStep('cart'); }} className="px-2 py-1 text-[8px] font-extrabold uppercase rounded w-full" style={{ background: colors.success, color: colors.background }}>Fermer</button></div>}
                      </div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl flex items-center gap-2 text-[9px]" style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${colors.border}`, color: colors.textMuted }}>
                    <Info className="w-3.5 h-3.5 flex-shrink-0" style={{ color: step.accent }} /> Astuce : « Aperçu » applique l’optique du produit au décor. Arrêtez-vous sur un objet, il tourne devant vous.
                  </div>
                </div>
              </div>
            )}

            {/* ----- FORMATIONS ----- */}
            {step.key === 'learn' && (
              <div className="relative p-5 md:p-6 pointer-events-auto w-full" style={panel(step.accent)}>
                <Corners color={step.accent} radius={theme.radius} />
                <div className="space-y-4 relative" style={{ transform: 'translateZ(20px)' }}>
                  <div className="border-b pb-3 flex items-start justify-between gap-2" style={{ borderColor: colors.border }}>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.3em] font-semibold" style={{ color: step.accent }}>Acte {step.short} · {step.zone}</span>
                      <h2 className="text-2xl font-extrabold flex items-center gap-2 tracking-tight" style={{ fontFamily: theme.fontDisplay }}>
                        <Icon name={step.icon} className="w-5 h-5" style={{ color: step.accent }} /> {step.headline}
                      </h2>
                      <p className="text-[11px] mt-1" style={{ color: colors.textMuted }}>{step.intro}</p>
                    </div>
                    <button onClick={() => openImmersion({ type: 'section', id: step.id })} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider font-bold border transition active:scale-95" style={{ borderColor: withAlpha(step.accent, 0.5), color: step.accent, background: withAlpha(step.accent, 0.1) }}>
                      <Search className="w-3.5 h-3.5" /> Découvrir la zone
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} colors={colors} onPlay={() => openImmersion({ type: 'course', id: course.id })} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ----- CONTACT ----- */}
            {step.key === 'contact' && (
              <div className="relative p-7 md:p-9 pointer-events-auto w-full" style={panel(step.accent)}>
                <Corners color={step.accent} radius={theme.radius} />
                <div className="space-y-6 relative" style={{ transform: 'translateZ(20px)' }}>
                  <div className="flex justify-center">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <span className="absolute inset-0 rounded-full border ar-target-pulse" style={{ borderColor: withAlpha(step.accent, 0.5) }} />
                      <span className="absolute w-32 h-32 rounded-full border border-dashed animate-spin-slow" style={{ borderColor: colors.border }} />
                      <Icon name={step.icon} className="w-12 h-12 ar-float" style={{ color: step.accent }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-semibold" style={{ color: step.accent }}>Acte {step.short} · {step.zone}</span>
                    <h2 className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight" style={{ fontFamily: theme.fontDisplay }}>{contact.headline}</h2>
                    <p className="text-xs mt-3 max-w-xl mx-auto leading-relaxed" style={{ color: colors.textMuted }}>{contact.pitch}</p>
                  </div>

                  {!scannerUnlocked ? (
                    <button onClick={() => { chirpSuccess(); setScannerUnlocked(true); }} className="ar-unlock-glow group px-8 py-4 rounded-2xl font-bold text-sm tracking-wider uppercase transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, color: colors.background }}>
                      <ScanLine className="w-5 h-5" /> {contact.unlockLabel} <Unlock className="w-4 h-4 opacity-80" />
                    </button>
                  ) : (
                    <div className="rounded-2xl p-5 text-left" style={{ background: 'rgba(0,0,0,0.28)', border: `1px solid ${withAlpha(step.accent, 0.4)}` }}>
                      {contactSent ? (
                        <div className="flex flex-col items-center text-center gap-2 py-4">
                          <ShieldCheck className="w-10 h-10" style={{ color: colors.success }} />
                          <p className="text-sm font-bold">Demande transmise, {contactForm.company || 'partenaire'} !</p>
                          <p className="text-xs" style={{ color: colors.textMuted }}>Notre agence revient vers vous. {contact.responseTime}.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <label className="flex flex-col gap-1 text-[10px]" style={{ color: colors.textMuted }}>
                              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" style={{ color: step.accent }} /> Entreprise</span>
                              <input required value={contactForm.company} onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })} placeholder="Votre société" className="rounded-lg px-3 py-2 text-xs outline-none" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${colors.border}`, color: colors.text }} />
                            </label>
                            <label className="flex flex-col gap-1 text-[10px]" style={{ color: colors.textMuted }}>
                              <span className="flex items-center gap-1"><Send className="w-3 h-3" style={{ color: step.accent }} /> Email pro</span>
                              <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="vous@entreprise.com" className="rounded-lg px-3 py-2 text-xs outline-none" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${colors.border}`, color: colors.text }} />
                            </label>
                          </div>
                          <label className="flex flex-col gap-1 text-[10px]" style={{ color: colors.textMuted }}>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" style={{ color: step.accent }} /> Créneau souhaité</span>
                            <input value={contactForm.slot} onChange={(e) => setContactForm({ ...contactForm, slot: e.target.value })} placeholder="ex. mardi 14h…" className="rounded-lg px-3 py-2 text-xs outline-none" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${colors.border}`, color: colors.text }} />
                          </label>
                          <button type="submit" className="w-full px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95" style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.secondary})`, color: colors.background }}>
                            <Calendar className="w-4 h-4" /> Programmer la démonstration
                          </button>
                          <p className="flex items-center justify-center gap-1.5 text-[9px]" style={{ color: colors.textMuted }}><MapPin className="w-3 h-3" /> {contact.bookingNote} · {contact.responseTime}</p>
                        </form>
                      )}
                    </div>
                  )}
                  <button onClick={() => teleportTo(0)} className="flex items-center gap-1.5 text-[10px] mx-auto transition-colors hover:opacity-80" style={{ color: colors.textMuted }}>
                    <ArrowRight className="w-3 h-3 rotate-180" /> Revenir au départ
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* vue d'immersion (section / produit / cours) */}
      <ImmersionView
        target={immersion}
        onClose={closeImmersion}
        onTeleport={teleportTo}
        onToggleCart={toggleCart}
        isInCart={(id) => cart.includes(id)}
        onPreview={previewProduct}
        currency={currency}
      />

      {/* pied de page */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(16,20,29,0.62)', border: `1px solid ${colors.border}`, backdropFilter: `blur(${blur}px)` }}>
          <MousePointer2 className="w-3.5 h-3.5" style={{ color: activeAccent }} />
          <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color: colors.textMuted }}>{activeIdx === journey.length - 1 ? 'Fin de la balade' : ui.scrollHint}</span>
        </div>
        <button onClick={handleFreeFlight} title="Piloter librement (WASD + flèches)" className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px] uppercase tracking-widest font-medium transition-colors hover:opacity-80" style={{ background: 'rgba(16,20,29,0.62)', border: `1px solid ${colors.border}`, color: colors.textMuted, backdropFilter: `blur(${blur}px)` }}>
          <Navigation className="w-3.5 h-3.5 rotate-45" style={{ color: activeAccent }} /> {ui.freeFlightLabel}
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   Sous-composants
   ============================================================ */

const Corners: React.FC<{ color: string; radius: number }> = ({ color }) => (
  <>
    <div className="absolute -top-px -left-px w-5 h-5 border-t border-l rounded-tl-xl" style={{ borderColor: withAlpha(color, 0.6) }} />
    <div className="absolute -top-px -right-px w-5 h-5 border-t border-r rounded-tr-xl" style={{ borderColor: withAlpha(color, 0.6) }} />
    <div className="absolute -bottom-px -left-px w-5 h-5 border-b border-l rounded-bl-xl" style={{ borderColor: withAlpha(color, 0.6) }} />
    <div className="absolute -bottom-px -right-px w-5 h-5 border-b border-r rounded-br-xl" style={{ borderColor: withAlpha(color, 0.6) }} />
  </>
);

const ScanReveal: React.FC<{ active: boolean; color: string; radius: number }> = ({ active, color, radius }) => {
  if (!active) return null;
  return (
    <div key="scan" className="absolute inset-0 z-30 overflow-hidden pointer-events-none" style={{ borderRadius: radius }}>
      <div className="absolute inset-x-0 h-24 ar-scan-sweep" style={{ background: `linear-gradient(to bottom, transparent, ${withAlpha(color, 0.25)} 48%, ${withAlpha(color, 0.55)} 50%, ${withAlpha(color, 0.25)} 52%, transparent)` }} />
    </div>
  );
};

const ProductCard: React.FC<{
  product: Product;
  accent: string;
  colors: any;
  currency: string;
  inCart: boolean;
  expanded: boolean;
  onToggleSpecs: () => void;
  onPreview: () => void;
  onToggleCart: () => void;
  onOpen: () => void;
}> = ({ product, accent, colors, currency, inCart, expanded, onToggleSpecs, onPreview, onToggleCart, onOpen }) => (
  <div className="relative rounded-xl p-3.5 flex flex-col justify-between transition-all duration-300 group" style={{ background: 'rgba(0,0,0,0.26)', border: `1px solid ${colors.border}` }}>
    <button onClick={onOpen} title="Ouvrir la fiche détaillée" className="relative flex items-center justify-center h-20 mb-2 w-full cursor-pointer">
      <div className="ar-float ar-orbit transition-transform group-hover:scale-110" style={{ transformStyle: 'preserve-3d' }}><Icon name={product.icon} className="w-12 h-12" style={{ color: colors.text }} /></div>
      <div className="absolute -top-1 -right-1 ar-float">
        <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold" style={{ background: 'rgba(12,15,22,0.85)', border: `1px solid ${withAlpha(accent, 0.5)}`, color: accent }}>{product.price} {product.currency || currency}</div>
      </div>
    </button>
    <span className="self-start text-[8px] tracking-wider font-bold uppercase rounded px-1.5 py-0.5 mb-1" style={{ background: withAlpha(accent, 0.12), border: `1px solid ${withAlpha(accent, 0.3)}`, color: accent }}>{product.badge}</span>
    <button onClick={onOpen} className="text-left text-xs font-bold uppercase tracking-wide transition-colors hover:opacity-80" style={{ color: colors.text }}>{product.name}</button>
    <span className="text-[9px] italic block mb-1" style={{ color: colors.textMuted }}>{product.tagline}</span>
    <p className="text-[10px] leading-snug min-h-[40px]" style={{ color: colors.textMuted }}>{product.description}</p>
    {expanded && (
      <div className="mt-2 space-y-1.5 rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}` }}>
        {product.specs.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-[9px]">
            <span className="flex items-center gap-1" style={{ color: colors.textMuted }}><Icon name={s.icon} className="w-3 h-3" style={{ color: accent }} />{s.label}</span>
            <span className="font-bold">{s.value}</span>
          </div>
        ))}
        <div className="pt-1 border-t text-[8px]" style={{ borderColor: colors.border, color: colors.textMuted }}>Compatibilité : <span style={{ color: accent }}>{product.compat.join(' · ')}</span></div>
      </div>
    )}
    <div className="pt-3 grid grid-cols-2 gap-1.5">
      <button onClick={onToggleSpecs} className="px-2 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wide flex items-center justify-center gap-1 transition active:scale-95 border" style={{ background: 'rgba(0,0,0,0.3)', borderColor: colors.border, color: colors.text }}><Info className="w-3 h-3" /> {expanded ? 'Masquer' : 'Specs'}</button>
      <button onClick={onPreview} title="Aperçu AR" className="px-2 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wide flex items-center justify-center gap-1 transition active:scale-95 border" style={{ background: withAlpha(accent, 0.16), borderColor: withAlpha(accent, 0.5), color: accent }}><Eye className="w-3 h-3" /> Aperçu</button>
      <button onClick={onToggleCart} className="col-span-2 px-2 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wide flex items-center justify-center gap-1 transition active:scale-95 border" style={{ background: inCart ? withAlpha(accent, 0.2) : 'rgba(0,0,0,0.3)', borderColor: inCart ? accent : colors.border, color: inCart ? accent : colors.text }}>{inCart ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}{inCart ? 'Dans le panier' : 'Ajouter au panier'}</button>
    </div>
  </div>
);

const CourseCard: React.FC<{ course: Course; colors: any; onPlay: () => void }> = ({ course, colors, onPlay }) => (
  <div className="relative rounded-xl p-4 flex flex-col justify-between transition-all duration-300 group overflow-hidden" style={{ background: 'rgba(0,0,0,0.26)', border: `1px solid ${colors.border}`, boxShadow: `inset 0 0 30px ${withAlpha(course.accent, 0.08)}` }}>
    <div className="relative flex items-center justify-center h-16 mb-2">
      <span className="absolute w-14 h-14 rounded-full border ar-target-pulse" style={{ borderColor: withAlpha(course.accent, 0.5) }} />
      <span className="absolute w-20 h-20 rounded-full border border-dashed animate-spin-slow" style={{ borderColor: colors.border }} />
      <Icon name="BookOpen" className="w-7 h-7 ar-float" style={{ color: course.accent }} />
    </div>
    <h3 className="text-sm font-bold text-center leading-tight">{course.title}</h3>
    <p className="text-[10px] text-center mt-1 leading-snug min-h-[40px]" style={{ color: colors.textMuted }}>{course.blurb}</p>
    <div className="flex justify-center gap-2 my-2 text-[8.5px]">
      {[course.level, course.duration, `${course.modulesCount} mod.`].map((t, i) => (
        <span key={i} className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, color: colors.textMuted }}>{t}</span>
      ))}
    </div>
    <button onClick={onPlay} className="mt-1 w-full px-3 py-2 rounded-lg font-bold text-[9.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 border" style={{ background: withAlpha(course.accent, 0.16), borderColor: withAlpha(course.accent, 0.5), color: colors.text }}>
      <Play className="w-3.5 h-3.5" /> Lecture AR
    </button>
  </div>
);
