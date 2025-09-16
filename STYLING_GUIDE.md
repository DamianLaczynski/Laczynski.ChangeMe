# Styling Guide

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Principles](#core-principles)
3. [SCSS Architecture (7-1 Pattern)](#scss-architecture-7-1-pattern)
4. [BEM Methodology](#bem-methodology)
5. [Component Styling](#component-styling)
6. [Angular Component Integration](#angular-component-integration)
7. [Theme System](#theme-system)
8. [Best Practices](#best-practices)
9. [Anti-patterns (Forbidden)](#anti-patterns-forbidden)
10. [Examples](#examples)

## Architecture Overview

This project follows a **7-1 SCSS Architecture** with **BEM methodology** for maintainable, scalable styling. The system is built around:

- **Design System**: Consistent variables, colors, typography, and spacing
- **Component-Based Architecture**: Reusable UI components with Angular integration
- **Theme Support**: Light/dark theme system with CSS custom properties
- **Responsive Design**: Mobile-first approach with breakpoint system

## Core Principles

### 1. **Consistency First**

- Use design system variables for all styling decisions
- Maintain consistent naming conventions across components
- Follow established patterns for similar UI elements

### 2. **Maintainability**

- Keep styles modular and organized
- Use BEM methodology for clear CSS structure
- Separate concerns (layout, components, utilities)

### 3. **Performance**

- Minimize CSS specificity conflicts
- Use efficient selectors
- Leverage CSS custom properties for theming

### 4. **Accessibility**

- Include focus states for all interactive elements
- Ensure sufficient color contrast
- Support keyboard navigation

## SCSS Architecture (7-1 Pattern)

```
scss/
├── abstracts/          # Variables, functions, mixins
│   ├── _variables.scss
│   ├── _functions.scss
│   ├── _mixins.scss
│   └── _utilities.scss
├── vendors/            # Third-party styles
│   └── _normalize.scss
├── base/               # Boilerplate code
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _base.scss
├── layout/             # Layout-related sections
│   ├── _header.scss
│   ├── _footer.scss
│   ├── _sidebar.scss
│   └── _grid.scss
├── components/         # Reusable UI components
│   ├── _button.scss
│   └── _field.scss
├── pages/              # Page-specific styles
├── themes/             # Theme-related styles
│   └── _default.scss
└── main.scss           # Main entry point
```

### File Organization Rules

✅ **DO:**

- Place component styles in `components/` directory
- Use descriptive file names with underscores
- Import files in the correct order in `main.scss`

❌ **DON'T:**

- Mix component styles with layout styles
- Use camelCase or kebab-case for SCSS files
- Import files in random order

## BEM Methodology

### Block-Element-Modifier Structure

```scss
// Block
.button {
}

// Element
.button__icon {
}
.button__text {
}

// Modifier
.button--primary {
}
.button--large {
}
.button--disabled {
}

// Element with modifier
.button__icon--left {
}
```

### Naming Conventions

✅ **DO:**

```scss
// Use double underscores for elements
.button__icon {
}
.field__label {
}

// Use double hyphens for modifiers
.button--primary {
}
.field--error {
}

// Use descriptive names
.user-profile__avatar {
}
.navigation__menu-item {
}
```

❌ **DON'T:**

```scss
// Single underscores for elements
.button_icon {
}

// Single hyphens for modifiers
.button-primary {
}

// Abbreviated or unclear names
.btn {
}
.fld {
}
.nav_itm {
}
```

## Component Styling

### SCSS Component Structure

```scss
@use "../utils/variables" as *;
@use "../utils/mixins" as *;
@use "../utils/functions" as *;
@use "../utils/utilities" as *;

@include block("component-name") {
  // Base styles
  display: flex;
  align-items: center;

  // Elements
  @include element("title") {
    font-size: $font-size-large;
    font-weight: $font-weight-semibold;
  }

  @include element("content") {
    flex: 1;
  }

  // Modifiers
  @include modifier("large") {
    padding: $spacing-large;
  }

  @include modifier("dark") {
    background-color: $color-gray-900;
    color: $color-white;
  }
}
```

### Required Imports

Every component SCSS file must include:

```scss
@use "../utils/variables" as *;
@use "../utils/mixins" as *;
@use "../utils/functions" as *;
@use "../utils/utilities" as *;
```

## Angular Component Integration

### Component Class Structure

```typescript
import { Component, input, output, model } from "@angular/core";

export type ComponentVariant = "primary" | "secondary";
export type ComponentSize = "small" | "medium" | "large";

@Component({
  selector: "app-component",
  templateUrl: "./component.component.html",
  standalone: true,
})
export class ComponentComponent {
  // Inputs for styling variants
  variant = input<ComponentVariant>("primary");
  size = input<ComponentSize>("medium");
  disabled = model<boolean>(false);

  // Outputs for events
  click = output<MouseEvent>();

  // Method to generate CSS classes
  componentClasses(): string {
    const classes = ["component"];

    classes.push(`component--${this.variant()}`);
    classes.push(`component--${this.size()}`);

    if (this.disabled()) {
      classes.push("component--disabled");
    }

    return classes.join(" ");
  }
}
```

### Template Integration

```html
<div
  [class]="componentClasses()"
  [attr.aria-disabled]="disabled()"
  (click)="onClick($event)"
>
  <ng-content></ng-content>
</div>
```

## Theme System

### CSS Custom Properties

The project uses CSS custom properties for theming:

```scss
:root {
  --theme-bg-primary: #{$color-white};
  --theme-text-primary: #{$color-gray-900};
  --theme-border-primary: #{$color-gray-300};
}

[data-theme="dark"] {
  --theme-bg-primary: #{$color-gray-900};
  --theme-text-primary: #{$color-white};
  --theme-border-primary: #{$color-gray-700};
}
```

### Theme-Aware Components

```scss
.theme-aware {
  background-color: var(--theme-bg-primary);
  color: var(--theme-text-primary);
  border-color: var(--theme-border-primary);
  transition: all $transition-normal;
}
```

## Best Practices

### 1. **Use Design System Variables**

✅ **DO:**

```scss
.button {
  padding: $spacing-small $spacing-medium;
  font-size: $font-size-medium;
  color: $color-white;
  background-color: $color-primary;
  border-radius: $border-radius;
}
```

❌ **DON'T:**

```scss
.button {
  padding: 8px 16px;
  font-size: 16px;
  color: #ffffff;
  background-color: #007bff;
  border-radius: 4px;
}
```

### 2. **Responsive Design**

✅ **DO:**

```scss
.button {
  padding: $spacing-small $spacing-medium;

  @include respond-to(medium) {
    padding: $spacing-medium $spacing-large;
  }
}
```

❌ **DON'T:**

```scss
.button {
  padding: 8px 16px;

  @media (min-width: 768px) {
    padding: 16px 24px;
  }
}
```

### 3. **Focus States**

✅ **DO:**

```scss
.button {
  @include focus-ring;

  &:focus-visible {
    outline: 2px solid $color-primary;
    outline-offset: 2px;
  }
}
```

❌ **DON'T:**

```scss
.button {
  &:focus {
    outline: none;
  }
}
```

### 4. **State Management**

✅ **DO:**

```scss
.button {
  transition: all $transition-fast;

  &:hover:not(:disabled) {
    background-color: $color-primary-dark;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

❌ **DON'T:**

```scss
.button {
  &:hover {
    background-color: $color-primary-dark;
  }

  &.disabled {
    opacity: 0.6;
  }
}
```

## Anti-patterns (Forbidden)

### 1. **Inline Styles**

❌ **NEVER:**

```html
<div style="color: red; font-size: 16px;">Content</div>
```

### 2. **Hardcoded Values**

❌ **NEVER:**

```scss
.button {
  color: #ff0000;
  margin: 20px;
  font-size: 18px;
}
```

### 3. **High Specificity Selectors**

❌ **NEVER:**

```scss
body div.container .row .col .button.primary.large {
  color: red;
}
```

### 4. **!important Usage**

❌ **NEVER:**

```scss
.button {
  color: red !important;
  background: blue !important;
}
```

### 5. **Global CSS Classes in Components**

❌ **NEVER:**

```scss
// In component.scss
.red-text {
  color: red;
}

.large-button {
  font-size: 20px;
}
```

### 6. **Mixing BEM with Other Methodologies**

❌ **NEVER:**

```scss
.button.primary {
}
.button-large {
}
.button__icon-left {
}
```

### 7. **Direct Element Styling**

❌ **NEVER:**

```scss
button {
  background: red;
}

input {
  border: 1px solid blue;
}
```

## Examples

### Complete Button Component Example

**TypeScript:**

```typescript
import { Component, input, output, model } from "@angular/core";
import { Intent, Size, Variant } from "../utils";

export type ButtonType = "button" | "submit" | "reset";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  standalone: true,
})
export class ButtonComponent {
  intent = input<Intent>("primary");
  variant = input<Variant>("solid");
  size = input<Size>("medium");
  type = input<ButtonType>("button");
  disabled = model<boolean>(false);
  fullWidth = input<boolean>(false);
  ariaLabel = input<string>();

  click = output<MouseEvent>();

  buttonClasses(): string {
    const classes = ["button"];

    classes.push(`button--${this.intent()}`);
    classes.push(`button--${this.variant()}`);
    classes.push(`button--${this.size()}`);

    if (this.fullWidth()) {
      classes.push("button--full-width");
    }

    return classes.join(" ");
  }

  onClick(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.click.emit(event);
  }
}
```

**Template:**

```html
<button
  [type]="type()"
  [class]="buttonClasses()"
  [disabled]="disabled()"
  [attr.aria-label]="ariaLabel() || label()"
  (click)="onClick($event)"
>
  <ng-content></ng-content>
</button>
```

**SCSS:**

```scss
@use "../utils/variables" as *;
@use "../utils/mixins" as *;
@use "../utils/functions" as *;
@use "../utils/utilities" as *;

@include block("button") {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: $font-family-primary;
  font-size: $font-size-medium;
  font-weight: $font-weight-medium;
  line-height: $line-height-normal;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  transition: all $transition-fast;
  @include focus-ring;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  // Size modifiers
  @include modifier("small") {
    padding: $spacing-xs $spacing-small;
    font-size: $font-size-small;
    border-radius: $border-radius-small;
  }

  @include modifier("medium") {
    padding: $spacing-small $spacing-medium;
    font-size: $font-size-medium;
    border-radius: $border-radius-medium;
  }

  @include modifier("large") {
    padding: $spacing-medium $spacing-large;
    font-size: $font-size-large;
    border-radius: $border-radius-medium;
  }

  // Intent modifiers
  @include modifier("primary") {
    color: $color-white;
    background-color: $color-primary;
    border-color: $color-primary;

    &:hover:not(:disabled) {
      background-color: rgba($color-primary-dark, 0.9);
      border-color: rgba($color-primary-dark, 0.9);
    }
  }

  @include modifier("secondary") {
    color: $color-gray-700;
    background-color: $color-white;
    border-color: $color-gray-300;

    &:hover:not(:disabled) {
      background-color: rgba($color-gray-200, 0.9);
      border-color: rgba($color-gray-400, 0.9);
    }
  }

  // Variant modifiers
  @include modifier("outline") {
    background-color: transparent;
    border-width: 2px;
    border-style: solid;

    &.button--primary {
      color: $color-primary;
      border-color: $color-primary;

      &:hover:not(:disabled) {
        color: $color-white;
        background-color: $color-primary;
      }
    }
  }

  @include modifier("full-width") {
    width: 100%;
  }
}
```

### Usage Example

```html
<!-- Basic button -->
<app-button>Click me</app-button>

<!-- Primary large button -->
<app-button intent="primary" size="large">Submit</app-button>

<!-- Outline secondary button -->
<app-button intent="secondary" variant="outline" size="small"
  >Cancel</app-button
>

<!-- Full width disabled button -->
<app-button intent="primary" [fullWidth]="true" [disabled]="true">
  Processing...
</app-button>
```

---

## Summary

This styling guide ensures:

- **Consistency** across all components
- **Maintainability** through organized architecture
- **Scalability** with design system variables
- **Accessibility** with proper focus states
- **Performance** with efficient CSS structure

Follow these guidelines to maintain a professional, maintainable, and scalable styling system.
