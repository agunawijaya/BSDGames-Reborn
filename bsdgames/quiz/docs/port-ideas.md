# `quiz` — Port Ideas

`quiz` is a content-first drill program. Modernisation means better
content authoring, richer UI, and smarter learning algorithms.

---

## Gameplay Modernisation

- **Spaced repetition:** Replace tutorial mode with an SM-2 scheduler.
- **Multiple choice:** Offer a choice of four answers.
- **Hints:** Show first letter, then second, etc.
- **Difficulty tags:** Tag each question Easy/Medium/Hard.

## UI/UX Design Ideas

- **Web editor:** WYSIWYG creation of quiz data files.
- **Card UI:** Flip-card animation for question/answer.
- **Progress bars:** Show mastery per category.
- **Mobile app:** Swipe to reveal, tap to answer.

## Internet Multiplayer Design

- **Shared decks:** Classrooms or study groups share a subject file.
- **Leaderboards:** Fastest correct streak per subject.
- **Head-to-head:** Two players race on the same question set.

## Persistence / Cloud / Cross-Device

- Save per-user performance per question.
- Sync progress across devices.
- Cloud-hosted community subjects.

## Other Modernisation Angles

- **Import formats:** Anki, CSV, JSON.
- **Accessibility:** Screen-reader support, dyslexic fonts.
- **Localisation:** Unicode category names and answers.

## What NOT to Change

- Keep the colon-separated data format as an import/export option.
- Preserve the ability to drill categories in either direction.

## Open Questions

- Should the port keep the bundled "cynical" subjects, replace them,
  or make them opt-in?
- Should the custom regexp engine be kept, or replaced with standard
  regex?
