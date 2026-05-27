import { useRef, useState, useCallback } from 'react';

const FrameIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: 'var(--steel)', fill: 'none', strokeWidth: 1.4 }}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M12 5v14" />
  </svg>
);

/**
 * Then / Now — restrained visual memory. A draggable wipe between a
 * 1944 view and the present. NO AR. PoC uses styled placeholders;
 * real archive pairs are dropped in at build (see tn-cap note).
 */
export function ThenNow() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0.5);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    setPos(p);
  }, []);

  return (
    <div className="thennow">
      <div className="tn-inner">
        <div className="tn-title">
          <FrameIcon />
          Then / Now
        </div>
        <div
          className="tn-frame"
          ref={frameRef}
          onMouseDown={(e) => { dragging.current = true; setFromClientX(e.clientX); }}
          onMouseMove={(e) => { if (dragging.current) setFromClientX(e.clientX); }}
          onMouseUp={() => { dragging.current = false; }}
          onMouseLeave={() => { dragging.current = false; }}
          onTouchStart={(e) => { dragging.current = true; setFromClientX(e.touches[0].clientX); }}
          onTouchMove={(e) => { if (dragging.current) setFromClientX(e.touches[0].clientX); }}
          onTouchEnd={() => { dragging.current = false; }}
        >
          <div className="tn-layer tn-then">
            <div className="tn-illus">[ 1944 ]<br />Burnt-out vehicles<br />litter the ramp approach</div>
          </div>
          <div className="tn-layer tn-now" style={{ clipPath: `inset(0 0 0 ${pos * 100}%)` }}>
            <div className="tn-illus">[ TODAY ]<br />John Frost Bridge<br />rebuilt 1948</div>
          </div>
          <div className="tn-tag then">1944</div>
          <div className="tn-tag now">Today</div>
          <div className="tn-handle" style={{ left: `${pos * 100}%` }} />
        </div>
        <div className="tn-cap">
          Drag to compare. The bridge was destroyed after the battle and rebuilt; the present span
          carries Frost&rsquo;s name.{' '}
          <span style={{ color: 'var(--c-likely)' }}>
            Imagery placeholder — real archive pairs added at build.
          </span>
        </div>
      </div>
    </div>
  );
}
