# Design System Component Implementation Guide

## Core Principles

### 1. Consistency First

- Follow existing patterns from `input`, `select`, `radio`, `accordion` components
- Use established naming conventions and CSS custom properties
- Maintain same file structure and TypeScript patterns

### 2. Accessibility by Default

- WCAG 2.1 AA compliance
- Proper ARIA attributes and keyboard navigation
- Focus management with roving tabindex pattern
- Use `inert` for hidden focusable content

### 3. Signal-Based Architecture

- Use Angular signals, avoid observables for component state
- Implement computed values and effects properly
- Prevent infinite loops in effects

## Implementation Process

### Step 1: Planning

- Define component API (inputs, outputs, states)
- Identify required variants, sizes, and accessibility features
- Check existing components for similar patterns

### Step 2: Structure Setup

```
[component-name]/
├── [component-name].component.ts
├── [component-name].component.scss
├── [component-name].model.ts
├── [component-name]-showcase.component.ts
└── index.ts
```

### Step 3: Implementation Order

1. **Models** - Define types, interfaces, helper functions
2. **Component** - Basic template and signal-based logic
3. **Styles** - CSS with design system tokens and accessibility
4. **Showcase** - Interactive demos and documentation
5. **Testing** - Focus management and edge cases

## Key Patterns

### TypeScript

- Input signals: `variant = input<ComponentVariant>('primary')`
- State management: `componentState = signal<State>(initialState)`
- Computed values: `classes = computed(() => mergeClasses(...))`
- Effects for complex state synchronization

### Templates

- Use `@if`, `@for` (not `*ngIf`, `*ngFor`)
- Include `trackBy` functions
- Proper event handling with type safety

### Styles

- Start with `@use` imports for abstracts
- Use CSS custom properties from design system
- Include size variants, states, focus styles
- Support reduced motion and high contrast

### Focus Management

- First enabled item: `tabindex="0"`, others: `tabindex="-1"`
- Hidden content: `[attr.inert]` + CSS `visibility: hidden`
- Keyboard navigation with Arrow keys, Home/End, Enter/Space

## Critical Rules

### ✅ Do

- Follow established component patterns
- Use design system CSS variables
- Handle all states (disabled, loading, error)
- Implement proper accessibility
- Validate inputs with helpful warnings

### ❌ Don't

- Let hidden content remain focusable
- Use hardcoded CSS values
- Create complex focus effects
- Implement inconsistent APIs
- Skip accessibility features

## Testing Checklist

- [ ] Focus management works correctly
- [ ] Keyboard navigation functions
- [ ] ARIA attributes are present
- [ ] All variants/sizes render properly
- [ ] Edge cases handled gracefully
- [ ] State changes work as expected

## Reference Components

Look at existing implementations for patterns:

- **Basic interaction**: `radio`, `checkbox`
- **Complex state**: `accordion`, `select`
- **Styling consistency**: `input`, `button`
- **Focus management**: `accordion` (roving tabindex)

---

_Keep this guide updated as new patterns emerge from component implementations._
