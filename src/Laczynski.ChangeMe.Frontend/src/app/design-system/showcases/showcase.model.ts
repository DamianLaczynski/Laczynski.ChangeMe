// =============================================================================
// Showcase System Models
// =============================================================================
// Modele TypeScript dla standardowej struktury showcase komponentów
// Zapewniają consistency i type safety w całym design system

// =============================================================================
// BASE SHOWCASE INTERFACES
// =============================================================================

/**
 * Base interface for all showcase components
 * Definiuje podstawowe właściwości każdego showcase'a
 */
export interface ShowcaseComponent {
  /** Nazwa komponentu wyświetlana w header */
  componentName: string;

  /** Opis funkcjonalności komponentu */
  description: string;

  /** Ostatnia akcja wykonana w interactive example */
  lastAction?: string;
}

/**
 * Sekcja showcase z konfiguracją
 */
export interface ShowcaseSection {
  /** Tytuł sekcji */
  title: string;

  /** Czy sekcja jest wymagana dla każdego showcase */
  required: boolean;

  /** Typ sekcji - określa strukturę i zachowanie */
  type: ShowcaseSectionType;

  /** Opcjonalny opis sekcji */
  description?: string;
}

/**
 * Typy sekcji showcase
 */
export type ShowcaseSectionType =
  | 'variants' // Różne warianty komponentu
  | 'states' // Stany (disabled, loading, error)
  | 'sizes' // Rozmiary (sm, md, lg)
  | 'interactive' // Interaktywny przykład
  | 'api' // Dokumentacja API
  | 'examples' // Dodatkowe przykłady użycia
  | 'accessibility' // Funkcje accessibility
  | 'theming'; // Customizacja theme

// =============================================================================
// STANDARDOWE SEKCJE SHOWCASE
// =============================================================================

/**
 * Definicja wymaganych sekcji dla każdego showcase
 */
export const REQUIRED_SHOWCASE_SECTIONS: ShowcaseSection[] = [
  {
    title: 'Variants',
    required: true,
    type: 'variants',
    description: 'Różne warianty stylistyczne komponentu',
  },
  {
    title: 'States',
    required: true,
    type: 'states',
    description: 'Różne stany komponentu (disabled, loading, error)',
  },
  {
    title: 'Interactive Example',
    required: true,
    type: 'interactive',
    description: 'Interaktywny przykład z feedback',
  },
  {
    title: 'Component API',
    required: true,
    type: 'api',
    description: 'Dokumentacja inputs, outputs i metod publicznych',
  },
];

/**
 * Opcjonalne sekcje które mogą być dodane do showcase
 */
export const OPTIONAL_SHOWCASE_SECTIONS: ShowcaseSection[] = [
  {
    title: 'Sizes',
    required: false,
    type: 'sizes',
    description: 'Różne rozmiary komponentu',
  },
  {
    title: 'Examples',
    required: false,
    type: 'examples',
    description: 'Dodatkowe przykłady użycia w kontekście',
  },
  {
    title: 'Accessibility',
    required: false,
    type: 'accessibility',
    description: 'Funkcje accessibility i keyboard navigation',
  },
  {
    title: 'Theming',
    required: false,
    type: 'theming',
    description: 'Customizacja kolorów i stylów',
  },
];

// =============================================================================
// COMPONENT API DOCUMENTATION MODELS
// =============================================================================

/**
 * Dokumentacja input property komponentu
 */
export interface ComponentInput {
  /** Nazwa property */
  name: string;

  /** Typ TypeScript */
  type: string;

  /** Wartość domyślna */
  defaultValue?: string;

  /** Opis funkcjonalności */
  description: string;

  /** Czy property jest wymagane */
  required?: boolean;

  /** Przykładowe wartości */
  examples?: string[];
}

/**
 * Dokumentacja output event komponentu
 */
export interface ComponentOutput {
  /** Nazwa eventu */
  name: string;

  /** Typ payload eventu */
  type: string;

  /** Opis kiedy event jest emitowany */
  description: string;

  /** Przykładowe payload */
  examples?: string[];
}

/**
 * Dokumentacja publicznej metody komponentu
 */
export interface ComponentMethod {
  /** Nazwa metody */
  name: string;

