import { useState } from 'react';
import type { SilenceStand } from '@/types/schema';

interface Props {
  stand: SilenceStand;
}

/**
 * Silence — dignity as behaviour. At cemeteries and memorials the app
 * withholds narration and says so. Only on a deliberate tap does the
 * site's story appear. This is a brand-defining restraint; do not add
 * auto-play, badges, or chatter here.
 */
export function SilenceState({ stand }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="silence">
      <div className="silence-mark" />
      {!revealed ? (
        <>
          <div className="silence-text">{stand.silenceText}</div>
          <div className="silence-sub">{stand.silenceSub}</div>
          <div className="silence-tap" onClick={() => setRevealed(true)}>
            Tap when ready
          </div>
        </>
      ) : (
        <>
          <div className="silence-text">{stand.revealText}</div>
          <div className="silence-sub">{stand.revealSub}</div>
        </>
      )}
    </div>
  );
}
