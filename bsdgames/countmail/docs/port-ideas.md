# `countmail` — Port Ideas

`countmail` is a joke utility, so modernisation means preserving the
joke while making it useful — or funnier — in today's notification
landscape.

---

## Gameplay Modernisation

- **Mock mode:** Add a `--mock N` flag so users can experience the
  output without needing a real mailbox.
- **Achievement system:** Unlock badges for inbox milestones (e.g.
  "Inbox Zero", "1000 Unread", "Septillionaire").
- **Competitive mode:** Compare mailbox counts with friends and crown
  the most overwhelmed.

## UI/UX Design Ideas

- **Rich terminal output:** Use colour, emoji-free ASCII art, and
  progress bars to dramatise the count.
- **Desktop notification:** Run `countmail` from cron and deliver the
  result as a system notification.
- **Web dashboard:** A single-page app that reads from an IMAP account
  and displays the count with the original all-caps flair.
- **Accessibility:** Screen-reader friendly output with adjustable
  volume for the laughter.

## Internet Multiplayer Design

- **Leaderboard:** A public (opt-in) leaderboard of highest unread
  counts, with the original `HAHAHAHAHA!` flavour.
- **Guild mail stats:** A bot that posts the team's aggregate unread
  count to Slack or Discord once a day.

## Persistence / Cloud / Cross-Device

- Sync counts across mail clients.
- Historical graph of daily unread counts.
- Store "best" (worst) counts in the cloud.

## Other Modernisation Angles

- **Multiple backends:** Support `from`, IMAP, Gmail API, Microsoft
  Graph, or filesystem Maildir.
- **Localisation:** Shout the count in languages other than English.
- **Quiet mode:** For users who actually want to know their count
  without the theatre.

## What NOT to Change

- Keep the all-caps, exclamation-heavy output style. It is the core
  identity of the program.
- Preserve the singular/plural distinction for `ONE`.
- Do not remove the final `HAHAHAHAHA!`.

## Open Questions

- Should the port still depend on `from(1)`, or should it default to a
  modern mail backend?
- Is there any serious use case, or should the port lean even harder
  into being a novelty?
