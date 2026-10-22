# jatuh: monitoring dashboard spec (phase A)

> status: **v1.0, revised after review** (see `05-review-disposition.md`). 2026-10-22.
> a **working tool** for tuning and running the experiment, not a portfolio piece. the mockup is `dashboard-mockup.html` (sample data, no live connection).
> data contracts: `02-prd.md` section 7.

## 1. one view, on the laptop

phase A has no performance screen (the pad and canvas moved to phase B). one laptop view, readable between takes and during the experiment. nothing on it needs to be read while playing.

style: warm paper, hairline rules, terracotta / slate / sage, lowercase, one sans-serif, numbers in a monospace. no dark SaaS cards, no glow, no fake analogue gauges. state colours: sage = ok, slate = idle or neutral, terracotta = fault or invalid.

## 2. panels

| panel | shows | why |
| :--- | :--- | :--- |
| **header** | session, panel (linen / wool / twill), condition (A fixed LFO / B body / C garment), mapping version, rig state, take timer | every take must be labelled before it is useful |
| **1. rig health** | pod heartbeat age, stream rate, packet loss, battery, rssi, `hem_ok`; core → reaper heartbeat; reaper OSC link | the two automatic fallbacks depend on these |
| **2. motion** | live traces of body and hem horizontal acceleration and of r (hem minus body), 6 s window; body-stop and hem-settle markers | to *see* the follow-through, not just trust a number |
| **3. last turn** | T_ft, f, zeta, peaks, R², valid / invalid with the reason | the validity gate in PRD 6.1 made visible |
| **4. experiment** | per panel: T_ft for every repeat as dots, mean ± SD band; separation check result | the G1 chart, built as you go; also the portfolio chart |
| **5. modulation** | wave sent, depth sent, clamp hits, condition | proves what reaper actually received |
| **6. audio** | input level, clips this take, last loopback latency | a clipped take is wasted |
| **7. latency** | control p50 / p95 against the 40 ms target, 60 s sparkline | NFR-2 |
| **8. event log** | timestamped state changes, faults, estimates | the fault-test record |

## 3. alerts (terracotta)

| metric | threshold |
| :--- | :--- |
| pod heartbeat age | > 300 ms (→ SENSOR_LOST) |
| stream rate | < 95 Hz |
| packet loss | > 1% |
| battery | < 3.6 V |
| rssi | < -75 dBm |
| `hem_ok` | false |
| core → reaper heartbeat | missing 300 ms (→ CORE_LOST, as seen by the JSFX) |
| estimate | invalid (fewer than 3 peaks, R² < 0.8, f or zeta out of range) |
| depth clamp hits | > 5 per take (the mapping is too hot) |
| control p95 | > 40 ms |
| clips | any |

## 4. behaviour

- updates at 10 Hz, traces at 30 Hz.
- the dashboard can only send three commands: **label the take** (panel, condition), **mark a cued turn**, **run the loopback test**. it cannot change the mapping, so a dashboard bug cannot change the sound mid-experiment.
- replay: load a session's `log.jsonl` and scrub it (FR-8).
- screenshot button: a dated PNG for the design log.
