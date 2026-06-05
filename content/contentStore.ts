import { SiteContent, CONTENT_VERSION } from './schema';
import { defaultContent } from './seed';

/**
 * Adaptateur de persistance du contenu.
 * Implémentation actuelle : localStorage (client only).
 * L'interface est volontairement asynchrone pour pouvoir brancher
 * un backend REST/Supabase en Phase 5 sans modifier les consommateurs.
 */
export interface ContentStore {
  load(): Promise<SiteContent>;
  save(content: SiteContent): Promise<void>;
  reset(): Promise<SiteContent>;
  /** Notifie les changements (ex. autre onglet). Retourne une fonction de désinscription. */
  subscribe(listener: (content: SiteContent) => void): () => void;
}

const STORAGE_KEY = 'aetheris.content.v1';

/** Fusionne le contenu chargé avec les valeurs par défaut (robuste aux ajouts de champs). */
function mergeWithDefaults(partial: Partial<SiteContent> | null | undefined): SiteContent {
  if (!partial || typeof partial !== 'object') return structuredClone(defaultContent);
  return {
    ...defaultContent,
    ...partial,
    version: CONTENT_VERSION,
    meta: { ...defaultContent.meta, ...(partial.meta || {}) },
    theme: {
      ...defaultContent.theme,
      ...(partial.theme || {}),
      colors: { ...defaultContent.theme.colors, ...((partial.theme || {}).colors || {}) },
    },
    ui: { ...defaultContent.ui, ...(partial.ui || {}) },
    contact: { ...defaultContent.contact, ...(partial.contact || {}) },
    admin: { ...defaultContent.admin, ...(partial.admin || {}) },
    journey: partial.journey ?? defaultContent.journey,
    products: partial.products ?? defaultContent.products,
    courses: partial.courses ?? defaultContent.courses,
  };
}

class LocalStorageContentStore implements ContentStore {
  private listeners = new Set<(c: SiteContent) => void>();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          try {
            const parsed = e.newValue ? JSON.parse(e.newValue) : null;
            const merged = mergeWithDefaults(parsed);
            this.listeners.forEach((l) => l(merged));
          } catch {
            /* ignore */
          }
        }
      });
    }
  }

  async load(): Promise<SiteContent> {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (!raw) return structuredClone(defaultContent);
      return mergeWithDefaults(JSON.parse(raw));
    } catch (err) {
      console.warn('Contenu illisible, retour aux valeurs par défaut.', err);
      return structuredClone(defaultContent);
    }
  }

  async save(content: SiteContent): Promise<void> {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      this.listeners.forEach((l) => l(content));
    } catch (err) {
      console.error('Échec de la sauvegarde du contenu.', err);
      throw err;
    }
  }

  async reset(): Promise<SiteContent> {
    const fresh = structuredClone(defaultContent);
    await this.save(fresh);
    return fresh;
  }

  subscribe(listener: (c: SiteContent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

/**
 * Stub d'un futur store distant (Phase 5).
 * Conserve la même interface — il suffira d'implémenter les appels réseau.
 */
export class RemoteContentStore implements ContentStore {
  constructor(private baseUrl: string) {}
  async load(): Promise<SiteContent> {
    throw new Error('RemoteContentStore non implémenté (prévu en Phase 5).');
  }
  async save(): Promise<void> {
    throw new Error('RemoteContentStore non implémenté (prévu en Phase 5).');
  }
  async reset(): Promise<SiteContent> {
    throw new Error('RemoteContentStore non implémenté (prévu en Phase 5).');
  }
  subscribe(): () => void {
    return () => {};
  }
}

let singleton: ContentStore | null = null;

/** Fabrique du store. On pourra ici basculer vers RemoteContentStore plus tard. */
export function getContentStore(): ContentStore {
  if (!singleton) {
    singleton = new LocalStorageContentStore();
  }
  return singleton;
}
