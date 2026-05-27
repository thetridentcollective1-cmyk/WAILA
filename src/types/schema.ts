/**
 * ============================================================
 *  HISTORICAL STATE SCHEMA
 * ============================================================
 *  This file is the product's spine. Every stand authored by an
 *  expert must satisfy these types. AI (Ask-the-Ground, connective
 *  narrative) assembles and answers ONLY from data shaped like this —
 *  it never invents facts outside the authored record.
 *
 *  When this moves to Supabase, these types become the column/row
 *  contract. Keep them authoritative.
 *
 *  VOICE REGISTER for all narrative prose: "military guide" —
 *  second person, present tense, oriented to the ground in front of
 *  the visitor. Authority without melodrama.
 * ============================================================
 */

/** Confidence tag shown on every claim. Intellectual honesty layer. */
export type Confidence = 'confirmed' | 'likely' | 'disputed' | 'commemorative';

/** Depth levels offered at each stand. */
export type Depth = 'essence' | 'deeper' | 'sources';

/** A single day-lens in the Timewalk. Arnhem ran 17–25 Sept 1944. */
export type DayKey = number;

/**
 * A directional sector for GroundSight. The visitor's compass heading
 * (0–359°) is matched against [min, max). A sector with max > 360
 * wraps through north (e.g. {min:315, max:380} covers 315°–20°).
 */
export interface ViewSector {
  /** inclusive lower bearing bound, degrees 0–359 */
  min: number;
  /** exclusive upper bearing bound; may exceed 360 to wrap north */
  max: number;
  /** what the visitor is looking at, short */
  target: string;
  /** guide narration for that direction */
  desc: string;
}

/** Narrative text at the three depth levels. */
export interface NarrativeBody {
  /** 30–60 seconds. May contain a single <span class="lead"> opener. */
  essence: string;
  /** 2–4 minutes. */
  deeper: string;
  /** source notes / bibliography for this day-lens. */
  sources: string;
}

/** A quote or guide-invoked testimony shown with the narrative. */
export interface Witness {
  q: string;
  attr: string;
}

/** The full historical state at one coordinate, for one day-lens. */
export interface DayState {
  /** e.g. "Day 1 · Arrival" */
  phase: string;
  /** e.g. "17 Sept 1944" */
  date: string;
  essence: NarrativeBody;
  /** the "why this mattered" significance line */
  why: string;
  witness: Witness;
  /** directional narration anchors for GroundSight */
  sectors: ViewSector[];
}

/** Movement mode affects pacing and geofence radius. */
export type MovementMode = 'foot' | 'driving';

/**
 * A fully authored stand.
 */
export interface AuthoredStand {
  kind: 'authored';
  /** e.g. "Stand 01 · The Northern Ramp" */
  stand: string;
  name: string;
  /** display coordinate string, e.g. "51.9778° N · 5.9156° E · geofence 60m" */
  coord: string;
  lat: number;
  lng: number;
  /** geofence radius in metres */
  radius: number;
  mode: MovementMode;
  /** per-day historical state at this coordinate */
  days: Record<DayKey, DayState>;
  /** context-aware suggested questions for Ask-the-Ground */
  suggestions: string[];
  /** whether a Then/Now image pair exists for this stand */
  hasThenNow?: boolean;
}

/** A solemn site where narration is withheld by default. */
export interface SilenceStand {
  kind: 'silence';
  stand: string;
  name: string;
  coord: string;
  lat: number;
  lng: number;
  radius: number;
  /** the quiet opening line */
  silenceText: string;
  /** the sub line before "tap when ready" */
  silenceSub: string;
  /** revealed only after the visitor taps */
  revealText: string;
  revealSub: string;
}

/** A stand authored in the full pack but not built in this PoC. */
export interface PreviewStand {
  kind: 'preview';
  stand: string;
  name: string;
  coord: string;
  lat: number;
  lng: number;
  radius: number;
  previewNote: string;
}

export type Stand = AuthoredStand | SilenceStand | PreviewStand;

/**
 * An atom in the Ask-the-Ground knowledge base.
 * Answers are retrieved over these — never generated outside them.
 * In production, `match` keyword arrays are replaced by semantic
 * retrieval (embeddings) over the same authored atoms; the contract
 * (answer text + confidence + source) is unchanged.
 */
export interface KnowledgeAtom {
  /** lowercase keywords for the PoC's simple retrieval */
  match: string[];
  conf: Confidence;
  /** the answer, in guide register */
  text: string;
  /** source attribution */
  src: string;
}

/** The runtime state of the companion. */
export interface CompanionState {
  standId: string;
  day: DayKey;
  heading: number;
  depth: Depth;
}
