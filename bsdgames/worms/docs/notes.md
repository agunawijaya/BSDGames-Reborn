# Working Notes — `worms`

- Uses curses; needs real terminal or TTY.
- Each worm has circular xpos/ypos queues of fixed length.
- Reference grid prevents one worm from erasing another.
- Nine orientation tables handle edges/corners.
- `-f` fills screen with repeating "WORM" text from source header.
- `-t` leaves `.` trail.
- Default delay 0 is fast; use `-d` for visible animation.
