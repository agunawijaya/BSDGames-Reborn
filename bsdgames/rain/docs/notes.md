# Working Notes — `rain`

- Uses curses; requires real terminal or TTY.
- `-d` delay in ms, converted to µs internally.
- Default delay 0 is too fast on modern terminals; recommend -d 120.
- Circular buffer of 5 positions creates the drop trail/fade effect.
- Catches SIGHUP, SIGINT, SIGTERM for clean exit.
