import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { SiteContent } from '../content/schema';
import { defaultContent } from '../content/seed';
import { getContentStore } from '../content/contentStore';

interface ContentContextValue {
  content: SiteContent;
  loaded: boolean;
  saving: boolean;
  /** Met à jour le contenu via un mutateur immuable ; persiste automatiquement. */
  update: (mutator: (draft: SiteContent) => SiteContent | void) => void;
  /** Remplace tout le contenu. */
  setContent: (next: SiteContent) => void;
  /** Réinitialise aux valeurs par défaut. */
  reset: () => Promise<void>;
}

const ContentCtx = createContext<ContentContextValue | null>(null);

/** Applique les tokens de thème en variables CSS sur :root + met à jour le titre. */
function applyTheme(content: SiteContent) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const c = content.theme.colors;
  root.style.setProperty('--ar-bg', c.background);
  root.style.setProperty('--ar-surface', c.surface);
  root.style.setProperty('--ar-text', c.text);
  root.style.setProperty('--ar-text-muted', c.textMuted);
  root.style.setProperty('--ar-accent', c.accent);
  root.style.setProperty('--ar-accent-soft', c.accentSoft);
  root.style.setProperty('--ar-secondary', c.secondary);
  root.style.setProperty('--ar-tertiary', c.tertiary);
  root.style.setProperty('--ar-success', c.success);
  root.style.setProperty('--ar-danger', c.danger);
  root.style.setProperty('--ar-border', c.border);
  root.style.setProperty('--ar-radius', `${content.theme.radius}px`);
  root.style.setProperty('--ar-glass', `${Math.round(content.theme.glass * 24)}px`);
  document.title = content.meta.seoTitle || content.meta.brandName;
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = getContentStore();
  const [content, setContentState] = useState<SiteContent>(defaultContent);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<number | null>(null);

  // Chargement initial + synchronisation inter-onglets
  useEffect(() => {
    let active = true;
    store.load().then((c) => {
      if (!active) return;
      setContentState(c);
      applyTheme(c);
      setLoaded(true);
    });
    const unsub = store.subscribe((c) => {
      setContentState(c);
      applyTheme(c);
    });
    return () => {
      active = false;
      unsub();
    };
  }, [store]);

  const persist = useCallback(
    (next: SiteContent) => {
      setSaving(true);
      if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        store.save(next).finally(() => setSaving(false));
      }, 350);
    },
    [store],
  );

  const setContent = useCallback(
    (next: SiteContent) => {
      setContentState(next);
      applyTheme(next);
      persist(next);
    },
    [persist],
  );

  const update = useCallback(
    (mutator: (draft: SiteContent) => SiteContent | void) => {
      setContentState((prev) => {
        const draft = structuredClone(prev);
        const result = mutator(draft);
        const next = (result as SiteContent) || draft;
        applyTheme(next);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const reset = useCallback(async () => {
    const fresh = await store.reset();
    setContentState(fresh);
    applyTheme(fresh);
  }, [store]);

  const value = useMemo<ContentContextValue>(
    () => ({ content, loaded, saving, update, setContent, reset }),
    [content, loaded, saving, update, setContent, reset],
  );

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>;
};

export function useContentContext(): ContentContextValue {
  const ctx = useContext(ContentCtx);
  if (!ctx) throw new Error('useContentContext doit être utilisé dans <ContentProvider>.');
  return ctx;
}

/** Raccourci pour lire le contenu en lecture seule. */
export function useContent(): SiteContent {
  return useContentContext().content;
}
