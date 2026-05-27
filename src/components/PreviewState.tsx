import type { PreviewStand } from '@/types/schema';

interface Props {
  stand: PreviewStand;
  onReturn: () => void;
}

/**
 * Preview — a stand authored in the full pack but not built in this PoC.
 * Demonstrates the simulated-location mechanic without pretending to be
 * finished content.
 */
export function PreviewState({ stand, onReturn }: Props) {
  return (
    <div className="silence">
      <div className="silence-mark" />
      <div className="silence-text">Authored in the full Arnhem pack.</div>
      <div className="silence-sub">{stand.previewNote}</div>
      <div className="silence-tap" onClick={onReturn}>
        Return to Arnhem Bridge
      </div>
    </div>
  );
}
