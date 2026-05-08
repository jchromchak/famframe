import { useEffect, useMemo, useState } from "react";
import { ConfigState, Routine, formatRoutineWindow, loadConfig } from "./config";

type View = "week" | "capture" | "routines" | "system";

const navItems: Array<{ id: View; label: string }> = [
  { id: "week", label: "This Week" },
  { id: "capture", label: "Capture" },
  { id: "routines", label: "Routines" },
  { id: "system", label: "System" },
];

const sampleAppends = ["Library books tomorrow", "Pack soccer gear", "Late start morning"];

function daysLabel(routine: Routine) {
  if (!routine.days?.length) {
    return "As needed";
  }

  if (routine.days.length === 7) {
    return "Every day";
  }

  return routine.days.join(", ");
}

function App() {
  const [activeView, setActiveView] = useState<View>("week");
  const [config, setConfig] = useState<ConfigState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captureText, setCaptureText] = useState("Late start tomorrow. Need library books. Pack soccer gear.");

  useEffect(() => {
    loadConfig()
      .then((nextConfig) => {
        setConfig(nextConfig);
        setError(null);
      })
      .catch((nextError: Error) => setError(nextError.message));
  }, []);

  const activeRoutines = useMemo(() => config?.routines ?? [], [config]);
  const operationalRoutines = activeRoutines.filter((routine) => routine.scene || routine.tasks?.length);
  const visibleAppends = captureText.trim() ? sampleAppends : [];

  return (
    <main className="admin-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Fam Frame Admin</p>
          <h1>{navItems.find((item) => item.id === activeView)?.label}</h1>
        </div>
        <div className="status-stack">
          <span className="sync-pill">Local JSON</span>
          <a href="../admin/" className="legacy-link">Old admin</a>
        </div>
      </header>

      {error ? <section className="notice">Config load issue: {error}</section> : null}

      <section className="view-frame">
        {activeView === "week" ? <ThisWeek routines={operationalRoutines} appends={visibleAppends} /> : null}
        {activeView === "capture" ? (
          <Capture text={captureText} onTextChange={setCaptureText} appends={visibleAppends} />
        ) : null}
        {activeView === "routines" ? <Routines routines={operationalRoutines} /> : null}
        {activeView === "system" ? <System config={config} /> : null}
      </section>

      <nav className="tabbar" aria-label="Admin sections">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={item.id === activeView ? "active" : ""}
            type="button"
            onClick={() => setActiveView(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </main>
  );
}

function ThisWeek({ routines, appends }: { routines: Routine[]; appends: string[] }) {
  return (
    <div className="panel-grid">
      <section className="wide-panel">
        <div className="section-heading">
          <p className="eyebrow">Operational View</p>
          <h2>This week starts with inherited routines.</h2>
        </div>
        <div className="week-strip">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <article key={day} className="day-card">
              <span>{day}</span>
              <div className="routine-dots">
                <i />
                <i />
                {day === "Thu" || day === "Sun" ? <b /> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="side-panel">
        <p className="eyebrow">Temporary Appends</p>
        {appends.length ? (
          <ul className="plain-list">
            {appends.map((append) => (
              <li key={append}>{append}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No temporary context captured yet.</p>
        )}
      </section>

      <section className="wide-panel">
        <p className="eyebrow">Routines In Play</p>
        <div className="routine-row">
          {routines.slice(0, 4).map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Capture({
  text,
  onTextChange,
  appends,
}: {
  text: string;
  onTextChange: (value: string) => void;
  appends: string[];
}) {
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
        <ul className="plain-list">
          {appends.map((append) => (
            <li key={append}>{append}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Routines({ routines }: { routines: Routine[] }) {
  return (
    <div className="routine-browser">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}
    </div>
  );
}

function RoutineCard({ routine }: { routine: Routine }) {
  return (
    <article className="routine-card">
      <div>
        <p className="eyebrow">{daysLabel(routine)}</p>
        <h3>{routine.label}</h3>
      </div>
      <dl>
        <div>
          <dt>Window</dt>
          <dd>{formatRoutineWindow(routine)}</dd>
        </div>
        <div>
          <dt>Tasks</dt>
          <dd>{routine.tasks?.length ?? 0}</dd>
        </div>
        <div>
          <dt>Theme</dt>
          <dd>{routine.themeId || "Default"}</dd>
        </div>
      </dl>
    </article>
  );
}

function System({ config }: { config: ConfigState | null }) {
  return (
    <div className="panel-grid">
      <section className="wide-panel">
        <p className="eyebrow">Source of Truth</p>
        <h2>React is reading the same JSON as the TV.</h2>
        <p className="muted">
          Editing and GitHub sync stay in the legacy admin until the new flow has the right shape.
        </p>
      </section>
      <section className="side-panel">
        <p className="eyebrow">Loaded</p>
        <dl className="system-list">
          <div>
            <dt>Routines</dt>
            <dd>{config?.routines.length ?? 0}</dd>
          </div>
          <div>
            <dt>Display theme</dt>
            <dd>{config?.display.theme ?? "Unknown"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export default App;
