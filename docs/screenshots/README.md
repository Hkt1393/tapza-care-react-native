# Tapza Care screenshot references

This library keeps the user-provided UI captures available as visual references for implementation and review. These are reference images, not evidence that the current app matches them. The original JPEG files are preserved without cropping, resizing, or recompression.

## Folders

- `home/` — Home screen, theme, scroll position, and overlay references.
- `book/` — Doctor selection and appointment booking references.
- `prescriptions/` — Prescription list and detail references.
- `doses/` — Scheduled dose reminder and taken-state references.
- `reminders/` — Reminder-specific flows not represented by the current dose captures.
- `family/` — Family destination references.
- `authentication/` — Sign-in and account access references.
- `shared/` — Reusable UI references that do not belong to one screen.

The `reminders/`, `family/`, `authentication/`, and `shared/` folders currently have no classified screenshots. Their `.gitkeep` files retain the requested folders until suitable references are supplied.

## Captures added

All 14 supplied images were readable as 720 × 1600 JPEGs and were copied on 2026-10-23. Everyday and Diwali describe the selected app theme shown in the capture. Each linked image is the unmodified original attachment.

### Home

- [home-diwali-mid-scroll.jpeg](home/home-diwali-mid-scroll.jpeg) — Diwali theme; mid-page view with doctor/service content.
- [home-diwali-top.jpeg](home/home-diwali-top.jpeg) — Diwali theme; top view with greeting, hero, and care shortcuts.
- [home-everyday-top.jpeg](home/home-everyday-top.jpeg) — Everyday theme; top view with greeting, hero, and care shortcuts.
- [home-everyday-services-doctors-offer.jpeg](home/home-everyday-services-doctors-offer.jpeg) — Everyday theme; lower view with service cards, doctor carousel, and offer banner.
- [home-everyday-top-settings-overlay.jpeg](home/home-everyday-top-settings-overlay.jpeg) — Everyday theme; top view with the settings overlay visible.
- [home-everyday-top-alternate-capture.jpeg](home/home-everyday-top-alternate-capture.jpeg) — Alternate Everyday top capture, visually similar to the other top references.

### Book

- [book-doctor-list-everyday.jpeg](book/book-doctor-list-everyday.jpeg) — Everyday theme; doctor selection list.
- [booking-sheet-everyday-dates.jpeg](book/booking-sheet-everyday-dates.jpeg) — Everyday theme; appointment sheet with date choices and available times.
- [booking-sheet-everyday-slot-selected.jpeg](book/booking-sheet-everyday-slot-selected.jpeg) — Everyday theme; appointment sheet with a time selected and confirmation action visible.

### Prescriptions

- [prescriptions-list-diwali.jpeg](prescriptions/prescriptions-list-diwali.jpeg) — Diwali theme; prescription list with two prescriptions.
- [prescriptions-list-everyday.jpeg](prescriptions/prescriptions-list-everyday.jpeg) — Everyday theme; prescription list with two prescriptions.
- [prescription-detail-diwali-not-taken.jpeg](prescriptions/prescription-detail-diwali-not-taken.jpeg) — Diwali theme; prescription detail and medicine schedule with doses not taken.

### Doses

- [dose-reminders-diwali-not-taken.jpeg](doses/dose-reminders-diwali-not-taken.jpeg) — Diwali theme; scheduled dose list with doses not taken.
- [dose-reminders-everyday-not-taken.jpeg](doses/dose-reminders-everyday-not-taken.jpeg) — Everyday theme; scheduled dose list with doses not taken.

## Missing references and classification notes

- No dedicated Family, Authentication, or shared-component screenshot was supplied.
- The two Doses captures show scheduled-dose reminder lists; no separate reminder setup or notification state was supplied.
- No dose marked-taken screenshot was supplied.
- The Home top captures include similar content; the alternate capture is retained rather than discarded.
- The visible system status bar is part of each original capture. These images are not cropped status-bar-only references.
