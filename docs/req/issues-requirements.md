# Requirements - Issues

This document covers five REQs for the **Issues** area:
issue list, issue create/edit flow, issue details page, watching and notifications, and the user notification center.

The scope also includes comments, change history, and delivering notifications in real time and by email.

The document also reflects the current `issues` module implementation, especially the existing **acceptance criteria** attached to an issue.

## Shared UX and data-loading rules

- The issues list, issue details page, create flow, edit flow, and notification center are available only to authenticated users.
- Screens and sections in the `issues` module that load data asynchronously should use **skeletons** matching the target layout.
- A global spinner-style loader must not be used as the primary loading mechanism for `issues` screens.
- Skeletons should be displayed locally within the list, form, details panel, or comments/history section depending on where data is being fetched.
- After data is loaded, the skeleton disappears without a full view reload.
- The real-time refresh mechanism for the issues list and issue details page is independent from the watch mechanism. Watching is used only to deliver user notifications.

---

# REQ-ISS-001: Issue List

## Goal

The user must be able to browse all issues, search, filter, sort, navigate to details, and quickly start creating a new issue.

## Features

### Search and actions bar

- A text field with the placeholder _Search issues..._ filters the list by a fragment of the **issue title**, **issue identifier**, or **description**.
- The **Search** button applies the text filter to the list.
- The **+ Add issue** button opens the issue creation form (REQ-ISS-002).

### Issues table - columns

| Column | Description |
| ------ | ----------- |
| **ID** | Unique issue identifier; clickable link to the issue details page (REQ-ISS-003). |
| **Title** | Short issue title; clickable link to the issue details page. |
| **Status** | Issue status badge, for example **New**, **In Progress**, **Resolved**, **Closed**. |
| **Priority** | Priority badge, for example **Low**, **Medium**, **High**, **Critical**. |
| **Assigned To** | Full name of the assigned user or information that the issue is unassigned. |
| **Last Activity** | Date and time of the most recent change, comment, or other activity on the issue. |
| **Actions** | Buttons: **View details** and **Watch / Unwatch**; the button may also display the watcher count. |

### Sorting

- The **ID** column is sortable ascending and descending.
- The **Title** column is sortable alphabetically ascending and descending.
- The **Created Date** column is sortable chronologically ascending and descending.
- The **Last Activity** column is sortable chronologically ascending and descending.
- The active sort column is visually marked together with the sort direction.

### Filter panel

- **Status** filter: single- or multi-select; no selection means no restriction.
- **Priority** filter: single- or multi-select; no selection means no restriction.
- **Assigned To** filter: user selector populated from the user dictionary.
- **Watched by me** filter: toggle that shows only issues watched by the current user.
- **My issues** filter: toggle that shows only issues created by or assigned to the current user.
- All filters work together with the text field using **AND** logic.
- The user can clear all filters at once with the **Clear filters** button.

---

# REQ-ISS-002: Issue Create and Edit Flow

## Goal

The user must be able to create a new issue and edit an existing one by providing the required core data, and after saving be taken to the issue details page.

## Features

### "Issue core data" section

| Field | Behavior |
| ----- | -------- |
| **Title** | Text field, **required**. |
| **Description** | Multiline text area, **required**. |
| **Status** | Issue status dropdown; **required**; default value in create flow: **New**. |
| **Priority** | Priority dropdown; **required**; default value in create flow: **Medium**. |
| **Assigned To** | User selector populated from the user dictionary; **optional**. |
| **Acceptance Criteria** | List of acceptance criteria; the user can add multiple items; each item contains criterion text. |
| **Watch after creation** | Checkbox; selected by default for the issue author. |

**System fields:**

- **Issue ID** - assigned by the system on first save.
- **Author** - set to the currently authenticated user during creation.
- **Created Date** - assigned by the system on first save; read-only.
- **Last Activity Date** - updated automatically by the system; read-only.

### Validation

