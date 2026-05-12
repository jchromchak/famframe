import { useEffect, useMemo, useState } from "react";
import {
  AdminScene,
  ConfigState,
  Routine,
  RoutinesConfig,
  fallbackIdentity,
  formatRoutineWindow,
  loadConfig,
  loadIdentityConfig,
  routineItemCount,
  routineTheme,
  sceneTypeLabel,
} from "./config";
import {
  Account,
  DeviceTarget,
  Family,
  FamilyMember,
  Membership,
} from "./mockData";
import { parseCaptureAppends } from "./capture";
import { CaptureView } from "./CaptureView";
import { ThisWeekView } from "./ThisWeekView";
import {
  devicesForFamily,
  familiesForAccount,
  membersForFamily,
  roleForAccount,
} from "./identity";

type View = "week" | "capture" | "scenes" | "routines" | "system";

const navItems: Array<{ id: View; label: string }> = [
  { id: "week", label: "This Week" },
  { id: "capture", label: "Capture" },
  { id: "scenes", label: "Scenes" },
  { id: "routines", label: "Routines" },
  { id: "system", label: "System" },
];

const timezoneOptions = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"];
const githubTokenKey = "fam_frame_github_pat";
const githubRepoKey = "fam_frame_config_repo";
const githubBranchKey = "fam_frame_config_branch";
const routineDraftKey = "fam_frame_react_routine_drafts";
const weekdayOptions = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

