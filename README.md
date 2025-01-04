
Things not considered:
- Space limitations inside the elevator

# Algorithms and elevators

- Both `Look` and `Shortest Seek first` (SSF) are strictly speaking "disk-scheduling" algorithms, not elevator algorithms.
In other words: They aren't actually made *for* elevators, but for operating systems in computers that need to decide in what order they should serve read/write requests to the disk.

- Regardless, a closely related algorithm called `SCAN` also goes by the name `Elevator algorithm`. `SCAN` simply moves back and forth, alternating from first to last track, regardless of whether any requests are actually present at these locations. This is perhaps the most simple implementation, with both `SSF` and `Look` being more efficient versions.

- While these algorithm's *don't* go by the name "Elevator algorithm", they still work very well when applied to an elevator.

### Look
- Where `SCAN` keeps going to the very end, regardless of any request being there, `Look` instead keeps going in the same direction until no further requests are found in said direction. It then changes direction and keeps going until no more requests are met in that direction and repeats.
- This gets rid of wasted travelling time, at the cost of slightly more processing required. Still, mostly an upgrade


### Shortest Seek First
- Where `Look` gets rid of "wasted" travelling time, `SSF` also *seeks* to minimize travel time.
- 


#### Articles:
https://en.wikipedia.org/wiki/Elevator_algorithm
https://en.wikipedia.org/wiki/Shortest_seek_first