- **Title**: required; save is blocked when empty.
- **Description**: required; save is blocked when empty.
- **Status**: required; must be one of the allowed dictionary values.
- **Priority**: required; must be one of the allowed dictionary values.
- **Assigned To**: if provided, it must come from the user dictionary.
- **Acceptance criterion**: when an item is added to the list, its text is required.
- Validation errors are shown next to the relevant fields without closing the form.

### Form actions

- **Cancel** button: closes the form without saving.
- **Create issue** / **Save changes** button: triggers validation; success saves and navigates to the issue page, failure keeps the form open with validation messages.

### Consistency between create and edit

- The edit form uses the same fields and validation rules as the create flow, except for system fields that are read-only.
- In edit mode, the user can change at least: **Title**, **Description**, **Status**, **Priority**, and **Assigned To**.
- In both create and edit flows, the user can add, remove, and modify **acceptance criteria** items.
- After issue creation, the author can be automatically added to watchers when **Watch after creation** is selected.
- Every issue creation and every issue edit writes an entry to change history (REQ-ISS-003).

---

# REQ-ISS-003: Issue Details, Comments, and Change History

## Goal

The issue details page is the central detailed view where the user reviews the full issue data, adds comments, tracks change history, and performs core operational actions.

Access to the issue details page requires authentication.

## Features

### Issue header

- Displays: **Issue ID**, **Title**, **Status**, **Priority**, **Author**, **Assigned To**, **Created Date**, and **Last Activity Date**.
- Shows the current user's watch state: **Watching** / **Not watching**.
- The **Edit issue** button opens the edit form (REQ-ISS-002).
- The **Watch** or **Unwatch** button manages the user's subscription (REQ-ISS-004).

### Description section

- The full issue **Description** is displayed as read-only content.

### Acceptance criteria section

- The issue details page displays the list of **acceptance criteria** linked to the issue.
- Each item shows the full criterion text.
- If the issue has no acceptance criteria, the view shows a clear empty-state message.

### Comments section

- Users can add comments to an issue.
- Each comment displays: **author**, **date and time**, and **full content**.
- Comments are sorted chronologically ascending unless the module adopts a different global standard.
- Adding a comment updates the issue **Last Activity Date**.
- Adding a comment can trigger notifications for watchers (REQ-ISS-004).

### Comment validation

- **Comment content**: required; an empty comment cannot be saved.
- After a validation error, the comment form remains open.

### Change history section

- The issue page includes an activity history list for the issue.
- History includes at least: issue creation, status change, priority change, assignee change, title edit, and description edit.
- Each history entry contains: **event type**, **acting user**, **date and time**, and a concise change description.
- For field changes, history should show **before** and **after** values when available and understandable to the user.
- History is read-only and serves as an audit trail of work on the issue.

### Actions and navigation

- The **Back to issues list** button navigates to the issues list.
- After saving an edit, the user returns to the issue page with refreshed data.
- After adding a comment, the user stays on the issue page and sees the new comment without manually refreshing the view.

---

# REQ-ISS-004: Watching Issues and Real-Time / Email Notifications

## Goal

The user must be able to watch selected issues and receive notifications about activity related to those issues in real time and by email.

## Features

### Watch management

- The user can manually start watching an issue from the issues list and from the issue details page.
- The user can manually stop watching an issue from the same places.
- Watch state is stored per user and per issue.
- The system must not duplicate the same issue watch for the same user.
- The **Watch / Unwatch** button may also display the current watcher count for the issue.

### Events that generate notifications

- Notifications are generated at minimum for:
  - comment creation,
  - status change,
  - priority change,
  - assignee change,
  - title edit,
  - issue close or reopen.

### Real-time notifications

- A watching user receives a notification in the UI without manually refreshing the page.
- A real-time notification includes at least: **event type**, **issue title**, **short change summary**, **event time**, and **link to the issue**.
- If the user is authenticated and active in the application, the notification should appear in the notification center and optionally as an immediate UI signal.
- The frontend keeps an active real-time connection to the notifications hub for the authenticated user.
- The frontend listens to at least two classes of real-time events:
  - events for newly created notifications for watching users,
  - issue change events used to refresh the list and details views.
