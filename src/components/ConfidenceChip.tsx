import type { Confidence } from '@/types/schema';

interface Props {
  conf: Confidence | 'unknown';
  label?: string;
}

const LABELS: Record<string, string> = {
  confirmed: 'Confirmed',
  likely: 'Likely',
  disputed: 'Disputed',
  commemorative: 'Commemorative',
  unknown: 'Not in record',
};

export function ConfidenceChip({ conf, label }: Props) {
  return (
    <span className={`conf ${conf}`}>
      <span className="cdot" />
      {label ?? LABELS[conf]}
    </span>
  );
}
