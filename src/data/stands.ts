import type { Stand } from '@/types/schema';

/**
 * ============================================================
 *  SEEDED CONTENT — ARNHEM PACK (PoC)
 * ============================================================
 *  This is the IP layer. In production it lives in Supabase,
 *  filled by expert authors against the schema in types/schema.ts.
 *
 *  Showcase stand: ARNHEM BRIDGE, fully authored across two
 *  Timewalk lenses (Day 1 arrival / Day 4 defence), five GroundSight
 *  sectors each, three depth levels.
 *
 *  Voice register: military guide (second person, present tense).
 *
 *  Note on witness text: these are written as guide-invoked
 *  narration drawn from accounts, NOT verbatim attributed quotes.
 *  When real authors come in, each becomes either properly sourced
 *  verbatim testimony or stays as honest guide narration. Do not
 *  silently convert them to "real quotes" without the source.
 * ============================================================
 */

export const STANDS: Record<string, Stand> = {
  bridge: {
    kind: 'authored',
    stand: 'Stand 01 · The Northern Ramp',
    name: 'Arnhem Bridge',
    coord: '51.9778° N · 5.9156° E · geofence 60m',
    lat: 51.9778,
    lng: 5.9156,
    radius: 60,
    mode: 'foot',
    hasThenNow: true,
    days: {
      1: {
        phase: 'Day 1 · Arrival',
        date: '17 Sept 1944',
        essence: {
          essence:
            `<span class="lead">Stand here on the evening of the 17th and you're at the far end of an eight-mile march that went right when almost everything else went wrong.</span> Frost's 2nd Battalion came in along the river road — the one route the Germans hadn't yet blocked — and took the houses around you, overlooking the ramp. Look up at the bridge: for one night, the whole point of Market Garden is in British hands.`,
          deeper:
            `Work the ground as Frost's men did. They cleared the houses on the eastern side of the ramp — the side you're standing on — and tried to rush the bridge itself. Fire from a pillbox and from the southern end threw that attempt back, so they dug into the buildings instead and set themselves to hold the northern approach. Roughly 740 men, lightly armed, are now holding the prize and waiting for two things: the rest of 1st Airborne to fight through from the west, and XXX Corps' tanks to drive up the single road from the south. Hold that thought as you look around — because from this spot, neither arrives in the strength or the time the plan demanded.`,
          sources:
            `Primary: Frost, "A Drop Too Many" (1980). Middlebrook, "Arnhem 1944" (1994). Unit war diary, 2 Para. Strength figures approximate and vary by source.`,
        },
        why:
          `The bridge above you was the last crossing of the Lower Rhine — the northernmost objective of the entire operation. Everything else, every other bridge taken on the road north, existed to get a relieving force to this point. Take it and hold it, and the door into northern Germany stands open. That is why a whole division was dropped to reach this single span.`,
        witness: {
          q: `"Look at the bridge as it is now, then imagine it black against the last of the light, and us thinking the hard part was already behind us. It wasn't."`,
          attr: `— Guide narration, drawn from accounts of 2 Para, evening 17 Sept`,
        },
        sectors: [
          { min: 20, max: 75, target: 'The bridge & southern bank', desc: `Face the ramp. Frost's men held this northern end; the far bank stayed German throughout. The early rush to cross was stopped roughly where the modern roadway crests.` },
          { min: 75, max: 135, target: 'The pillbox & eastern houses', desc: `Off to your right front stood the German pillbox that broke the first attempt on the bridge. The houses here became the strongpoints of the perimeter.` },
          { min: 135, max: 225, target: 'The Lower Rhine, southward', desc: `The river runs below and away to the south. Somewhere down that axis, XXX Corps is meant to be driving hard up a single raised road through flooded country.` },
          { min: 225, max: 315, target: 'Into Arnhem town', desc: `West, into the streets. This is the direction the rest of the division was meant to come from. Most of those battalions were halted in the western suburbs and never reached you here.` },
          { min: 315, max: 380, target: 'The northern approach', desc: `Behind you, the road back toward the landing zones — eight miles that the follow-on units found far harder to cross than the plan assumed.` },
        ],
      },
      4: {
        phase: 'Day 4 · The Defence',
        date: '20 Sept 1944',
        essence: {
          essence:
            `<span class="lead">Stand on the same spot three days later and the houses around you are burning.</span> Frost's force has held this ramp with no reinforcement and almost no ammunition, against tanks and infantry, for longer than anyone planned for. The cellars beneath you are full of wounded — Frost among them. Look at the buildings: the perimeter is being taken from them one at a time.`,
          deeper:
            `This is where you understand the cost. Elements of the 9th and 10th SS Panzer Divisions — armour the plan had not reckoned on finding here — worked methodically along the ramp, using tanks and self-propelled guns to collapse the British-held houses around you. The resupply drops the men were promised mostly fell into German hands; you can stand here and know that the ammunition they needed was landing in fields they no longer controlled. After about four days, resistance at the bridge ended. Most of the survivors went into captivity; a few slipped away. The bridge passed back to the Germans, and XXX Corps never reached this point at all.`,
          sources:
            `Primary: Frost (1980). Kershaw, "It Never Snows in September" (1990) for the German side. Middlebrook (1994). Casualty and timing details vary; the four-day duration is well established.`,
        },
        why:
          `This ground is where Market Garden's central bet — speed and surprise along one road — visibly lost. The defence here bought time and cost the Germans dearly, but the failure to get reinforcement to this exact spot decided the operation. Stand here and you are standing on the hinge of the whole thing.`,
        witness: {
          q: `"The floors above us were on fire and we carried the wounded down as they gave way. We were still holding the corner. We just knew, by then, that no one was coming to it."`,
          attr: `— Guide narration, drawn from survivor accounts, bridge perimeter, 20 Sept`,
        },
        sectors: [
          { min: 20, max: 75, target: 'The contested ramp', desc: `What was the objective on Day 1 is a killing ground now. German armour fired straight down the ramp, working house to house toward where you stand.` },
          { min: 75, max: 135, target: 'The reduced strongpoints', desc: `The houses to your right, held since the first night, are being burned and blasted out of the perimeter one by one.` },
          { min: 135, max: 225, target: 'The river — no relief', desc: `South, down the river axis, XXX Corps is still stalled. From this spot the men couldn't know whether relief was hours or days away. It was neither.` },
          { min: 225, max: 315, target: 'The burning town', desc: `West, Arnhem is ablaze. The division's other battalions were halted well short of here and could not break through to you.` },
          { min: 315, max: 380, target: 'The closing ring', desc: `Behind you the northern approach is firmly German. By now the perimeter is a handful of shattered buildings around this ramp.` },
        ],
      },
    },
    suggestions: [
      'Why was this bridge so important?',
      'Could Frost have held out longer?',
      'Where were the Germans attacking from?',
      "Why didn't the rest of the division arrive?",
      'What did Dutch civilians experience here?',
      'What happened to the bridge itself?',
    ],
  },

  perimeter: {
    kind: 'preview',
    stand: 'Stand 02 · Preview',
    name: 'Oosterbeek Perimeter',
    coord: '51.9869° N · 5.8417° E · geofence 80m',
    lat: 51.9869,
    lng: 5.8417,
    radius: 80,
    previewNote:
      `In the full Arnhem pack, the divisional perimeter — the Cauldron — is a stand in its own right, with its own Timewalk, GroundSight sectors and Dutch civilian layer. Authored separately. This build focuses entirely on Arnhem Bridge as the quality bar.`,
  },

  cemetery: {
    kind: 'silence',
    stand: 'Stand 03',
    name: 'Arnhem Oosterbeek War Cemetery',
    coord: '51.9931° N · 5.8389° E · geofence 100m',
    lat: 51.9931,
    lng: 5.8389,
    radius: 100,
    silenceText: 'No narration will play here.',
    silenceSub:
      'You are standing among the graves of the men who fell at Arnhem. Take a moment. When you are ready, the cemetery\u2019s story is here.',
    revealText: '\u201CTheir name liveth for evermore.\u201D',
    revealSub:
      '1,759 men are buried here. Each September, local schoolchildren lay flowers on every grave \u2014 a tradition unbroken since 1945.',
  },
};

export const DEFAULT_STAND = 'bridge';
export const DEFAULT_DAY = 1;
