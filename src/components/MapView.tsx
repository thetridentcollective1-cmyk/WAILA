import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

/**
 * MapView — the map-scale echo of GroundSight.
 *
 *  Renders the current stand's catchment (500m circle), the user's
 *  position, and a heading wedge that rotates as the SimDock dial
 *  turns. Everything it shows is fed by props from usePosition — the
 *  map never calls navigator.geolocation or DeviceOrientationEvent
 *  itself. When the production stub in usePosition lights up real
 *  sensors, this component will pick up live position + compass with
 *  no further changes.
 *
 *  PoC NOTE: in simulated mode usePosition mirrors the selected stand's
 *  lat/lng into `coords`, so userLat/userLng arrive equal to centerLat/
 *  centerLng. The catchment ring and user dot therefore sit on the same
 *  point today. Once the hook starts feeding a real GPS fix, the user
 *  marker will diverge from the stand centre naturally — no change here.
 */

interface Props {
  /** Stand centre (catchment ring). */
  centerLat: number;
  centerLng: number;
  /** User position (from usePosition). */
  userLat: number;
  userLng: number;
  /** Compass heading in degrees, 0 = north, clockwise. */
  heading: number;
  /** Catchment radius in metres; defaults to 500m per product spec. */
  radiusM?: number;
}

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

const ACCENT = '#9e3b3b';
const ACCENT_SOFT = '#c25a5a';
const BG_VOID = '#0a0d10';

const CONE_HALF_ANGLE_DEG = 20; // matches GroundSight's ~40° wedge
const CONE_LENGTH_M = 350;

const EARTH_R = 6378137;

/** Approximate flat-earth offset; accurate enough at sub-kilometre scale. */
function offsetMeters(lat: number, lng: number, dxMeters: number, dyMeters: number): [number, number] {
  const dLat = (dyMeters / EARTH_R) * (180 / Math.PI);
  const dLng = (dxMeters / (EARTH_R * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);
  return [lng + dLng, lat + dLat];
}

function catchmentFeature(lng: number, lat: number, radiusM: number): GeoJSON.Feature<GeoJSON.Polygon> {
  const N = 64;
  const ring: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * 2 * Math.PI;
    ring.push(offsetMeters(lat, lng, radiusM * Math.cos(a), radiusM * Math.sin(a)));
  }
  return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring] }, properties: {} };
}

function coneFeature(
  lng: number,
  lat: number,
  headingDeg: number,
  lengthM: number,
  halfAngleDeg: number
): GeoJSON.Feature<GeoJSON.Polygon> {
  const N = 24;
  const a0 = ((headingDeg - halfAngleDeg) * Math.PI) / 180;
  const a1 = ((headingDeg + halfAngleDeg) * Math.PI) / 180;
  const ring: [number, number][] = [[lng, lat]];
  for (let i = 0; i <= N; i++) {
    const a = a0 + (i / N) * (a1 - a0);
    // bearing convention: 0° = north, clockwise. x = sin(a), y = cos(a).
    ring.push(offsetMeters(lat, lng, lengthM * Math.sin(a), lengthM * Math.cos(a)));
  }
  ring.push([lng, lat]);
  return { type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring] }, properties: {} };
}

function pointFeature(lng: number, lat: number): GeoJSON.Feature<GeoJSON.Point> {
  return { type: 'Feature', geometry: { type: 'Point', coordinates: [lng, lat] }, properties: {} };
}

export function MapView({ centerLat, centerLng, userLat, userLng, heading, radiusM = 500 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [centerLng, centerLat],
      zoom: 15.2,
      attributionControl: false,
      cooperativeGestures: false,
    });
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    mapRef.current = map;

    map.on('load', () => {
      map.resize();
      loadedRef.current = true;

      map.addSource('catchment', { type: 'geojson', data: catchmentFeature(centerLng, centerLat, radiusM) });
      map.addLayer({
        id: 'catchment-fill',
        type: 'fill',
        source: 'catchment',
        paint: { 'fill-color': ACCENT, 'fill-opacity': 0.1 },
      });
      map.addLayer({
        id: 'catchment-line',
        type: 'line',
        source: 'catchment',
        paint: { 'line-color': ACCENT, 'line-width': 1.1, 'line-opacity': 0.7 },
      });

      map.addSource('cone', {
        type: 'geojson',
        data: coneFeature(userLng, userLat, heading, CONE_LENGTH_M, CONE_HALF_ANGLE_DEG),
      });
      map.addLayer({
        id: 'cone-fill',
        type: 'fill',
        source: 'cone',
        paint: { 'fill-color': ACCENT, 'fill-opacity': 0.22 },
      });
      map.addLayer({
        id: 'cone-line',
        type: 'line',
        source: 'cone',
        paint: { 'line-color': ACCENT_SOFT, 'line-width': 0.8, 'line-opacity': 0.55 },
      });

      map.addSource('user', { type: 'geojson', data: pointFeature(userLng, userLat) });
      map.addLayer({
        id: 'user-pt',
        type: 'circle',
        source: 'user',
        paint: {
          'circle-radius': 6,
          'circle-color': ACCENT_SOFT,
          'circle-stroke-color': BG_VOID,
          'circle-stroke-width': 2,
        },
      });
    });

    return () => {
      loadedRef.current = false;
      map.remove();
      mapRef.current = null;
    };
    // Intentionally bare deps — initial mount only. Subsequent prop
    // changes are handled by the targeted effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cone + user marker follow heading / position
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    const cone = map.getSource('cone') as mapboxgl.GeoJSONSource | undefined;
    cone?.setData(coneFeature(userLng, userLat, heading, CONE_LENGTH_M, CONE_HALF_ANGLE_DEG));
    const user = map.getSource('user') as mapboxgl.GeoJSONSource | undefined;
    user?.setData(pointFeature(userLng, userLat));
  }, [heading, userLat, userLng]);

  // Catchment + camera follow stand changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loadedRef.current) return;
    const catch_ = map.getSource('catchment') as mapboxgl.GeoJSONSource | undefined;
    catch_?.setData(catchmentFeature(centerLng, centerLat, radiusM));
    map.easeTo({ center: [centerLng, centerLat], duration: 600 });
  }, [centerLat, centerLng, radiusM]);

  if (!TOKEN) {
    return (
      <div className="map-missing">
        <div className="map-missing-mark" />
        <div className="map-missing-title">Map requires VITE_MAPBOX_TOKEN</div>
        <div className="map-missing-sub">
          Add it to <code>.env.local</code> for local dev, and to the Vercel project's environment
          variables for production. Restart the dev server after setting it.
        </div>
      </div>
    );
  }

  return <div className="mapview" ref={containerRef} />;
}
