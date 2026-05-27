# Arnhem — Battlefield Companion

A standalone battlefield-tour web app. Stand on historic ground, choose the day, look across the terrain, and **ask what happened** — with every answer drawn from expert-authored sources.

This is the **reference web build (PoC)**, to be ported to React Native once the experience is validated. It runs today on Vercel using a simulated-position control, so it demos anywhere.

> **North star:** Make battlefield ground intelligible, personal, and emotionally truthful — without forcing visitors into a fixed route or reducing history to a tourist script.

---

## Run locally

```bash
npm install
npm run dev
```

Open the printed localhost URL. Build for production with `npm run build`; preview with `npm run preview`.

## Deploy (Vercel)

Push to a Git repo and import it in Vercel. Framework preset is detected as **Vite**; `vercel.json` is already configured (build → `dist`, SPA rewrites). No environment variables are needed for the PoC.

---

## What this build is — and isn't

**It is** a real, deployable React + TypeScript app with the full interaction model working on seeded Arnhem Bridge content: the Companion Card, GroundSight (directional narration), Timewalk (Day 1 vs Day 4 at the same coordinate), Ask the Ground (retrieval over verified atoms), source-confidence tagging, the Silence state, and a Then/Now wipe. Simulated position is first-class so it demos without being on the ground.

**It isn't** wired to real device sensors, a database, or a live LLM. Those are deliberately stubbed behind clean interfaces and marked for the next stage (Claude Code). They require real hardware / services to implement and test and were not faked here.

---

## Architecture

```
src/
  types/schema.ts        ← THE SPINE. Historical State schema as typed contract.
  data/
    stands.ts            ← Seeded Arnhem content (the IP), typed to the schema.
    knowledge.ts         ← Ask-the-Ground verified atoms.
  lib/
    askTheGround.ts      ← Retrieval logic. ⚑ Production swap point marked inside.
    bearing.ts           ← Compass/sector maths.
  hooks/
    usePosition.ts       ← The ONLY seam to device sensors. ⚑ Production path marked inside.
  components/            ← CompanionCard, GroundSight, AskTheGround, Timewalk,
                           ThenNow, SilenceState, PreviewState, SimDock, ConfidenceChip
  styles/                ← Design tokens + component CSS (LATEO language).
  App.tsx                ← Composition.
```

### The governing rule (do not break)

**AI narrates; it does not invent.** Ask-the-Ground answers come *from* the authored atoms or honestly say the record doesn't cover the question. The Silence state withholds narration on solemn ground. Source-confidence tags (Confirmed / Likely / Disputed / Commemorative) sit on claims. These are not features to be optimised away — they are the product's trust foundation.

---

## Handoff: what Claude Code should build next

Three stubs, each isolated so the UI needs no changes when they're implemented:

1. **Real geolocation + compass** — `src/hooks/usePosition.ts`. Implement `enableRealSensors()`: `watchPosition` → geofence match against each stand's `{lat,lng,radius}` to set the active stand; `DeviceOrientationEvent` (with iOS permission request) → heading. Fall back to simulated mode on denial/unsupported. Requires HTTPS + real device to test.

2. **Supabase** — move `data/stands.ts` and `data/knowledge.ts` into the database, shaped by `types/schema.ts` (the types become the row contract). Add an authoring path so experts fill the schema. Store knowledge atoms with a vector column for step 3.

3. **Live Ask-the-Ground retrieval** — `src/lib/askTheGround.ts`, inside the marked swap point. Replace keyword matching with semantic retrieval over the same atoms, optionally with an LLM constrained to answer **only** from supplied atoms (and to return the unknown response otherwise). The `GroundAnswer` contract must not change.

Then: **audio.** Authored narration should be generated at build time (high-quality TTS) and shipped as files — not synthesised live — for dignity, offline support, and cost. Ask-the-Ground answers are voiced after retrieval. Live conversational voice ("Live Guide Mode" via a realtime API) is a later premium tier, always answering from retrieval, never free generation.

---

## Open product decisions (not yet settled)

- **App name.** Deliberately unset — placeholder "Battlefield Companion". `GroundSight` is the *feature*, not the app; keep them distinct. This is the least reversible decision and deserves its own pass.
- **Monetisation.** Direction is paid battle packs (free app + free sample, ~£7.99–£12.99/pack), subscription only once a library exists. Price is tied to the still-open **expert authoring-cost** question.
- **Voice register.** This build is written in the **military-guide** register (second person, present tense, oriented to the ground). Documented in `data/stands.ts`.

---

## Content & dignity note

Witness passages are written as *guide-invoked narration drawn from accounts*, not verbatim attributed quotes — deliberately, to avoid false precision. When real authors come in, each becomes either properly sourced verbatim testimony or stays as honest guide narration. Then/Now imagery is placeholder; real 1944/present archive pairs are sourced at build.
