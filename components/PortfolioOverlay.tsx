import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Crosshair,
  Activity,
  ShoppingCart,
  Eye,
  Terminal,
  CreditCard,
  Package,
  Info,
  Search,
  X,
  DoorOpen,
  GraduationCap,
  Radar,
  Headset,
  Glasses,
  Move3d,
  Play,
  Plus,
  Check,
  Gauge,
  Wifi,
  BatteryCharging,
  BookOpen,
  Boxes,
  Building2,
  Calendar,
  Send,
  MapPin,
  ScanLine,
  Unlock,
  Navigation,
  MousePointer2,
  Cpu,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

/* ============================================================
   SONS — bips rétro légers (Web Audio) pour les interactions AR
   ============================================================ */
const playSubtleChirp = (frequency = 800, type: OscillatorType = 'sine', duration = 0.15) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.3, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Audio Context indisponible', error);
  }
};

const playSuccessChirp = () => {
  playSubtleChirp(440, 'sine', 0.15);
  setTimeout(() => playSubtleChirp(660, 'sine', 0.15), 100);
  setTimeout(() => playSubtleChirp(880, 'sine', 0.25), 200);
};

/* ============================================================
   CONFIG DU PARCOURS — 4 actes (Level Design)
   ============================================================ */
type ActDef = {
  id: string;
  short: string;
  label: string;
  zone: string;
  color: string;
  center: number; // position cible sur le rail (0..1)
  icon: React.ComponentType<{ className?: string }>;
};

const ACTS: ActDef[] = [
  { id: 'start', short: '00', label: 'Point de Départ', zone: 'SAS D’ENTRÉE', color: '#22d3ee', center: 0.0, icon: DoorOpen },
  { id: 'shop', short: '01', label: 'Avenue Matériel', zone: 'BOUTIQUE AR', color: '#06b6d4', center: 0.30, icon: ShoppingCart },
  { id: 'learn', short: '02', label: 'Champ de Connaissance', zone: 'PÔLE ENSEIGNEMENT', color: '#a855f7', center: 0.56, icon: GraduationCap },
  { id: 'contact', short: '03', label: 'Portail Virtuel-Réel', zone: 'BORNE B2B', color: '#38bdf8', center: 0.92, icon: Radar },
];

/* Produits de la boutique AR (Avenue Matériel) */
const PRODUCTS = [
  {
    id: 'vortex',
    name: 'Vortex AR-1',
    tagline: 'Casque de réalité augmentée',
    description:
      'Casque AR phare : double écran micro-OLED, suivi inside-out 6DoF et incrustation holographique temps réel des étiquettes flottantes.',
    price: 1290,
    badge: 'PHARE',
    icon: Headset,
    specs: [
      { label: 'Champ de vision', value: '120°', icon: Eye },
      { label: 'Latence', value: '4 ms', icon: Gauge },
      { label: 'Autonomie', value: '3 h 30', icon: BatteryCharging },
    ],
    compat: ['Windows', 'macOS', 'WebXR'],
    effectLabel: 'ZOOM TÉLÉOBJECTIF',
    effect: (set: (k: string, v: number) => void, commit?: () => void) => {
      set('slider_zoom', 1.85);
      set('slider_atmosphereDensity', 3.2);
      set('slider_colorEffectStrength', 0.8);
      commit?.();
    },
  },
  {
    id: 'spectra',
    name: 'HoloLens Spectra',
    tagline: 'Lunettes intelligentes du quotidien',
    description:
      'Smartglasses ultra-légères (62 g) à guides d’ondes. Affiche les waypoints et fiches produits directement dans votre champ de vision.',
    price: 740,
    badge: 'LÉGER',
    icon: Glasses,
    specs: [
      { label: 'Poids', value: '62 g', icon: Move3d },
      { label: 'Connectivité', value: 'Wi-Fi 6E', icon: Wifi },
      { label: 'Autonomie', value: '6 h', icon: BatteryCharging },
    ],
    compat: ['iOS', 'Android', 'WebXR'],
    effectLabel: 'CELLULES HEXAGONALES',
    effect: (set: (k: string, v: number) => void, commit?: () => void) => {
      set('slider_fractalScale', 0.48);
      set('slider_fractalRotation', 1.45);
      commit?.();
    },
  },
  {
    id: 'neogrip',
    name: 'NeoGrip Haptic',
    tagline: 'Manettes à retour haptique',
    description:
      'Paire de contrôleurs avec moteurs piézo : ressentez la texture des polygones et la résistance des interfaces holographiques.',
    price: 320,
    badge: 'HAPTIQUE',
    icon: Boxes,
    specs: [
      { label: 'Capteurs', value: '384 nœuds', icon: Cpu },
      { label: 'Retour', value: 'Bi-directionnel', icon: Activity },
      { label: 'Autonomie', value: '9 h', icon: BatteryCharging },
    ],
    compat: ['Vortex AR-1', 'Spectra', 'WebXR'],
    effectLabel: 'PULSATION FRACTALE',
    effect: (set: (k: string, v: number) => void, commit?: () => void) => {
      set('slider_fractalPulseStrength', 0.35);
      commit?.();
    },
  },
];

