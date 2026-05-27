import type { KnowledgeAtom, Confidence } from '@/types/schema';
import { KNOWLEDGE } from '@/data/knowledge';

export interface GroundAnswer {
  text: string;
  conf: Confidence | 'unknown';
  src: string;
  /** true when nothing in the record matched */
  unknown: boolean;
}

/**
 * Ask-the-Ground retrieval.
 *
 * PoC implementation: simple keyword scoring over authored atoms.
 *
 * ─── PRODUCTION SWAP POINT (Claude Code) ──────────────────────
 * Replace the body of `retrieve` with semantic retrieval:
 *   1. embed the question,
 *   2. cosine-rank against pre-embedded authored atoms (same atoms,
 *      stored in Supabase with a vector column),
 *   3. optionally pass the top atom(s) to an LLM with a STRICT
 *      instruction to answer ONLY from the supplied atoms and to
 *      return the unknown response if they don't cover the question.
 * The function signature and GroundAnswer contract must not change,
 * so the UI layer needs no edits.
 *
 * The firewall is invariant: answers come FROM the record or say
 * they can't. Never open generation of historical fact.
 * ──────────────────────────────────────────────────────────────
 */
export function retrieve(standId: string, question: string): GroundAnswer {
  const atoms: KnowledgeAtom[] = KNOWLEDGE[standId] ?? [];
  const q = question.toLowerCase();

  let best: KnowledgeAtom | null = null;
  let bestScore = 0;
  for (const atom of atoms) {
    let score = 0;
    for (const m of atom.match) {
      if (q.includes(m)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = atom;
    }
  }

  if (best && bestScore > 0) {
    return { text: best.text, conf: best.conf, src: best.src, unknown: false };
  }

  return {
    text:
      `That isn't established in the sources for this place. Rather than guess, the ground stays honest — this is outside what the expert record can confirm here.`,
    conf: 'unknown',
    src: 'Ask-the-Ground answers only from verified atoms',
    unknown: true,
  };
}
