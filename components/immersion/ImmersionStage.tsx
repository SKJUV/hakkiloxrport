import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface Props {
  originRect: DOMRect | null;
  accent: string;
  borderColor: string;
  radius: number;
  glass: number;
  onClose: () => void;
  children: React.ReactNode;
}

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DURATION = 520;

/** Anime un uniform du shader (plongée caméra). */
function tweenUniform(
  set: (k: string, v: number) => void,
  key: string,
  from: number,
  to: number,
  ms: number,
  rafs: number[],
) {
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
    set(key, from + (to - from) * e);
    if (t < 1) rafs.push(requestAnimationFrame(step));
  };
  rafs.push(requestAnimationFrame(step));
}

export const ImmersionStage: React.FC<Props> = ({ originRect, accent, borderColor, radius, glass, onClose, children }) => {
  const { handleUniformChange } = useAppContext();
  const [visible, setVisible] = useState(false);
  const rafsRef = useRef<number[]>([]);

  // Décalage initial vers le point d'origine du clic (effet "shared element").
  const dx = originRect ? originRect.left + originRect.width / 2 - window.innerWidth / 2 : 0;
  const dy = originRect ? originRect.top + originRect.height / 2 - window.innerHeight / 2 : 0;
  const startScale = originRect ? 0.18 : 0.7;

  const requestClose = useCallback(() => {
    setVisible(false);
    window.setTimeout(onClose, DURATION - 60);
  }, [onClose]);

  // Entrée + plongée caméra + verrouillage du scroll.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));

    const rail = document.getElementById('ar-scroll-rail');
    const prevOverflow = rail?.style.overflow ?? '';
    if (rail) rail.style.overflow = 'hidden';

    tweenUniform(handleUniformChange, 'slider_zoom', 1.2, 1.85, 560, rafsRef.current);
    tweenUniform(handleUniformChange, 'slider_atmosphereDensity', 0.35, 0.18, 560, rafsRef.current);

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') requestClose(); };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      rafsRef.current.forEach(cancelAnimationFrame);
      rafsRef.current = [];
      if (rail) rail.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      // Restaure la caméra en douceur.
      tweenUniform(handleUniformChange, 'slider_zoom', 1.85, 1.2, 360, []);
      tweenUniform(handleUniformChange, 'slider_atmosphereDensity', 0.18, 0.35, 360, []);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blur = Math.round(glass * 26);

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-3 md:p-8">
      {/* décor estompé */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${accent}14, rgba(6,8,12,0.62))`,
          backdropFilter: `blur(${visible ? 6 : 0}px)`,
          WebkitBackdropFilter: `blur(${visible ? 6 : 0}px)`,
          opacity: visible ? 1 : 0,
          transition: `opacity ${DURATION}ms ${EASE}, backdrop-filter ${DURATION}ms ${EASE}`,
        }}
        onClick={requestClose}
      />
      {/* panneau immersif */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-none"
        style={{
          background: 'rgba(13,17,25,0.9)',
          border: `1px solid ${borderColor}`,
          borderRadius: radius,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          boxShadow: `0 30px 90px rgba(0,0,0,0.5), 0 0 60px ${accent}22`,
          transformOrigin: 'center center',
          transform: visible ? 'translate(0px,0px) scale(1)' : `translate(${dx}px, ${dy}px) scale(${startScale})`,
          opacity: visible ? 1 : 0,
          transition: `transform ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}`,
        }}
      >
        <button
          onClick={requestClose}
          aria-label="Fermer l'immersion"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
};
