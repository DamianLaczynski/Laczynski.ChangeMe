# Wymagania — Issues

Dokument obejmuje pięć REQ dla obszaru **Issues**:
lista zgłoszeń, kreator i edycja zgłoszenia, karta szczegółów zgłoszenia, obserwowanie i powiadomienia oraz centrum powiadomień użytkownika.

Zakres uwzględnia także komentarze, historię zmian oraz dostarczanie powiadomień w czasie rzeczywistym i e-mailem.

Dokument uwzględnia także obecną implementację modułu `issues`, w szczególności istniejące **acceptance criteria** powiązane ze zgłoszeniem.

## Wspólne zasady UX i ładowania danych

- Ekrany i sekcje w module `issues` ładowane asynchronicznie powinny wykorzystywać **skeletons** dopasowane do docelowego układu treści.
- Nie należy stosować globalnego loadera typu spinner jako podstawowego mechanizmu ładowania ekranów `issues`.
- Skeleton powinien być widoczny lokalnie w obrębie listy, formularza, panelu szczegółów lub sekcji komentarzy/historii, zależnie od miejsca pobierania danych.
- Po załadowaniu danych skeleton znika bez pełnego przeładowania widoku.

---

# REQ-ISS-001: Lista issues

## Cel

Użytkownik musi mieć dostęp do przeglądu wszystkich zgłoszeń, móc je wyszukiwać, filtrować, sortować, przechodzić do szczegółów oraz szybko rozpoczynać tworzenie nowego issue.

## Funkcje

### Pasek wyszukiwania i akcji

- Pole tekstowe z placeholderem _Szukaj issue…_ filtruje listę po fragmencie **tytułu issue**, **identyfikatora issue** lub **opisu**.
- Przycisk **Szukaj** stosuje filtr tekstowy do listy.
- Przycisk **+ Dodaj issue** otwiera formularz tworzenia zgłoszenia (REQ-ISS-002).

### Tabela issues — kolumny

| Kolumna | Opis |
| --- | --- |
| **ID** | Unikalny identyfikator zgłoszenia; klikalny link do karty issue (REQ-ISS-003). |
| **Tytuł** | Krótki tytuł zgłoszenia; klikalny link do karty issue. |
| **Status** | Badge statusu issue, np. **Nowe**, **W trakcie**, **Rozwiązane**, **Zamknięte**. |
| **Priorytet** | Badge priorytetu, np. **Niski**, **Średni**, **Wysoki**, **Krytyczny**. |
| **Przypisany do** | Imię i nazwisko przypisanego użytkownika lub informacja o braku przypisania. |
| **Ostatnia aktywność** | Data i czas ostatniej zmiany, komentarza lub innej aktywności na issue. |
| **Akcje** | Przyciski: **Pokaż szczegóły** oraz **Obserwuj / Przestań obserwować**; przycisk może także pokazywać liczbę obserwujących. |

### Sortowanie

- Kolumna **ID** sortowalna rosnąco i malejąco.
- Kolumna **Tytuł** sortowalna alfabetycznie rosnąco i malejąco.
- Kolumna **Data utworzenia** sortowalna chronologicznie rosnąco i malejąco.
- Kolumna **Ostatnia aktywność** sortowalna chronologicznie rosnąco i malejąco.
- Aktywna kolumna sortowania jest wizualnie oznaczona kierunkiem.

### Filtry panelu

- Filtr **Status** — jedno- lub wielokrotny wybór; brak wyboru oznacza brak ograniczenia.
- Filtr **Priorytet** — jedno- lub wielokrotny wybór; brak wyboru oznacza brak ograniczenia.
- Filtr **Przypisany do** — wybór użytkownika ze słownika.
- Filtr **Obserwowane przeze mnie** — przełącznik pokazujący wyłącznie issue obserwowane przez zalogowanego użytkownika.
- Filtr **Moje issue** — przełącznik pokazujący wyłącznie issue utworzone przez zalogowanego użytkownika lub do niego przypisane.
- Wszystkie filtry działają łącznie z polem tekstowym według logiki **AND**.
- Możliwość wyczyszczenia wszystkich filtrów jednocześnie przyciskiem **Wyczyść filtry**.

---

# REQ-ISS-002: Kreator i edycja issue

## Cel

Użytkownik musi móc utworzyć nowe zgłoszenie i edytować istniejące, podając komplet podstawowych danych, a po zapisie przejść do karty szczegółów issue.

## Funkcje

### Sekcja „Podstawowe dane issue”

