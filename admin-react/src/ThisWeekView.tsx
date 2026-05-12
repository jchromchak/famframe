import type { CaptureAppend } from "./capture";
import { formatRoutineWindow } from "./config";
import type { Routine } from "./config";
import type { Account, DeviceTarget, Family } from "./mockData";

type ThisWeekViewProps = {
  routines: Routine[];
  appends: CaptureAppend[];
  account: Account;
  family: Family;
  device: DeviceTarget | null;
  devices: DeviceTarget[];
  selectedDate: Date;
  routeRefreshStatus: string;
  onDeviceChange: (device: DeviceTarget) => void;
  onDateChange: (date: Date) => void;
  onRoutineSelect: (routine: Routine) => void;
  onRouteRefresh: () => void;
};

export function ThisWeekView({
  routines,
  appends,
  account,
  family,
  device,
  devices,
  selectedDate,
  routeRefreshStatus,
  onDeviceChange,
  onDateChange,
  onRoutineSelect,
  onRouteRefresh,
}: ThisWeekViewProps) {
  const selectedDateKey = dateKey(selectedDate);
  const routinesForDate = routines.filter((routine) => routineAppliesToDate(routine, selectedDate));

  function moveDate(offset: number) {
    const nextDate = new Date(selectedDate);

    nextDate.setDate(selectedDate.getDate() + offset);
    onDateChange(nextDate);
  }

  return (
    <div className="day-view">
      <section className="day-header wide-panel">
        <button className="date-step" type="button" aria-label="Previous day" onClick={() => moveDate(-1)}>
          ‹
        </button>
        <div>
          <p className="eyebrow">Selected day</p>
          <h2>{formatDateLabel(selectedDate)}</h2>
          <p className="muted">{selectedDateKey}</p>
        </div>
        <button className="date-step" type="button" aria-label="Next day" onClick={() => moveDate(1)}>
          ›
        </button>
        <button className="route-refresh-button" type="button" onClick={onRouteRefresh}>
          Refresh routes
        </button>
        <p className="route-refresh-status">{routeRefreshStatus}</p>
      </section>

      <div className="panel-grid">
        <section className="wide-panel">
          <div className="section-heading">
            <p className="eyebrow">Assigned routines</p>
            <h2>Routines for this day</h2>
          </div>
          {routinesForDate.length ? (
            <div className="routine-row day-routine-list">
              {routinesForDate.map((routine) => (
                <button className="routine-card routine-card-button" key={routine.id} type="button" onClick={() => onRoutineSelect(routine)}>
                  <div>
                    <p className="eyebrow">{routine.type ?? "routine"}</p>
                    <h3>{routine.label}</h3>
                  </div>
                  <dl>
                    <div>
                      <dt>Window</dt>
                      <dd>{formatRoutineWindow(routine)}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{routine.appliesTo?.dates?.includes(selectedDateKey) ? "Modified" : "Baseline"}</dd>
                    </div>
                  </dl>
                </button>
              ))}
            </div>
          ) : (
            <p className="muted">No routines are assigned to this day yet.</p>
          )}
        </section>

        <section className="side-panel">
          <p className="eyebrow">Active display</p>
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
            <p className="eyebrow">Route</p>
            <p className="muted">Preview the active display route for this family/device.</p>
            <code>/dashboard/?family={family.handle}&device={device?.handle ?? "none"}</code>
          </section>
        ) : null}

        <section className="side-panel">
          <p className="eyebrow">Temporary appends</p>
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

        <section className="wide-panel add-event-panel">
          <p className="eyebrow">Add</p>
          <h2>Add an event</h2>
          <button className="primary-action" type="button">
            Add event
          </button>
        </section>
      </div>
    </div>
  );
}

function routineAppliesToDate(routine: Routine, date: Date) {
  const key = dateKey(date);
  const dates = routine.appliesTo?.dates ?? [];

  if (dates.includes(key)) {
    return true;
  }

  return routine.appliesTo?.days?.includes(date.getDay()) ?? false;
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}