function daysLabel(routine: Routine) {
  const dayNumbers = routine.appliesTo?.days;

  if (!dayNumbers?.length) {
    return "As needed";
  }

  if (dayNumbers.length === 7) {
    return "Every day";
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return dayNumbers.map((day) => dayLabels[day] ?? String(day)).join(", ");
}

function datesLabel(routine: Routine) {
  const dates = routine.appliesTo?.dates;

  if (!dates?.length) {
    return "No one-off dates";
  }

  if (dates.length === 1) {
    return dates[0];
  }

  return `${dates[0]} to ${dates[dates.length - 1]}`;
}

function App() {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activeFamily, setActiveFamily] = useState<Family | null>(null);
  const [activeDevice, setActiveDevice] = useState<DeviceTarget | null>(null);
  const [activeView, setActiveView] = useState<View>("week");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(fallbackIdentity.accounts);
  const [families, setFamilies] = useState<Family[]>(fallbackIdentity.families);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(fallbackIdentity.familyMembers);
  const [memberships, setMemberships] = useState<Membership[]>(fallbackIdentity.memberships);
  const [deviceTargets, setDeviceTargets] = useState<DeviceTarget[]>(fallbackIdentity.deviceTargets);
  const [config, setConfig] = useState<ConfigState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captureText, setCaptureText] = useState("");

  useEffect(() => {
    loadConfig()
      .then((nextConfig) => {
        setConfig(nextConfig);
        setError(null);
      })
      .catch((nextError: Error) => setError(nextError.message));

    loadIdentityConfig().then((identity) => {
      setAccounts(identity.accounts);
      setFamilies(identity.families);
      setFamilyMembers(identity.familyMembers);
      setMemberships(identity.memberships);
      setDeviceTargets(identity.deviceTargets);
    });
  }, []);

  const activeRoutines = useMemo(() => config?.routines ?? [], [config]);
  const activeScenes = useMemo(() => config?.scenes ?? [], [config]);
  const operationalRoutines = useMemo(
    () => activeRoutines.filter((routine) => routine.enabled !== false),
    [activeRoutines],
  );
  const visibleAppends = useMemo(
    () => parseCaptureAppends(captureText, operationalRoutines),
    [captureText, operationalRoutines],
  );

  const familiesForActiveAccount = useMemo(() => {
    if (!activeAccount) {
      return [];
    }

    return familiesForAccount(activeAccount, families, memberships);
  }, [activeAccount, families, memberships]);

  function getDevicesForFamily(familyId: string) {
    return devicesForFamily(familyId, deviceTargets);
  }

  function getMembersForFamily(familyId: string) {
    return membersForFamily(familyId, familyMembers);
  }

  function getRoleForAccount(account: Account, familyId: string) {
    return roleForAccount(account, familyId, memberships);
  }

  function selectDefaultFamily(account: Account, familyList = families, deviceList = deviceTargets, membershipList = memberships) {
    const accountFamilies = familiesForAccount(account, familyList, membershipList);
    const preferredFamily =
      accountFamilies.find((family) => family.handle === "chromchak-family-a1b2c3d4") ?? accountFamilies[0] ?? null;

    setActiveAccount(account);
    setActiveFamily(preferredFamily);
    setActiveDevice(preferredFamily ? devicesForFamily(preferredFamily.id, deviceList)[0] ?? null : null);
    setActiveView("week");
  }

  function createFamily(input: CreateFamilyInput) {
    if (!activeAccount) {
      return;
    }

    const suffix = makeOpaqueSuffix();
    const slug = slugify(input.name);
    const nextFamily: Family = {
      id: `fam-${slug}-${suffix}`,
      name: input.name.trim(),
      handle: `${slug}-${suffix}`,
      timezone: input.timezone,
    };
    const nextMember: FamilyMember = {
      id: `mem-${suffix}`,
      familyId: nextFamily.id,
      name: input.ownerName.trim() || activeAccount.displayName,
      email: activeAccount.email,
      relationship: "Parent",
    };
    const nextMembership: Membership = {
      accountEmail: activeAccount.email,
      familyId: nextFamily.id,
      familyMemberId: nextMember.id,
      role: "owner",
    };
    const nextDevice: DeviceTarget = {
      id: `dev-${suffix}-default-tv`,
      familyId: nextFamily.id,
      handle: "default-tv",
      label: input.deviceLabel.trim() || "Default TV",
      surface: "tv",
      room: "Default",
      mode: "Household dashboard",
    };

    setFamilies((current) => [...current, nextFamily]);
    setFamilyMembers((current) => [...current, nextMember]);
    setMemberships((current) => [...current, nextMembership]);
    setDeviceTargets((current) => [...current, nextDevice]);
    setActiveFamily(nextFamily);
    setActiveDevice(nextDevice);
    setActiveView("week");
  }

  if (!activeAccount) {
    return <LoginScreen accounts={accounts} onLogin={selectDefaultFamily} />;
  }

  if (!activeFamily) {
    return (
      <FamilySwitcher
        account={activeAccount}
        families={familiesForActiveAccount}
        devicesForFamily={getDevicesForFamily}
        membersForFamily={getMembersForFamily}
        roleForAccount={getRoleForAccount}
        onBack={() => setActiveAccount(null)}
        onSelectFamily={(family, device) => {
          setActiveFamily(family);
          setActiveDevice(device);
        }}
        onCreateFamily={createFamily}
      />
    );
  }

  const familyRole = getRoleForAccount(activeAccount, activeFamily.id);
  const familyDevices = getDevicesForFamily(activeFamily.id);

  return (
    <main className="admin-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">{activeFamily.name}</p>
          <h1>{activeView === "week" ? "Today" : navItems.find((item) => item.id === activeView)?.label}</h1>
        </div>
        <div className="status-stack">
          <span className="sync-pill">{familyRole ?? "super admin"}</span>
          <span className="sync-pill">{activeDevice?.label ?? "No device"}</span>
          <span className="sync-pill">Local JSON</span>
          <button className="text-button" type="button" onClick={() => setActiveFamily(null)}>
            Switch family
          </button>
          <a href="../admin/" className="legacy-link">Old admin</a>
        </div>
      </header>

      {error ? <section className="notice">Config load issue: {error}</section> : null}

      <section className="view-frame">
        {activeView === "week" ? (
          <ThisWeekView
            routines={operationalRoutines}
            appends={visibleAppends}
            account={activeAccount}
            family={activeFamily}
            device={activeDevice}
            devices={familyDevices}
            selectedDate={selectedDate}
            onDeviceChange={setActiveDevice}
            onDateChange={setSelectedDate}
            onRouteRefresh={() => undefined}
            onRoutineSelect={(routine) => {
              setSelectedRoutineId(routine.id);
              setActiveView("routines");
            }}
          />
        ) : null}
        {activeView === "capture" ? (
          <CaptureView text={captureText} onTextChange={setCaptureText} appends={visibleAppends} />
        ) : null}
        {activeView === "scenes" ? <Scenes scenes={activeScenes} /> : null}
        {activeView === "routines" && config ? (
          <Routines
            routines={activeRoutines}
            sourceConfig={config.routinesConfig}
            initialSelectedRoutineId={selectedRoutineId}
          />
        ) : null}
        {activeView === "system" ? (
          <System config={config} account={activeAccount} family={activeFamily} device={activeDevice} />
        ) : null}
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

function LoginScreen({ accounts, onLogin }: { accounts: Account[]; onLogin: (account: Account) => void }) {
  const [email, setEmail] = useState(accounts[0]?.email ?? "");
  const selectedAccount = accounts.find((account) => account.email === email) ?? accounts[0];

  useEffect(() => {
    if (!accounts.some((account) => account.email === email)) {
      setEmail(accounts[0]?.email ?? "");
    }
  }, [accounts, email]);

  return (
    <main className="entry-shell">
      <section className="entry-panel">
        <p className="eyebrow">Step 0</p>
        <h1>Log in</h1>
        <label className="field-stack">
          <span>Email</span>
          <select value={email} onChange={(event) => setEmail(event.target.value)}>
            {accounts.map((account) => (
              <option key={account.email} value={account.email}>
                {account.email}
              </option>
            ))}
          </select>
        </label>
        <button
          className="primary-action"
          type="button"
          disabled={!selectedAccount}
          onClick={() => onLogin(selectedAccount)}
        >
          Continue
        </button>
        <p className="muted">Sample login only. This is shaping identity and family access before real auth exists.</p>
      </section>
    </main>
  );
}

function FamilySwitcher({
  account,
  families,
  devicesForFamily,
  membersForFamily,
  roleForAccount,
  onBack,
  onSelectFamily,
  onCreateFamily,
}: {
  account: Account;
  families: Family[];
  devicesForFamily: (familyId: string) => DeviceTarget[];
  membersForFamily: (familyId: string) => FamilyMember[];
  roleForAccount: (account: Account, familyId: string) => string | undefined;
  onBack: () => void;
  onSelectFamily: (family: Family, device: DeviceTarget | null) => void;
  onCreateFamily: (input: CreateFamilyInput) => void;
}) {
  return (
    <main className="admin-shell family-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">{account.email}</p>
          <h1>Choose Family</h1>
        </div>
        <div className="status-stack">
          {account.isSuperAdmin ? <span className="sync-pill">super admin</span> : null}
          <button className="text-button" type="button" onClick={onBack}>
            Change login
          </button>
        </div>
      </header>

      <section className="family-grid view-frame">
        <CreateFamilyCard account={account} onCreateFamily={onCreateFamily} />

        {families.map((family) => {
          const role = roleForAccount(account, family.id) ?? "super admin";
          const devices = devicesForFamily(family.id);
          const members = membersForFamily(family.id);
          const defaultDevice = devices[0] ?? null;

          return (
            <article className="family-card" key={family.id}>
              <div>
                <p className="eyebrow">{role}</p>
                <h2>{family.name}</h2>
                <p className="muted">{family.handle}</p>
              </div>
              <dl className="system-list">
                <div>
                  <dt>Members</dt>
                  <dd>{members.length}</dd>
                </div>
                <div>
                  <dt>Devices</dt>
                  <dd>{devices.length}</dd>
                </div>
                <div>
                  <dt>Default</dt>
                  <dd>{defaultDevice?.label ?? "None"}</dd>
                </div>
              </dl>
              <button className="primary-action" type="button" onClick={() => onSelectFamily(family, defaultDevice)}>
                Open family
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}

type CreateFamilyInput = {
  name: string;
  ownerName: string;
  timezone: string;
  deviceLabel: string;
};

function CreateFamilyCard({
  account,
  onCreateFamily,
}: {
  account: Account;
  onCreateFamily: (input: CreateFamilyInput) => void;
}) {
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState(account.displayName);
  const [timezone, setTimezone] = useState(timezoneOptions[0]);
  const [deviceLabel, setDeviceLabel] = useState("Living Room TV");
  const slugPreview = name.trim() ? `${slugify(name)}-${"a1b2c3d4"}` : "family-name-a1b2c3d4";
  const canCreate = name.trim().length >= 2;

  return (
    <article className="family-card create-family-card">
      <div>
        <p className="eyebrow">New family</p>
        <h2>Create family</h2>
        <p className="muted">Start with one owner, one default display, and the same routine truths underneath.</p>
      </div>

      <div className="form-grid">
        <label className="field-stack">
          <span>Family name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Chromchak Family" />
        </label>
        <label className="field-stack">
          <span>Your family member name</span>
          <input value={ownerName} onChange={(event) => setOwnerName(event.target.value)} />
        </label>
        <label className="field-stack">
          <span>Timezone</span>
          <select value={timezone} onChange={(event) => setTimezone(event.target.value)}>
            {timezoneOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="field-stack">
          <span>Default display</span>
          <input value={deviceLabel} onChange={(event) => setDeviceLabel(event.target.value)} />
        </label>
      </div>

      <dl className="system-list">
        <div>
          <dt>Handle</dt>
          <dd>{slugPreview}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>owner</dd>
        </div>
      </dl>

      <button
        className="primary-action"
        type="button"
        disabled={!canCreate}
        onClick={() => onCreateFamily({ name, ownerName, timezone, deviceLabel })}
      >
        Create and open
      </button>
    </article>
  );
}

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "family"
  );
}

function makeOpaqueSuffix() {
  const values = new Uint8Array(4);

  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(16).padStart(2, "0")).join("");
  }

  return Math.random().toString(16).slice(2, 10).padEnd(8, "0");
}

function Routines({
  routines,
  sourceConfig,
  initialSelectedRoutineId,
}: {
  routines: Routine[];
  sourceConfig: RoutinesConfig;
  initialSelectedRoutineId: string | null;
}) {
  const [draftRoutines, setDraftRoutines] = useState(routines);
  const [selectedRoutineId, setSelectedRoutineId] = useState(initialSelectedRoutineId ?? routines[0]?.id ?? "");
  const selectedRoutine = draftRoutines.find((routine) => routine.id === selectedRoutineId) ?? draftRoutines[0] ?? null;

  useEffect(() => {
    setDraftRoutines(routines);
  }, [routines]);

  useEffect(() => {
    if (initialSelectedRoutineId) {
      setSelectedRoutineId(initialSelectedRoutineId);
    }
  }, [initialSelectedRoutineId]);

  useEffect(() => {
    if (!draftRoutines.some((routine) => routine.id === selectedRoutineId)) {
      setSelectedRoutineId(draftRoutines[0]?.id ?? "");
    }
  }, [draftRoutines, selectedRoutineId]);

  function updateRoutine(nextRoutine: Routine) {
    setDraftRoutines((current) =>
      current.map((routine) => (routine.id === nextRoutine.id ? nextRoutine : routine)),
    );
  }

  const draftConfig = useMemo(
    () => toRoutinesConfig(sourceConfig, draftRoutines),
    [sourceConfig, draftRoutines],
  );

  return (
    <div className="routine-workspace">
      <section className="routine-rail" aria-label="Routines">
        {draftRoutines.map((routine) => (
          <button
            key={routine.id}
            className={routine.id === selectedRoutine?.id ? "routine-select active" : "routine-select"}
            type="button"
            onClick={() => setSelectedRoutineId(routine.id)}
          >
            <span>{routine.label}</span>
            <small>{formatRoutineWindow(routine)}</small>
          </button>
        ))}
      </section>

      {selectedRoutine ? (
        <RoutineDetail routine={selectedRoutine} onUpdate={updateRoutine} draftConfig={draftConfig} />
      ) : null}
    </div>
  );
}

function Scenes({ scenes }: { scenes: AdminScene[] }) {
  const tributeCount = scenes.filter((scene) => scene.type === "tribute").length;
  const routineCount = scenes.filter((scene) => scene.type === "routine").length;

  return (
    <div className="scene-view">
      <section className="wide-panel">
        <p className="eyebrow">Scene System</p>
        <h2>Scenes are what the frame renders.</h2>
        <p className="muted">
          Routines and tributes now sit under the same display concept. This is read-only for the first pass while
          routine editing remains stable.
        </p>
        <dl className="scene-summary">
          <div>
            <dt>Tributes</dt>
            <dd>{tributeCount}</dd>
          </div>
          <div>
            <dt>Routines</dt>
            <dd>{routineCount}</dd>
          </div>
          <div>
            <dt>Active</dt>
            <dd>{scenes.filter((scene) => scene.status === "active").length}</dd>
          </div>
        </dl>
      </section>

      <div className="scene-browser">
        {scenes.map((scene) => (
          <SceneCard key={scene.id} scene={scene} />
        ))}
      </div>
    </div>
  );
}

function SceneCard({ scene }: { scene: AdminScene }) {
  return (
    <article className={`scene-card ${scene.type === "tribute" ? "tribute-scene" : ""}`}>
      {scene.imagePath ? <img src={scene.imagePath} alt="" className="scene-thumb" /> : null}
      <div>
        <p className="eyebrow">{sceneTypeLabel(scene)}</p>
        <h3>{scene.label}</h3>
      </div>
      <dl>
        <div>
          <dt>Status</dt>
          <dd>{scene.status}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{scene.source}</dd>
        </div>
        <div>
          <dt>Schedule</dt>
          <dd>{scene.schedule}</dd>
        </div>
      </dl>
    </article>
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
          <dd>{routineItemCount(routine)}</dd>
        </div>
        <div>
          <dt>Theme</dt>
          <dd>{routineTheme(routine)}</dd>
        </div>
      </dl>
    </article>
  );
}

function RoutineDetail({
  routine,
  onUpdate,
  draftConfig,
}: {
  routine: Routine;
  onUpdate: (routine: Routine) => void;
  draftConfig: RoutinesConfig;
}) {
  const isTimeline = routine.type === "timeline";
  const items = isTimeline ? routine.timeline ?? [] : routine.tasks ?? [];
  const activeDays = routine.appliesTo?.days ?? [];
  const activeDates = routine.appliesTo?.dates ?? [];

  function updateRoutine(patch: Partial<Routine>) {
    onUpdate({ ...routine, ...patch });
  }

  function updateWindow(field: "start" | "end", value: string) {
    updateRoutine({
      window: {
        ...routine.window,
        [field]: value || undefined,
      },
    });
  }

  function updateTiming(field: "leaveAt" | "arriveBy" | "deadline", value: string) {
    updateRoutine({
      timing: {
        ...routine.timing,
        [field]: value || undefined,
      },
    });
  }

  function toggleDay(day: number) {
    const nextDays = activeDays.includes(day)
      ? activeDays.filter((activeDay) => activeDay !== day)
      : [...activeDays, day].sort((left, right) => left - right);

    updateRoutine({
      appliesTo: {
        ...routine.appliesTo,
        days: nextDays,
      },
    });
  }

  function updateDates(value: string) {
    const dates = value
      .split(",")
      .map((date) => date.trim())
      .filter(Boolean);

    updateRoutine({
      appliesTo: {
        ...routine.appliesTo,
        dates,
      },
    });
  }

  return (
    <section className="routine-detail">
      <div className="routine-detail-head">
        <div>
          <p className="eyebrow">{routine.enabled === false ? "Inactive routine" : "Active routine"}</p>
          <h2>{routine.label}</h2>
        </div>
        <span className="sync-pill">{isTimeline ? "Timeline" : "Departure"}</span>
      </div>

      <div className="routine-detail-tabs" aria-label="Routine detail sections">
        <span>Summary</span>
        <span>Timing</span>
        <span>{isTimeline ? "Timeline" : "Checklist"}</span>
        <span>Route</span>
        <span>Theme</span>
      </div>

      <div className="routine-detail-grid">
        <RoutinePersistencePanel draftConfig={draftConfig} />

        <section className="detail-panel detail-panel-wide routine-editor">
          <div className="detail-panel-head">
            <p className="eyebrow">Draft editor</p>
            <span className="sync-pill">Local only</span>
          </div>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={routine.enabled !== false}
              onChange={(event) => updateRoutine({ enabled: event.target.checked })}
            />
            <span>Enabled</span>
          </label>

          <div className="routine-editor-grid">
            <label className="field-stack">
              <span>Name</span>
              <input value={routine.label} onChange={(event) => updateRoutine({ label: event.target.value })} />
            </label>
            <label className="field-stack">
              <span>One-off dates</span>
              <input value={activeDates.join(", ")} onChange={(event) => updateDates(event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Window start</span>
              <input type="time" value={routine.window?.start ?? ""} onChange={(event) => updateWindow("start", event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Window end</span>
              <input type="time" value={routine.window?.end ?? ""} onChange={(event) => updateWindow("end", event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Leave</span>
              <input type="time" value={routine.timing?.leaveAt ?? ""} onChange={(event) => updateTiming("leaveAt", event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Arrive</span>
              <input type="time" value={routine.timing?.arriveBy ?? ""} onChange={(event) => updateTiming("arriveBy", event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Deadline</span>
              <input type="time" value={routine.timing?.deadline ?? routine.deadlineTime ?? ""} onChange={(event) => updateTiming("deadline", event.target.value)} />
            </label>
          </div>

          <div className="day-toggle-group" aria-label="Recurring days">
            {weekdayOptions.map((day) => (
              <button
                key={day.value}
                aria-pressed={activeDays.includes(day.value)}
                className={activeDays.includes(day.value) ? "day-toggle active" : "day-toggle"}
                type="button"
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>
        </section>

        <section className="detail-panel">
          <p className="eyebrow">Summary</p>
          <dl className="system-list">
            <div>
              <dt>Repeats</dt>
              <dd>{daysLabel(routine)}</dd>
            </div>
            <div>
              <dt>Dates</dt>
              <dd>{datesLabel(routine)}</dd>
            </div>
            <div>
              <dt>Window</dt>
              <dd>{formatRoutineWindow(routine)}</dd>
            </div>
            <div>
              <dt>Layer</dt>
              <dd>{routine.layer ?? "baseline"}</dd>
            </div>
          </dl>
        </section>

        <section className="detail-panel">
          <p className="eyebrow">Timing</p>
          <dl className="system-list">
            <div>
              <dt>Leave</dt>
              <dd>{routine.timing?.leaveAt ?? "n/a"}</dd>
            </div>
            <div>
              <dt>Arrive</dt>
              <dd>{routine.timing?.arriveBy ?? "n/a"}</dd>
            </div>
            <div>
              <dt>Deadline</dt>
              <dd>{routine.timing?.deadline ?? routine.deadlineTime ?? "n/a"}</dd>
            </div>
          </dl>
        </section>

        <section className="detail-panel detail-panel-wide">
          <p className="eyebrow">{isTimeline ? "Timeline" : "Checklist"}</p>
          {items.length ? (
            <ul className="plain-list">
              {items.map((item) => (
                <li className="append-card" key={item.id}>
                  <span className="append-label">{item.label}</span>
                  <span className="append-meta">
                    {isTimeline
                      ? `${"start" in item && item.start ? item.start : "Flexible"} / ${"durationMinutes" in item && item.durationMinutes ? item.durationMinutes : 0} min`
                      : `${"targetOffsetMinutes" in item && item.targetOffsetMinutes != null ? item.targetOffsetMinutes : 0} min from leave`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No display items are attached to this routine yet.</p>
          )}
        </section>

        <section className="detail-panel">
          <p className="eyebrow">Route</p>
          <dl className="system-list">
            <div>
              <dt>Route</dt>
              <dd>{routine.routeId ?? "none"}</dd>
            </div>
            <div>
              <dt>List</dt>
              <dd>{routine.listId ?? "none"}</dd>
            </div>
          </dl>
        </section>

        <section className="detail-panel">
          <p className="eyebrow">Theme</p>
          <dl className="system-list">
            <div>
              <dt>Scene</dt>
              <dd>{routine.display?.scene ?? routine.type ?? "routine"}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>{routine.display?.priority ?? 50}</dd>
            </div>
            <div>
              <dt>Theme</dt>
              <dd>{routineTheme(routine)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
}

function RoutinePersistencePanel({ draftConfig }: { draftConfig: RoutinesConfig }) {
  const [repo, setRepo] = useState(() => localStorage.getItem(githubRepoKey) || "jchromchak/famframe");
  const [branch, setBranch] = useState(() => localStorage.getItem(githubBranchKey) || "main");
  const [token, setToken] = useState(() => localStorage.getItem(githubTokenKey) || "");
  const [status, setStatus] = useState("Draft changes are local until saved.");
  const routinesJson = useMemo(() => `${JSON.stringify(draftConfig, null, 2)}\n`, [draftConfig]);

  function saveBrowserDraft() {
    localStorage.setItem(routineDraftKey, routinesJson);
    setStatus("Saved a browser draft of config/routines.json.");
  }

  function downloadDraft() {
    const blob = new Blob([routinesJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "routines.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded routines.json draft.");
  }

  async function pushToGitHub() {
    const cleanRepo = repo.trim();
    const cleanBranch = branch.trim() || "main";
    const cleanToken = token.trim();

    if (!cleanRepo || !cleanToken) {
      setStatus("Add a GitHub repo and token before pushing.");
      return;
    }

    localStorage.setItem(githubRepoKey, cleanRepo);
    localStorage.setItem(githubBranchKey, cleanBranch);
    localStorage.setItem(githubTokenKey, cleanToken);
    setStatus("Saving config/routines.json to GitHub...");

    try {
      await putGitHubFile({
        repo: cleanRepo,
        branch: cleanBranch,
        token: cleanToken,
        path: "config/routines.json",
        content: routinesJson,
        message: "Update baseline routines",
      });
      setStatus("Saved config/routines.json to GitHub. Refresh the dashboard after Pages updates.");
    } catch (error) {
      setStatus(error instanceof Error ? `GitHub save failed: ${error.message}` : "GitHub save failed.");
    }
  }

  return (
    <section className="detail-panel detail-panel-wide persistence-panel">
      <div className="detail-panel-head">
        <div>
          <p className="eyebrow">Persistence</p>
          <h3>Baseline routine save path</h3>
        </div>
        <span className="sync-pill">config/routines.json</span>
      </div>

      <div className="routine-editor-grid">
        <label className="field-stack">
          <span>GitHub repo</span>
          <input value={repo} onChange={(event) => setRepo(event.target.value)} />
        </label>
        <label className="field-stack">
          <span>Branch</span>
          <input value={branch} onChange={(event) => setBranch(event.target.value)} />
        </label>
        <label className="field-stack">
          <span>Token</span>
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Contents read/write token"
          />
        </label>
      </div>

      <div className="action-row">
        <button className="primary-action" type="button" onClick={saveBrowserDraft}>
          Save browser draft
        </button>
        <button className="text-button bordered-action" type="button" onClick={downloadDraft}>
          Download JSON
        </button>
        <button className="primary-action" type="button" onClick={pushToGitHub}>
          Push baseline
        </button>
      </div>

      <p className="muted">{status}</p>
    </section>
  );
}

function toRoutinesConfig(sourceConfig: RoutinesConfig, routines: Routine[]): RoutinesConfig {
  return {
    schemaVersion: sourceConfig.schemaVersion ?? 1,
    routines: routines.map(stripHydratedRoutine),
    lists: sourceConfig.lists ?? [],
  };
}

function stripHydratedRoutine(routine: Routine): Routine {
  const { tasks, ...sourceRoutine } = routine;

  if (!routine.listId) {
    return routine;
  }

  return sourceRoutine;
}

async function putGitHubFile({
  repo,
  branch,
  token,
  path,
  content,
  message,
}: {
  repo: string;
  branch: string;
  token: string;
  path: string;
  content: string;
  message: string;
}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const readUrl = `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`;
  const readResponse = await fetch(readUrl, { headers });

  if (!readResponse.ok) {
    throw new Error(await githubError(readResponse, `Could not read ${path} before saving.`));
  }

  const currentFile = await readResponse.json() as { sha?: string };
  const saveResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branch,
      content: encodeContent(content),
      message,
      sha: currentFile.sha,
    }),
  });

  if (!saveResponse.ok) {
    throw new Error(await githubError(saveResponse, `Could not save ${path}.`));
  }
}

function encodeContent(content: string) {
  return btoa(unescape(encodeURIComponent(content)));
}

async function githubError(response: Response, fallback: string) {
  try {
    const body = await response.json() as { message?: string };

    return `${fallback} GitHub returned ${response.status}${body.message ? `: ${body.message}` : ""}`;
  } catch {
    return `${fallback} GitHub returned ${response.status}.`;
  }
}

function System({
  config,
  account,
  family,
  device,
}: {
  config: ConfigState | null;
  account: Account;
  family: Family;
  device: DeviceTarget | null;
}) {
  return (
    <div className="panel-grid">
      <section className="wide-panel">
        <p className="eyebrow">Source of Truth</p>
        <h2>React is reading the same JSON as the TV.</h2>
        <p className="muted">
          Routine edits can now export or push the baseline routines JSON. Broader config sync still belongs to the
          legacy admin until this flow is proven.
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
          <div>
            <dt>Account</dt>
            <dd>{account.email}</dd>
          </div>
          <div>
            <dt>Family</dt>
            <dd>{family.handle}</dd>
          </div>
          <div>
            <dt>Device</dt>
            <dd>{device?.handle ?? "none"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export default App;