| Pole | Zachowanie |
| --- | --- |
| **Tytuł** | Pole tekstowe, **wymagane**. |
| **Opis** | Obszar tekstowy wielowierszowy, **wymagane**. |
| **Status** | Lista wyboru statusów issue; **wymagane**; wartość domyślna w kreatorze: **Nowe**. |
| **Priorytet** | Lista wyboru priorytetów; **wymagane**; wartość domyślna w kreatorze: **Średni**. |
| **Przypisany do** | Wybór użytkownika ze słownika; **opcjonalne**. |
| **Acceptance criteria** | Lista kryteriów akceptacji; użytkownik może dodać wiele pozycji; pojedyncza pozycja zawiera tekst kryterium. |
| **Obserwuj po utworzeniu** | Pole wyboru; domyślnie zaznaczone dla autora issue. |

**Pola systemowe:**

- **ID issue** — nadawane przez system przy pierwszym zapisie.
- **Autor** — ustawiany na aktualnie zalogowanego użytkownika przy tworzeniu.
- **Data utworzenia** — nadawana przez system przy pierwszym zapisie; tylko do odczytu.
- **Data ostatniej aktywności** — aktualizowana automatycznie przez system; tylko do odczytu.

### Walidacja

- **Tytuł**: wymagany; zapis niemożliwy przy pustym polu.
- **Opis**: wymagany; zapis niemożliwy przy pustym polu.
- **Status**: wymagany; musi być jedną z dozwolonych wartości słownikowych.
- **Priorytet**: wymagany; musi być jedną z dozwolonych wartości słownikowych.
- **Przypisany do**: jeśli wskazany, musi pochodzić ze słownika użytkowników.
- **Acceptance criterion**: jeśli pozycja została dodana do listy, jej treść jest wymagana.
- Błędy walidacji są wyświetlane przy odpowiednich polach bez zamykania formularza.

### Akcje formularza

- Przycisk **Anuluj** — zamknięcie formularza bez zapisu.
- Przycisk **Utwórz issue** / **Zapisz zmiany** — inicjuje walidację; sukces powoduje zapis i przejście do karty issue, błąd pozostawia formularz otwarty z komunikatami.

### Spójność kreatora i edycji

- Formularz edycji używa tych samych pól i reguł walidacji co kreator, z wyjątkiem pól systemowych tylko do odczytu.
- W trybie edycji użytkownik może zmienić co najmniej: **Tytuł**, **Opis**, **Status**, **Priorytet**, **Przypisany do**.
- W kreatorze i edycji użytkownik może dodawać, usuwać i modyfikować pozycje **acceptance criteria**.
- Po utworzeniu issue autor może zostać automatycznie dodany do obserwujących, jeśli zaznaczono opcję **Obserwuj po utworzeniu**.
- Każde utworzenie i każda edycja issue zapisuje wpis w historii zmian (REQ-ISS-003).

---

# REQ-ISS-003: Karta issue, komentarze i historia zmian

## Cel

Karta issue jest centralnym widokiem szczegółowym, w którym użytkownik przegląda pełne dane zgłoszenia, komentuje je, śledzi historię zmian i wykonuje podstawowe akcje operacyjne.

## Funkcje

### Nagłówek karty issue

- Wyświetla pola: **ID issue**, **Tytuł**, **Status**, **Priorytet**, **Autor**, **Przypisany do**, **Data utworzenia**, **Data ostatniej aktywności**.
- Widoczny jest stan obserwacji bieżącego użytkownika: **Obserwujesz** / **Nie obserwujesz**.
- Przycisk **Edytuj issue** otwiera formularz edycji (REQ-ISS-002).
- Przycisk **Obserwuj** lub **Przestań obserwować** zarządza subskrypcją użytkownika (REQ-ISS-004).

### Sekcja opisu

- Pełny **Opis** issue jest wyświetlany jako treść tylko do odczytu.

### Sekcja acceptance criteria

- Karta issue wyświetla listę **acceptance criteria** powiązanych ze zgłoszeniem.
- Każda pozycja prezentuje pełną treść kryterium.
- Jeśli issue nie ma zdefiniowanych kryteriów akceptacji, widok pokazuje czytelną informację o ich braku.

### Sekcja komentarzy

- Użytkownicy mogą dodawać komentarze do issue.
- Każdy komentarz wyświetla: **autora**, **datę i czas dodania** oraz **pełną treść**.
- Komentarze są sortowane chronologicznie rosnąco, chyba że moduł przyjmie inny globalny standard.
- Dodanie komentarza aktualizuje **Datę ostatniej aktywności** issue.
- Dodanie komentarza może generować powiadomienia dla obserwujących (REQ-ISS-004).

