# REQ Template

> Template for writing functional requirements documents in this repository. It preserves the structure used in business analysis and can be copied for new areas.

# Requirements - `<Area Name>`

This document covers `<count>` REQs for the **`<Area Name>`** area:
`<short scope summary, for example list, create/edit flow, details page, related actions, notifications>`.

---

# `<REQ-ID-001>`: `<Requirement Name>`

## Goal

The user must be able to `<main business outcome>`.

## Features

### `<Functional Section 1>`

- `<behavior description 1>`
- `<behavior description 2>`
- `<behavior description 3>`

### `<Functional Section 2>`

| Field / element | Behavior |
| --------------- | -------- |
| **`<Name>`** | `<description>` |
| **`<Name>`** | `<description>` |

### Validation

- **`<Field>`**: `<validation rule>`.
- **`<Field>`**: `<validation rule>`.
- Validation errors are shown next to the relevant fields without closing the form.

### Form actions

- **Cancel** button - `<behavior description>`.
- **Save / Create** button - `<success / failure behavior description>`.

### States and business rules

- `<business rule 1>`
- `<business rule 2>`
- `<business rule 3>`

### Permissions and visibility

- `<who can see the feature>`
- `<who can perform the action>`
- `<who receives side effects, for example a notification>`

---

# `<REQ-ID-002>`: `<Requirement Name>`

## Goal

The user must be able to `<main business outcome>`.

## Features

### `<Functional Section>`

- `<behavior description 1>`
- `<behavior description 2>`
- `<behavior description 3>`

### Actions and navigation

- `<action 1>`
- `<action 2>`
- `<action 3>`

### Exceptions / out of scope

- `<what is intentionally excluded from the current iteration>`

---

## Writing guidelines

- A single REQ should describe one coherent behavior area from the user's perspective.
- Keep identifiers in the `REQ-<AREA>-XXX` format.
- The **Goal** section describes the business outcome, not the technical solution.
- The **Features** section describes user-visible behavior and business rules.
- If the screen contains a form, add separate sections for fields, validation, and form actions.
- If the feature has side effects, describe them explicitly: history, notifications, audit, email, real time.
- When something is not included in the current iteration, mark it clearly as **Out of scope for this REQ**.
