import type { KnowledgeAtom } from '@/types/schema';

/**
 * ============================================================
 *  ASK-THE-GROUND KNOWLEDGE BASE
 * ============================================================
 *  Verified atoms, keyed by stand id. Ask-the-Ground retrieves
 *  over these and NEVER generates facts outside them. If nothing
 *  matches, the app says so honestly rather than guessing.
 *
 *  PRODUCTION UPGRADE (Claude Code): replace keyword `match`
 *  with semantic retrieval (embeddings) over these same atoms.
 *  The contract — answer text + confidence + source — is unchanged.
 *  See lib/askTheGround.ts for the swap point.
 * ============================================================
 */

export const KNOWLEDGE: Record<string, KnowledgeAtom[]> = {
  bridge: [
    {
      match: ['important', 'matter', 'why', 'prize', 'objective', 'point'],
      conf: 'confirmed',
      text:
        `The bridge above you was the northernmost objective of Operation Market Garden — the final crossing of the Lower Rhine. The whole 64-mile airborne carpet, every bridge seized on the road north, was laid to get a relieving force to this exact span. Take and hold it, and the route into northern Germany was open. That's why a full division was committed to reach this one point.`,
      src: 'Middlebrook (1994); Frost (1980)',
    },
    {
      match: ['hold', 'longer', 'held', 'frost', 'survive', 'last'],
      conf: 'likely',
      text:
        `Frost's force held this northern end for roughly four days — well beyond the two the plan assumed before relief arrived. Most historians judge that without resupply and reinforcement, neither of which reached this spot in strength, holding longer wasn't realistically possible. They ran out of ammunition, not resolve.`,
      src: 'Frost (1980); Kershaw (1990) — interpretation varies',
    },
    {
      match: ['german', 'attack', 'panzer', 'ss', 'enemy', 'counter', 'tank'],
      conf: 'confirmed',
      text:
        `The defenders here faced elements of the 9th and 10th SS Panzer Divisions, which were refitting near Arnhem when the landings came — a presence the plan badly underweighted. They used tanks and self-propelled guns to reduce the British-held houses around the ramp, methodically, building by building.`,
      src: "Kershaw, 'It Never Snows in September' (1990)",
    },
    {
      match: ['division', 'arrive', 'reinforce', 'rest', 'other', 'come', 'reach'],
      conf: 'confirmed',
      text:
        `Only Frost's 2nd Battalion and attached troops reached the bridge. The rest of 1st Airborne landed miles to the west and was halted in the streets of Arnhem before it could fight through. XXX Corps, driving up the single raised road from the south, never reached this point at all.`,
      src: 'Middlebrook (1994)',
    },
    {
      match: ['civilian', 'dutch', 'people', 'town', 'resident', 'local'],
      conf: 'likely',
      text:
        `Arnhem's people first met the landings as liberation. As the fighting turned, the town was caught in it — and afterwards the German occupiers ordered Arnhem evacuated. The city was largely emptied and looted through the winter that followed. Civilian suffering here was severe and lasted long after the airborne men had gone.`,
      src: 'Dutch civilian testimony; Airborne Museum collections',
    },
    {
      match: ['bridge itself', 'destroyed', 'rebuilt', 'still', 'standing', 'today', 'now', 'happened to the bridge'],
      conf: 'confirmed',
      text:
        `The bridge you see is not the original. The 1944 span was destroyed by Allied bombing in October 1944 to deny it to the Germans, and rebuilt after the war on the same site. In 1977 it was named the John Frostbrug — the John Frost Bridge — after the officer whose men held it.`,
      src: 'Municipal records, Arnhem; Middlebrook (1994)',
    },
    {
      match: ['frostbrug', 'frost bridge', 'named', 'name'],
      conf: 'confirmed',
      text:
        `In 1977 the rebuilt bridge was officially named the John Frostbrug, after Lieutenant Colonel John Frost, whose 2nd Battalion held the northern end. It is one of very few bridges named for the enemy officer who fought for it.`,
      src: 'Municipal records, Arnhem',
    },
    {
      match: ['plan', 'wrong', 'fail', 'gamble', 'mistake', 'flaw'],
      conf: 'disputed',
      text:
        `Whether Market Garden was a sound plan undone by detail or a flawed gamble from the outset is still argued. The drop zones placed miles from the bridge, the optimistic timetable, the single road for XXX Corps, and the underestimated SS armour are all cited. Where the decisive fault lay is genuinely contested between historians.`,
      src: 'Contested — Ryan, Middlebrook, Beevor differ',
    },
    {
      match: ['wounded', 'casualt', 'cellar', 'hurt'],
      conf: 'likely',
      text:
        `Frost himself was wounded in the fighting and, with the other wounded, was eventually taken prisoner when the perimeter could no longer be held. The cellars of the houses around the ramp served as dressing stations as the buildings above burned.`,
      src: 'Frost (1980)',
    },
  ],
};
