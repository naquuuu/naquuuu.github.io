# jatuh: physical blueprint spec (phase A)

> status: **v1.0, revised after review** (see `05-review-disposition.md`). 2026-10-22.
> the drawn sheets are in `blueprint.html` (open in a browser; prints one sheet per A4 landscape page). this file is the written spec behind them.
> units mm and g. tolerances ±2 mm on sewn parts, ±1 mm on the pod. all drawings are not to scale (nts) unless a sheet says otherwise.

## 0. sheets

| sheet | content |
| :--- | :--- |
| J-01 | general arrangement: yoke, panel, pod and lead on the body (back view) |
| J-02 | hem panel pattern: one pattern, cut in three fabrics |
| J-03 | yoke, pod pouch, hem IMU pocket (details) |
| J-04 | wiring: pod and hem lead |
| J-05 | signal chain and the three failure classes |

phase B sheets (strap touch patch, mounts, overshirt v3) are drawn later, only after gate G2.

## 1. the test garment

the test garment is a **test fixture**, not a fashion piece: one base (the yoke) and three interchangeable panels from one pattern, so the fabric is the only thing that changes.

### 1.1 waist yoke

- band of cotton twill with fusible interfacing, finished 30 mm high; length = your waist + 100 mm overlap; closes at the front with 25 mm webbing and a side-release buckle.
- 9 snap studs (male) along the back and sides, every 60 mm, centred on centre back (cb).
- pod pouch at back left, 70 mm from cb (away from the cb lead route and the guitar strap).

### 1.2 hem panel (J-02)

drafted as a ring sector so it flares and swings:

| parameter | value |
| :--- | :--- |
| waist edge (inner arc) | 500 mm (back and sides; set it to about 0.6 x your waist) |
| drop at cb | 300 mm |
| hem edge (outer arc) | 750 mm (1.5 x the waist edge) |
| draft radii | inner R600, outer R900 |
| sector angle | 48° (47.7° calculated) |
| grain | cb on the lengthwise grain, every panel |
| waist finish | 25 mm twill tape bound over the raw edge; 9 snap sockets (female) every 60 mm, matching the yoke |
| hem finish | 10 mm double fold (20 mm allowance) |
| side edges | 6 mm narrow hem |
| cut size | about 730 x 355 mm per panel, plus allowances |

at the usual 1450 mm fabric width, 0.75 m of each fabric gives two panels (v1 and v2) plus the test swatches.

### 1.3 hem IMU pocket (J-03)

- one pocket per panel, **identical position on all three**: on cb, inside, lower edge 20 mm above the finished hem.
- pocket 40 x 30 mm inner, cotton twill, sewn on three sides, open at the top.
- the hem IMU sits on a 1 mm card sled (30 x 22 mm) with its axes marked: **x along the hem, y up, z out of the fabric.** the same IMU moves between panels, so sensor-to-sensor differences don't enter the experiment.
- the lead leaves the pocket at the top and runs up the cb on the inside through 3 loose thread loops (bar tacks) at 100 mm spacing, to the yoke.

## 2. the pod

| part | size (L x W x H) | mass |
| :--- | :--- | :--- |
| ESP32-C3 SuperMini | 22.5 x 18 x 4 | 2 g |
| body IMU (GY-521), on a sled, x along the yoke | 21 x 16 x 3 | 3 g with sled |
| LiPo 3.7 V ~400 mAh, protected | about 30 x 20 x 6 | 9 g |
| TP4056 USB-C module, protected | 25 x 19 x 4 | 2 g |
| switch, wiring, connector | | 4 g |
| pouch (twill + 2 mm felt) | 70 x 45 x 18 outer | 6 g |
| **pod total** | | **about 26 g** (budget ≤ 35 g) |
| **at the hem**: hem IMU + sled + about half the lead | | **about 4 g** (budget ≤ 5 g) |

## 3. wiring (J-04)

| from | to | wire | note |
| :--- | :--- | :--- | :--- |
| LiPo + / - | TP4056 B+ / B- | 26 AWG red / black | protected cell |
| TP4056 OUT+ | slide switch → C3 5V pin | 26 AWG red | the onboard LDO makes 3.3 V |
| TP4056 OUT- | C3 GND | 26 AWG black | |
| C3 3V3 | body IMU VCC, connector pin 1 | 28 AWG red | |
| C3 GND | body IMU GND, connector pin 2 | 28 AWG black | |
| C3 GPIO6 | body IMU SDA, connector pin 3 | 28 AWG sage | I2C SDA |
| C3 GPIO7 | body IMU SCL, connector pin 4 | 28 AWG terracotta | I2C SCL |
| body IMU AD0 | GND | | address 0x68 |
| hem IMU AD0 | its own VCC (solder bridge on the hem board) | | address 0x69 |
| OUT+ → 100k → GPIO3 → 100k → GND | | | battery sense, reads half the voltage |

- hem lead: 4 cores, 28 AWG silicone, 350 mm, SDA twisted with GND and SCL twisted with 3V3. 4-pin connector at the pouch so panels can be swapped.
- I2C at 100 kHz. the two GY-521 pull-ups in parallel (about 2.35 kΩ) are enough for a 350 mm lead.
- GPIO 2, 8 and 9 are C3 strapping pins: don't use them.
- the C3 has **no capacitive touch**. phase B's strap patch needs a classic ESP32 or an S3.

## 4. signal chain and failure classes (J-05)

```
guitar --> interface hi-Z in --usb--> laptop: reaper (ASIO, 64 to 128 samples)
            track: input gate -> JSFX jatuh-mod (chorus + watchdog) -> clean amp sim off / eq -> out
laptop --usb--> interface out (about -20 dB) --> amp input, amp set clean
pod --wifi--> jatuh-core (python) --OSC /jatuh/wave, /depth, /hb, /cond--> JSFX
```

| class | automatic? | where the protection lives |
| :--- | :--- | :--- |
| sensor loss | yes | core: depth to 0 over 1 s |
| core loss | yes | JSFX inside reaper: no `/jatuh/hb` for 300 ms → depth to 0 over 1 s |
| audio host loss | **no** | manual: interface direct-monitor knob to full dry, or restart reaper from the template (target ≤ 30 s) |

## 5. safety

- protected LiPo only; never charged while worn; all pads insulated with heat shrink or kapton.
- every wire leaving a board is stitched down within 10 mm (strain relief).
- laptop on battery during takes.

## 6. open questions (for the build, not for review)

1. does the hem lead change the swing? check it against the 240 fps video at week 1.
2. if the linen panel is too light to swing cleanly, v2 adds a 10 g weighted hem tape to *all three* panels (the fabric stays the only variable).
