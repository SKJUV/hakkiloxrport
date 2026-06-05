import { SiteContent, CONTENT_VERSION } from './schema';

/**
 * Contenu par défaut de la plateforme.
 * Thème "douceur" : palette pastel (menthe, lavande, pêche) sur fond crépusculaire doux.
 * Toutes ces valeurs sont éditables depuis le back-office /admin.
 */
export const defaultContent: SiteContent = {
  version: CONTENT_VERSION,
  meta: {
    brandName: 'Aetheris',
    tagline: 'Le parcours AR, en douceur.',
    seoTitle: 'Aetheris — Parcours Interactif AR',
    seoDescription:
      'Une balade immersive en réalité augmentée : matériel, formations et démonstrations B2B, le long d’un parcours doux.',
  },
  theme: {
    name: 'Aube douce',
    colors: {
      background: '#161b26',
      surface: 'rgba(255,255,255,0.06)',
      text: '#eef1f6',
      textMuted: '#9aa4b4',
      accent: '#8fd6c4',      // menthe douce
      accentSoft: '#bfe9df',
      secondary: '#b7a8e8',   // lavande
      tertiary: '#f3c9a8',    // pêche / sable
      success: '#a8d8b0',
      danger: '#e8a3a3',
      border: 'rgba(255,255,255,0.10)',
    },
    radius: 18,
    glass: 0.6,
    glowIntensity: 0.4,
    fontDisplay: 'Space Grotesk',
    fontBody: 'Inter',
  },
  ui: {
    startCta: 'Commencer la balade',
    scrollHint: 'Molette / glisser — avancez tranquillement',
    freeFlightLabel: 'Mode libre',
    compassLabel: 'Étapes',
    immersionHint: 'Cliquez une étape pour vous y immerger',
  },
  journey: [
    {
      id: 'start',
      key: 'start',
      short: '00',
      label: 'Point de départ',
      zone: 'Départ',
      accent: '#8fd6c4',
      center: 0.0,
      turn: 0,
      icon: 'DoorOpen',
      headline: 'Glissez pour lancer la balade AR',
      intro:
        'Vous êtes au début du chemin. Avancez tranquillement : matériel, formations, puis contact. Bougez la souris pour regarder autour de vous.',
      detail: {
        title: 'Bienvenue sur le parcours',
        body:
          'Une expérience continue, pensée comme une balade à vélo : on avance au rythme du défilement, on prend des virages doux, et on s’arrête où l’on veut.',
        bullets: [
          'Navigation au scroll, douce et réversible',
          'Regard libre à ±30° autour de la zone active',
          'Téléportation instantanée vers n’importe quelle étape',
        ],
        ctaLabel: 'Découvrir le matériel',
      },
    },
    {
      id: 'shop',
      key: 'shop',
      short: '01',
      label: 'Avenue Matériel',
      zone: 'Boutique',
      accent: '#b7a8e8',
      center: 0.33,
      turn: -0.6,
      icon: 'ShoppingBag',
      headline: 'La boutique en réalité augmentée',
      intro:
        'Des objets lévitent au bord du chemin. Arrêtez-vous, faites-les tourner, comparez et ajoutez-les au panier.',
      detail: {
        title: 'Avenue Matériel',
        body:
          'Casques, lunettes intelligentes et accessoires haptiques. Chaque produit affiche son prix flottant, ses spécifications et sa compatibilité.',
        bullets: [
          'Aperçu AR : l’optique du produit s’applique au décor',
          'Spécifications et compatibilité détaillées',
          'Panier et paiement intégrés',
        ],
        ctaLabel: 'Voir tous les produits',
      },
    },
    {
      id: 'learn',
      key: 'learn',
      short: '02',
      label: 'Champ de connaissance',
      zone: 'Formations',
      accent: '#f3c9a8',
      center: 0.62,
      turn: 0.6,
      icon: 'GraduationCap',
      headline: 'Le champ de connaissance',
      intro:
        'Des îles de savoir flottent le long du chemin. Ralentissez sur un cours puis lancez le module en lecture spatiale.',
      detail: {
        title: 'Champ de connaissance',
        body:
          'Des parcours e-learning pour maîtriser la VR, les shaders et le design spatial. Modules vidéo, exercices et certification.',
        bullets: [
          'Lecture spatiale immersive',
          'Modules courts et progressifs',
          'Certification à la clé',
        ],
        ctaLabel: 'Explorer les formations',
      },
    },
    {
      id: 'contact',
      key: 'contact',
      short: '03',
      label: 'Portail Virtuel-Réel',
      zone: 'Contact B2B',
      accent: '#8fd6c4',
      center: 0.95,
      turn: -0.3,
      icon: 'Radar',
      headline: 'Et chez vous, ça donnerait quoi ?',
      intro:
        'Au bout du chemin, ouvrez la fenêtre de contact pour programmer une démonstration AR sur mesure.',
      detail: {
        title: 'Portail Virtuel-Réel',
        body:
          'Prouvons aujourd’hui ce qu’un rendu AR produit chez VOTRE entreprise. Prise de contact et réservation de démo en quelques secondes.',
        bullets: [
          'Démonstration sur site ou en visio',
          'Réponse sous 24 h',
          'Accompagnement projet de bout en bout',
        ],
        ctaLabel: 'Programmer une démo',
      },
    },
  ],
  products: [
    {
      id: 'vortex',
      name: 'Vortex AR-1',
      tagline: 'Casque de réalité augmentée',
      description:
        'Double écran micro-OLED, suivi inside-out 6DoF et incrustation holographique temps réel.',
      longDescription:
        'Le Vortex AR-1 est notre casque phare. Son champ de vision de 120°, sa latence de 4 ms et son suivi inside-out 6DoF offrent une immersion confortable, sans nausée, même sur de longues sessions. Conçu pour le travail comme pour la formation.',
      price: 1290,
      currency: '€',
      badge: 'Phare',
      icon: 'Headset',
      specs: [
        { label: 'Champ de vision', value: '120°', icon: 'Eye' },
        { label: 'Latence', value: '4 ms', icon: 'Gauge' },
        { label: 'Autonomie', value: '3 h 30', icon: 'BatteryCharging' },
      ],
      compat: ['Windows', 'macOS', 'WebXR'],
      features: [
        'Écrans micro-OLED 4K par œil',
        'Audio spatial intégré',
        'Passthrough couleur haute fidélité',
        'Ajustement IPD motorisé',
      ],
      inStock: true,
    },
    {
      id: 'spectra',
      name: 'HoloLens Spectra',
      tagline: 'Lunettes intelligentes du quotidien',
      description: 'Smartglasses ultra-légères (62 g) à guides d’ondes pour le quotidien.',
      longDescription:
        'Les Spectra affichent waypoints et fiches directement dans votre champ de vision, sans vous couper du monde réel. 62 g, élégantes, autonomie de 6 h : la réalité augmentée au quotidien.',
      price: 740,
      currency: '€',
      badge: 'Léger',
      icon: 'Glasses',
      specs: [
        { label: 'Poids', value: '62 g', icon: 'Feather' },
        { label: 'Connectivité', value: 'Wi-Fi 6E', icon: 'Wifi' },
        { label: 'Autonomie', value: '6 h', icon: 'BatteryCharging' },
      ],
      compat: ['iOS', 'Android', 'WebXR'],
      features: [
        'Guides d’ondes haute transparence',
        'Commande vocale et gestuelle',
        'Verres correcteurs en option',
      ],
      inStock: true,
    },
    {
      id: 'neogrip',
      name: 'NeoGrip Haptic',
      tagline: 'Manettes à retour haptique',
      description: 'Contrôleurs piézo : ressentez la texture des objets virtuels.',
      longDescription:
        'La paire NeoGrip ajoute le toucher à la réalité augmentée : 384 nœuds piézoélectriques restituent textures et résistances. Indispensable pour la manipulation fine et la formation pratique.',
      price: 320,
      currency: '€',
      badge: 'Haptique',
      icon: 'Boxes',
      specs: [
        { label: 'Capteurs', value: '384 nœuds', icon: 'Cpu' },
        { label: 'Retour', value: 'Bi-directionnel', icon: 'Activity' },
        { label: 'Autonomie', value: '9 h', icon: 'BatteryCharging' },
      ],
      compat: ['Vortex AR-1', 'Spectra', 'WebXR'],
      features: ['Suivi sub-millimétrique', 'Recharge sans fil', 'Sangles adaptatives'],
      inStock: true,
    },
  ],
  courses: [
    {
      id: 'python-vr',
      title: 'Python appliqué à la VR',
      level: 'Intermédiaire',
      duration: '12 h',
      modulesCount: 9,
      accent: '#b7a8e8',
      blurb: 'Pilotez des scènes immersives et scriptez des interactions spatiales en Python.',
      longDescription:
        'De la mise en place d’une scène au scripting d’interactions spatiales, ce parcours vous rend autonome pour prototyper des expériences VR en Python.',
      outcomes: [
        'Mettre en place une scène immersive',
        'Gérer le tracking et les contrôleurs',
        'Scripter des interactions spatiales',
      ],
      modules: [
        { title: 'Mise en place de l’environnement', duration: '1 h' },
        { title: 'Caméra et déplacement', duration: '1 h 30' },
        { title: 'Interactions et événements', duration: '2 h' },
      ],
      price: 149,
      certifying: true,
    },
    {
      id: 'glsl',
      title: 'Shaders WebGL & GLSL',
      level: 'Avancé',
      duration: '16 h',
      modulesCount: 12,
      accent: '#f3c9a8',
      blurb: 'Du raymarching aux fractales : des mondes compilés directement sur le GPU.',
      longDescription:
        'Plongez dans le rendu temps réel : raymarching, SDF, fractales et optimisation GPU pour créer des environnements procéduraux saisissants.',
      outcomes: [
        'Comprendre le pipeline GPU',
        'Écrire des SDF et du raymarching',
        'Optimiser pour le temps réel',
      ],
      modules: [
        { title: 'Bases de GLSL', duration: '2 h' },
        { title: 'Signed Distance Fields', duration: '3 h' },
        { title: 'Raymarching avancé', duration: '3 h' },
      ],
      price: 199,
      certifying: true,
    },
    {
      id: 'ux-spatial',
      title: 'Design UX Spatial / AR',
      level: 'Tous niveaux',
      duration: '8 h',
      modulesCount: 7,
      accent: '#8fd6c4',
      blurb: 'Concevez des interfaces phygitales lisibles et confortables.',
      longDescription:
        'Les bonnes pratiques de l’interface spatiale : lisibilité, confort, waypoints et HUD flottants qui ne fatiguent pas l’utilisateur.',
      outcomes: [
        'Concevoir des HUD flottants lisibles',
        'Gérer profondeur et confort visuel',
        'Prototyper des interactions naturelles',
      ],
      modules: [
        { title: 'Principes de l’UX spatiale', duration: '1 h 30' },
        { title: 'Lisibilité et confort', duration: '2 h' },
        { title: 'Prototypage', duration: '2 h' },
      ],
      price: 99,
      certifying: false,
    },
  ],
  contact: {
    headline: 'Prouvons ce qu’un rendu AR produit chez VOUS',
    pitch:
      'Déverrouillez le scanner pour ouvrir la fenêtre de prise de contact et programmer une démonstration AR sur mesure avec notre agence.',
    unlockLabel: 'Déverrouiller le scanner',
    email: 'contact@aetheris.studio',
    phone: '+33 1 23 45 67 89',
    address: 'Paris, France',
    responseTime: 'Réponse sous 24 h',
    bookingNote: 'Démo sur site ou en visio',
  },
  admin: {
    passphrase: 'aetheris',
  },
};
