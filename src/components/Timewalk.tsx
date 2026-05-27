import type { DayKey } from '@/types/schema';

interface Props {
  days: DayKey[];
  current: DayKey;
  date: string;
  onSelect: (day: DayKey) => void;
}

const ClockIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

/**
 * Timewalk — the temporal lens. Same coordinate, different reality
 * depending on the chosen day. Built for two lenses (Day 1 / Day 4)
 * in this PoC; the thumb logic generalises to N segments.
 */
export function Timewalk({ days, current, date, onSelect }: Props) {
  const idx = Math.max(0, days.indexOf(current));
  const segWidth = 100 / days.length;

  return (
    <div className="timewalk">
      <div className="tw-head">
        <span className="tw-title">
          <ClockIcon />
          Timewalk
        </span>
        <span className="tw-day">{date}</span>
      </div>
      <div className="tw-track">
        <div
          className="tw-thumb"
          style={{
            width: `calc(${segWidth}% - 2px)`,
            transform: `translateX(${idx * 100}%)`,
          }}
        />
        {days.map((d) => (
          <div
            key={d}
            className={`tw-seg ${d === current ? 'active' : ''}`}
            onClick={() => onSelect(d)}
          >
            {d === 1 ? 'DAY 1 · ARRIVAL' : d === 4 ? 'DAY 4 · THE DEFENCE' : `DAY ${d}`}
          </div>
        ))}
      </div>
    </div>
  );
}