### Walidacja komentarzy

- **Treść komentarza**: wymagana; pusty komentarz nie może zostać zapisany.
- Po błędzie walidacji formularz komentarza pozostaje otwarty.

### Sekcja historii zmian

- Karta issue zawiera listę historii aktywności dla zgłoszenia.
- Historia obejmuje co najmniej: utworzenie issue, zmianę statusu, zmianę priorytetu, zmianę osoby przypisanej, edycję tytułu, edycję opisu.
- Każdy wpis historii zawiera: **typ zdarzenia**, **użytkownika wykonującego akcję**, **datę i czas**, oraz zwięzły opis zmiany.
- Dla zmian pól historia powinna pokazywać wartości **przed** i **po**, jeśli jest to dostępne i czytelne dla użytkownika.
- Historia jest tylko do odczytu i służy audytowi przebiegu pracy nad issue.

### Akcje i nawigacja

- Przycisk **Wróć do listy issues** prowadzi do listy zgłoszeń.
- Po zapisaniu edycji użytkownik wraca na kartę issue z odświeżonymi danymi.
- Po dodaniu komentarza użytkownik pozostaje na karcie issue i widzi nowy komentarz bez ręcznego odświeżania widoku.

---

# REQ-ISS-004: Obserwowanie issue i powiadomienia realtime / e-mail

## Cel

Użytkownik musi móc obserwować wybrane issue i otrzymywać powiadomienia o aktywności związanej z tym zgłoszeniem w czasie rzeczywistym oraz e-mailem.

## Funkcje

### Zarządzanie obserwowaniem

- Użytkownik może ręcznie rozpocząć obserwowanie issue z poziomu listy issue i karty issue.
- Użytkownik może ręcznie zakończyć obserwowanie issue z tych samych miejsc.
- Stan obserwowania jest zapisywany per użytkownik i per issue.
- System nie może duplikować obserwacji tego samego issue dla tego samego użytkownika.
- Przycisk **Obserwuj / Przestań obserwować** może także prezentować aktualną liczbę obserwujących dane issue.

### Zdarzenia generujące powiadomienia

- Powiadomienia są generowane co najmniej dla zdarzeń:
  - utworzenie komentarza,
  - zmiana statusu,
  - zmiana priorytetu,
  - zmiana osoby przypisanej,
  - edycja tytułu,
  - zamknięcie lub ponowne otwarcie issue.

### Powiadomienia realtime

- Obserwujący użytkownik otrzymuje powiadomienie w interfejsie bez konieczności ręcznego odświeżenia strony.
- Powiadomienie realtime zawiera co najmniej: **typ zdarzenia**, **tytuł issue**, **krótki opis zmiany**, **czas zdarzenia** oraz **link do issue**.
- Jeśli użytkownik jest aktualnie zalogowany i aktywny w aplikacji, powiadomienie powinno pojawić się w centrum powiadomień oraz opcjonalnie jako sygnał natychmiastowy w UI.
- Frontend utrzymuje aktywne połączenie realtime z hubem powiadomień dla zalogowanego użytkownika.
- Frontend nasłuchuje zdarzeń dotyczących nowych powiadomień i zmian na obserwowanych issue.
- Po odebraniu zdarzenia realtime frontend aktualizuje bez przeładowania strony co najmniej: licznik nieprzeczytanych powiadomień, listę powiadomień oraz widok aktualnie otwartego issue, jeżeli zdarzenie dotyczy tego issue.
- Jeżeli otwarta jest lista issues, frontend odświeża bez ręcznego refreshu co najmniej status, priorytet, liczbę obserwujących i datę ostatniej aktywności dla issue objętych zdarzeniem.
- Jeżeli otwarta jest karta issue, frontend odświeża bez ręcznego refreshu komentarze, historię zmian, stan obserwowania, ostatnią aktywność oraz inne pola zmienione przez zdarzenie.

### Powiadomienia e-mail

- System wysyła również powiadomienie e-mail dla każdego zdarzenia objętego mechanizmem powiadomień.
- E-mail powinien zawierać co najmniej: **tytuł issue**, **rodzaj zmiany**, **krótki opis**, **czas zdarzenia** oraz **link prowadzący do szczegółów issue**.
- Zdarzenie objęte takim e-mailem musi zostać równolegle zapisane jako powiadomienie w aplikacji, aby po zalogowaniu użytkownik widział, że zaszła zmiana.
- Po zalogowaniu użytkownik widzi takie powiadomienie w centrum powiadomień i po kliknięciu może przejść bezpośrednio do danego issue.
- System powinien unikać wielokrotnego wysyłania identycznych wiadomości dla tego samego zdarzenia i tego samego użytkownika.