- After receiving a notification event, the frontend updates at least the unread notification counter and notification list without reloading the page.
- If the issues list is open, the frontend refreshes at least status, priority, watcher count, and last activity date for affected issues without a manual refresh, regardless of whether the current user watches the issue.
- If an issue details page is open, the frontend refreshes comments, change history, watch state, last activity, and any other fields affected by the issue change event without a manual refresh, regardless of whether the current user watches the issue.

### Email notifications

- The system also sends an email notification for every event covered by the notification mechanism.
- The email contains at least: **issue title**, **change type**, **short summary**, **event time**, and **link to issue details**.
- An event covered by such an email must also be stored as an in-app notification so the user can see it after signing in.
- After signing in, the user sees the notification in the notification center and can navigate directly to the issue by clicking it.
- The system should avoid sending duplicate messages for the same event to the same user.

### Business rules

- The issue author may be a default watcher of a newly created issue.
- A user who stops watching an issue stops receiving new notifications about that issue from the moment they opt out.

---

# REQ-ISS-005: User Notification Center

## Goal

The user must have access to a personal notification center where they can see new and historical notifications related to watched issues and mark them as read.

## Features

### Notification bell

- A **bell** icon is available in the top application bar and opens the notification center or a dropdown panel.
- The bell icon shows the unread notification count.
- New notifications are added to the list without manually refreshing the page.
- Receiving a real-time notification updates the bell and its counter immediately without navigating to another view.

### Notification list

- The user can see both **new** and **older** notifications.
- Each notification displays at least: **event type**, **issue title**, **short summary**, **event time**, and **read state**.
- Clicking a notification navigates the user to the relevant issue.
- The list may be visually separated into **Unread** and **Read** sections, or use another clear distinction mechanism.

### Mark as read

- The user can mark a single notification as read.
- The user can optionally mark multiple notifications or all visible notifications as read if the module supports a bulk action.
- Marking notifications as read updates the bell counter without reloading the page.

### States and retention

- A notification does not disappear after being read; it moves to a historical state.
- Historical notifications remain available to the user for a period defined by the system retention policy.
- The system distinguishes at least two states: **Unread** and **Read**.
- The notification retention policy must be explicitly defined and configurable on the backend.
- Default retention policy:
  - an **unread** notification remains available for **90 days** from the event time,
  - a **read** notification remains available for **30 days** from the moment it is marked as read,
  - regardless of state, a single notification must not be stored longer than **180 days** from the event time.
- After the retention period expires, the notification disappears from the user's notification center and may be physically removed from the database.
- Retention applies only to the notification record in the notification center; it does not remove comments, change history, or the issue itself.
- The expired-notification cleanup mechanism must run automatically on the system side and must not require user action.
- Reading the notifications list must not return expired records even if physical cleanup has not yet run.

### Consistency with issues

- Clicking a notification opens the relevant issue details page.
- After navigating from a notification to an issue, the user sees the current issue state, comments, and change history.
- The notification center is a source of information about new events, but it does not replace the change history on the issue page.

---

## Cross-cutting acceptance criteria

- The list, details page, and `issues` forms display local **skeletons** while loading data instead of a global blocking spinner.
- The user can create an issue with **acceptance criteria**, and after saving sees those criteria on the issue details page.
- The user can edit existing issue **acceptance criteria**, and after saving sees the updated list on the issue details page.
- The user can start and stop watching an issue from both the list and the issue details page.
- If a watched issue changes, the system sends an email and stores an in-app notification at the same time.
- After signing in again, the user sees the unread notification in the bell and can navigate to the correct issue by clicking it.
- Adding a comment updates the issue last activity and is visible without manually refreshing the page.
- The frontend keeps the issues list, issue details page, and notification center up to date through a real-time mechanism without forcing manual page refresh.
- Loss of the real-time connection must not block the core application flow, but after reconnection the frontend should resume listening and resynchronize UI state.