/* Cours / E-Learning (Champ de Connaissance) — nœuds-îles */
const COURSES = [
  {
    id: 'python-vr',
    title: 'Python appliqué à la VR',
    level: 'Intermédiaire',
    duration: '12 h',
    modules: 9,
    color: '#a855f7',
    blurb: 'Pilotez des scènes immersives, gérez le tracking et scriptez des interactions spatiales en Python.',
  },
  {
    id: 'glsl',
    title: 'Shaders WebGL & GLSL',
    level: 'Avancé',
    duration: '16 h',
    modules: 12,
    color: '#f5b942',
    blurb: 'Du raymarching aux fractales : construisez des mondes compilés directement sur le GPU.',
  },
  {
    id: 'ux-spatial',
    title: 'Design UX Spatial / AR',
    level: 'Tous niveaux',
    duration: '8 h',
    modules: 7,
    color: '#a855f7',
    blurb: 'Concevez des HUD flottants, des waypoints et des interfaces phygitales lisibles et confortables.',
  },
];

export const PortfolioOverlay: React.FC = () => {
  const {
    portfolioScroll,
    devMode,
    setDevMode,
    soundConfig,
    handleSoundConfigChange,
    uniforms,
    handleUniformChange,
    handleUniformsCommit,
  } = useAppContext();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hudTime, setHudTime] = useState('');

  // Boutique
  const [cart, setCart] = useState<string[]>(['vortex']);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'purchasing' | 'success'>('cart');

  // E-Learning
  const [playingCourse, setPlayingCourse] = useState<string | null>(null);

  // Contact B2B
  const [scannerUnlocked, setScannerUnlocked] = useState(false);
  const [contact, setContact] = useState({ company: '', email: '', slot: '' });
  const [contactSent, setContactSent] = useState(false);

  // Horloge HUD
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setHudTime(
        now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' · GMT+1',
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Parallaxe HUD au pointeur
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const activeIdx = useMemo(() => {
    if (portfolioScroll < 0.17) return 0;
    if (portfolioScroll < 0.45) return 1;
    if (portfolioScroll < 0.72) return 2;
    return 3;
  }, [portfolioScroll]);

  const theme = ACTS[activeIdx].color;

  if (devMode) return null;

  /* --- TÉLÉPORTATION : saut fluide vers une zone du parcours --- */
  const teleportTo = (progress: number) => {
    playSubtleChirp(900, 'triangle', 0.18);
    const el = document.getElementById('ar-scroll-rail');
    if (!el) return;
    const total = el.scrollHeight - el.clientHeight;
    if (total <= 0) return;
    el.scrollTo({ top: progress * total, behavior: 'smooth' });
  };

  const handleFreeFlight = () => {
    playSubtleChirp(600, 'sawtooth', 0.35);
    if (!soundConfig.enabled) {
      handleSoundConfigChange('enabled', true);
      handleSoundConfigChange('masterVolume', 0.5);
    }
    setDevMode(true);
  };

  /* --- Boutique --- */
  const filteredProducts = PRODUCTS.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return [p.name, p.tagline, p.description, p.badge].some((s) => s.toLowerCase().includes(q));
  });

  const toggleCart = (id: string) => {
    playSubtleChirp(680, 'sine', 0.1);
    setCart((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const previewProduct = (id: string) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (product) {
      playSubtleChirp(1100, 'triangle', 0.25);
      product.effect(handleUniformChange, handleUniformsCommit);
    }
  };

  const cartTotal = cart.reduce((acc, id) => acc + (PRODUCTS.find((p) => p.id === id)?.price || 0), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutStep('purchasing');
    playSubtleChirp(350, 'sawtooth', 0.4);
    setTimeout(() => {
      setCheckoutStep('success');
      playSuccessChirp();
    }, 1600);
  };

  /* --- Contact B2B --- */
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.company.trim() || !contact.email.trim()) return;
    playSuccessChirp();
    setContactSent(true);
  };

  /* --- Style des cartes : "passe au bord de la route" sur les rails --- */
  const getCardStyle = (actIdx: number): React.CSSProperties => {
    const d = portfolioScroll - ACTS[actIdx].center;
    const win = actIdx === 0 ? 0.16 : actIdx === 3 ? 0.18 : 0.15;
    let opacity = 1 - Math.abs(d) / win;
    opacity = Math.max(0, Math.min(1, opacity));
    const tiltX = -mousePos.y * 8;
    const tiltY = mousePos.x * 9;
    const isActive = activeIdx === actIdx;
    return {
      transform: `perspective(1300px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${-d * 130}px) scale(${0.9 + opacity * 0.1})`,
      transformStyle: 'preserve-3d',
      opacity,
      transition: 'transform 0.18s cubic-bezier(0.25,1,0.5,1), opacity 0.32s ease-out',
      pointerEvents: isActive && opacity > 0.45 ? 'auto' : 'none',
    };
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden select-none font-sans">
      {/* Teinte AR de la zone active (verre des lunettes intelligentes) */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{ background: `radial-gradient(circle at 50% 60%, ${theme}14 0%, transparent 55%)` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(7,11,20,0.78)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

      {/* ===========================================================
          LIGNE DIRECTRICE "WAYPOINTS" AU SOL (perspective holographique)
          =========================================================== */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[46vh] w-full z-[5] pointer-events-none transition-opacity duration-700"
        style={{ opacity: 0.6 }}
      >
        {/* rails convergents vers l'horizon */}
        <line x1="50" y1="0" x2="20" y2="100" stroke={theme} strokeWidth="0.22" opacity="0.5" />
        <line x1="50" y1="0" x2="80" y2="100" stroke={theme} strokeWidth="0.22" opacity="0.5" />
        {/* ligne centrale animée (flux de données) */}
        <line x1="50" y1="2" x2="50" y2="100" stroke={theme} strokeWidth="0.55" className="ar-dash-stream" />
        {/* chevrons de direction */}
        {[26, 44, 62, 80].map((y, i) => {
          const spread = (y / 100) * 26 + 2;
          return (
            <polyline
              key={i}
              points={`${50 - spread},${y - 3} 50,${y} ${50 + spread},${y - 3}`}
              fill="none"
              stroke={theme}
              strokeWidth="0.4"
              opacity={0.25 + (y / 100) * 0.5}
            />
          );
        })}
      </svg>
      {/* lueur de progression sur la ligne (flux qui file vers l'avant) */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[5] pointer-events-none ar-waypoint-stream transition-colors duration-700"
        style={{
          width: '60vw',
          height: '42vh',
          clipPath: 'polygon(48.5% 0%, 51.5% 0%, 80% 100%, 20% 100%)',
          background: `repeating-linear-gradient(to bottom, transparent 0 28px, ${theme}55 28px 36px)`,
          maskImage: 'linear-gradient(to top, black 10%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to top, black 10%, transparent 85%)',
        }}
      />

      {/* ===========================================================
          BARRE D'ÉTAT HAUT GAUCHE
          =========================================================== */}
      <div className="absolute top-4 left-4 md:left-6 z-30 pointer-events-auto flex items-center gap-2.5">
        <div
          className="bg-black/70 border backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono shadow-lg shadow-black/40 transition-colors duration-500"
          style={{ borderColor: `${theme}55`, color: theme }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: theme }} />
          PARCOURS AR // {ACTS[activeIdx].zone}
        </div>
        <div className="hidden sm:flex bg-black/50 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full font-mono text-[9px] text-gray-300 tracking-wider items-center gap-1.5">
          <Terminal className="w-3 h-3" style={{ color: theme }} />
          {hudTime || 'SYNCHRONISATION…'}
        </div>
      </div>

      {/* ===========================================================
          MENU TÉLÉPORTATION (Compas AR fixe à droite)
          =========================================================== */}
      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5 text-[8px] font-mono tracking-[0.25em] text-gray-400 uppercase">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" style={{ color: theme }} />
          Compas
        </div>
        <div className="flex flex-col gap-2 bg-black/55 border border-white/10 backdrop-blur-md rounded-2xl p-2 shadow-2xl">
          {ACTS.map((act, idx) => {
            const ActIcon = act.icon;
            const isActive = activeIdx === idx;
            return (
              <button
                key={act.id}
                onClick={() => teleportTo(act.center)}
                title={`Téléporter vers : ${act.label}`}
                className="group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border"
                style={{
                  borderColor: isActive ? act.color : 'rgba(255,255,255,0.08)',
                  backgroundColor: isActive ? `${act.color}26` : 'rgba(0,0,0,0.4)',
                  boxShadow: isActive ? `0 0 16px ${act.color}55` : 'none',
                }}
              >
                <ActIcon className="w-5 h-5 transition-colors" />
                <span
                  className="absolute right-full mr-3 px-2.5 py-1.5 rounded-lg bg-black/90 border border-white/10 text-[9px] font-mono uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ color: act.color }}
                >
                  {act.short} · {act.label}
                </span>
                <span
                  className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[2px] rounded-full transition-all"
                  style={{ height: isActive ? '60%' : '0%', backgroundColor: act.color }}
                />
              </button>
            );
          })}
        </div>
        {/* progression verticale */}
        <div className="h-24 w-[2px] bg-white/10 relative rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full transition-all duration-100"
            style={{ height: `${portfolioScroll * 100}%`, background: `linear-gradient(to bottom, #22d3ee, #a855f7, #38bdf8)` }}
          />
        </div>
        <span className="font-mono text-[9px] text-gray-400 font-bold tracking-widest">
          {(portfolioScroll * 100).toFixed(0)}%
        </span>
      </div>

      {/* ===========================================================
          RÉTICULE CENTRAL + TÉLÉMÉTRIE (vision masque AR)
          =========================================================== */}
      <div
        className="absolute top-1/2 left-1/2 z-10 pointer-events-none hidden lg:flex flex-col items-center justify-center transition-transform duration-100 ease-out"
        style={{ transform: `translate3d(-50%,-50%,0) perspective(1200px) rotateX(${-mousePos.y * 11}deg) rotateY(${mousePos.x * 14}deg)` }}
      >
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border ar-target-pulse"
            style={{ borderColor: `${theme}40` }}
          />
          <div className="absolute w-44 h-44 border border-dashed border-white/10 rounded-full animate-spin-slow" />
          <Crosshair className="w-7 h-7 text-white/25" />
          <div className="absolute -right-[8.5rem] top-4 flex flex-col font-mono text-[8px] text-gray-400 bg-black/65 border border-white/10 p-2.5 rounded-lg backdrop-blur-md gap-[2px] shadow-2xl">
            <span className="text-white font-bold flex items-center gap-1.5 border-b border-white/10 pb-1 mb-1 tracking-wider">
              <Activity className="w-3 h-3" style={{ color: theme }} /> TÉLÉMÉTRIE
            </span>
            <span>VITESSE&nbsp;: <span className="text-white font-bold">{(portfolioScroll > 0 ? 110 + Math.sin(portfolioScroll * 40) * 24 : 0).toFixed(0)} km/h</span></span>
            <span>ZONE&nbsp;: <span className="font-bold" style={{ color: theme }}>{ACTS[activeIdx].zone}</span></span>
            <span>TANGAGE&nbsp;: <span className="text-white font-bold">{(mousePos.y * -15).toFixed(1)}°</span></span>
            <span>LACET&nbsp;: <span className="text-white font-bold">{(mousePos.x * 30).toFixed(1)}°</span></span>
          </div>
        </div>
      </div>

      {/* ===========================================================
          CARTES DES ACTES
          =========================================================== */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-start px-4 md:px-20 pointer-events-none">

        {/* -------- ACTE 00 — POINT DE DÉPART -------- */}
        <div className="absolute w-full max-w-xl md:max-w-2xl flex flex-col items-center md:items-start text-center md:text-left" style={getCardStyle(0)}>
          <div className="relative bg-black/75 border border-white/10 rounded-2xl p-7 md:p-9 backdrop-blur-xl shadow-2xl pointer-events-auto" style={{ boxShadow: `0 0 40px ${ACTS[0].color}1a` }}>
            <CornerMarks color={ACTS[0].color} />
            <div className="space-y-6 relative" style={{ transform: 'translateZ(25px)' }}>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-[9.5px] uppercase tracking-[0.3em] font-mono font-semibold" style={{ color: ACTS[0].color }}>
                  CONSOLE AR // ACTE 00
                </span>
                <span className="h-[1px] w-12" style={{ backgroundColor: `${ACTS[0].color}80` }} />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                GLISSEZ POUR LANCER<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-500">L’IMMERSION AR.</span>
              </h1>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                Vous êtes face au portail. Au premier défilement, la caméra franchit la porte et vous place sur les rails
                d’un parcours continu : matériel, formations, puis contact pro. Bougez la souris pour pivoter votre regard à ~30°.
              </p>
              <div className="pt-1 flex flex-col md:flex-row items-center gap-4">
                <button
                  onClick={() => teleportTo(ACTS[1].center)}
                  className="px-6 py-3 rounded-xl text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
                  style={{ background: 'linear-gradient(90deg,#0891b2,#7c3aed)', boxShadow: '0 0 24px rgba(34,211,238,0.35)' }}
                >
                  <DoorOpen className="w-4 h-4" /> Entrer dans le parcours
                </button>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                  <span className="relative inline-flex w-4 h-6 border border-white/30 rounded-full justify-center pt-1">
                    <span className="w-0.5 h-1.5 rounded-full ar-wheel-hint" style={{ backgroundColor: ACTS[0].color }} />
                  </span>
                  Molette / glisser vers le bas
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-gray-400 text-xs font-mono animate-bounce pointer-events-none">
            <ChevronDown className="w-4 h-4" style={{ color: ACTS[0].color }} />
            <span>Descendez dans le monde 3D</span>
          </div>
        </div>

        {/* -------- ACTE 01 — AVENUE MATÉRIEL (BOUTIQUE) -------- */}
        <div className="absolute w-full max-w-5xl" style={getCardStyle(1)}>
          <ScanReveal active={activeIdx === 1} color={ACTS[1].color} />
          <div className="relative bg-black/82 border border-white/12 rounded-2xl p-5 md:p-6 backdrop-blur-2xl shadow-2xl pointer-events-auto" style={{ boxShadow: `0 0 44px ${ACTS[1].color}1f` }}>
            <CornerMarks color={ACTS[1].color} />
            <div className="space-y-4 relative" style={{ transform: 'translateZ(28px)' }}>
              {/* En-tête */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em] font-mono font-bold" style={{ color: ACTS[1].color }}>
                    ACTE 01 // AVENUE MATÉRIEL
                  </span>
                  <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                    <ShoppingCart className="w-5 h-5" style={{ color: ACTS[1].color }} />
                    Boutique <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300">Réalité Augmentée</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> PAIEMENT SÉCURISÉ
                </div>
              </div>

              {/* Recherche */}
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4" style={{ color: ACTS[1].color }} />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); playSubtleChirp(800 + Math.random() * 200, 'sine', 0.04); }}
                  placeholder="Rechercher un casque, des lunettes, un accessoire…"
                  className="w-full bg-black/60 border border-white/10 focus:border-cyan-400 text-white placeholder-gray-500 text-xs rounded-lg py-2 pl-9 pr-8 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-cyan-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Produits (le prix lévite façon tag AR) */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {filteredProducts.length === 0 ? (
                    <div className="md:col-span-3 flex flex-col items-center justify-center p-8 bg-black/40 border border-dashed border-white/10 rounded-xl text-center text-gray-400 font-mono gap-2">
                      <Search className="w-5 h-5" style={{ color: ACTS[1].color }} />
                      <p className="text-xs text-white">Aucun matériel ne correspond à votre recherche.</p>
                      <button onClick={() => setSearchQuery('')} className="px-3 py-1.5 text-[9px] uppercase tracking-wider rounded-lg border" style={{ borderColor: ACTS[1].color, color: ACTS[1].color }}>
                        Réinitialiser
                      </button>
                    </div>
                  ) : (
                    filteredProducts.map((product) => {
                      const ProdIcon = product.icon;
                      const inCart = cart.includes(product.id);
                      const expanded = expandedProduct === product.id;
                      return (
                        <div key={product.id} className="relative bg-black/55 border border-white/10 hover:border-cyan-400/40 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-300 group">
                          {/* objet qui tourne + tag prix lévitant */}
                          <div className="relative flex items-center justify-center h-20 mb-2">
                            <div className="ar-float ar-orbit" style={{ transformStyle: 'preserve-3d' }}>
                              <ProdIcon className="w-12 h-12 text-white/90 group-hover:text-cyan-200 transition-colors" />
                            </div>
                            <div className="absolute -top-1 -right-1 ar-float">
                              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/80 border text-[10px] font-mono font-bold" style={{ borderColor: `${ACTS[1].color}66`, color: ACTS[1].color }}>
                                {product.price} €
                              </div>
                              <span className="block w-px h-3 mx-auto" style={{ backgroundColor: `${ACTS[1].color}66` }} />
                            </div>
                          </div>
                          <span className="self-start bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[8px] tracking-wider font-bold uppercase rounded px-1.5 py-0.5 font-mono mb-1">
                            {product.badge}
                          </span>
                          <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wide">{product.name}</h3>
                          <span className="text-[9px] text-gray-400 italic block mb-1">{product.tagline}</span>
                          <p className="text-[10px] text-gray-300 leading-snug min-h-[40px]">{product.description}</p>

                          {/* Spécifications (déployable) */}
                          {expanded && (
                            <div className="mt-2 space-y-1.5 bg-white/5 border border-white/10 rounded-lg p-2 font-mono">
                              {product.specs.map((s, i) => {
                                const SpecIcon = s.icon;
                                return (
                                  <div key={i} className="flex items-center justify-between text-[9px]">
                                    <span className="flex items-center gap-1 text-gray-400"><SpecIcon className="w-3 h-3" style={{ color: ACTS[1].color }} />{s.label}</span>
                                    <span className="text-white font-bold">{s.value}</span>
                                  </div>
                                );
                              })}
                              <div className="pt-1 border-t border-white/10 text-[8px] text-gray-400">
                                Compatibilité : <span className="text-cyan-300">{product.compat.join(' · ')}</span>
                              </div>
                            </div>
                          )}

                          <div className="pt-3 grid grid-cols-2 gap-1.5">
                            <button
                              onClick={() => { playSubtleChirp(700, 'sine', 0.08); setExpandedProduct(expanded ? null : product.id); }}
                              className="px-2 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wide flex items-center justify-center gap-1 transition active:scale-95 border bg-black/50 border-white/10 text-gray-200 hover:border-cyan-400/40"
                            >
                              <Info className="w-3 h-3" /> {expanded ? 'Masquer' : 'Specs'}
                            </button>
                            <button
                              onClick={() => previewProduct(product.id)}
                              className="px-2 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wide flex items-center justify-center gap-1 transition active:scale-95 border text-cyan-200"
                              style={{ backgroundColor: `${ACTS[1].color}1f`, borderColor: `${ACTS[1].color}55` }}
                              title="Aperçu AR : applique l'optique du produit au monde 3D"
                            >
                              <Eye className="w-3 h-3" /> Aperçu
                            </button>
                            <button
                              onClick={() => toggleCart(product.id)}
                              className={`col-span-2 px-2 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wide flex items-center justify-center gap-1 transition active:scale-95 border ${inCart ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-black/50 border-white/10 text-white hover:border-cyan-400/40'}`}
                            >
                              {inCart ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                              {inCart ? 'Dans le panier' : 'Ajouter au panier'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Panier / Caisse */}
                <div className="lg:col-span-4 bg-black/65 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between font-mono text-[10.5px]">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] border-b border-white/10 pb-1.5 text-gray-400 font-bold">
                      <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" style={{ color: ACTS[1].color }} /> PANIER</span>
                      <span style={{ color: ACTS[1].color }}>{cart.length} art.</span>
                    </div>
                    <div className="space-y-2 min-h-[90px]">
                      {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500 gap-1">
                          <Package className="w-6 h-6 text-gray-600" />
                          <span>Panier vide</span>
                        </div>
                      ) : (
                        cart.map((id) => {
                          const item = PRODUCTS.find((p) => p.id === id);
                          if (!item) return null;
                          const ItemIcon = item.icon;
                          return (
                            <div key={id} className="flex items-center justify-between border-b border-white/5 py-1 text-[9.5px]">
                              <span className="flex items-center gap-1.5 text-white"><ItemIcon className="w-3.5 h-3.5" style={{ color: ACTS[1].color }} />{item.name}</span>
                              <span className="flex items-center gap-1.5">
                                <span className="text-gray-300 font-bold">{item.price} €</span>
                                <button onClick={() => toggleCart(id)} className="text-red-400 hover:text-red-300 px-1">×</button>
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="border-t border-white/15 pt-2 flex justify-between text-[11px] font-bold">
                      <span style={{ color: ACTS[1].color }}>TOTAL</span>
                      <span style={{ color: ACTS[1].color }}>{cartTotal} €</span>
                    </div>
                  </div>
                  <div className="pt-3">
                    {checkoutStep === 'cart' && (
                      <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full px-3 py-2.5 rounded-lg text-white font-bold text-[9.5px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-40" style={{ background: 'linear-gradient(90deg,#0891b2,#0e7490)' }}>
                        <CreditCard className="w-3.5 h-3.5" /> Valider l’achat
                      </button>
                    )}
                    {checkoutStep === 'purchasing' && (
                      <div className="w-full px-3 py-2.5 rounded-lg border text-[9px] uppercase tracking-wider flex items-center justify-center gap-2" style={{ borderColor: ACTS[1].color, color: ACTS[1].color }}>
                        <span className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: ACTS[1].color, borderTopColor: 'transparent' }} />
                        Traitement…
                      </div>
                    )}
                    {checkoutStep === 'success' && (
                      <div className="w-full p-2 rounded-lg bg-emerald-500/10 border border-emerald-500 text-emerald-300 text-[9px] uppercase tracking-wider space-y-1">
                        <div className="flex items-center justify-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Commande confirmée</div>
                        <button onClick={() => { playSubtleChirp(600, 'sine', 0.1); setCheckoutStep('cart'); }} className="bg-emerald-500 text-black px-2 py-1 text-[8px] font-extrabold uppercase rounded w-full hover:bg-emerald-400 transition">Fermer</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-black/40 border border-white/5 p-2 rounded-xl flex items-center gap-2 text-[9px] font-mono text-gray-400">
                <Info className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACTS[1].color }} />
                Astuce : <span className="text-cyan-300">« Aperçu »</span> applique l’optique du produit directement au monde 3D. Arrêtez-vous sur un objet : il s’aimante et tourne devant vous.
              </div>
            </div>
          </div>
        </div>

        {/* -------- ACTE 02 — CHAMP DE CONNAISSANCE (E-LEARNING) -------- */}
        <div className="absolute w-full max-w-5xl" style={getCardStyle(2)}>
          <ScanReveal active={activeIdx === 2} color={ACTS[2].color} />
          <div className="relative bg-black/82 border border-white/12 rounded-2xl p-5 md:p-6 backdrop-blur-2xl shadow-2xl pointer-events-auto" style={{ boxShadow: `0 0 44px ${ACTS[2].color}22` }}>
            <CornerMarks color={ACTS[2].color} />
            <div className="space-y-4 relative" style={{ transform: 'translateZ(28px)' }}>
              <div className="border-b border-white/10 pb-3">
                <span className="text-[9px] uppercase tracking-[0.3em] font-mono font-bold" style={{ color: ACTS[2].color }}>
                  ACTE 02 // PÔLE ENSEIGNEMENT
                </span>
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 tracking-tight">
                  <GraduationCap className="w-5 h-5" style={{ color: ACTS[2].color }} />
                  Champ de <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-amber-300">Connaissance</span>
                </h2>
                <p className="text-[11px] text-gray-400 mt-1">Des îles de savoir flottent devant la caméra. Ralentissez sur un nœud, puis lancez le module en lecture spatiale.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {COURSES.map((course) => (
                  <div key={course.id} className="relative bg-black/55 border border-white/10 rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-white/25 group overflow-hidden" style={{ boxShadow: `inset 0 0 30px ${course.color}10` }}>
                    {/* nœud-île holographique */}
                    <div className="relative flex items-center justify-center h-16 mb-2">
                      <span className="absolute w-14 h-14 rounded-full border ar-target-pulse" style={{ borderColor: `${course.color}55` }} />
                      <span className="absolute w-20 h-20 rounded-full border border-dashed border-white/10 animate-spin-slow" />
                      <BookOpen className="w-7 h-7 ar-float" style={{ color: course.color }} />
                    </div>
                    <h3 className="text-sm font-bold text-white text-center leading-tight">{course.title}</h3>
                    <p className="text-[10px] text-gray-400 text-center mt-1 leading-snug min-h-[40px]">{course.blurb}</p>
                    <div className="flex justify-center gap-2 my-2 font-mono text-[8.5px]">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">{course.level}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">{course.duration}</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300">{course.modules} mod.</span>
                    </div>
                    <button
                      onClick={() => { playSubtleChirp(880, 'triangle', 0.18); setPlayingCourse(course.id); }}
                      className="mt-1 w-full px-3 py-2 rounded-lg font-bold text-[9.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 border text-white"
                      style={{ backgroundColor: `${course.color}26`, borderColor: `${course.color}66` }}
                    >
                      <Play className="w-3.5 h-3.5" /> Lecture AR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* -------- ACTE 03 — PORTAIL VIRTUEL-RÉEL (CONTACT B2B) -------- */}
        <div className="absolute w-full max-w-3xl flex flex-col items-center text-center" style={getCardStyle(3)}>
          <ScanReveal active={activeIdx === 3} color={ACTS[3].color} />
          <div className="relative bg-black/85 border border-white/12 rounded-2xl p-7 md:p-9 backdrop-blur-2xl shadow-2xl pointer-events-auto w-full" style={{ boxShadow: `0 0 50px ${ACTS[3].color}22` }}>
            <CornerMarks color={ACTS[3].color} />
            <div className="space-y-6 relative" style={{ transform: 'translateZ(28px)' }}>
              {/* Borne / Radar IA */}
              <div className="flex justify-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full border ar-target-pulse" style={{ borderColor: `${ACTS[3].color}66` }} />
                  <span className="absolute w-32 h-32 rounded-full border border-dashed border-white/10 animate-spin-slow" />
                  <Radar className="w-12 h-12 ar-float" style={{ color: ACTS[3].color }} />
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] font-mono font-bold" style={{ color: ACTS[3].color }}>ACTE 03 // PORTAIL VIRTUEL-RÉEL</span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-1 tracking-tight">
                  Prouvons aujourd’hui ce qu’un rendu AR<br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300"> produit chez VOTRE entreprise.</span>
                </h2>
                <p className="text-xs text-gray-300 mt-3 max-w-xl mx-auto leading-relaxed">
                  Vous êtes au bout du parcours. Déverrouillez le scanner pour ouvrir la fenêtre holographique de prise de contact
                  et programmer une démonstration avec notre agence.
                </p>
              </div>

              {!scannerUnlocked ? (
                <button
                  onClick={() => { playSuccessChirp(); setScannerUnlocked(true); }}
                  className="ar-unlock-glow group px-8 py-4 rounded-2xl text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
                  style={{ background: 'linear-gradient(90deg,#0ea5e9,#2563eb)' }}
                >
                  <ScanLine className="w-5 h-5" />
                  Déverrouiller le Scanner
                  <Unlock className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <div className="bg-black/60 border rounded-2xl p-5 text-left" style={{ borderColor: `${ACTS[3].color}44` }}>
                  {contactSent ? (
                    <div className="flex flex-col items-center text-center gap-2 py-4">
                      <ShieldCheck className="w-10 h-10 text-emerald-400" />
                      <p className="text-sm font-bold text-white">Demande transmise, {contact.company || 'partenaire'} !</p>
                      <p className="text-xs text-gray-400 font-mono">Notre agence revient vers vous pour caler la démonstration AR.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACTS[3].color }} />
                        Fenêtre holographique · Prise de contact B2B
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="flex flex-col gap-1 text-[10px] font-mono text-gray-400">
                          <span className="flex items-center gap-1"><Building2 className="w-3 h-3" style={{ color: ACTS[3].color }} /> Entreprise</span>
                          <input required value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} placeholder="Votre société" className="bg-black/60 border border-white/15 focus:border-sky-400 rounded-lg px-3 py-2 text-white text-xs focus:outline-none" />
                        </label>
                        <label className="flex flex-col gap-1 text-[10px] font-mono text-gray-400">
                          <span className="flex items-center gap-1"><Send className="w-3 h-3" style={{ color: ACTS[3].color }} /> Email pro</span>
                          <input required type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="vous@entreprise.com" className="bg-black/60 border border-white/15 focus:border-sky-400 rounded-lg px-3 py-2 text-white text-xs focus:outline-none" />
                        </label>
                      </div>
                      <label className="flex flex-col gap-1 text-[10px] font-mono text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" style={{ color: ACTS[3].color }} /> Créneau de démo souhaité</span>
                        <input value={contact.slot} onChange={(e) => setContact({ ...contact, slot: e.target.value })} placeholder="ex. mardi 14h, semaine prochaine…" className="bg-black/60 border border-white/15 focus:border-sky-400 rounded-lg px-3 py-2 text-white text-xs focus:outline-none" />
                      </label>
                      <button type="submit" className="w-full px-4 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95" style={{ background: 'linear-gradient(90deg,#0ea5e9,#2563eb)' }}>
                        <Calendar className="w-4 h-4" /> Programmer la démonstration
                      </button>
                      <p className="flex items-center justify-center gap-1.5 text-[9px] text-gray-500 font-mono">
                        <MapPin className="w-3 h-3" /> Démo sur site ou en visio · Réponse sous 24 h
                      </p>
                    </form>
                  )}
                </div>
              )}

              <button onClick={() => teleportTo(0)} className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 hover:text-white mx-auto transition-colors">
                <ArrowRight className="w-3 h-3 rotate-180" /> Revenir au départ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===========================================================
          LECTEUR DE COURS FLOTTANT (Cinéma spatial)
          =========================================================== */}
      {playingCourse && (() => {
        const course = COURSES.find((c) => c.id === playingCourse);
        if (!course) return null;
        return (
          <div className="absolute inset-0 z-40 pointer-events-auto flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPlayingCourse(null)} />
            <div className="relative w-full max-w-2xl bg-black/90 border rounded-2xl p-5 shadow-2xl" style={{ borderColor: `${course.color}55`, boxShadow: `0 0 50px ${course.color}33` }}>
              <CornerMarks color={course.color} />
              <button onClick={() => setPlayingCourse(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              <div className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-wider mb-3" style={{ color: course.color }}>
                <GraduationCap className="w-4 h-4" /> Lecture spatiale · {course.level}
              </div>
              {/* écran vidéo simulé */}
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 flex items-center justify-center" style={{ background: `radial-gradient(circle at 50% 40%, ${course.color}22, #05070d)` }}>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
                <button className="relative w-16 h-16 rounded-full flex items-center justify-center border-2 ar-target-pulse" style={{ borderColor: course.color }}>
                  <Play className="w-7 h-7" style={{ color: course.color }} />
                </button>
              </div>
              <h3 className="text-lg font-extrabold text-white mt-3">{course.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{course.blurb}</p>
              <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-[9px] text-gray-300">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-center">{course.modules} modules</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-center">{course.duration}</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-center">Certifiant</span>
              </div>
              <button onClick={() => { playSuccessChirp(); setPlayingCourse(null); }} className="mt-4 w-full px-4 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95" style={{ backgroundColor: `${course.color}33`, border: `1px solid ${course.color}` }}>
                <ArrowRight className="w-4 h-4" /> S’inscrire à ce parcours
              </button>
            </div>
          </div>
        );
      })()}

      {/* ===========================================================
          PIED DE PAGE — indice + mode libre
          =========================================================== */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/75 border border-white/10 backdrop-blur-md rounded-full shadow-xl">
          <MousePointer2 className="w-3.5 h-3.5" style={{ color: theme }} />
          <span className="text-[9px] uppercase tracking-widest text-gray-300 font-mono font-bold">
            {activeIdx === 3 ? 'Fin du parcours · contact B2B' : 'Molette : avancer / reculer · souris : pivoter à 30°'}
          </span>
        </div>
        <button
          onClick={handleFreeFlight}
          title="Détacher des rails et piloter librement (WASD + flèches)"
          className="flex items-center gap-1.5 px-3 py-2 bg-black/75 border border-white/10 hover:border-white/25 backdrop-blur-md rounded-full text-[9px] uppercase tracking-widest text-gray-300 font-mono font-bold transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 rotate-45" style={{ color: theme }} /> Mode libre
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   Sous-composants utilitaires
   ============================================================ */

const CornerMarks: React.FC<{ color: string }> = ({ color }) => (
  <>
    <div className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: color }} />
    <div className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: color }} />
    <div className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: color }} />
    <div className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: color }} />
  </>
);

// Effet "scan laser 3D" : une grille balaye la carte quand on arrive dessus
const ScanReveal: React.FC<{ active: boolean; color: string }> = ({ active, color }) => {
  if (!active) return null;
  return (
    <div key="scan" className="absolute inset-0 z-30 overflow-hidden rounded-2xl pointer-events-none">
      <div
        className="absolute inset-x-0 h-24 ar-scan-sweep"
        style={{
          background: `linear-gradient(to bottom, transparent, ${color}40 45%, ${color} 50%, ${color}40 55%, transparent)`,
          boxShadow: `0 0 24px ${color}aa`,
        }}
      />
    </div>
  );
};