  /** Sygnatura metody */
  signature: string;

  /** Opis funkcjonalności */
  description: string;

  /** Parametry metody */
  parameters?: ComponentMethodParameter[];

  /** Typ zwracany */
  returnType?: string;
}

/**
 * Parametr metody komponentu
 */
export interface ComponentMethodParameter {
  /** Nazwa parametru */
  name: string;

  /** Typ parametru */
  type: string;

  /** Czy parametr jest wymagany */
  required?: boolean;

  /** Opis parametru */
  description?: string;
}

/**
 * Pełna dokumentacja API komponentu
 */
export interface ComponentApiDocumentation {
  /** Input properties */
  inputs: ComponentInput[];

  /** Output events */
  outputs: ComponentOutput[];

  /** Publiczne metody */
  methods?: ComponentMethod[];

  /** CSS custom properties dla stylowania */
  cssProperties?: ComponentCssProperty[];
}

/**
 * CSS Custom Property dla komponentu
 */
export interface ComponentCssProperty {
  /** Nazwa CSS property */
  name: string;

  /** Wartość domyślna */
  defaultValue: string;

  /** Opis zastosowania */
  description: string;

  /** Przykładowe wartości */
  examples?: string[];
}

// =============================================================================
// SHOWCASE NAVIGATION MODELS
// =============================================================================

/**
 * Element nawigacji w design system
 */
export interface DesignSystemNavItem {
  /** Etykieta wyświetlana w menu */
  label: string;

  /** Ścieżka routingu */
  path: string;

  /** Kategoria komponentu */
  category: DesignSystemCategory;

  /** Ikona (opcjonalna) */
  icon?: string;

  /** Czy aktualnie implementowane */
  implemented?: boolean;
}

/**
 * Categories of components in design system
 */
export type DesignSystemCategory =
  | 'forms' // Form components
  | 'navigation' // Navigation components
  | 'data' // Data components
  | 'layout' // Layout components
  | 'overlay' // Overlay components
  | 'foundation' // Foundation elements (colors, typography, etc.)
  | 'feedback' // Feedback components
  | 'actions' // Action components
  | 'overview'; // Overview page

/**
 * Struktura nawigacji design system
 */
export interface DesignSystemNavigation {
  [category: string]: DesignSystemNavItem[];
}

// =============================================================================
// SHOWCASE CONFIGURATION
// =============================================================================

/**
 * Konfiguracja showcase komponentu
 */
export interface ShowcaseConfig {
  /** Podstawowe informacje o komponencie */
  component: ShowcaseComponent;

  /** Dokumentacja API */
  api: ComponentApiDocumentation;

  /** Aktywne sekcje showcase */
  sections: ShowcaseSection[];

  /** Czy showcase jest w trybie dev (pokazuje dodatkowe informacje) */
  devMode?: boolean;
}

/**
 * Template data dla showcase
 */
export interface ShowcaseTemplateData {
  /** Konfiguracja */
  config: ShowcaseConfig;

  /** Przykładowe dane dla komponentu */
  sampleData?: any;

  /** Stan interaktywnego przykładu */
  interactiveState?: any;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Helper type dla wszystkich dostępnych showcase sections
 */
export type AllShowcaseSections =
  | (typeof REQUIRED_SHOWCASE_SECTIONS)[number]
  | (typeof OPTIONAL_SHOWCASE_SECTIONS)[number];

/**
 * Union type wszystkich kategorii
 */
export type AllCategories = DesignSystemCategory;

/**
 * Predicate function dla sprawdzania czy sekcja jest wymagana
 */
export const isRequiredSection = (sectionType: ShowcaseSectionType): boolean => {
  return REQUIRED_SHOWCASE_SECTIONS.some(section => section.type === sectionType);
};

/**
 * Helper function dla tworzenia showcas config
 */
export const createShowcaseConfig = (
  component: ShowcaseComponent,
  api: ComponentApiDocumentation,
  additionalSections?: ShowcaseSection[],
): ShowcaseConfig => {
  const sections = [...REQUIRED_SHOWCASE_SECTIONS, ...(additionalSections || [])];

  return {
    component,
    api,
    sections,
  };
};
