import { useState } from "react";
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
  onEventAdd: (event: AddEventInput) => void;
  onRoutineSelect: (routine: Routine) => void;
  onRouteRefresh: () => void;
};

export type AddEventInput = {
  label: string;
  type: "departure" | "timeline";
  recurrence: "date" | "weekly";
  windowStart: string;
  windowEnd: string;
  leaveAt: string;
  arriveBy: string;
  deadline: string;
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
  onEventAdd,
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
          <AddEventForm selectedDate={selectedDate} onEventAdd={onEventAdd} />
        </section>
      </div>
    </div>
  );
}

function AddEventForm({
  selectedDate,
  onEventAdd,
}: {
  selectedDate: Date;
  onEventAdd: (event: AddEventInput) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [type, setType] = useState<AddEventInput["type"]>("departure");
  const [recurrence, setRecurrence] = useState<AddEventInput["recurrence"]>("date");
  const [windowStart, setWindowStart] = useState("15:00");
  const [windowEnd, setWindowEnd] = useState("17:00");
  const [leaveAt, setLeaveAt] = useState("15:30");
  const [arriveBy, setArriveBy] = useState("");
  const [deadline, setDeadline] = useState("");
  const canSubmit = label.trim().length >= 2 && windowStart && windowEnd;

  function submit() {
    if (!canSubmit) {
      return;
    }

    onEventAdd({
      label,
      type,
      recurrence,
      windowStart,
      windowEnd,
      leaveAt,
      arriveBy,
      deadline,
    });
    setLabel("");
    setIsOpen(false);
  }

  return (
    <div className="add-event-flow">
      <div className="detail-panel-head">
        <div>
          <p className="eyebrow">Add</p>
          <h2>Add an event</h2>
          <p className="muted">
            {recurrence === "date"
              ? `Adds context for ${dateKey(selectedDate)}.`
              : `Adds a weekly event on ${formatWeekday(selectedDate)}.`}
          </p>
        </div>
        <button className="primary-action compact-action" type="button" onClick={() => setIsOpen((current) => !current)}>
          {isOpen ? "Close" : "Add event"}
        </button>
      </div>

      {isOpen ? (
        <div className="add-event-form">
          <div className="segmented-control" aria-label="Event type">
            <button className={type === "departure" ? "active" : ""} type="button" onClick={() => setType("departure")}>
              Departure
            </button>
            <button className={type === "timeline" ? "active" : ""} type="button" onClick={() => setType("timeline")}>
              Timeline
            </button>
          </div>

          <div className="segmented-control" aria-label="Event recurrence">
            <button className={recurrence === "date" ? "active" : ""} type="button" onClick={() => setRecurrence("date")}>
              This day
            </button>
            <button className={recurrence === "weekly" ? "active" : ""} type="button" onClick={() => setRecurrence("weekly")}>
              Weekly
            </button>
          </div>

          <div className="routine-editor-grid">
            <label className="field-stack">
              <span>Name</span>
              <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Practice pickup" />
            </label>
            <label className="field-stack">
              <span>Window start</span>
              <input type="time" value={windowStart} onChange={(event) => setWindowStart(event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Window end</span>
              <input type="time" value={windowEnd} onChange={(event) => setWindowEnd(event.target.value)} />
            </label>
            {type === "departure" ? (
              <>
                <label className="field-stack">
                  <span>Leave</span>
                  <input type="time" value={leaveAt} onChange={(event) => setLeaveAt(event.target.value)} />
                </label>
                <label className="field-stack">
                  <span>Arrive</span>
                  <input type="time" value={arriveBy} onChange={(event) => setArriveBy(event.target.value)} />
                </label>
                <label className="field-stack">
                  <span>Deadline</span>
                  <input type="time" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
                </label>
              </>
            ) : null}
          </div>

          <button className="primary-action" type="button" disabled={!canSubmit} onClick={submit}>
            Add to routines
          </button>
        </div>
      ) : null}
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

function formatWeekday(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}
