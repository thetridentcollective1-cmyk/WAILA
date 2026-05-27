import type { ViewSector } from '@/types/schema';
import { bearingLabel, sectorFor } from '@/lib/bearing';

interface Props {
  sectors: ViewSector[];
  heading: number;
}

const SightIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'var(--steel)', fill: 'none', strokeWidth: 1.4 }}>
    <path d="M12 2 4 20l8-4 8 4z" />
  </svg>
);

/**
 * GroundSight — directional narration. The visitor's heading drives
 * which sector narrates. Compass cone + needle rotate to the heading.
 * In production the heading comes from the device compass; here from
 * the simulated heading dial. Same data, same logic.
 */
export function GroundSight({ sectors, heading }: Props) {
  const sector = sectorFor(sectors, heading);

  return (
    <div className="groundsight">
      <div className="gs-inner">
        <div className="gs-head">
          <span className="gs-title">
            <SightIcon />
            GroundSight
          </span>
          <span className="gs-bearing">{bearingLabel(heading)}</span>
        </div>

        <div className="gs-stage">
          <div className="compass">
            <div className="compass-ring" />
            <svg viewBox="0 0 118 118">
              <path
                className="cone"
                d="M59 59 L40 6 A56 56 0 0 1 78 6 Z"
                style={{ transform: `rotate(${heading}deg)` }}
              />
              <line
                className="needle"
                x1="59" y1="59" x2="59" y2="12"
                style={{ transform: `rotate(${heading}deg)` }}
              />
              <circle cx="59" cy="59" r="3" fill="var(--accent-soft)" />
              <text className="compass-card-letter" x="56" y="14">N</text>
              <text className="compass-card-letter" x="103" y="62">E</text>
              <text className="compass-card-letter" x="56" y="110">S</text>
              <text className="compass-card-letter" x="6" y="62">W</text>
            </svg>
          </div>

          <div className="gs-readout">
            <div className="gs-target-label">You are looking toward</div>
            <div className="gs-target">{sector?.target}</div>
            <div className="gs-desc">{sector?.desc}</div>
          </div>
        </div>

        <div className="gs-hint">
          <span className="dot" />
          Turn your body — the ground narrates what you face
        </div>
      </div>
    </div>
  );
}
