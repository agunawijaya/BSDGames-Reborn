# `battlestar(6)` — Man Page Annotation

> Annotated modern mirror of the classic 4.2BSD `battlestar(6)` manual page.

---

```text
BATTLESTAR(6)                BSD Games Manual                BATTLESTAR(6)

NAME
     battlestar — a tropical adventure game

SYNOPSIS
     battlestar [-r] [saved-file]

DESCRIPTION
     battlestar is an adventure game in the classic style. However, it's
     slightly less of a puzzle and more a game of exploration. There are
     a few magical words in the game, but on the whole, simple English
     should suffice to make one's desires understandable to the parser.

THE SETTING
     In the days before the darkness came, when battlestars ruled the
     heavens...

           Three He made and gave them to His daughters,
           Beautiful nymphs, the goddesses of the waters.
           One to bring good luck and simple feats of wonder,
           Two to wash the lands and churn the waves asunder,
           Three to rule the world and purge the skies with thunder.

     In those times great wizards were known and their powers were beyond
     belief. They could take any object from thin air, and, uttering the
     word "su" could disappear.

COMMANDS
     Commands are typically two or three words: a verb followed by one
     or two nouns. Directions may be specified either as absolute compass
     headings (north, south, east, west, up, down) or as relative
     headings (ahead, back, left, right).

     Common verbs include:
           take, drop, wear, draw, put, look, inven, eat, drink,
           light, launch, land, fight, shoot, dig, sleep, save, score,
           quit.

FILES
     /var/games/battlestar.log   shared high-score log file
     ~/.Bstar                    default save game file

AUTHORS
     David Riggle, on the Cory PDP-11/70, University of California,
     Berkeley.

HISTORY
     The battlestar game first appeared in 4.2BSD (1983).
```

---

## Modern Annotations

1. **The Setting Poem:**
   - The opening five-line poem hints directly at the game's core puzzle: the three magical artifacts (`AMULET`, `MEDALION`, `TALISMAN`) gifted to the three water nymphs. Collecting all three transforms the mortal player into a wizard.
2. **The `su` Privilege:**
   - The manual explicitly teases `su` ("substitute user"), acknowledging the Unix culture where superusers could teleport anywhere across the system hierarchy.
3. **Navigation Flexibility:**
   - The man page notes that relative commands (`ahead`, `back`, `left`, `right`) work alongside compass directions. This was revolutionary in 1979 when almost all interactive fiction forced players to memorize fixed compass rose maps.
