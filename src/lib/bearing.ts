import type { ViewSector } from '@/types/schema';

/** Normalise any heading to 0–359. */
export function normalizeHeading(h: number): number {
  return ((h % 360) + 360) % 360;
}

/** Human-readable bearing label, e.g. "045° NE". */
export function bearingLabel(heading: number): string {
  const h = normalizeHeading(heading);
  const dirs: Array<[number, string]> = [
    [0, 'N'], [45, 'NE'], [90, 'E'], [135, 'SE'],
    [180, 'S'], [225, 'SW'], [270, 'W'], [315, 'NW'],
  ];
  let best = dirs[0];
  let bd = 999;
  for (const d of dirs) {
    const diff = Math.min(Math.abs(h - d[0]), 360 - Math.abs(h - d[0]));
    if (diff < bd) { bd = diff; best = d; }
  }
  if (h > 337 || h < 23) best = [0, 'N'];
  return `${String(Math.round(h)).padStart(3, '0')}° ${best[1]}`;
}

/**
 * Find the GroundSight sector for a heading.
 * Sectors with max > 360 wrap through north.
 */
export function sectorFor(sectors: ViewSector[], heading: number): ViewSector | null {
  if (!sectors || sectors.length === 0) return null;
  const h = normalizeHeading(heading);
  for (const s of sectors) {
    if (s.max > 360) {
      if (h >= s.min || h <= s.max - 360) return s;
    } else if (h >= s.min && h < s.max) {
      return s;
    }
  }
  return sectors[0];
}
