# Plan Rozwoju Biblioteki Komponentów Angular

## Przegląd Projektu

Tworzenie biblioteki komponentów Angular dla aplikacji Laczynski.ChangeMe z naciskiem na spójność, reużywalność i maintainability.

## 1. Standardy Komponentów

### 1.1 Architektura Komponentów

- **Standalone Components**: Używanie standalone komponentów (już implementowane w app.component.ts)
- **Component Architecture**:
  - Smart Components (Container) - zarządzają stanem i logiką biznesową
  - Dumb Components (Presentational) - odpowiedzialne tylko za wyświetlanie

### 1.2 Naming Conventions

- **Komponenty**: PascalCase z suffiksem Component (np. `ButtonComponent`)
- **Selektory**: kebab-case z prefiksem aplikacji (np. `lcm-button`)
- **Pliki**: kebab-case (np. `button.component.ts`)
- **Katalogi**: kebab-case (np. `button-group/`)

### 1.3 Struktura Plików Komponentu

```
button/
├── button.component.ts
├── button.component.html
├── button.component.scss
├── button.component.spec.ts
├── button.showcase.ts              # Showcase komponentu
├── button.model.ts                 # Models i interfaces
└── index.ts (public API)
```

### 1.4 Showcase System

Każdy komponent musi posiadać showcase o **identycznej strukturze** demonstrujący wszystkie warianty i stany:

**Standardowa Struktura Showcase:**

```typescript
// button.showcase.ts
import { Component } from "@angular/core";
import { ButtonComponent } from "./button.component";

@Component({
  selector: "lcm-button-showcase",
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="showcase-container">
      <!-- Header Section - obowiązkowe -->
      <header class="showcase-header">
        <h1>{{ componentName }}</h1>
        <p class="showcase-description">{{ description }}</p>
      </header>

      <!-- Variants Section - obowiązkowe -->
      <section class="showcase-section">
        <h2>Variants</h2>
        <div class="showcase-grid">
          <lcm-button variant="primary">Primary Button</lcm-button>
          <lcm-button variant="secondary">Secondary Button</lcm-button>
        </div>
      </section>

      <!-- States Section - obowiązkowe -->
      <section class="showcase-section">
        <h2>States</h2>
        <div class="showcase-grid">
          <lcm-button [disabled]="true">Disabled</lcm-button>
          <lcm-button [loading]="true">Loading</lcm-button>
        </div>
      </section>

      <!-- Sizes Section - jeśli ma sizes -->
      <section class="showcase-section">
        <h2>Sizes</h2>
        <div class="showcase-grid">
          <lcm-button size="small">Small</lcm-button>
          <lcm-button size="medium">Medium</lcm-button>
          <lcm-button size="large">Large</lcm-button>
        </div>
      </section>

      <!-- Interactive Example - obowiązkowe -->
      <section class="showcase-section">
        <h2>Interactive Example</h2>
        <div class="showcase-interactive">
          <lcm-button (buttonClick)="onButtonClick($event)">
            Click Me
          </lcm-button>
          <div class="showcase-output">Last action: {{ lastAction }}</div>
        </div>
      </section>

      <!-- API Section - obowiązkowe -->
      <section class="showcase-section">
        <h2>Component API</h2>
        <div class="showcase-api">
          <h3>Inputs</h3>
          <ul>
            <li>
              <code>variant: 'primary' | 'secondary'</code> - Button style
              variant
            </li>
            <li><code>disabled: boolean</code> - Disable the button</li>
            <li><code>loading: boolean</code> - Show loading state</li>
          </ul>
          <h3>Outputs</h3>
          <ul>
            <li>
              <code>buttonClick: MouseEvent</code> - Emitted when button is
              clicked
            </li>
          </ul>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .showcase-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: var(--spacing-xl);
      }

      .showcase-header {
        margin-bottom: var(--spacing-xl);
        border-bottom: 1px solid var(--color-border);
        padding-bottom: var(--spacing-lg);
      }

      .showcase-header h1 {
        margin: 0 0 var(--spacing-sm) 0;
        color: var(--color-text);
      }

      .showcase-description {
        color: var(--color-text-secondary);
        font-size: var(--font-size-lg);
      }

      .showcase-section {
        margin-bottom: var(--spacing-xl);
      }

      .showcase-section h2 {
        margin: 0 0 var(--spacing-md) 0;
        font-size: var(--font-size-lg);
        color: var(--color-text);
      }

      .showcase-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-md);
      }

      .showcase-interactive {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .showcase-output {
        padding: var(--spacing-md);
        background: var(--color-surface);
        border-radius: var(--border-radius-md);
        font-family: monospace;
      }

      .showcase-api ul {
        list-style: none;
        padding: 0;
      }

      .showcase-api li {
        padding: var(--spacing-sm);
        border-bottom: 1px solid var(--color-border);
      }

      .showcase-api code {
        background: var(--color-surface);
        padding: 2px 4px;
        border-radius: var(--border-radius-sm);
        font-family: monospace;
      }
    `,
  ],
})
export class ButtonShowcaseComponent {
  componentName = "Button Component";
  description =
    "Interactive button component with multiple variants and states";
  lastAction = "None";

