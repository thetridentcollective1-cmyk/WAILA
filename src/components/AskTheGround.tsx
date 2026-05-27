import { useState } from 'react';
import { retrieve, type GroundAnswer } from '@/lib/askTheGround';
import { ConfidenceChip } from './ConfidenceChip';

interface Props {
  standId: string;
  suggestions: string[];
}

const SendIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/**
 * Ask the Ground — the headline interaction. The visitor asks; the
 * app answers from verified atoms only, with a confidence chip and a
 * source. If the record doesn't cover it, the app says so rather than
 * inventing. This honesty behaviour is the safety architecture made
 * visible — preserve it through every future change.
 */
export function AskTheGround({ standId, suggestions }: Props) {
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState<GroundAnswer | null>(null);

  const ask = (q: string) => {
    if (!q.trim()) return;
    setAnswer(retrieve(standId, q));
  };

  return (
    <div className="ask">
      <div className="ask-inner">
        <div className="ask-title">Ask the ground</div>
        <div className="ask-sub">
          Every answer is drawn from expert-authored sources. The ground answers honestly — or
          says when something isn&rsquo;t known.
        </div>

        <div className="suggest">
          {suggestions.map((q) => (
            <button key={q} className="sugg-btn" onClick={() => ask(q)}>
              <span>{q}</span>
              <span className="arr">›</span>
            </button>
          ))}
        </div>

        <div className="ask-input">
          <input
            type="text"
            placeholder="Ask anything about this place…"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                ask(input);
                setInput('');
              }
            }}
          />
          <button
            className="ask-send"
            aria-label="Ask"
            onClick={() => {
              ask(input);
              setInput('');
            }}
          >
            <SendIcon />
          </button>
        </div>

        {answer && (
          <div className="answer">
            <div className={`answer-text ${answer.unknown ? 'answer-unknown' : ''}`}>
              {answer.text}
            </div>
            <div className="answer-meta">
              <ConfidenceChip conf={answer.conf} />
              <span className="src-note">
                {answer.unknown ? answer.src : `Source · ${answer.src}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
