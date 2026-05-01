# Template wymagań REQ

> Szablon do tworzenia dokumentów wymagań funkcjonalnych w tym repozytorium. Zachowuje układ zgodny z analizami biznesowymi i może być kopiowany dla nowych obszarów.

# Wymagania — `<Nazwa obszaru>`

Dokument obejmuje `<liczbę>` REQ dla obszaru **`<Nazwa obszaru>`**:
`<krótka lista zakresu, np. lista, kreator/edycja, karta szczegółów, powiązane akcje, powiadomienia>`.

---

# `<REQ-ID-001>`: `<Nazwa wymagania>`

## Cel

Użytkownik musi móc `<główny rezultat biznesowy>`.

## Funkcje

### `<Sekcja funkcjonalna 1>`

- `<opis zachowania 1>`
- `<opis zachowania 2>`
- `<opis zachowania 3>`

### `<Sekcja funkcjonalna 2>`

| Pole / element | Zachowanie |
| -------------- | ---------- |
| **`<Nazwa>`**  | `<opis>`   |
| **`<Nazwa>`**  | `<opis>`   |

### Walidacja

- **`<Pole>`**: `<reguła walidacyjna>`.
- **`<Pole>`**: `<reguła walidacyjna>`.
- Błędy walidacji są wyświetlane przy odpowiednich polach bez zamykania formularza.

### Akcje formularza

- Przycisk **Anuluj** — `<opis zachowania>`.
- Przycisk **Zapisz / Utwórz** — `<opis zachowania sukces / błąd>`.

### Stany i reguły biznesowe

- `<reguła biznesowa 1>`
- `<reguła biznesowa 2>`
- `<reguła biznesowa 3>`

### Uprawnienia i widoczność

- `<kto widzi funkcję>`
- `<kto może wykonać akcję>`
- `<kto otrzymuje skutki uboczne, np. powiadomienie>`

---

# `<REQ-ID-002>`: `<Nazwa wymagania>`

## Cel

Użytkownik musi móc `<główny rezultat biznesowy>`.

## Funkcje

### `<Sekcja funkcjonalna>`

- `<opis zachowania 1>`
- `<opis zachowania 2>`
- `<opis zachowania 3>`

### Akcje i nawigacja

- `<akcja 1>`
- `<akcja 2>`
- `<akcja 3>`

### Wyjątki / poza zakresem

- `<co świadomie nie wchodzi do bieżącej iteracji>`

---

## Wskazówki redakcyjne

- Jeden REQ powinien opisywać spójny obszar zachowania z perspektywy użytkownika.
- Nazwy identyfikatorów utrzymuj w schemacie `REQ-<OBSZAR>-XXX`.
- Sekcja **Cel** opisuje efekt biznesowy, nie rozwiązanie techniczne.
- Sekcja **Funkcje** opisuje zachowanie widoczne dla użytkownika i reguły biznesowe.
- Jeśli ekran ma formularz, dodaj osobne sekcje: pola, walidacja, akcje formularza.
- Jeśli funkcja ma skutki uboczne, opisz je jawnie: historia, powiadomienia, audit, mail, realtime.
- Gdy coś nie wchodzi do zakresu iteracji, zaznacz to jako **Poza zakresem tego REQ**.
