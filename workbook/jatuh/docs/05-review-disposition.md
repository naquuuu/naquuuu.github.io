# jatuh: review disposition (astra + deepseek), 2026-10-22

> what each review finding changed, and where. reviews were pasted by the owner into chat on 2026-10-22.
> astra = `openai/gpt-6-astra` one-shot design consult on `00-astra-review-pack.md`. deepseek = read-only review of the pack and drafts.
> admissions facts quoted by astra (RCA reviews in receipt order; LPDP 2026 conditions on what counts as an LoA) are **not verified here**. they are marked "to verify" wherever they are used.

## the one change that matters

**old centre:** three theses side by side (measured drape, irreversibility, failure as design) on a six-device rig.
**new centre:** **the garment becomes part of the instrument.** one hem sensor, one test garment with interchangeable fabric panels, one expressive mapping, a controlled experiment, a tested disconnect. failure handling makes it playable; it is not the headline. painting waits.

the key idea that came out of astra's question 8: **a body-worn sensor goes quiet the moment you stop moving. the hem doesn't. it keeps swinging and settles at the fabric's own rate.** the instrument plays that follow-through. a pedal or a sensor strapped to the body cannot produce it, and this is what the experiment measures.

## finding by finding

| # | source | finding | disposition | where |
| :--- | :--- | :--- | :--- | :--- |
| A1 | astra | make "the garment becomes part of the instrument" the thesis; failure supports; painting optional | **accepted.** "no undo" dropped as a thesis | PRD 1, 2.2 |
| A2 | astra | the stiffness vs zeta scatter doesn't prove you measured drape; use one pattern with interchangeable panels, fixed sensor placement, repeated movements, within vs between variance, same recorded phrase with an unchanged mapping; the cantilever test is supporting material data only | **accepted in full.** test garment = waist yoke + three snap-on hem panels from one pattern. 5 repeats per fabric. reamped DI phrase. the cantilever test is moved to "material characterisation" | PRD 6, 10; blueprint J-02 |
| A3 | astra | painting is the weakest link; make city pop audible in a specific passage | **accepted.** canvas moved to phase B and only if you design the mark vocabulary by hand. an original city pop test phrase (maj7/9 voicings, clean chorus) is both the musical identity and the experiment's fixed input | PRD 2.3, 6.4 |
| A4 | astra | hero moment = visible garment movement producing an intelligible musical change, then what you discovered; reliability is support | **accepted.** hero: you stop turning, the hem keeps swinging, the shimmer follows it and settles; swap to twill, the tail is shorter | timeline 5 |
| A5 | astra | cut v1 to one hem sensor, one garment prototype, one mapping, recording, a tested disconnect. cut chest phone, then headstock phone, NFC, canvas. move one play-test and one garment revision into phase A | **accepted.** all four cut from phase A (moved to phase B, optional). strap touch also moved to phase B. panel v1 → v2 and one play-test now in phase A | timeline 4; PRD 5 |
| A6 | astra | 4 dec is reasonable, but submit when the experiment is convincing; LPDP provisional; RCA offer ≠ LPDP-acceptable LoA; plan for the 3-week accept-and-deposit window | **accepted.** submission gate = evidence gate, not a date. deposit window and LoA conditions added as owner tasks | timeline 3, 6 |
| A7 | astra | PRD and dashboard are working tools; the portfolio shows question, trials, iterations, a readable system drawing, evidence, what changed | **accepted.** PRD and dashboard are labelled working tools. blueprint sheets kept because they explain real decisions. portfolio page plan added | PRD 13; timeline 4 |
| A8 | astra | answer "what can this garment express that a pedal or body sensor can't?" with trade-offs | **accepted.** a 3-condition comparison (fixed LFO / body sensor / garment) is now part of the experiment and the play-test | PRD 6.3, 10.3 |
| T1 | astra | a SAFE preset inside reaper can't protect against reaper crashing | **accepted, and the promise is narrowed.** three failure classes: sensor loss (glide, automatic), core loss (watchdog inside reaper's own JSFX fades modulation, automatic), audio host loss (audio stops; manual recovery, under 30 s, honest) | PRD 4.4 |
| T2 | astra | the ESP32-C3 has no native capacitive touch | **already handled** in blueprint 5.2 (strap node is a classic ESP32), now moot for phase A because the strap moved to phase B. the note is kept | blueprint 5 |
| T3 | astra | treat f and zeta as estimates; prove a repeatable decaying oscillation first; invalid estimates must not drive delay feedback | **accepted.** week 1 is a go/no-go experiment. f and zeta never drive audio directly in v1 (analysis only). a validity gate applies, and delay feedback is hard-clamped | PRD 6.1, 6.2; timeline gate G0 |
| D1 | deepseek | the plan put every gadget-defeating step after submission | **accepted** (same as A5) | timeline 4 |
| D2 | deepseek | q6 was an admissions question astra can't know | **noted.** astra answered with citations. its admissions claims are marked to verify, never used as fact | this file, timeline 2 |
| D3 | deepseek | killing the core is a better failure demo than a wi-fi pull | **accepted as the supporting demo** (not the hero, per A4) | timeline 5; PRD 10.2 |
| D4 | deepseek | "losing core or reaper drops to a SAFE preset in reaper" contradicts itself | **accepted** (same as T1) | PRD 4.4 |
| D5 | deepseek | ADR-054 says the portfolio is canonical on the blog, with bio-mask and hotsand as the IDE-shaped leads; jatuh as lead is unrecorded drift | **decided (owner, 2026-10-22): jatuh is the final form.** the pack runs as one arc from concepts on paper to a built, tested object. jatuh closes it. recorded as **ADR-058** | below |
| D6 | deepseek | IELTS is the only item that can't be recovered by cutting scope | **accepted, then re-planned (owner, 2026-10-22):** RCA doesn't need IELTS to apply, so the test moves to mid january 2027, ahead of LPDP tahap 1. LPDP tahap 2 + RCA deferral is the documented fallback | timeline 2, 3 |

