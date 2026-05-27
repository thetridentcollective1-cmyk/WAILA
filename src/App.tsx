import { useState } from 'react';
import type { DayKey, Depth } from '@/types/schema';
import { STANDS, DEFAULT_STAND, DEFAULT_DAY } from '@/data/stands';
import { usePosition } from '@/hooks/usePosition';

import { CompanionCard } from '@/components/CompanionCard';
import { GroundSight } from '@/components/GroundSight';
import { AskTheGround } from '@/components/AskTheGround';
import { ThenNow } from '@/components/ThenNow';
import { SilenceState } from '@/components/SilenceState';
import { PreviewState } from '@/components/PreviewState';
import { SimDock } from '@/components/SimDock';
import { MapView } from '@/components/MapView';

type View = 'companion' | 'map';

export default function App() {
  const pos = usePosition(STANDS, DEFAULT_STAND, 45);
  const [day, setDay] = useState<DayKey>(DEFAULT_DAY);
  const [depth, setDepth] = useState<Depth>('essence');
  const [view, setView] = useState<View>('companion');

  const stand = STANDS[pos.standId];

  const goToStand = (id: string) => {
    pos.setStand(id);
    setDay(DEFAULT_DAY);
    setDepth('essence');
    // scroll to top on stand change
    const scroller = document.querySelector('.scroll');
    scroller?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="stage">
      <div id="device">
        {/* TOP BAR */}
        <div className="topbar">
          <div className="brand">
            <div className="title">Arnhem</div>
            <div className="sub">Battlefield Companion · PoC</div>
          </div>
          <div className="topbar-right">
            <div className="view-toggle" role="tablist" aria-label="View">
              <button
                role="tab"
                aria-selected={view === 'companion'}
                className={`view-seg ${view === 'companion' ? 'active' : ''}`}
                onClick={() => setView('companion')}
              >
                Stand
              </button>
              <button
                role="tab"
                aria-selected={view === 'map'}
                className={`view-seg ${view === 'map' ? 'active' : ''}`}
                onClick={() => setView('map')}
              >
                Map
              </button>
            </div>
            <div className="sig-pill">
              <span className="sig-dot" />
              <span>
                {stand.kind === 'silence'
                  ? 'In silence'
                  : stand.kind === 'preview'
                  ? 'Preview'
                  : 'Located'}
              </span>
            </div>
          </div>
        </div>

        {/* MAIN SCROLL */}
        {view === 'companion' && (
          <div className="scroll">
            {/* LOCATION HEADER */}
            <div className="loc-head">
              <div className="loc-kicker">
                {stand.kind === 'silence'
                  ? 'Hallowed Ground'
                  : stand.kind === 'preview'
                  ? 'Preview Stand'
                  : stand.stand}
              </div>
              <h1 className="loc-name">{stand.name}</h1>
              <div className="loc-coord">{stand.coord}</div>
            </div>

            {stand.kind === 'authored' && (
              <>
                <CompanionCard
                  stand={stand}
                  day={day}
                  depth={depth}
                  onDay={setDay}
                  onDepth={setDepth}
                />
                <GroundSight sectors={stand.days[day].sectors} heading={pos.heading} />
                <AskTheGround standId={pos.standId} suggestions={stand.suggestions} />
                {stand.hasThenNow && <ThenNow />}
              </>
            )}

            {stand.kind === 'silence' && <SilenceState stand={stand} />}

            {stand.kind === 'preview' && (
              <PreviewState stand={stand} onReturn={() => goToStand('bridge')} />
            )}
          </div>
        )}

        {view === 'map' && (
          <div className="map-pane">
            <div className="map-head">
              <div className="map-kicker">Catchment</div>
              <div className="map-name">{stand.name}</div>
              <div className="map-coord">{stand.coord}</div>
            </div>
            <div className="map-frame">
              <MapView
                centerLat={stand.lat}
                centerLng={stand.lng}
                userLat={pos.coords.lat}
                userLng={pos.coords.lng}
                heading={pos.heading}
              />
            </div>
          </div>
        )}

        {/* DOCK */}
        <SimDock
          standId={pos.standId}
          heading={pos.heading}
          onStand={goToStand}
          onHeading={pos.setHeading}
        />

        <div className="proto-tag">Reference Build — Working Name</div>
      </div>
    </div>
  );
}
