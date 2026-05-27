import type { ReactNode } from 'react';
import { STANDS } from '@/data/stands';

interface Props {
  standId: string;
  heading: number;
  onStand: (id: string) => void;
  onHeading: (h: number) => void;
}

/**
 * SimDock — the simulated-position control. First-class in this build
 * so the experience demos anywhere, not only on the bridge. In
 * production this collapses to a small "demo mode" affordance and the
 * real position/heading come from device sensors (see usePosition).
 */
export function SimDock({ standId, heading, onStand, onHeading }: Props) {
  const chips: Array<{ id: string; label: ReactNode }> = [
    { id: 'bridge', label: <>Arnhem<br />Bridge</> },
    { id: 'perimeter', label: <>Perimeter<br /><span className="muted">preview</span></> },
    { id: 'cemetery', label: <>Cemetery<br /><span className="muted">silence</span></> },
  ];

  const mode = STANDS[standId]?.kind === 'authored' ? 'ON FOOT' : 'DEMO';

  return (
    <div className="dock">
      <div className="sim-bar">
        <div className="sim-head">
          <span className="sim-label">
            <span className="live" />
            Simulated Position
          </span>
          <span className="sim-mode">DEMO MODE · {mode}</span>
        </div>
        <div className="stand-row">
          {chips.map((c) => (
            <div
              key={c.id}
              className={`stand-chip ${c.id === standId ? 'active' : ''}`}
              onClick={() => onStand(c.id)}
            >
              {c.label}
            </div>
          ))}
        </div>
        <div className="heading-row">
          <label>Heading</label>
          <input
            type="range"
            min={0}
            max={359}
            value={heading}
            onChange={(e) => onHeading(Number(e.target.value))}
          />
          <span className="heading-val">{String(heading).padStart(3, '0')}°</span>
        </div>
      </div>
    </div>
  );
}