  onButtonClick(event: MouseEvent) {
    this.lastAction = `Button clicked at ${new Date().toLocaleTimeString()}`;
    console.log("Button clicked:", event);
  }
}
```

**Showcase Template Interface:**

```typescript
// src/app/design-system/models/showcase.model.ts
export interface ShowcaseComponent {
  componentName: string;
  description: string;
  lastAction?: string;
}

export interface ShowcaseSection {
  title: string;
  required: boolean;
  type: "variants" | "states" | "sizes" | "interactive" | "api";
}

export const REQUIRED_SHOWCASE_SECTIONS: ShowcaseSection[] = [
  { title: "Variants", required: true, type: "variants" },
  { title: "States", required: true, type: "states" },
  { title: "Interactive Example", required: true, type: "interactive" },
  { title: "Component API", required: true, type: "api" },
];
```

**Design System Routes (ds.routes.ts):**

```typescript
// src/app/design-system/ds.routes.ts
import { Routes } from "@angular/router";
import { DsLayoutComponent } from "./ds-layout.component";
import { OverviewComponent } from "./overview/overview.component";
import { ButtonShowcaseComponent } from "../shared/components/ui/button/button.showcase";
import { InputShowcaseComponent } from "../shared/components/ui/input/input.showcase";
import { ModalShowcaseComponent } from "../shared/components/ui/modal/modal.showcase";
import { PaginatedTableShowcaseComponent } from "../shared/components/data/paginated-table/paginated-table.showcase";
import { InfinityListShowcaseComponent } from "../shared/components/data/infinity-list/infinity-list.showcase";
import { HeaderShowcaseComponent } from "../shared/components/layout/header/header.showcase";
import { LoadingIndicatorShowcaseComponent } from "../shared/components/feedback/loading-indicator/loading-indicator.showcase";
import { ToastShowcaseComponent } from "../shared/components/feedback/toast/toast.showcase";
import { FormFieldShowcaseComponent } from "../shared/components/forms/form-field/form-field.showcase";