### Reguły biznesowe

- Autor issue może być domyślnie obserwatorem nowo utworzonego zgłoszenia.
- Użytkownik, który przestaje obserwować issue, przestaje otrzymywać nowe powiadomienia dotyczące tego issue od momentu rezygnacji.

---

# REQ-ISS-005: Centrum powiadomień użytkownika

## Cel

Użytkownik musi mieć dostęp do osobistego centrum powiadomień, w którym widzi nowe i archiwalne powiadomienia związane z obserwowanymi issue oraz może oznaczać je jako przeczytane.

## Funkcje

### Dzwonek powiadomień

- W górnym pasku aplikacji dostępna jest ikona **dzwonka** prowadząca do centrum powiadomień lub rozwijanego panelu.
- Ikona dzwonka pokazuje liczbę nieprzeczytanych powiadomień.
- Nowe powiadomienia są dodawane do listy bez ręcznego odświeżenia strony.
- Otrzymanie powiadomienia realtime aktualizuje dzwonek i jego licznik natychmiast, bez przechodzenia do innego widoku.

### Lista powiadomień

- Użytkownik widzi zarówno **nowe**, jak i **starsze** powiadomienia.
- Każde powiadomienie prezentuje co najmniej: **typ zdarzenia**, **tytuł issue**, **krótki opis**, **czas zdarzenia** oraz **stan przeczytania**.
- Kliknięcie w powiadomienie przenosi użytkownika do odpowiedniego issue.
- Lista może być podzielona wizualnie na sekcje **Nieprzeczytane** i **Przeczytane** lub rozróżniona innym czytelnym mechanizmem.

### Oznaczanie jako przeczytane

- Użytkownik może oznaczyć pojedyncze powiadomienie jako przeczytane.
- Użytkownik może opcjonalnie oznaczyć wiele powiadomień lub wszystkie widoczne jako przeczytane, jeśli moduł przewiduje taką akcję zbiorczą.
- Oznaczenie jako przeczytane aktualizuje licznik na ikonie dzwonka bez przeładowania strony.

### Stany i retencja

- Powiadomienie nie znika po przeczytaniu; przechodzi do stanu historycznego.
- Powiadomienia historyczne pozostają dostępne użytkownikowi przez okres zgodny z polityką retencji systemu.
- System rozróżnia co najmniej dwa stany: **nieprzeczytane** i **przeczytane**.

### Spójność z issue

- Kliknięcie w powiadomienie otwiera kartę właściwego issue.
- Po przejściu z powiadomienia do issue użytkownik widzi aktualny stan zgłoszenia, komentarze i historię zmian.
- Centrum powiadomień jest źródłem informacji o nowych zdarzeniach, ale nie zastępuje historii zmian na karcie issue.

---

## Kryteria akceptacji przekrojowe

- Lista, karta szczegółów i formularze `issues` podczas ładowania danych prezentują lokalne **skeletons**, a nie globalny spinner blokujący cały ekran.
- Użytkownik może dodać issue z **acceptance criteria**, a po zapisie widzi te kryteria na karcie szczegółów issue.
- Użytkownik może edytować istniejące **acceptance criteria** zgłoszenia i po zapisie widzi zaktualizowaną listę na karcie issue.
- Użytkownik może rozpocząć i zakończyć obserwowanie issue z listy oraz z karty szczegółów.
- Jeżeli na obserwowanym issue zajdzie zmiana, system wysyła e-mail i jednocześnie zapisuje powiadomienie w aplikacji.
- Po ponownym zalogowaniu użytkownik widzi nieprzeczytane powiadomienie w dzwonku i po kliknięciu przechodzi do właściwego issue.
- Dodanie komentarza aktualizuje ostatnią aktywność issue i jest widoczne bez ręcznego odświeżania.
- Frontend utrzymuje aktualny interfejs listy issues, karty issue oraz centrum powiadomień przy użyciu mechanizmu realtime, bez wymuszania ręcznego odświeżania strony.
- Brak połączenia realtime nie może blokować podstawowego działania aplikacji, ale po odzyskaniu połączenia frontend powinien wznowić nasłuch i zsynchronizować stan interfejsu.
