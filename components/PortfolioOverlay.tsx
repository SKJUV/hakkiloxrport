import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Cpu, 
  Volume2, 
  LayoutGrid, 
  Navigation, 
  Mail, 
  Sparkles,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Crosshair,
  Layers,
  Activity,
  Maximize2,
  ShoppingCart,
  Eye,
  Fingerprint,
  Terminal,
  CreditCard,
  Package,
  Info,
  Search,
  X
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// High-fidelity standard custom retro synthesizer chirps using standard Web Audio
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
    console.warn("Audio Context init disabled or blocked", error);
  }
};

// Play a beautiful successful checkout sound sweep
const playSuccessChirp = () => {
  playSubtleChirp(440, 'sine', 0.15);
  setTimeout(() => playSubtleChirp(660, 'sine', 0.15), 100);
  setTimeout(() => playSubtleChirp(880, 'sine', 0.25), 200);
};

export const PortfolioOverlay: React.FC = () => {
  const { 
    portfolioScroll, 
    devMode, 
    setDevMode, 
    soundConfig, 
    handleSoundConfigChange,
    setIsControlsOpen,
    uniforms,
    handleUniformChange,
    handleUniformsCommit
  } = useAppContext();

  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [activePreset, setActivePreset] = useState<string>('gorge');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'purchasing' | 'success'>('cart');
  const [cart, setCart] = useState<string[]>(['vr_glasses']); // Starts with one headset
  const [hudTime, setHudTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Update HUD Clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHudTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track cursor movement for high-fidelity 3D spatial tilt (Parallax HUD)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (devMode) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    playSubtleChirp(900, 'triangle', 0.2);
    setEmailSubscribed(true);
    setEmailInput('');
  };

  const handleFreeFlightToggle = () => {
    playSubtleChirp(600, 'sawtooth', 0.35);
    if (!soundConfig.enabled) {
      handleSoundConfigChange('enabled', true);
      handleSoundConfigChange('masterVolume', 0.5);
    }
    setDevMode(true);
  };

  // High-performance live remodeler presets (Updates GLSL matrices in real-time)
  const presets = [
    { id: 'gorge', name: 'Matrix Gorge', scale: 0.37, rotation: 1.09, desc: 'Classic vertical modular skyscrapers' },
    { id: 'hex', name: 'Hyper Hexagonal', scale: 0.45, rotation: 1.45, desc: 'Massive dense honeycomb structures' },
    { id: 'towers', name: 'Cyber Towers', scale: 0.31, rotation: 0.82, desc: 'Futuristic slim chamfer core blocks' },
    { id: 'nanosynth', name: 'Nano Grid', scale: 0.26, rotation: 0.65, desc: 'Highly detailed crystalline network' }
  ];

  const applyPreset = (presetId: string, scale: number, rotation: number) => {
    playSubtleChirp(700, 'sine', 0.1);
    setActivePreset(presetId);
    handleUniformChange('slider_fractalScale', scale);
    handleUniformChange('slider_fractalRotation', rotation);
    if (handleUniformsCommit) {
      handleUniformsCommit();
    }
  };

  // PRODUCTS LIST FOR THE VR MARKETPLACE
  const vrProducts = [
    {
      id: 'vr_glasses',
      name: 'Aetheris Vision Pro-X',
      tagline: 'Optic Core Waveguide Glasses',
      description: 'Injects procedural math streams directly onto your retina. Powered by self-compiling WebGL pipelines with zero lag.',
      price: 1250,
      badge: 'FLAGSHIP',
      icon: Eye,
      stats: [
        { label: 'Latency', value: '0.00ms', color: 'text-emerald-400' },
        { label: 'Optics', value: '16K Wave', color: 'text-purple-400' }
      ],
      effectLabel: 'TELEPHOTO ZOOM',
      effect: () => {
        handleUniformChange('slider_zoom', 1.85);
        handleUniformChange('slider_atmosphereDensity', 4.5);
        handleUniformChange('slider_colorEffectStrength', 0.8);
        if (handleUniformsCommit) handleUniformsCommit();
      }
    },
    {
      id: 'neuro_link',
      name: 'Neural Matrix Portal BCI',
      tagline: 'Synaptic Cortex Streamer',
      description: 'Brain-Computer Interface streaming highly detailed fractal grids to cognitive layers. Bypasses eyeball architecture.',
      price: 1890,
      badge: 'NEURAL',
      icon: Fingerprint,
      stats: [
        { label: 'Coupled', value: '98.4%', color: 'text-pink-400' },
        { label: 'Sync Rate', value: '5.2 Tb/s', color: 'text-blue-400' }
      ],
      effectLabel: 'HEX CELL SYMMETRY',
      effect: () => {
        handleUniformChange('slider_fractalScale', 0.48);
        handleUniformChange('slider_fractalRotation', 1.45);
        if (handleUniformsCommit) handleUniformsCommit();
      }
    },
    {
      id: 'haptic_gloves',
      name: 'Omni-Tactile Haptic Suit',
      tagline: 'Piezoelectric Waveform Mesh',
      description: 'Physical friction feedback from non-existent polygons. Features micro-actuators responding to voxel limits.',
      price: 750,
      badge: 'FLOCKED',
      icon: Layers,
      stats: [
        { label: 'Feedback', value: 'Bi-Dir', color: 'text-orange-400' },
        { label: 'Actuators', value: '384 nodes', color: 'text-teal-400' }
      ],
      effectLabel: 'FRACTAL PULSE FORCE',
      effect: () => {
        handleUniformChange('slider_fractalPulseStrength', 0.35);
        if (handleUniformsCommit) handleUniformsCommit();
      }
    }
  ];

  const filteredProducts = vrProducts.filter(product => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      product.name.toLowerCase().includes(q) ||
      product.tagline.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.badge.toLowerCase().includes(q)
    );
  });

  const toggleCart = (id: string) => {
    playSubtleChirp(680, 'sine', 0.1);
    if (cart.includes(id)) {
      setCart(cart.filter(item => item !== id));
    } else {
      setCart([...cart, id]);
    }
  };

  const equipProductPreview = (id: string) => {
    // Play sound and trigger beautiful active world transformation based on selected device
    const product = vrProducts.find(p => p.id === id);
    if (product) {
      playSubtleChirp(1100, 'triangle', 0.25);
      product.effect();
    }
  };

  const handleCheckoutPurchase = () => {
    setCheckoutStep('purchasing');
    playSubtleChirp(350, 'sawtooth', 0.4);
    setTimeout(() => {
      setCheckoutStep('success');
      playSuccessChirp();
    }, 1800);
  };

  const getActiveSection = () => {
    if (portfolioScroll < 0.20) return 0;
    if (portfolioScroll < 0.45) return 1;
    if (portfolioScroll < 0.68) return 2;
    if (portfolioScroll < 0.88) return 3;
    return 4;
  };

  const activeSectionIdx = getActiveSection();

  const getSectionOpacity = (start: number, peakStart: number, peakEnd: number, end: number) => {
    const s = portfolioScroll;
    if (s < start || s > end) return 0;
    if (s >= peakStart && s <= peakEnd) return 1;
    if (s < peakStart) {
      return (s - start) / (peakStart - start);
    } else {
      return 1.0 - (s - peakEnd) / (end - peakEnd);
    }
  };

  // Compute 3D Card Tilt style based on cursor coordinates for the immersive "in the 3D world" depth
  const getCardStyle = (sectionIdx: number) => {
    const tiltX = -mousePos.y * 11; 
    const tiltY = mousePos.x * 12;  
    const activeScrollDelta = (portfolioScroll - (sectionIdx * 0.23));
    
    return {
      transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px) translateY(${-activeScrollDelta * 90}px)`,
      transformStyle: 'preserve-3d' as const,
      transition: 'transform 0.18s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease-out',
      opacity: activeSectionIdx === sectionIdx ? getSectionOpacity(sectionIdx * 0.2 - 0.12, sectionIdx * 0.2, sectionIdx * 0.2 + 0.10, sectionIdx * 0.2 + 0.24) : 0,
      pointerEvents: activeSectionIdx === sectionIdx ? ('auto' as const) : ('none' as const),
    };
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden select-none font-sans">
      
      {/* Immersive Holographic HUD Scanlines / Dark vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(11,15,25,0.72)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />

      {/* FLOAT SCENERY LOCATOR LABELS (GEOMETRIC PARALLAX PINS EMBEDDED DIRECTLY IN FLUID HORIZON) */}
      <div className="absolute inset-0 overflow-hidden font-mono text-[9px]">
        {/* PARALLAX PIN 1 */}
        <div 
          className="absolute hidden md:block transition-all duration-300 pointer-events-auto cursor-help"
          style={{
            top: `${30 + (portfolioScroll * -32)}%`,
            left: `${68 + (portfolioScroll * -4)}%`,
            opacity: portfolioScroll < 0.4 ? 1.0 - portfolioScroll * 2.8 : 0,
            transform: `perspective(800px) rotateY(${mousePos.x * 18}deg) translateZ(60px)`
          }}
        >
          <div className="flex items-center gap-2 bg-black/80 border border-[#a855f7]/45 text-[#a855f7] px-3 py-2 rounded-lg backdrop-blur-md shadow-lg shadow-[#a855f7]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-ping" />
            <div className="flex flex-col">
              <span className="font-bold tracking-widest text-[9.5px]">SECTOR_01 // APEX CORE</span>
              <span className="text-gray-400 font-medium text-[8px] mt-[1.5px] uppercase">ALT: {(-1.49 - portfolioScroll * 0.8).toFixed(2)}m</span>
              <span className="text-gray-500 text-[7px] mt-[1px]">SYSTEM COMPILING ACTIVE</span>
            </div>
            <div className="border-l border-white/10 pl-2 ml-1 text-gray-400 font-bold">
              [ONLINE]
            </div>
          </div>
          <svg className="w-16 h-8 text-[#a855f7]/40 -mt-1 ml-4" fill="none" viewBox="0 0 64 32">
            <path d="M0 0 L16 16 L48 16" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="48" cy="16" r="2.5" fill="currentColor" />
          </svg>
        </div>

        {/* PARALLAX PIN 2 */}
        <div 
          className="absolute hidden md:block transition-all duration-300 pointer-events-auto cursor-help"
          style={{
            top: `${54 + (portfolioScroll * -36)}%`,
            left: `${12 + (portfolioScroll * 10)}%`,
            opacity: portfolioScroll > 0.25 && portfolioScroll < 0.7 ? 1.0 : 0,
            transform: `perspective(800px) rotateY(${mousePos.x * 22}deg) translateZ(40px)`
          }}
        >
          <div className="flex items-center gap-2 bg-black/80 border border-[#3b82f6]/45 text-[#3b82f6] px-3 py-2 rounded-lg backdrop-blur-md shadow-lg shadow-[#3b82f6]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-ping" />
            <div className="flex flex-col">
              <span className="font-bold tracking-widest text-[9.5px]">SECTOR_02 // AUDIO RESONANCE</span>
              <span className="text-gray-400 font-medium text-[8px] mt-[1.5px] uppercase">FRQ: 65.40 Hz // SYNCS</span>
              <span className="text-gray-500 text-[7px] mt-[1px]">AMPLITUDE STABILIZED</span>
            </div>
            <div className="border-l border-white/10 pl-2 ml-1 text-emerald-400">
              [LOCKED]
            </div>
          </div>
          <svg className="w-16 h-8 text-[#3b82f6]/40 -mt-1 ml-4" fill="none" viewBox="0 0 64 32">
            <path d="M0 0 L16 16 L48 16" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="48" cy="16" r="2.5" fill="currentColor" />
          </svg>
        </div>

        {/* PARALLAX PIN 3 */}
        <div 
          className="absolute hidden md:block transition-all duration-300 pointer-events-auto cursor-help"
          style={{
            top: `${44 + (portfolioScroll * -23)}%`,
            left: `${73 + (portfolioScroll * -6)}%`,
            opacity: portfolioScroll > 0.6 ? 1.0 : 0,
            transform: `perspective(800px) rotateY(${mousePos.x * 19}deg) translateZ(70px)`
          }}
        >
          <div className="flex items-center gap-2 bg-black/80 border border-pink-500/45 text-pink-400 px-3 py-2 rounded-lg backdrop-blur-md shadow-lg shadow-pink-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
            <div className="flex flex-col">
              <span className="font-bold tracking-widest text-[9.5px]">TERMINUS // VR HUD LEDGER</span>
              <span className="text-gray-400 font-medium text-[8px] mt-[1.5px] uppercase">COGNITIVE CHANNEL</span>
              <span className="text-gray-500 text-[7px] mt-[1px]">MARKET CONNECT ACTIVE</span>
            </div>
            <div className="border-l border-white/10 pl-2 ml-1 text-pink-400">
              [STORE]
            </div>
          </div>
          <svg className="w-16 h-8 text-pink-500/40 -mt-1 ml-4" fill="none" viewBox="0 0 64 32">
            <path d="M0 0 L16 16 L48 16" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="48" cy="16" r="2.5" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* DYNAMIC SCENERY PERSPECTIVE CROSSHAIR HUD IN CENTRAL DEPTH (PRODUCING PARALLAX EMBEDDINGS) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointers-events-none hidden md:flex flex-col items-center justify-center transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(-50%, -50%, 0) perspective(1200px) rotateX(${-mousePos.y * 13}deg) rotateY(${mousePos.x * 17}deg)`
        }}
      >
        <div className="relative w-52 h-52 border border-white/5 rounded-full flex items-center justify-center">
          {/* Outer Rotating Reticle */}
          <div className="absolute inset-0 border border-t-[#a855f7]/35 border-b-[#3b82f6]/35 border-l-transparent border-r-transparent rounded-full animate-spin-slow" />
          <div className="absolute w-48 h-48 border border-dashed border-white/10 rounded-full" />
          
          {/* Inner Lock Target Ticks */}
          <Crosshair className="w-8 h-8 text-white/25 animate-pulse" />
          <div className="absolute top-14 left-14 text-[7px] font-mono text-gray-500 tracking-widest uppercase">
            [AETHERIS_SYS]
          </div>
          
          {/* Live dynamic flight telemetry panels */}
          <div className="absolute -right-32 top-6 flex flex-col font-mono text-[8px] text-gray-400 bg-black/70 border border-white/10 p-2.5 rounded-lg backdrop-blur-md gap-[2px] shadow-2xl">
            <span className="text-white font-mono flex items-center gap-1.5 border-b border-white/10 pb-1 mb-1 font-bold tracking-wider">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              FLIGHT_REACTIVE
            </span>
            <span>VELOCITY: <span className="text-white font-bold">{(portfolioScroll > 0 ? (120 + Math.sin(portfolioScroll*40)*25) : 0).toFixed(0)} km/h</span></span>
            <span>ALTITUDE: <span className="text-white font-bold">{(-1.49 - portfolioScroll * 0.8).toFixed(2)}m</span></span>
            <span>PITCH: <span className="text-[#a855f7] font-bold">{(mousePos.y * -10).toFixed(2)}°</span></span>
            <span>YAW: <span className="text-blue-400 font-bold">{(mousePos.x * 10).toFixed(2)}°</span></span>
          </div>

          <div className="absolute -left-32 bottom-6 flex flex-col font-mono text-[8px] text-gray-400 bg-black/70 border border-white/10 p-2.5 rounded-lg backdrop-blur-md gap-[2px] shadow-2xl">
            <span className="text-white font-mono flex items-center gap-1.5 border-b border-white/10 pb-1 mb-1 font-bold tracking-wider">
              <Layers className="w-3.5 h-3.5 text-pink-400" />
              COGNITIVE_GRID
            </span>
            <span>CORE PRESET: <span className="text-white uppercase font-bold">{activePreset}</span></span>
            <span>F-SCALE: <span className="text-[#a855f7] font-bold">{(uniforms['slider_fractalScale'] ?? 0.37).toFixed(3)}</span></span>
            <span>F-ROT: <span className="text-blue-400 font-bold">{(uniforms['slider_fractalRotation'] ?? 1.09).toFixed(3)}</span></span>
            <span>CART QTY: <span className="text-emerald-400 font-bold">{cart.length} items</span></span>
          </div>
        </div>
      </div>

      {/* Floating Status Bar - Top HUD bar */}
      <div className="absolute top-4 left-24 md:left-28 z-30 pointer-events-auto flex items-center gap-3">
        <div className="bg-black/70 border border-white/15 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#a855f7] font-mono shadow-lg shadow-black/40">
          <span className="w-1.5 h-1.5 bg-[#a855f7] rounded-full animate-ping" />
          AETHERIS COGNITIVE GRID // AR MODULES
        </div>
        <div className="bg-black/50 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full font-mono text-[9px] text-gray-300 tracking-wider flex items-center gap-1.5">
          <Terminal className="w-3 h-3 text-pink-400" />
          {hudTime || 'SYNCING...'}
        </div>
      </div>

      {/* PROGRESS SCROLLER TRACK BAR */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 pointer-events-auto">
        <div className="h-44 w-[2px] bg-white/10 relative rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#a855f7] via-pink-500 to-[#3b82f6] transition-all duration-75"
            style={{ height: `${portfolioScroll * 100}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-gray-400 font-bold tracking-widest rotate-90 origin-center mt-4">
          {(portfolioScroll * 100).toFixed(0)}% SINK
        </span>
      </div>

      {/* CORE NARRATIVE LAYERS - 3D PERSPECTIVE MATRIX EMBEDDED IN WORLD */}
      <div className="absolute inset-0 flex items-center justify-start px-4 md:px-20 max-w-7xl pointer-events-none md:overflow-visible">
        
        {/* =======================================
            SECTION 0: THE DEPARTURE (HERO SPLASH)
            ======================================= */}
        <div 
          className="absolute max-w-xl md:max-w-2xl"
          style={getCardStyle(0)}
        >
          {/* Aesthetic geometric corners to convey "in the 3D world" spatial terminal */}
          <div className="relative bg-black/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col hover:border-[#a855f7]/40 transition-all duration-300 text-left pointer-events-auto">
            {/* Holographic Target Ticks */}
            <div className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 border-[#a855f7] rounded-tl-lg" />
            <div className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-2 border-r-2 border-[#a855f7] rounded-tr-lg" />
            <div className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-2 border-l-2 border-[#a855f7] rounded-bl-lg" />
            <div className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-2 border-r-2 border-[#a855f7] rounded-br-lg" />
            
            {/* Grid background flare */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] rounded-2xl pointer-events-none" />

            <div className="space-y-6 relative" style={{ transform: 'translateZ(25px)' }}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] uppercase tracking-[0.3em] text-[#a855f7] font-mono font-semibold">AR HUD CONSOLE // ACT: 01</span>
                  <span className="h-[1px] w-12 bg-[#a855f7]/50" />
                </div>
                <h1 className="text-3xl md:text-5xl font-sans tracking-tight font-extrabold text-white leading-tight">
                  AETHERIS <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500">LABS METROPOLIS.</span>
                </h1>
              </div>
              
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans">
                Welcome to our real-time GPU modular metropolis. 
                mathematically compiled directly on your graphics hardware utilizing zero bulky textures or polygonal files.
                Navigate and customize modules, query the haptic VR matrix storefront, or engage full-steering manual controls.
              </p>

              <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <button 
                  onClick={handleFreeFlightToggle}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-250 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <Navigation className="w-4 h-4 text-white rotate-45" />
                  Launch Free Flight
                </button>
                
                <div className="hidden md:flex items-center gap-2 text-[10px] text-gray-400 font-mono pl-3">
                  <Compass className="w-4 h-4 text-pink-400 animate-spin-slow" />
                  Scroll down to descend into the city cores
                </div>
              </div>

              <div className="pt-1 flex items-center gap-2.5 text-gray-400 text-xs font-mono animate-bounce">
                <ChevronDown className="w-4 h-4 text-[#a855f7]" />
                <span>Swipe down to sink into the 3D world</span>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            SECTION 1: THE CORE MATRIX (RAYMARCHER ENGINE & LIVE GEOMETRY REMODELER)
            ======================================= */}
        <div 
          className="absolute max-w-xl md:max-w-2xl"
          style={getCardStyle(1)}
        >
          <div className="relative bg-black/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col hover:border-[#3b82f6]/40 transition-all duration-300 text-left pointer-events-auto">
            {/* High Tech Framing Corner Marks */}
            <div className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 border-[#3b82f6] rounded-tl-lg" />
            <div className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-2 border-r-2 border-[#3b82f6] rounded-tr-lg" />
            <div className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-2 border-l-2 border-[#3b82f6] rounded-bl-lg" />
            <div className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-2 border-r-2 border-[#3b82f6] rounded-br-lg" />

            <div className="space-y-6 relative" style={{ transform: 'translateZ(25px)' }}>
              <div className="space-y-2">
                <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#3b82f6] font-mono block font-bold">LIVE SHADER ENGINE // GEOMETRY DATA</span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  LIVE COMPILATION & <span className="text-[#3b82f6]">METROPOLIS RE-SHAPING</span>
                </h2>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Polygons are obsolete. Customize layout mathematics at a hardware level. 
                Trigger code changes to instantly reorganize the 3D city density, height structures, and symmetries:
              </p>

              {/* LIVE PRESENTS PANEL - THE REAL INTERACTION CORES */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2.5 font-sans">
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1 border-b border-white/5 pb-1">
                  <span className="flex items-center gap-1.5 text-[#3b82f6] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    GPU CODES METEOROLOGY PRESETS
                  </span>
                  <span className="text-gray-500">[INTERACTIVE CORE]</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset.id, preset.scale, preset.rotation)}
                      className={`px-3 py-2 rounded-lg font-sans text-xs font-semibold flex flex-col items-start transition-all border ${
                        activePreset === preset.id 
                          ? 'bg-[#3b82f6]/25 border-[#3b82f6] text-white shadow-[#3b82f6]/10 shadow-md' 
                          : 'bg-black/55 border-white/10 text-gray-300 hover:border-white/20 hover:bg-black/75'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${activePreset === preset.id ? 'bg-[#3b82f6] animate-pulse' : 'bg-gray-600'}`} />
                        {preset.name}
                      </div>
                      <span className="text-[9px] text-gray-400 font-normal mt-[3px] text-left leading-tight">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Performance Stats Overlay cards */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-black/55 border border-white/5 rounded-xl p-3 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[#3b82f6] mb-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-gray-300">GPU RENDER TIME</span>
                  </div>
                  <div className="text-base font-mono font-bold text-white">0.32 ms</div>
                  <p className="text-[9px] text-gray-400">Raymarch loop frame budget</p>
                </div>

                <div className="bg-black/55 border border-white/5 rounded-xl p-3 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[#a855f7] mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-mono tracking-wider uppercase font-bold text-gray-300">SHADER COMPILE</span>
                  </div>
                  <div className="text-base font-mono font-bold text-white">42.8 KB</div>
                  <p className="text-[9px] text-gray-400">Total code payloads running</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            SECTION 2: HARMONICS AND VOICE (AUDIO)
            ======================================= */}
        <div 
          className="absolute max-w-xl md:max-w-2xl"
          style={getCardStyle(2)}
        >
          <div className="relative bg-black/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col hover:border-emerald-500/40 transition-all duration-300 text-left pointer-events-auto">
            {/* Framing Corner Marks */}
            <div className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 border-[#10b981] rounded-tl-lg" />
            <div className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-2 border-r-2 border-[#10b981] rounded-tr-lg" />
            <div className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-2 border-l-2 border-[#10b981] rounded-bl-lg" />
            <div className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-2 border-r-2 border-[#10b981] rounded-br-lg" />

            <div className="space-y-6 relative" style={{ transform: 'translateZ(25px)' }}>
              <div className="space-y-2">
                <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#10b981] font-mono block font-bold">HARMONIC RE-ACTOR // SPECTRUM DATA</span>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  DYNAMIC <span className="text-emerald-400">SYNTHESIZER HARMONICS</span>
                </h2>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Audio frequencies synchronize mathematically in real-time. Pitch sweeps, resonant lowpass bounds, and speed triggers adapt dynamically as you fly or scroll through coordinates.
              </p>

              {/* Audio Signal Flow visualization */}
              <div className="bg-black/60 border border-white/10 p-4 rounded-xl w-full backdrop-blur-md space-y-3 font-mono">
                <div className="flex justify-between items-center text-[10px] text-gray-400 border-b border-white/10 pb-2">
                  <span className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    RESONATOR WAVEFORMS
                  </span>
                  <span className="text-emerald-400 font-semibold animate-pulse">● SIGNAL CONNECTED</span>
                </div>
                
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Drone Foundation Resonance:</span>
                    <span className="text-white font-semibold">C2 Major Harmonic // 65.4 Hz</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="w-[85%] bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full animate-pulse" />
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-400">LFO Generative Speed:</span>
                    <span className="text-white font-semibold">BPM proportional to descending speed</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${Math.max(20, Math.min(100, portfolioScroll * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            SECTION 3: VR PRODUCTS & MATRIX NEON MARKETPLACE (THE REQUESTED FEATURE)
            ======================================= */}
        <div 
          className="absolute max-w-4xl w-full px-2 md:px-0"
          style={getCardStyle(3)}
        >
          <div className="relative bg-black/85 border border-white/15 rounded-2xl p-5 md:p-6 backdrop-blur-2xl shadow-3xl flex flex-col hover:border-pink-500/40 transition-all duration-300 text-left pointer-events-auto w-full">
            
            {/* Holographic glowing pink border corner markings */}
            <div className="absolute -top-[1.5px] -left-[1.5px] w-6 h-6 border-t-[2.5px] border-l-[2.5px] border-pink-500 rounded-tl-lg shadow-[0_0_12px_rgba(236,72,153,0.4)]" />
            <div className="absolute -top-[1.5px] -right-[1.5px] w-6 h-6 border-t-[2.5px] border-r-[2.5px] border-pink-500 rounded-tr-lg shadow-[0_0_12px_rgba(236,72,153,0.4)]" />
            <div className="absolute -bottom-[1.5px] -left-[1.5px] w-6 h-6 border-b-[2.5px] border-l-[2.5px] border-pink-500 rounded-bl-lg shadow-[0_0_12px_rgba(236,72,153,0.4)]" />
            <div className="absolute -bottom-[1.5px] -right-[1.5px] w-6 h-6 border-b-[2.5px] border-r-[2.5px] border-pink-500 rounded-br-lg shadow-[0_0_12px_rgba(236,72,153,0.4)]" />

            {/* Inner technological mesh lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(244,63,94,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(244,63,94,0.015)_1px,transparent_1px)] bg-[size:15px_15px] rounded-2xl pointer-events-none" />

            <div className="space-y-4 relative w-full" style={{ transform: 'translateZ(30px)' }}>
              
              {/* Header Title Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-[0.35em] text-pink-500 font-mono font-bold">COGNITIVE LOGS MODULE</span>
                    <span className="bg-pink-500/10 text-pink-400 font-mono text-[8px] px-1.5 py-0.5 rounded border border-pink-500/20 uppercase font-black">VR STORESECURE CONNECTED</span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-pink-500 animate-pulse" />
                    AETHERIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">VR SOLUTIONS MARKETPLACE</span>
                  </h2>
                </div>
                
                {/* HUD info metrics */}
                <div className="flex items-center gap-3 font-mono text-[9px] text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    SYS_NODE: SECURE
                  </span>
                  <span className="text-white">BALANCE: <span className="text-pink-400 font-bold">5,000 AET</span></span>
                </div>
              </div>

              {/* Dynamic VR Marketplace Search HUD */}
              <div className="relative w-full bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-md">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-pink-400" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      playSubtleChirp(800 + Math.random() * 200, 'sine', 0.04);
                    }}
                    placeholder="QUERY CORE ARCHITECTURE BY COGNITIVE KEYWORD (glasses, neural, suit)..."
                    className="w-full bg-black/60 border border-white/10 focus:border-pink-500 text-white placeholder-gray-500 text-xs rounded-lg py-1.5 pl-9 pr-8 focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all font-mono tracking-wider uppercase"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        playSubtleChirp(500, 'sine', 0.1);
                      }}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-pink-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2.5 font-mono text-[10px] text-gray-400 whitespace-nowrap">
                  <span>FILES MATCHED:</span>
                  <span className="bg-pink-500/15 text-pink-400 border border-pink-500/35 px-2.5 py-1 rounded font-bold">
                    {filteredProducts.length} / {vrProducts.length} SYSTEM RECORDS
                  </span>
                </div>
              </div>

              {/* Main Layout: Products on Left, Interactive Shopping Cart on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* PRODUCTS LIST GRID (8 COLS) */}
                <div className="lg:col-span-8 space-y-2.5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {filteredProducts.length === 0 ? (
                      <div className="md:col-span-3 flex flex-col items-center justify-center p-8 bg-black/40 border border-dashed border-white/10 rounded-xl text-center text-gray-400 font-mono space-y-3">
                        <div className="p-3 bg-pink-500/10 rounded-full border border-pink-500/20">
                          <Search className="w-5 h-5 text-pink-400 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white uppercase tracking-wider">No modules match search criteria</p>
                          <p className="text-[10px] text-gray-500 max-w-md">No matching system files active. Refine your query or reset below.</p>
                        </div>
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            playSubtleChirp(600, 'sine', 0.1);
                          }}
                          className="px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500 text-pink-400 font-black text-[9px] uppercase tracking-wider rounded-lg transition active:scale-95 cursor-pointer"
                        >
                          Clear Search Query
                        </button>
                      </div>
                    ) : (
                      filteredProducts.map(product => {
                        const IconComponent = product.icon;
                        const isInCart = cart.includes(product.id);
                        return (
                          <div
                            key={product.id}
                            className="relative bg-black/60 border border-white/10 hover:border-pink-500/40 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5 group"
                            style={{ transformStyle: 'preserve-3d font-sans' }}
                          >
                            <div className="space-y-2">
                              {/* Product Badge & Price Header */}
                              <div className="flex justify-between items-center">
                                <span className="bg-pink-500/10 text-pink-400 border border-pink-500/30 text-[8px] tracking-wider font-bold uppercase rounded px-1.5 py-0.5 font-mono">
                                  {product.badge}
                                </span>
                                <span className="text-white font-mono text-xs font-black tracking-wide text-pink-400">
                                  {product.price} <span className="text-[8px] text-gray-400">AET</span>
                                </span>
                              </div>

                              {/* Product Name */}
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <IconComponent className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
                                  <h3 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors uppercase font-mono tracking-wide">{product.name}</h3>
                                </div>
                                <span className="text-[8px] text-gray-400 font-mono tracking-wide italic block mt-0.5 leading-none">{product.tagline}</span>
                              </div>

                              <p className="text-[10px] text-gray-300 leading-normal font-sans tracking-wide min-h-[44px]">
                                {product.description}
                              </p>

                              {/* Product Specifications Badge Panel */}
                              <div className="grid grid-cols-2 gap-1.5 bg-white/5 border border-white/5 p-1.5 rounded-lg font-mono text-[9px]">
                                {product.stats.map((stat, sIdx) => (
                                  <div key={sIdx} className="flex flex-col">
                                    <span className="text-gray-500 text-[7px] uppercase font-black">{stat.label}:</span>
                                    <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Controls for this product */}
                            <div className="pt-3 gap-1.5 grid grid-cols-2" style={{ transform: 'translateZ(10px)' }}>
                              <button
                                onClick={() => equipProductPreview(product.id)}
                                className="px-2 py-1.5 bg-[#a855f7]/20 hover:bg-[#a855f7]/30 border border-[#a855f7]/40 text-[#b36af8] font-bold text-[9px] uppercase tracking-wide rounded-lg flex items-center justify-center gap-1 transition active:scale-95"
                                title="Engage live preview parameters directly onto the 3D rendering pipeline"
                              >
                                <Eye className="w-3 h-3 text-[#a855f7]" />
                                EQUIP SYS
                              </button>
                              
                              <button
                                onClick={() => toggleCart(product.id)}
                                className={`px-2 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wide flex items-center justify-center gap-1 transition active:scale-95 border ${
                                  isInCart 
                                    ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                                    : 'bg-black/60 border-white/10 hover:border-pink-500/30 text-white'
                                }`}
                              >
                                <ShoppingCart className="w-3 h-3" />
                                {isInCart ? 'REMOVE' : 'ADD CART'}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Informational Advisory Note */}
                  <div className="bg-black/45 border border-white/5 p-2 rounded-xl flex items-center gap-2 text-[9px] font-mono text-gray-400">
                    <Info className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                    <span>
                      * TIP: Click <span className="text-[#a855f7] font-semibold">"EQUIP SYS"</span> to compile the VR module's optics pipeline directly into the 3D simulator! This shifts the camera field-of-view and cyber structures.
                    </span>
                  </div>
                </div>

                {/* THE NEURAL CART TERMINAL (4 COLS) */}
                <div className="lg:col-span-4 bg-black/70 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between font-mono text-[10.5px]">
                  
                  <div className="space-y-3">
                    {/* Simulated terminal bar */}
                    <div className="flex justify-between items-center text-[9px] border-b border-white/10 pb-1.5 text-gray-400 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
                        ORDER_LEDGER.EXE
                      </span>
                      <span className="text-pink-500">REV_04</span>
                    </div>

                    {/* Cart Item Row List / Active Screen */}
                    <div className="space-y-2 min-h-[105px]">
                      {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500 font-mono gap-1">
                          <Package className="w-6 h-6 text-gray-600 border border-dashed border-gray-600/30 rounded p-1" />
                          <span>LEDGER EMPTY</span>
                          <span className="text-[7.5px] uppercase">Awaiting neural requests</span>
                        </div>
                      ) : (
                        cart.map(cartId => {
                          const item = vrProducts.find(p => p.id === cartId);
                          if (!item) return null;
                          return (
                            <div key={cartId} className="flex items-center justify-between border-b border-white/5 py-1 text-[9.5px]">
                              <div className="flex items-center gap-1.5">
                                <item.icon className="w-3.5 h-3.5 text-pink-400" />
                                <div className="flex flex-col">
                                  <span className="text-white font-bold font-mono tracking-wider">{item.name}</span>
                                  <span className="text-[#a855f7] text-[7.5px] uppercase">{item.effectLabel} LOADED</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 ml-2">
                                <span className="font-bold text-gray-300 font-mono">{item.price} AET</span>
                                <button
                                  onClick={() => toggleCart(cartId)}
                                  className="text-red-400 font-bold hover:text-red-300 px-1 border border-transparent hover:border-red-500/20 rounded transition"
                                  title="Remove item"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Mathematical Summary Calculation */}
                    <div className="border-t border-white/15 pt-2 space-y-1 text-[9px]">
                      <div className="flex justify-between text-gray-500">
                        <span>SUB-TOTAL COGNITION:</span>
                        <span className="text-white">{cart.reduce((acc, cId) => acc + (vrProducts.find(p => p.id === cId)?.price || 0), 0)} AET</span>
                      </div>
                      <div className="flex justify-between text-gray-500 border-b border-white/5 pb-1">
                        <span>SYNAPTIC BROKER FEE:</span>
                        <span className="text-emerald-400 font-bold">0.00 AET (0%)</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold text-white pt-1">
                        <span className="text-pink-400 font-bold">GRAND TOTAL LOGS:</span>
                        <span className="text-pink-400 font-black">{cart.reduce((acc, cId) => acc + (vrProducts.find(p => p.id === cId)?.price || 0), 0)} AET</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Stage Interactive Button */}
                  <div className="pt-4">
                    <AnimatePresence mode="wait">
                      {checkoutStep === 'cart' && (
                        <button
                          key="cart"
                          onClick={handleCheckoutPurchase}
                          disabled={cart.length === 0}
                          className="w-full px-3 py-2.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-800 disabled:to-gray-800 disabled:opacity-50 text-white font-bold text-[9.5px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition duration-150 shadow-md shadow-pink-500/20 active:scale-95"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-white" />
                          AUTHORIZE PURCHASE
                        </button>
                      )}

                      {checkoutStep === 'purchasing' && (
                        <div
                          key="purchasing"
                          className="w-full px-3 py-2.5 rounded-lg bg-pink-500/10 border border-pink-500 text-pink-400 font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                          <span className="w-3.5 h-3.5 border-2 border-t-transparent border-pink-500 rounded-full animate-spin" />
                          COMPUTING TRANSACTION HASH...
                        </div>
                      )}

                      {checkoutStep === 'success' && (
                        <div
                          key="success"
                          className="w-full p-2 rounded-lg bg-emerald-500/10 border border-emerald-500 text-emerald-400 font-bold text-[9px] uppercase tracking-wider space-y-1 opacity-100"
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>TRANSACTION AUTHORIZED</span>
                          </div>
                          <p className="text-[7.5px] leading-tight text-gray-300 normal-case font-mono mt-1 text-center font-normal">
                            Cognitive receipt sent to your neural interface registry log. Enjoy custom hardware rendering variables!
                          </p>
                          <button
                            onClick={() => {
                              playSubtleChirp(600, 'sine', 0.1);
                              setCheckoutStep('cart');
                            }}
                            className="bg-emerald-500 text-black px-2 mt-1 py-1 text-[8px] font-extrabold uppercase rounded w-full border border-emerald-400 hover:bg-emerald-400 transition"
                          >
                            Close Receipt
                          </button>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>

        {/* =======================================
            SECTION 4: BREAK THE RAILS (LAUNCH MANUAL CONTROLS)
            ======================================= */}
        <div 
          className="absolute max-w-xl md:max-w-2xl"
          style={getCardStyle(4)}
        >
          <div className="relative bg-black/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl flex flex-col hover:border-[#a855f7]/40 transition-all duration-300 text-left pointer-events-auto">
            {/* Corner Bracket Accents to merge into the spatial world */}
            <div className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 border-[#a855f7] rounded-tl-lg" />
            <div className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-2 border-r-2 border-[#a855f7] rounded-tr-lg" />
            <div className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-2 border-l-2 border-[#a855f7] rounded-bl-lg" />
            <div className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-2 border-r-2 border-[#a855f7] rounded-br-lg" />

            <div className="space-y-6 relative" style={{ transform: 'translateZ(25px)' }}>
              <div className="space-y-2">
                <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#a855f7] font-mono block font-bold">MANUAL STEERING COPT_03 // ACTIVE STATUS</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
                  DETACH <br className="hidden md:block"/>
                  FROM THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">RAILS ENGINE.</span>
                </h2>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                You are now fully aligned with the 3D space. You can scroll back up to remodel modular skyscrapers or ignite manual flying controls beneath to drive the capsule freely!
              </p>

              <div className="pt-2 flex flex-col gap-4 max-w-sm">
                
                {/* Active Flight Launch Card */}
                <div className="bg-gradient-to-r from-purple-950/45 via-blue-900/30 to-black/60 border border-purple-500/35 rounded-2xl p-4 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-pink-300 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                      AETHERIS FLIGHT UNLOCKED
                    </h4>
                    <p className="text-[10px] text-gray-300 font-sans">Decouples navigation locks to enable custom WASD + steering matrices.</p>
                  </div>
                  <button
                    onClick={handleFreeFlightToggle}
                    className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#a855f7] hover:bg-[#b56ef8] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/30 font-sans"
                  >
                    <Navigation className="w-3.5 h-3.5 rotate-45" />
                    Ignite
                  </button>
                </div>

                {/* Newsletter subscribe */}
                <form onSubmit={handleSubscribe} className="space-y-2 font-sans">
                  <div className="flex gap-2 text-left">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      required
                      placeholder="Request matrix registry key..."
                      disabled={emailSubscribed}
                      className="flex-grow bg-black/65 border border-white/15 px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 rounded-xl"
                    />
                    <button
                      type="submit"
                      disabled={emailSubscribed}
                      className="px-4 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {emailSubscribed ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
                      <span>{emailSubscribed ? 'Sent' : 'Submit'}</span>
                    </button>
                  </div>
                  {emailSubscribed && (
                    <p className="text-[10px] text-emerald-400 font-mono">✓ System authorization verified! We will transmit beta coordinates.</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* COMPANION FIXED SCROLL SCROLLBAR ADVISORY */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-2 px-4 py-2 bg-black/80 border border-white/10 backdrop-blur-md rounded-full shadow-xl transition-transform hover:scale-105">
          <div className="w-1.5 h-4 border border-white/30 rounded-full flex justify-center p-[2px]">
            <span className="w-0.5 h-1 bg-white rounded-full animate-bounce" />
          </div>
          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-mono font-bold">
            {activeSectionIdx === 4 ? 'MANUAL NAVIGATION CAPABILITIES LIVE' : 'SWIPE OR SCROLL MOUSE DOWN TO SINK DEEPER'}
          </span>
        </div>
      </div>

    </div>
  );
};
