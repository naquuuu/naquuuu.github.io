# astra review pack: jatuh (one-shot, verdict only)

> for: `openai/gpt-6-astra`, one-shot design consult. no tools, no file edits.
> full drafts behind this pack: `01-timeline.md`, `02-prd.md`, `03-blueprint.md`, `04-dashboard.md` (same folder). this pack is self-contained; do not ask for them.

## who and why

applicant: a jakarta product manager, industrial engineer by training, applying to RCA/Imperial **innovation design engineering (IDE)**, round 1 (deadline 8 jan 2027). his work is failure-aware systems; outside work he paints, sews and plays guitar (city pop, shibuya-kei, space ambient) and dresses for a hot city (linen, tropical wool, cotton twill). his statement: "once a design leaves the screen it becomes matter, with tolerances."

goal: one portfolio project plus the 2-minute video (phone recorded, speaking to reviewers, answering ≥ 3 of 4 prompts: inspiration; how he brings it into his work; aspirations and how IDE helps; unique perspective). he also wants an RCA offer early enough for the LPDP scholarship (tahap 1 2027, not announced; 2026 ran 22 jan to 23 feb).

## the project: jatuh

*bahannya jatuh* is how jakarta tailors say a fabric drapes well; *jatuh* also means "to fall" (murphy's law).

a wearable guitar rig. three ideas:

1. **measured drape as input.** an ESP32-C3 + IMU pod (about 18 g) in the jacket's centre-back hem. one quarter turn, the hem swings and settles; the core computes swing frequency f and damping ratio zeta (log decrement). zeta sets reverb decay and delay feedback, f sets chorus rate, live hem motion adds a little drive. an NFC tag in the care label picks the preset per garment. evidence: a home cantilever bending test (ASTM D1388 style) and GSM on swatches of the same fabric types, plotted against zeta.
2. **irreversibility as rule.** the xiaomi pad paints a canvas from pick dynamics and hem motion, one layer per take, no undo, no clear. each take saves a wav, a canvas layer and a log.
3. **failure as design.** every device heartbeats; > 300 ms silence glides its parameters to neutral over 1 s (DEGRADED); losing core or reaper drops to a clean SAFE preset that lives in reaper itself. live demo in the video: turn off the iphone's wi-fi mid-song, the rig falls gracefully.

also: iphone 11 on the headstock (tilt → filter), a sashiko conductive-thread touch patch on the strap wired to an ESP32 touch pin (freeze, drone), infinix phone on the chest as the "heart" (screen pulse through mesh, haptics). DSP in reaper with ASIO; python websocket core; html clients over local HTTPS.

## plan

- **phase A, 2 nov to 4 dec 2026 (5 weeks, alongside a day job):** filmable v1, film, portfolio pages, submit early on 4 dec. hard stop 18 dec. IELTS academic in mid november (needed for both RCA and LPDP).
- **phase B, dec to jan:** sew a v2 garment around the sensor (weighted hem, sewn channel), 2 to 3 play-tests, failure log page, interview-ready demo.
- **phase C, feb to mar:** LPDP tahap 1 registration; fallback RCA round 2 (23 mar) with v2.

hardware about Rp 0.8 to 1 juta. key targets: audio round trip ≤ 12 ms, control p95 ≤ 60 ms, hem pod 100 Hz, setup ≤ 5 min, no ugly noise on any single failure.

deliverables after this review: PRD (with mermaid flowcharts), blueprint sheets J-01 to J-06 (general arrangement, hem pod, strap patch, mounts, wiring, audio chain), and an HTML dashboard mockup (performance view on the pad: canvas + one state strip; engineering view on the laptop: device health, garment match, swing trace and f/zeta scatter, parameters src → mapped → sent, audio, latency, event log). style: warm paper, hairlines, terracotta/slate/sage, lowercase, no dark SaaS cards.

## questions (answer each: KEEP / CHANGE / CUT + one line)

1. **thesis.** three ideas (measured drape, irreversibility, failure as design): is this one coherent IDE project, or should one be cut or demoted? which?
2. **evidence.** is f/zeta vs bending rigidity a convincing proof for an IDE reviewer, or would something else show the garment matters more clearly?
3. **personal fit.** does the project read as *this* person (systems + tailoring + painting + city pop), or as a gadget? name the weakest link.
4. **video.** talking head with b-roll covering all four prompts, wi-fi pull as the hero moment. right hero moment?
5. **scope vs time.** is a filmable v1 in 5 weeks next to a day job realistic? what would you cut first?
6. **timeline.** submitting on 4 dec to raise the chance of an offer before LPDP tahap 1: sound, or does an earlier, thinner submission hurt more than it helps?
7. **deliverables.** are PRD + blueprint + dashboard mockup the right artefacts for the portfolio, or is one of them internal-only?
8. **anything missing** that an IDE tutor would ask in the first minute of an interview.

output format: a numbered list of 8 verdicts, then at most 5 lines of free comments. no rewrites.
