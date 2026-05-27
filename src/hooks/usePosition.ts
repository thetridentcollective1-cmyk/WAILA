import { useState, useCallback, useRef } from 'react';

/**
 * ============================================================
 *  usePosition — position + heading source
 * ============================================================
 *  This hook is the single seam between the app and real device
 *  sensors. The whole UI consumes { standId, coords, heading } from
 *  here and does not care whether they come from a slider or a
 *  satellite.
 *
 *  PoC MODE (live now, works on Vercel without HTTPS sensor access):
 *    - simulated position: user picks a stand chip → coords mirror
 *      that stand's authored lat/lng
 *    - simulated heading: user drags the heading dial
 *  This is the demo capability — fully functional anywhere.
 *
 *  ─── PRODUCTION PATH (Claude Code, requires HTTPS + real device) ──
 *  Implement `enableRealSensors()` to:
 *    1. navigator.geolocation.watchPosition(...) → drive `coords`
 *       from the live fix; match lat/lng against each stand's
 *       {lat,lng,radius} geofence → set standId when the visitor
 *       physically enters a stand.
 *    2. DeviceOrientationEvent (with iOS 13+ permission request via
 *       DeviceOrientationEvent.requestPermission()) → set heading
 *       from event.webkitCompassHeading (iOS) or 360 - event.alpha.
 *    3. fall back to simulated mode if permission denied / unsupported.
 *  Keep the returned shape identical so no UI changes are needed.
 *  These require real hardware to test and are intentionally NOT
 *  implemented in this build (cannot be verified in a sandbox).
 *  ──────────────────────────────────────────────────────────────
 */

export type PositionMode = 'simulated' | 'live';

export interface Coords {
  lat: number;
  lng: number;
}

export interface PositionApi {
  mode: PositionMode;
  standId: string;
  /**
   * Current position. In simulated mode this mirrors the selected
   * stand's authored coordinates; in live mode it is the watchPosition
   * fix. Consumers (e.g. MapView) read this directly and don't need to
   * know which source is feeding it.
   */
  coords: Coords;
  heading: number;
  setStand: (id: string) => void;
  setHeading: (h: number) => void;
  /** stubbed — see production path above */
  enableRealSensors: () => Promise<void>;
}

/** Minimal coord-bearing record — anything with lat/lng will do. */
type StandCoord = { lat: number; lng: number };

export function usePosition(
  stands: Record<string, StandCoord>,
  initialStand: string,
  initialHeading: number
): PositionApi {
  const [mode, setMode] = useState<PositionMode>('simulated');
  const [standId, setStandId] = useState(initialStand);
  const [heading, setHeading] = useState(initialHeading);
  const [coords, setCoords] = useState<Coords>({
    lat: stands[initialStand].lat,
    lng: stands[initialStand].lng,
  });
  const warned = useRef(false);

  const setStand = useCallback(
    (id: string) => {
      setStandId(id);
      // In simulated mode the "user position" is the stand position.
      // In live mode this assignment is harmless: watchPosition keeps
      // overwriting coords with the real fix on every tick.
      const s = stands[id];
      if (s) setCoords({ lat: s.lat, lng: s.lng });
    },
    [stands]
  );

  const enableRealSensors = useCallback(async () => {
    // Intentional stub. Real implementation belongs here (Claude Code).
    if (!warned.current) {
      warned.current = true;
      // eslint-disable-next-line no-console
      console.info(
        '[usePosition] Real geolocation + compass not implemented in this build. ' +
          'See src/hooks/usePosition.ts production path. Staying in simulated mode.'
      );
    }
    setMode('simulated');
  }, []);

  return {
    mode,
    standId,
    coords,
    heading,
    setStand,
    setHeading,
    enableRealSensors,
  };
}
