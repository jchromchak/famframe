import type { CaptureAppend } from "./capture";
import type { Routine } from "./config";
import type { Account, DeviceTarget, Family } from "./mockData";

type ThisWeekViewProps = {
  routines: Routine[];
  appends: CaptureAppend[];
  account: Account;
  family: Family;
  device: DeviceTarget | null;
  devices: DeviceTarget[];
  onDeviceChange: (device: DeviceTarget) => void;
  renderRoutine: (routine: Routine) => React.ReactNode;
};

export function ThisWeekView({
  routines,
  appends,
  account,
  family,
  device,
  devices,
  onDeviceChange,
  renderRoutine,
}: ThisWeekViewProps) {
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
        <p className="eyebrow">Active Target</p>
        <h3 className="compact-title">{device?.label ?? "No device selected"}</h3>
        <p className="muted">{family.handle}</p>
        <div className="target-stack">
          {devices.map((target) => (
            <button
              key={target.id}
              className={target.id === device?.id ? "target-button active" : "target-button"}
              type="button"
              onClick={() => onDeviceChange(target)}
            >
              {target.label}
            </button>
          ))}
        </div>
      </section>

      {account.isSuperAdmin ? (
        <section className="side-panel super-panel">
          <p className="eyebrow">Testing View</p>
          <p className="muted">Super-admin controls will set which family and device a TV route renders.</p>
          <code>/dashboard/?family={family.handle}&device={device?.handle ?? "none"}</code>
        </section>
      ) : null}

      <section className="side-panel">
        <p className="eyebrow">Temporary Appends</p>
        {appends.length ? (
          <ul className="plain-list">
            {appends.map((append) => (
              <li className="append-card" key={append.id}>
                <span className="append-label">{append.label}</span>
                <span className="append-meta">
                  {append.timing} / {append.routineLabel}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No temporary context captured yet.</p>
        )}
      </section>

      <section className="wide-panel">
        <p className="eyebrow">Routines In Play</p>
        <div className="routine-row">{routines.slice(0, 4).map(renderRoutine)}</div>
      </section>
    </div>
  );
}