## D5 decision (owner, 2026-10-22): jatuh is the final form

recorded as **ADR-058** in `internal-docs/DECISION_LOG.md`. the draft it was based on:

> **ADR-0xx: the IDE pack is one arc, and jatuh closes it.** the ADR-054 pack is ordered as a progression: 3M bio-mask and schneider hotsand (concepts that stayed on paper), simakara, traveloka (systems built against failure in a commercial setting), then **jatuh, the final form**: the first work where the systems instinct becomes a built, tested, physical object. this matches the statement's own arc ("both stayed on paper" → "once a design leaves the screen it becomes matter"). jatuh gets the largest page budget (4 pages). canonical material lives on a blog page under ADR-054 rule 1 and exports to the PDF like the others. MAPCLUB stays out of the pack. the PRD, blueprint sheets and dashboard stay internal working tools; drawing details enter a page only where they explain a decision.

| order | work | pages | role |
| :--- | :--- | :--- | :--- |
| 0 | cover + index | 1 | |
| 1 | 3M bio-mask | 3 | group (role to confirm) |
| 2 | schneider hotsand | 3 | group (role to confirm) |
| 3 | simakara | 2 to 3 | to confirm (owner to describe) |
| 4 | traveloka (optional half-page note on the WA bot) | 2 | commercial |
| 5 | **jatuh** | **4** | individual |
| 6 | personal making: painting, sewing, sketches | 1 to 2 | individual |
| 7 | CV and contact | 1 | |
| | **total** | **17 to 19 of 20** | |

## what was not changed

- the name *jatuh* and the hot-city wardrobe (linen, tropical wool, cotton twill).
- the reaper + python core + local websocket stack.
- the 4 dec target date. it stays a target, behind the evidence gate.
