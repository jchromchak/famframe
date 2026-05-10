import type { CaptureAppend } from "./capture";

type CaptureViewProps = {
  text: string;
  onTextChange: (value: string) => void;
  appends: CaptureAppend[];
};

export function CaptureView({ text, onTextChange, appends }: CaptureViewProps) {
  return (
    <div className="panel-grid capture-grid">
      <section className="wide-panel">
        <p className="eyebrow">Quick Capture</p>
        <textarea
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          aria-label="Quick capture text"
        />
      </section>
      <section className="side-panel">
        <p className="eyebrow">Append Preview</p>
        {appends.length ? (
          <ul className="plain-list">
            {appends.map((append) => (
              <li className="append-card" key={append.id}>
                <span className="append-label">{append.label}</span>
                <span className="append-meta">
                  {append.timing} / {append.routineLabel} / {append.confidence}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Type a note to preview temporary routine add-ons.</p>
        )}
      </section>
    </div>
  );
}
