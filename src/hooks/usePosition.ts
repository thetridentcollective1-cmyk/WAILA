import { useState, useCallback, useRef } from 'react';

/**
 * ============================================================
 *  usePosition — position + heading source
 * ============================================================
 *  This hook is the single seam between the app and real device
 *  sensors. The whole UI consumes { standId, heading } from here
 *  and does not care whether they come from a slider or a satellite.
 *
 *  PoC MODE (live now, works on Vercel without HTTPS sensor access):
 *    - simulated position: user picks a stand chip
 *    - simulated heading: user drags the heading dial
 *  This is the demo capability — fully functional anywhere.
 *
 *  ─── PRODUCTION PATH (Claude Code, requires HTTPS + real device) ──
 *  Implement `enableRealSensors()` to:
 *    1. navigator.geolocation.watchPosition(...) → match lat/lng
 *       against each stand's {lat,lng,radius} geofence → set standId
 *       when the visitor physically enters a stand.
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

export interface PositionApi {
  mode: PositionMode;
  standId: string;
  heading: number;
  setStand: (id: string) => void;
  setHeading: (h: number) => void;
  /** stubbed — see production path above */
  enableRealSensors: () => Promise<void>;
}

export function usePosition(initialStand: string, initialHeading: number): PositionApi {
  const [mode, setMode] = useState<PositionMode>('simulated');
  const [standId, setStandId] = useState(initialStand);
  const [heading, setHeading] = useState(initialHeading);
  const warned = useRef(false);

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
    heading,
    setStand: setStandId,
    setHeading,
    enableRealSensors,
  };
}
