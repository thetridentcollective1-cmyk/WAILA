import type { AuthoredStand, DayKey, Depth } from '@/types/schema';
import { Timewalk } from './Timewalk';

interface Props {
  stand: AuthoredStand;
  day: DayKey;
  depth: Depth;
  onDay: (d: DayKey) => void;
  onDepth: (d: Depth) => void;
}

const DEPTHS: Depth[] = ['essence', 'deeper', 'sources'];
const DEPTH_LABEL: Record<Depth, string> = {
  essence: 'Essence',
  deeper: 'Deeper',
  sources: 'Sources',
};

/**
 * The Companion Card — the product's central interface.
 * Where you are, the time lens, what happened, why it mattered,
 * a witness voice, and the depth control. Audio-first in spirit;
 * this is the on-screen anchor.
 */
export function CompanionCard({ stand, day, depth, onDay, onDepth }: Props) {
  const sd = stand.days[day];
  const dayKeys = Object.keys(stand.days).map(Number) as DayKey[];

  return (
    <div className="card">
      <div className="card-top">
        <span className="card-label">Companion</span>
        <span className="card-label">{sd.phase}</span>
      </div>

      <Timewalk days={dayKeys} current={day} date={sd.date} onSelect={onDay} />

      <div className="narr">
        <div
          className="narr-essence"
          // Authored content; the only HTML is the controlled <span class="lead"> opener.
          dangerouslySetInnerHTML={{ __html: sd.essence[depth] }}
        />

        <div className="why">
          <div className="why-label">Why this mattered</div>
          <div className="why-text">{sd.why}</div>
        </div>

        {depth !== 'sources' && (
          <div className="witness">
            <div className="witness-q">{sd.witness.q}</div>
            <div className="witness-attr">{sd.witness.attr}</div>
          </div>
        )}

        <div className="depth-row">
          {DEPTHS.map((d) => (
            <div
              key={d}
              className={`depth-btn ${d === depth ? 'active' : ''}`}
              onClick={() => onDepth(d)}
            >
              {DEPTH_LABEL[d]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
