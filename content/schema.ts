/**
 * Modèle de contenu de la plateforme (source de vérité du CMS).
 * Le site public ET le back-office lisent/écrivent ces structures.
 */

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;      // couleur principale douce (menthe)
  accentSoft: string;
  secondary: string;   // lavande
  tertiary: string;    // pêche / sable chaud
  success: string;
  danger: string;
  border: string;
}

export interface ThemeTokens {
  name: string;
  colors: ThemeColors;
  radius: number;        // arrondi global (px)
  glass: number;         // intensité du flou des panneaux (0..1)
  glowIntensity: number; // halos (0..1)
  fontDisplay: string;
  fontBody: string;
}

export interface JourneyDetail {
  title: string;
  body: string;
  bullets: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface JourneyStep {
  id: string;
  key: string;        // 'start' | 'shop' | 'learn' | 'contact' | ...
  short: string;      // '00'
  label: string;
  zone: string;
  accent: string;     // couleur de la zone
  center: number;     // position cible sur le parcours (0..1)
  turn: number;       // intensité du virage cycliste (-1 gauche .. +1 droite)
  icon: string;       // nom d'icône lucide
  headline: string;
  intro: string;
  detail: JourneyDetail; // contenu riche affiché à l'immersion (clic)
}

export interface ProductSpec {
  label: string;
  value: string;
  icon: string;
}

export interface ProductVariant {
  name: string;
  color: string; // teinte d'aperçu (#hex)
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  currency: string;
  badge: string;
  icon: string;
  specs: ProductSpec[];
  compat: string[];
  features: string[];
  inStock: boolean;
  variants?: ProductVariant[];
  rating?: number;  // 0..5
  reviews?: number; // nombre d'avis
}

export interface CourseModule {
  title: string;
  duration: string;
}

export interface CourseInstructor {
  name: string;
  role: string;
}

export interface Course {
  id: string;
  title: string;
  level: string;
  duration: string;
  modulesCount: number;
  accent: string;
  blurb: string;
  longDescription: string;
  outcomes: string[];
  modules: CourseModule[];
  price?: number;
  certifying: boolean;
  instructor?: CourseInstructor;
  prerequisites?: string[];
  rating?: number;   // 0..5
  students?: number; // nombre d'inscrits
}

export interface ContactInfo {
  headline: string;
  pitch: string;
  unlockLabel: string;
  email: string;
  phone: string;
  address: string;
  responseTime: string;
  bookingNote: string;
  /** Créneaux horaires proposés dans le mini-calendrier d'immersion. */
  slots?: string[];
  /** Types de demande proposés à l'étape 1 du flux de contact. */
  needs?: string[];
}

export interface SiteMeta {
  brandName: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
}

export interface UiTexts {
  startCta: string;
  scrollHint: string;
  freeFlightLabel: string;
  compassLabel: string;
  immersionHint: string;
}

export interface AdminSettings {
  /**
   * Mot de passe "simple" du back-office. Stocké en clair côté client :
   * ce n'est PAS une sécurité robuste (à remplacer par une vraie auth backend en Phase 5).
   */
  passphrase: string;
}

export interface SiteContent {
  version: number;
  meta: SiteMeta;
  theme: ThemeTokens;
  ui: UiTexts;
  journey: JourneyStep[];
  products: Product[];
  courses: Course[];
  contact: ContactInfo;
  admin: AdminSettings;
}

/** Version courante du schéma (pour les migrations de persistance). */
export const CONTENT_VERSION = 1;