export const DS_ROUTES: Routes = [
  {
    path: "",
    component: DsLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "overview",
        pathMatch: "full",
      },
      {
        path: "overview",
        component: OverviewComponent,
      },
      // UI Components
      {
        path: "ui/button",
        component: ButtonShowcaseComponent,
      },
      {
        path: "ui/input",
        component: InputShowcaseComponent,
      },
      {
        path: "ui/modal",
        component: ModalShowcaseComponent,
      },
      // Data Components
      {
        path: "data/paginated-table",
        component: PaginatedTableShowcaseComponent,
      },
      {
        path: "data/infinity-list",
        component: InfinityListShowcaseComponent,
      },
      // Layout Components
      {
        path: "layout/header",
        component: HeaderShowcaseComponent,
      },
      // Feedback Components
      {
        path: "feedback/loading-indicator",
        component: LoadingIndicatorShowcaseComponent,
      },
      {
        path: "feedback/toast",
        component: ToastShowcaseComponent,
      },
      // Forms Components
      {
        path: "forms/form-field",
        component: FormFieldShowcaseComponent,
      },
    ],
  },
];
```

**Design System Layout Component:**

```typescript
// src/app/design-system/ds-layout.component.ts
@Component({
  selector: "app-ds-layout",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="ds-layout">
      <aside class="ds-sidebar">
        <div class="ds-sidebar__header">
          <h2>Design System</h2>
        </div>

        <nav class="ds-navigation">
          <a
            routerLink="overview"
            routerLinkActive="active"
            class="ds-nav-item"
          >
            Overview
          </a>

          <div class="ds-nav-section">
            <h3>UI Components</h3>
            <a
              routerLink="ui/button"
              routerLinkActive="active"
              class="ds-nav-item"
              >Button</a
            >
            <a
              routerLink="ui/input"
              routerLinkActive="active"
              class="ds-nav-item"
              >Input</a
            >
            <a
              routerLink="ui/modal"
              routerLinkActive="active"
              class="ds-nav-item"
              >Modal</a
            >
            <a
              routerLink="ui/card"
              routerLinkActive="active"
              class="ds-nav-item"
              >Card</a
            >
          </div>

          <div class="ds-nav-section">
            <h3>Data Components</h3>
            <a
              routerLink="data/paginated-table"
              routerLinkActive="active"
              class="ds-nav-item"
              >Paginated Table</a
            >
            <a
              routerLink="data/infinity-list"
              routerLinkActive="active"
              class="ds-nav-item"
              >Infinity List</a
            >
            <a
              routerLink="data/data-grid"
              routerLinkActive="active"
              class="ds-nav-item"
              >Data Grid</a
            >
          </div>

          <div class="ds-nav-section">
            <h3>Layout Components</h3>
            <a
              routerLink="layout/header"
              routerLinkActive="active"
              class="ds-nav-item"
              >Header</a
            >
            <a
              routerLink="layout/sidebar"
              routerLinkActive="active"
              class="ds-nav-item"
              >Sidebar</a
            >
            <a
              routerLink="layout/footer"
              routerLinkActive="active"
              class="ds-nav-item"
              >Footer</a
            >
          </div>

          <div class="ds-nav-section">
            <h3>Feedback Components</h3>
            <a
              routerLink="feedback/loading-indicator"
              routerLinkActive="active"
              class="ds-nav-item"
              >Loading Indicator</a
            >
            <a
              routerLink="feedback/toast"
              routerLinkActive="active"
              class="ds-nav-item"
              >Toast</a
            >
            <a
              routerLink="feedback/alert"
              routerLinkActive="active"
              class="ds-nav-item"
              >Alert</a
            >
          </div>

          <div class="ds-nav-section">
            <h3>Form Components</h3>
            <a
              routerLink="forms/form-field"
              routerLinkActive="active"
              class="ds-nav-item"
              >Form Field</a
            >
            <a
              routerLink="forms/validators"
              routerLinkActive="active"
              class="ds-nav-item"
              >Validators</a
            >
            <a
              routerLink="forms/dynamic-form"
              routerLinkActive="active"
              class="ds-nav-item"
              >Dynamic Form</a
            >
          </div>
        </nav>
      </aside>

      <main class="ds-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .ds-layout {
        display: flex;
        height: 100vh;
      }

      .ds-sidebar {
        width: 280px;
        background: var(--color-surface);
        border-right: 1px solid var(--color-border);
        overflow-y: auto;
      }

      .ds-sidebar__header {
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--color-border);
      }

      .ds-navigation {
        padding: var(--spacing-md);
      }

      .ds-nav-section {
        margin-bottom: var(--spacing-lg);
      }

      .ds-nav-section h3 {
        margin: 0 0 var(--spacing-sm) 0;
        font-size: var(--font-size-sm);
        font-weight: 600;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .ds-nav-item {
        display: block;
        padding: var(--spacing-sm) var(--spacing-md);
        margin-bottom: var(--spacing-xs);
        text-decoration: none;
        color: var(--color-text);
        border-radius: var(--border-radius-sm);
        transition: all 0.2s ease;
      }

      .ds-nav-item:hover {
        background: var(--color-surface-hover);
      }

      .ds-nav-item.active {
        background: var(--color-primary);
        color: white;
      }

      .ds-content {
        flex: 1;
        overflow-y: auto;
        padding: var(--spacing-xl);
      }
    `,
  ],
})
export class DsLayoutComponent {}
```

**Główne App Routes z lazy loading:**

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./features/items/items.routes").then((m) => m.ITEMS_ROUTES),
  },
  {
    path: "design-system",
    loadChildren: () =>
      import("./design-system/ds.routes").then((m) => m.DS_ROUTES),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
```

### 1.4 Standardy Kodowania

- **TypeScript Strict Mode**: Wszystkie komponenty muszą być zgodne z strict mode
- **Input/Output Typing**: Wszystkie @Input() i @Output() muszą mieć jawnie określone typy
- **Angular Signals API**: Preferowane używanie nowego API:
  - `input()` i `input.required()` zamiast `@Input()`
  - `output()` zamiast `@Output()`
  - `model()` i `model.required()` dla two-way binding
  - `computed()` dla derived state
- **Signal-based Queries**: Preferowane nad decorator-based queries:
  - `viewChild()` i `viewChild.required()` zamiast `@ViewChild`
  - `viewChildren()` zamiast `@ViewChildren`
  - `contentChild()` i `contentChild.required()` zamiast `@ContentChild`
  - `contentChildren()` zamiast `@ContentChildren`
- **OnPush Change Detection**: Domyślna strategia dla komponentów presentational
- **Dependency Injection**: Używanie `inject()` function zamiast constructor injection gdzie to możliwe
- **Resource Management**:
  - `takeUntilDestroyed(this.destroyRef)` dla RxJS subscriptions
  - `DestroyRef` injection dla cleanup logic
- **Generics Support**: Komponenty powinny wspierać generics dla lepszego typowania (np. `<T, P extends BaseType>`)
- **JSDoc Comments**: Wszystkie publiczne metody muszą mieć dokumentację JSDoc
- **Interface Implementation**: Implementacja odpowiednich Angular interfaces (`OnInit`, `OnDestroy`, etc.)
- **Error Handling**: Graceful handling błędów z fallback values
- **Accessibility**: Wszystkie komponenty muszą spełniać standardy WCAG 2.1 AA
- **Naming Conventions**:
  - Methods: `camelCase` z deskryptywnymi nazwami (np. `handleRowSelect`, `getCurrentPage`)
  - Properties: `camelCase`
  - Events: `camelCase` z czasownikami (np. `rowSelect`, `pageChange`)
  - Interfaces/Types: `PascalCase` z suffiksem (`Model`, `Config`, `Parameters`)

### 1.5 Template Guidelines

- **Angular Signals**: Preferowane nad RxJS Observable gdzie to możliwe
- **Control Flow Syntax**: Preferowane używanie nowej składni:
  - `@if` zamiast `*ngIf`
  - `@for` zamiast `*ngFor`
  - `@switch` zamiast `*ngSwitch`
  - `@empty` dla pustych stanów w `@for`
- **Trackby Functions**: Obowiązkowe dla wszystkich `@for` (track expression)
- **Signal-based Queries**: Używanie w reactive contexts (`computed`, `effect`)
- **Async Pipe**: Preferowany nad subskrypcjami w komponencie dla RxJS Observable
- **OnPush Strategy**: Domyślna dla komponentów UI
- **Template Reference Variables**: Używane z signal-based queries przez string locators

## 2. Struktura Biblioteki

### 2.1 Hierarchia Katalogów

```
src/app/shared/components/
├── ui/                          # Podstawowe komponenty UI
│   ├── button/
│   ├── input/
│   ├── modal/
│   ├── dropdown/
│   └── card/
├── data/                        # Komponenty związane z danymi
│   ├── paginated-table/         # (już istnieje)
│   ├── infinity-list/           # (już istnieje)
│   ├── data-grid/
│   └── search-filter/
├── layout/                      # Komponenty layoutu
│   ├── header/
│   ├── sidebar/
│   ├── footer/
│   └── navigation/
├── feedback/                    # Komponenty feedback
│   ├── loading-indicator/       # (już istnieje)
│   ├── toast/
│   ├── alert/
│   └── progress/
└── forms/                       # Komponenty formularzy
    ├── form-field/
    ├── validators/
    ├── form-builder/
    └── dynamic-form/
```

### 2.2 Public API (Barrel Exports)

Każdy katalog główny powinien mieć `index.ts`:

```typescript
// ui/index.ts
export * from "./button";
export * from "./input";
export * from "./modal";
```

### 2.3 Moduły vs Standalone

- **Standalone Components**: Preferowane dla nowych komponentów
- **Feature Modules**: Tylko dla dużych funkcjonalności wymagających lazy loading
- **Shared Module**: Deprecated - zastąpiony barrel exports

## 3. Podejście do Stylowania

### 3.1 Design System Foundation

- **CSS Custom Properties**: Główna metoda zarządzania tematami
- **SCSS**: Język stylowania z modularną strukturą
- **BEM Methodology**: Naming convention dla klas CSS
- **Mobile-First**: Responsywne projektowanie od najmniejszych ekranów

### 3.2 Architektura Stylów

```
src/styles/
├── abstracts/
│   ├── _variables.scss          # CSS custom properties
│   ├── _mixins.scss            # SCSS mixins
│   ├── _functions.scss         # SCSS functions
│   └── _breakpoints.scss       # Media query breakpoints
├── base/
│   ├── _reset.scss             # CSS reset
│   ├── _typography.scss        # Typography styles
│   └── _base.scss              # Base HTML element styles
├── components/
│   ├── _buttons.scss           # Button component styles
│   ├── _forms.scss             # Form component styles
│   └── _modals.scss            # Modal component styles
├── layout/
│   ├── _grid.scss              # Grid system
│   ├── _header.scss            # Header layout
│   └── _sidebar.scss           # Sidebar layout
├── themes/
│   ├── _light.scss             # Light theme
│   ├── _dark.scss              # Dark theme
│   └── _high-contrast.scss     # Accessibility theme
├── utilities/
│   ├── _spacing.scss           # Margin/padding utilities
│   ├── _colors.scss            # Color utilities
│   └── _typography.scss        # Typography utilities
└── main.scss                   # Main import file
```

### 3.3 CSS Custom Properties Structure

```scss
:root {
  // Colors
  --color-primary: #007bff;
  --color-primary-hover: #0056b3;
  --color-secondary: #6c757d;

  // Spacing
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  // Typography
  --font-family-primary: "Inter", sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  // Shadows
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  // Border radius
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 0.75rem;
}
```

## 4. Harmonogram Implementacji

### Faza 1: Fundament (Tydzień 1-2)

- [ ] Setup CSS Custom Properties
- [ ] Implementacja Design Tokens
- [ ] Utworzenie base stylów i mixinów
- [ ] **Utworzenie Design System Layout** (`ds-layout.component.ts`)
- [ ] **Setup ds.routes.ts** z prostą składnią component
- [ ] **Standardowa struktura showcase** i interface
- [ ] Dokumentacja standardów

### Faza 2: Podstawowe Komponenty UI (Tydzień 3-4)

- [ ] Button Component + **Standardowy Button Showcase**
- [ ] Input Component + **Standardowy Input Showcase**
- [ ] Card Component + **Standardowy Card Showcase**
- [ ] Modal Component + **Standardowy Modal Showcase**
- [ ] **Integracja showcase'ów** z design system routes

### Faza 3: Komponenty Formularzy (Tydzień 5-6)

- [ ] Form Field Component + **Standardowy Form Field Showcase**
- [ ] Validators + **Standardowy Validators Showcase**
- [ ] Dynamic Form Builder + **Standardowy Dynamic Form Showcase**

### Faza 4: Komponenty Data (Tydzień 7-8)

- [ ] **Refaktor istniejących komponentów** na model-based architecture
- [ ] **Standardowe showcase'y** dla paginated-table, infinity-list
- [ ] Data Grid Component + **Standardowy Data Grid Showcase**
- [ ] Search Filter Component + **Standardowy Search Filter Showcase**

### Faza 5: Komponenty Layout i Feedback (Tydzień 9-10)

- [ ] Navigation Components + **Standardowy Navigation Showcase**
- [ ] Toast/Alert Components + **Standardowy Toast/Alert Showcase**
- [ ] Progress Components + **Standardowy Progress Showcase**
- [ ] **Refaktor loading-indicator** + standardowy showcase

### Faza 6: Finalizacja (Tydzień 11-12)

- [ ] **Kompletny Design System** z uniform showcase'ami
- [ ] **Automatyczne generowanie** showcase template
- [ ] **Dokumentacja pattern** dla consistent development
- [ ] Testy jednostkowe i e2e
- [ ] Performance optimization
- [ ] Accessibility audit

## 5. Narzędzia i Technologie

### 5.1 Development Tools

- **Wewnętrzny Showcase System**: Uniform documentation i testing
- **Angular DevKit**: Schematics dla generowania komponentów i standardowych showcase'ów
- **ESLint + Prettier**: Code formatting i linting
- **Husky**: Pre-commit hooks

### 5.2 Showcase Standardization

- **Uniform Structure**: Wszystkie showcase'y mają identyczną strukturę
- **Model-based Architecture**: Używanie `.model.ts` zamiast `.types.ts`
- **Component Routes**: Prosta składnia z `component` property
- **Interactive Documentation**: Live examples z real-time feedback

### 5.3 Testing

- **Jest**: Unit testing
- **Testing Library**: Component testing
- **Cypress**: E2E testing showcase'ów
- **Axe-core**: Accessibility testing

## 6. Next Steps

1. **Przegląd i akceptacja planu** przez zespół
2. **Setup showcase template** i model structure
3. **Rozpoczęcie Fazy 1** - implementacja fundamentów
4. **Weekly reviews** postępu z focus na consistency

---

**Autor**: Development Team  
**Data utworzenia**: $(date)  
**Ostatnia aktualizacja**: $(date)  
**Status**: Draft - Do Review
