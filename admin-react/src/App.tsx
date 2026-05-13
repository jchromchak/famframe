import { useEffect, useMemo, useState } from "react";
import {
  AdminScene,
  ConfigState,
  RouteConfig,
  RoutesConfig,
  Routine,
  RoutineTask,
  RoutinesConfig,
  TimelineItem,
  fallbackIdentity,
  formatRoutineWindow,
  loadConfig,
  loadIdentityConfig,
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
import type { AddEventInput } from "./ThisWeekView";
import {
  devicesForFamily,
  familiesForAccount,
  membersForFamily,
  roleForAccount,
} from "./identity";
import { suggestionsForRoutine } from "./routineSuggestions";
import type { RoutineSuggestion } from "./routineSuggestions";

type View = "week" | "capture" | "scenes" | "routines" | "system";
type EditScope = "instance" | "future";

const navItems: Array<{ id: View; label: string }> = [
  { id: "week", label: "This Week" },
  { id: "routines", label: "Routines" },
  { id: "capture", label: "Capture" },
];

const timezoneOptions = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"];
const githubTokenKey = "fam_frame_github_pat";
const githubRepoKey = "fam_frame_config_repo";
const githubBranchKey = "fam_frame_config_branch";
const routineDraftKey = "fam_frame_react_routine_drafts";
const googleMapsKey = "fam_frame_gmaps_key";
const commuteOriginKey = "fam_frame_commute_origin";
const commuteDestinationKey = "fam_frame_commute_destination";
let mapsPromise: Promise<any> | null = null;
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
  const [syncStatus, setSyncStatus] = useState("Ready");
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

  async function refreshSchoolRoute() {
    if (!config) {
      setSyncStatus("Config is still loading.");
      return;
    }

    const mapsKey = localStorage.getItem(googleMapsKey) || "";
    const origin = localStorage.getItem(commuteOriginKey) || "";
    const destination = localStorage.getItem(commuteDestinationKey) || "";
    const token = localStorage.getItem(githubTokenKey) || "";
    const repo = localStorage.getItem(githubRepoKey) || "jchromchak/famframe";
    const branch = localStorage.getItem(githubBranchKey) || "main";

    if (!mapsKey || !origin || !destination) {
      setSyncStatus("Route refresh needs the Maps key, origin, and destination saved in the legacy admin first.");
      return;
    }

    if (!token) {
      setSyncStatus("Route refresh needs the GitHub token saved locally before it can push routes.json.");
      return;
    }

    setSyncStatus("Refreshing school route...");

    try {
      const derivedRoute = await deriveSchoolRoute(mapsKey, origin, destination);
      const nextRoutesConfig = updateRouteDerived(config.routesConfig, "route-school-morning", derivedRoute);
      const content = `${JSON.stringify(nextRoutesConfig, null, 2)}\n`;

      await putGitHubFile({
        repo,
        branch,
        token,
        path: "config/routes.json",
        content,
        message: "Refresh Fam Frame school route",
      });

      setConfig({ ...config, routesConfig: nextRoutesConfig });
      setSyncStatus(
        `School route refreshed: ${derivedRoute.derived?.durationMinutes ?? "?"} min / ${derivedRoute.derived?.trafficStatus ?? "traffic unknown"}.`,
      );
    } catch (error) {
      setSyncStatus(error instanceof Error ? `Route refresh failed: ${error.message}` : "Route refresh failed.");
    }
  }

  function addEvent(input: AddEventInput) {
    const createdAt = Date.now();
    const selectedKey = dateKey(selectedDate);
    const nextRoutine: Routine = {
      id: `routine-${slugify(input.label)}-${createdAt}`,
      label: input.label.trim(),
      type: input.type,
      enabled: true,
      layer: input.recurrence === "date" ? "addon" : "baseline",
      appliesTo: input.recurrence === "date"
        ? { dates: [selectedKey] }
        : { days: [selectedDate.getDay()] },
      window: {
        start: input.windowStart,
        end: input.windowEnd,
      },
      display: {
        scene: input.type === "departure" ? "departure" : "evening",
        priority: input.recurrence === "date" ? 70 : 50,
        themeId: "",
      },
      ...(input.type === "departure"
        ? {
            timing: {
              leaveAt: input.leaveAt || undefined,
              arriveBy: input.arriveBy || undefined,
              deadline: input.deadline || undefined,
            },
          }
        : {
            timeline: [
              {
                id: `item-${createdAt}`,
                label: input.label.trim(),
                start: input.windowStart,
                durationMinutes: durationMinutes(input.windowStart, input.windowEnd),
              },
            ],
          }),
    };

    setConfig((current) => {
      if (!current) {
        return current;
      }

      const nextRoutines = [...current.routines, nextRoutine];

      return {
        ...current,
        routines: nextRoutines,
      };
    });
    setSelectedRoutineId(nextRoutine.id);
    setActiveView("routines");
    setSyncStatus(`${input.recurrence === "date" ? "One-off" : "Weekly"} event added as a local routine draft.`);
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
  const activeFamilyMembers = getMembersForFamily(activeFamily.id);

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
          <span className="sync-pill">{syncPillLabel(syncStatus)}</span>
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
            onEventAdd={addEvent}
            routeRefreshStatus={syncStatus}
            onRouteRefresh={refreshSchoolRoute}
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
            familyMembers={activeFamilyMembers}
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

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function durationMinutes(start: string, end: string) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;

  return Math.max(0, endTotal - startTotal);
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
  familyMembers,
  initialSelectedRoutineId,
}: {
  routines: Routine[];
  sourceConfig: RoutinesConfig;
  familyMembers: FamilyMember[];
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

  function disableRoutine(routineId: string) {
    setDraftRoutines((current) =>
      current.map((routine) =>
        routine.id === routineId
          ? {
              ...routine,
              enabled: false,
            }
          : routine,
      ),
    );
  }

  function deleteRoutine(routineId: string) {
    setDraftRoutines((current) => {
      const nextRoutines = current.filter((routine) => routine.id !== routineId);

      if (selectedRoutineId === routineId) {
        setSelectedRoutineId(nextRoutines[0]?.id ?? "");
      }

      return nextRoutines;
    });
  }

  const draftConfig = useMemo(
    () => toRoutinesConfig(sourceConfig, draftRoutines),
    [sourceConfig, draftRoutines],
  );
  const hasPendingChanges = stableConfigJson(draftConfig) !== stableConfigJson(sourceConfig);
  const draftSummary = useMemo(
    () => routineDraftSummary(sourceConfig, draftConfig),
    [sourceConfig, draftConfig],
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
        <RoutineDetail
          routine={selectedRoutine}
          onDelete={deleteRoutine}
          onDisable={disableRoutine}
          onUpdate={updateRoutine}
          draftConfig={draftConfig}
          draftSummary={draftSummary}
          familyMembers={familyMembers}
          hasPendingChanges={hasPendingChanges}
        />
      ) : (
        <section className="routine-detail empty-detail">
          <p className="eyebrow">Routines</p>
          <h2>No routines yet</h2>
          <p className="muted">Add an event from This Week to start a local routine draft.</p>
        </section>
      )}
    </div>
  );
}

function Scenes({ scenes }: { scenes: AdminScene[] }) {
  const tributeCount = scenes.filter((scene) => scene.type === "tribute").length;
  const routineCount = scenes.filter((scene) => scene.type === "routine").length;
  const scheduledTributes = scenes.filter((scene) => scene.type === "tribute" && scene.status === "active");
  const conflictGroups = sceneConflictGroups(scheduledTributes);
  const conflictDateCount = conflictGroups.length;

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
          <div>
            <dt>Conflicts</dt>
            <dd>{conflictDateCount}</dd>
          </div>
        </dl>
      </section>

      {conflictGroups.length ? (
        <section className="wide-panel scene-conflict-panel">
          <div className="detail-panel-head">
            <div>
              <p className="eyebrow">Schedule conflicts</p>
              <h2>Priority decides overlapping tribute days.</h2>
            </div>
          </div>
          <div className="conflict-list">
            {conflictGroups.map((group) => (
              <article className="conflict-card" key={group.date}>
                <div>
                  <p className="eyebrow">{group.date}</p>
                  <h3>{group.winner.label}</h3>
                  <p className="muted">Wins with priority {scenePriority(group.winner)}.</p>
                </div>
                <ul className="plain-list">
                  {group.scenes.map((scene) => (
                    <li key={scene.id}>
                      <span className="append-label">{scene.label}</span>
                      <span className="append-meta">Priority {scenePriority(scene)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="scene-browser">
        {sortScenesForAdmin(scenes).map((scene) => (
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
          <dt>Priority</dt>
          <dd>{scenePriority(scene)}</dd>
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

function scenePriority(scene: AdminScene) {
  return scene.priority ?? 50;
}

function sortScenesForAdmin(scenes: AdminScene[]) {
  return [...scenes].sort((left, right) => {
    if (left.type !== right.type) return left.type === "tribute" ? -1 : 1;
    return scenePriority(right) - scenePriority(left);
  });
}

function sceneConflictGroups(scenes: AdminScene[]) {
  const byDate = new Map<string, AdminScene[]>();

  scenes.forEach((scene) => {
    (scene.scheduleDates ?? []).forEach((date) => {
      const current = byDate.get(date) ?? [];
      byDate.set(date, [...current, scene]);
    });
  });

  return Array.from(byDate.entries())
    .filter(([, dateScenes]) => dateScenes.length > 1)
    .map(([date, dateScenes]) => {
      const sortedScenes = sortScenesForAdmin(dateScenes);

      return {
        date,
        scenes: sortedScenes,
        winner: sortedScenes[0],
      };
    })
    .sort((left, right) => left.date.localeCompare(right.date));
}

function RoutineDetail({
  routine,
  onDelete,
  onDisable,
  onUpdate,
  draftConfig,
  draftSummary,
  familyMembers,
  hasPendingChanges,
}: {
  routine: Routine;
  onDelete: (routineId: string) => void;
  onDisable: (routineId: string) => void;
  onUpdate: (routine: Routine) => void;
  draftConfig: RoutinesConfig;
  draftSummary: RoutineDraftSummary;
  familyMembers: FamilyMember[];
  hasPendingChanges: boolean;
}) {
  const isTimeline = routine.type === "timeline";
  const items = isTimeline ? routine.timeline ?? [] : routine.tasks ?? [];
  const activeDays = routine.appliesTo?.days ?? [];
  const activeDates = routine.appliesTo?.dates ?? [];
  const [editScope, setEditScope] = useState<EditScope | null>(null);
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);
  const isEditing = editScope !== null;
  const canDelete = routine.layer === "addon" || routine.layer === "override";
  const suggestions = suggestionsForRoutine(
    routine,
    isTimeline
      ? (routine.timeline ?? []).map((item) => item.label)
      : (routine.tasks ?? []).map((item) => item.label),
  );
  const visibleSuggestions = suggestions.filter((suggestion) => showMoreSuggestions || suggestion.tier === "primary");

  useEffect(() => {
    setShowMoreSuggestions(false);
  }, [routine.id]);

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

  function updateTimelineItem(itemId: string, patch: Partial<TimelineItem>) {
    updateRoutine({
      timeline: (routine.timeline ?? []).map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    });
  }

  function addTimelineItem(suggestion?: RoutineSuggestion) {
    const currentTimeline = routine.timeline ?? [];
    const lastItem = currentTimeline[currentTimeline.length - 1];
    const fallbackStart = lastItem?.start ?? routine.window?.start ?? "17:00";
    const nextItem: TimelineItem = {
      id: `timeline-${suggestion?.id ?? "item"}-${Date.now()}`,
      label: suggestion?.label ?? "New item",
      start: nextTimelineStart(lastItem, fallbackStart),
      durationMinutes: suggestion?.durationMinutes ?? 15,
      note: suggestion?.note ?? "",
    };

    updateRoutine({
      timeline: [...currentTimeline, nextItem],
    });
  }

  function deleteTimelineItem(itemId: string) {
    updateRoutine({
      timeline: (routine.timeline ?? []).filter((item) => item.id !== itemId),
    });
  }

  function moveTimelineItem(itemId: string, offset: number) {
    updateRoutine({
      timeline: moveItem((routine.timeline ?? []), itemId, offset),
    });
  }

  function updateTaskItem(itemId: string, patch: Partial<RoutineTask>) {
    updateRoutine({
      tasks: (routine.tasks ?? []).map((item) =>
        item.id === itemId
          ? {
              ...item,
              ...patch,
            }
          : item,
      ),
    });
  }

  function addTaskItem(suggestion?: RoutineSuggestion) {
    const nextItem: RoutineTask = {
      id: `task-${suggestion?.id ?? "item"}-${Date.now()}`,
      label: suggestion?.label ?? "New item",
      targetOffsetMinutes: suggestion?.targetOffsetMinutes ?? 0,
      assignee: "",
    };

    updateRoutine({
      tasks: [...(routine.tasks ?? []), nextItem],
    });
  }

  function deleteTaskItem(itemId: string) {
    updateRoutine({
      tasks: (routine.tasks ?? []).filter((item) => item.id !== itemId),
    });
  }

  function moveTaskItem(itemId: string, offset: number) {
    updateRoutine({
      tasks: moveItem((routine.tasks ?? []), itemId, offset),
    });
  }

  function removeRoutine() {
    if (canDelete && deleteArmed) {
      onDelete(routine.id);
      return;
    }

    if (canDelete) {
      setDeleteArmed(true);
      return;
    }

    if (!canDelete) {
      onDisable(routine.id);
    }
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

      <div className="routine-detail-grid">
        {hasPendingChanges ? (
          <RoutinePersistencePanel
            draftConfig={draftConfig}
            editScope={editScope}
            draftSummary={draftSummary}
            hasPendingChanges={hasPendingChanges}
          />
        ) : null}

        <section className="detail-panel detail-panel-wide routine-editor workbench-basics-panel">
          <div className="detail-panel-head">
            <div>
              <p className="eyebrow">Basics</p>
              <h3>What changes?</h3>
            </div>
            <span className="sync-pill">{editScope ? scopeLabel(editScope) : "Choose scope"}</span>
          </div>

          <div className="scope-choice-grid">
            <button
              className={editScope === "instance" ? "scope-choice active" : "scope-choice"}
              type="button"
              onClick={() => setEditScope("instance")}
            >
              <span>This day only</span>
              <small>Use for a one-off change to the selected occurrence.</small>
            </button>
            <button
              className={editScope === "future" ? "scope-choice active" : "scope-choice"}
              type="button"
              onClick={() => setEditScope("future")}
            >
              <span>This type going forward</span>
              <small>Use for baseline changes to this routine pattern.</small>
            </button>
          </div>

          {!isEditing ? (
            <p className="muted">Choose how far this edit should apply before changing routine fields.</p>
          ) : null}

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={routine.enabled !== false}
              disabled={!isEditing}
              onChange={(event) => updateRoutine({ enabled: event.target.checked })}
            />
            <span>Enabled</span>
          </label>

          <div className="routine-editor-grid">
            <label className="field-stack">
              <span>Name</span>
              <input disabled={!isEditing} value={routine.label} onChange={(event) => updateRoutine({ label: event.target.value })} />
            </label>
            <label className="field-stack">
              <span>One-off dates</span>
              <input disabled={!isEditing} value={activeDates.join(", ")} onChange={(event) => updateDates(event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Window start</span>
              <input disabled={!isEditing} type="time" value={routine.window?.start ?? ""} onChange={(event) => updateWindow("start", event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Window end</span>
              <input disabled={!isEditing} type="time" value={routine.window?.end ?? ""} onChange={(event) => updateWindow("end", event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Leave</span>
              <input disabled={!isEditing} type="time" value={routine.timing?.leaveAt ?? ""} onChange={(event) => updateTiming("leaveAt", event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Arrive</span>
              <input disabled={!isEditing} type="time" value={routine.timing?.arriveBy ?? ""} onChange={(event) => updateTiming("arriveBy", event.target.value)} />
            </label>
            <label className="field-stack">
              <span>Deadline</span>
              <input disabled={!isEditing} type="time" value={routine.timing?.deadline ?? routine.deadlineTime ?? ""} onChange={(event) => updateTiming("deadline", event.target.value)} />
            </label>
          </div>

          <div className="day-toggle-group" aria-label="Recurring days">
            {weekdayOptions.map((day) => (
              <button
                key={day.value}
                aria-pressed={activeDays.includes(day.value)}
                className={activeDays.includes(day.value) ? "day-toggle active" : "day-toggle"}
                disabled={!isEditing}
                type="button"
                onClick={() => toggleDay(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>
        </section>

        <section className="detail-panel detail-panel-wide workbench-primary-panel" id={`${routine.id}-items`}>
          <div className="detail-panel-head">
            <div>
              <p className="eyebrow">{isTimeline ? "Timeline" : "Checklist"}</p>
              <h3>{isTimeline ? "Arrange the evening flow" : "Checklist items"}</h3>
            </div>
            {isTimeline ? (
              <button className="text-button bordered-action compact-action" type="button" disabled={!isEditing} onClick={() => addTimelineItem()}>
                Add item
              </button>
            ) : (
              <button className="text-button bordered-action compact-action" type="button" disabled={!isEditing} onClick={() => addTaskItem()}>
                Add item
              </button>
            )}
          </div>
          {suggestions.length ? (
            <div className="suggestion-panel">
              {visibleSuggestions.length ? (
                <div className="suggestion-chip-row">
                  {visibleSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      className={suggestion.tier === "more" ? "suggestion-chip secondary" : "suggestion-chip"}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => (isTimeline ? addTimelineItem(suggestion) : addTaskItem(suggestion))}
                    >
                      {suggestion.label}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="muted">The usual items are already here.</p>
              )}
              {suggestions.some((suggestion) => suggestion.tier === "more") ? (
                <button className="text-button suggestion-more-button" type="button" onClick={() => setShowMoreSuggestions((current) => !current)}>
                  {showMoreSuggestions ? "Show less" : "See more"}
                </button>
              ) : null}
            </div>
          ) : null}
          {isTimeline && (routine.timeline ?? []).length ? (
            <div className="timeline-editor-list">
              {(routine.timeline ?? []).map((item, index) => (
                <article className="timeline-editor-row" key={item.id}>
                  <label className="field-stack">
                    <span>Item</span>
                    <input
                      disabled={!isEditing}
                      value={item.label}
                      onChange={(event) => updateTimelineItem(item.id, { label: event.target.value })}
                    />
                  </label>
                  <label className="field-stack">
                    <span>Start</span>
                    <input
                      disabled={!isEditing}
                      type="time"
                      value={item.start ?? ""}
                      onChange={(event) => updateTimelineItem(item.id, { start: event.target.value || undefined })}
                    />
                  </label>
                  <label className="field-stack">
                    <span>Minutes</span>
                    <input
                      disabled={!isEditing}
                      min="0"
                      type="number"
                      value={item.durationMinutes ?? 0}
                      onChange={(event) => updateTimelineItem(item.id, { durationMinutes: Number(event.target.value) || 0 })}
                    />
                  </label>
                  <label className="field-stack timeline-note-field">
                    <span>Note</span>
                    <input
                      disabled={!isEditing}
                      value={item.note ?? ""}
                      onChange={(event) => updateTimelineItem(item.id, { note: event.target.value })}
                    />
                  </label>
                  <div className="item-order-actions" aria-label={`Move ${item.label}`}>
                    <button
                      type="button"
                      disabled={!isEditing || index === 0}
                      onClick={() => moveTimelineItem(item.id, -1)}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={!isEditing || index === (routine.timeline?.length ?? 0) - 1}
                      onClick={() => moveTimelineItem(item.id, 1)}
                    >
                      Down
                    </button>
                  </div>
                  <button
                    className="icon-danger-action"
                    type="button"
                    disabled={!isEditing}
                    title={`Delete ${item.label}`}
                    aria-label={`Delete ${item.label}`}
                    onClick={() => deleteTimelineItem(item.id)}
	                  >
	                    Remove
	                  </button>
                </article>
              ))}
            </div>
          ) : isTimeline ? (
            <div className="empty-workbench-items">
              <p className="muted">No timeline items yet.</p>
              <button className="primary-action" type="button" disabled={!isEditing} onClick={() => addTimelineItem()}>
                Add item
              </button>
            </div>
          ) : items.length ? (
            <div className="checklist-editor-list">
              {(routine.tasks ?? []).map((item, index) => (
                <article className="checklist-editor-row" key={item.id}>
                  <label className="field-stack">
                    <span>Item</span>
                    <input
                      disabled={!isEditing}
                      value={item.label}
                      onChange={(event) => updateTaskItem(item.id, { label: event.target.value })}
                    />
                  </label>
                  <label className="field-stack">
                    <span>Offset</span>
                    <input
                      disabled={!isEditing}
                      type="number"
                      value={item.targetOffsetMinutes ?? 0}
                      onChange={(event) => updateTaskItem(item.id, { targetOffsetMinutes: Number(event.target.value) || 0 })}
                    />
                  </label>
                  <label className="field-stack">
                    <span>Assignee</span>
                    <select
                      disabled={!isEditing}
                      value={item.assignee ?? item.ownerId ?? ""}
                      onChange={(event) => updateTaskItem(item.id, { assignee: event.target.value })}
                    >
                      <option value="">Unassigned</option>
                      {familyMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="item-order-actions" aria-label={`Move ${item.label}`}>
                    <button
                      type="button"
                      disabled={!isEditing || index === 0}
                      onClick={() => moveTaskItem(item.id, -1)}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={!isEditing || index === (routine.tasks?.length ?? 0) - 1}
                      onClick={() => moveTaskItem(item.id, 1)}
                    >
                      Down
                    </button>
                  </div>
                  <button
                    className="icon-danger-action"
                    type="button"
                    disabled={!isEditing}
                    title={`Delete ${item.label}`}
                    aria-label={`Delete ${item.label}`}
                    onClick={() => deleteTaskItem(item.id)}
	                  >
	                    Remove
	                  </button>
                </article>
              ))}
            </div>
          ) : !isTimeline ? (
            <div className="empty-workbench-items">
              <p className="muted">No checklist items yet.</p>
              <button className="primary-action" type="button" disabled={!isEditing} onClick={() => addTaskItem()}>
                Add item
              </button>
            </div>
          ) : (
            <p className="muted">No display items are attached to this routine yet.</p>
          )}
        </section>

        <details className="detail-panel detail-panel-wide workbench-secondary-panel">
          <summary>Route</summary>
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
        </details>

        <details className="detail-panel detail-panel-wide workbench-secondary-panel">
          <summary>Display theme</summary>
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
        </details>

        <details className="detail-panel detail-panel-wide workbench-secondary-panel routine-lifecycle-panel">
          <summary>Lifecycle</summary>
          <div className="detail-panel-head">
            <div>
              <p className="eyebrow">{canDelete ? "Remove draft" : "Disable routine"}</p>
              <h3>{routine.layer ?? "baseline"}</h3>
            </div>
          </div>
          <p className="muted">
            {canDelete
              ? "This looks like temporary routine context, so it can be removed from the draft config."
              : "Recurring baseline routines are disabled instead of deleted so their structure is not lost."}
          </p>
          <button
            className={canDelete ? "danger-action" : "text-button bordered-action"}
            type="button"
            disabled={!canDelete && routine.enabled === false}
            onClick={removeRoutine}
          >
            {canDelete
              ? deleteArmed
                ? "Confirm delete"
                : "Delete draft routine"
              : routine.enabled === false
                ? "Routine disabled"
                : "Disable routine"}
          </button>
          {deleteArmed ? <p className="muted">Tap confirm delete to remove this draft from the routine list.</p> : null}
        </details>
      </div>
    </section>
  );
}

function scopeLabel(scope: EditScope) {
  return scope === "instance" ? "This day only" : "Going forward";
}

type RoutineDraftSummary = {
  added: number;
  changed: number;
  disabled: number;
  removed: number;
};

function DraftStatePanel({
  draftSummary,
  hasPendingChanges,
}: {
  draftSummary: RoutineDraftSummary;
  hasPendingChanges: boolean;
}) {
  return (
    <section className={hasPendingChanges ? "detail-panel detail-panel-wide draft-state-panel dirty" : "detail-panel detail-panel-wide draft-state-panel"}>
      <div className="detail-panel-head">
        <div>
          <p className="eyebrow">Draft state</p>
          <h3>{hasPendingChanges ? "Local changes pending" : "Loaded config is unchanged"}</h3>
        </div>
        <span className="sync-pill">{hasPendingChanges ? "Draft" : "Clean"}</span>
      </div>
      <dl className="scene-summary draft-summary">
        <div>
          <dt>Added</dt>
          <dd>{draftSummary.added}</dd>
        </div>
        <div>
          <dt>Changed</dt>
          <dd>{draftSummary.changed}</dd>
        </div>
        <div>
          <dt>Disabled</dt>
          <dd>{draftSummary.disabled}</dd>
        </div>
        <div>
          <dt>Removed</dt>
          <dd>{draftSummary.removed}</dd>
        </div>
      </dl>
      <p className="muted">
        {hasPendingChanges
          ? "These changes exist only in this browser session until you save a browser draft, download JSON, or push baseline routines."
          : "No routine edits have diverged from the loaded config/routines.json file."}
      </p>
    </section>
  );
}

function syncPillLabel(status: string) {
  if (/failed|needs|missing|add /i.test(status)) {
    return "Needs setup";
  }

  if (/refreshing|saving/i.test(status)) {
    return "Syncing";
  }

  if (/refreshed|saved/i.test(status)) {
    return "Synced";
  }

  return status;
}

function RoutinePersistencePanel({
  draftConfig,
  editScope,
  draftSummary,
  hasPendingChanges,
}: {
  draftConfig: RoutinesConfig;
  editScope: EditScope | null;
  draftSummary: RoutineDraftSummary;
  hasPendingChanges: boolean;
}) {
  const [repo, setRepo] = useState(() => localStorage.getItem(githubRepoKey) || "jchromchak/famframe");
  const [branch, setBranch] = useState(() => localStorage.getItem(githubBranchKey) || "main");
  const [token, setToken] = useState(() => localStorage.getItem(githubTokenKey) || "");
  const [status, setStatus] = useState("Local routine edits are not published until you choose a save path.");
  const routinesJson = useMemo(() => `${JSON.stringify(draftConfig, null, 2)}\n`, [draftConfig]);

  function saveBrowserDraft() {
    localStorage.setItem(routineDraftKey, routinesJson);
    setStatus(`Saved a browser draft for ${editScope ? scopeLabel(editScope).toLowerCase() : "unscoped"} changes.`);
  }

  function downloadDraft() {
    const blob = new Blob([routinesJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "routines.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus(`Downloaded routines.json draft for ${editScope ? scopeLabel(editScope).toLowerCase() : "unscoped"} changes.`);
  }

  async function saveToGitHub() {
    const cleanRepo = repo.trim();
    const cleanBranch = branch.trim() || "main";
    const cleanToken = token.trim();

    if (!cleanRepo || !cleanToken) {
      setStatus("Open Advanced and add a GitHub repo and token before saving.");
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
      setStatus(`Saved ${editScope ? scopeLabel(editScope).toLowerCase() : "routine"} changes to GitHub. Refresh the dashboard after Pages updates.`);
    } catch (error) {
      setStatus(error instanceof Error ? `GitHub save failed: ${error.message}` : "GitHub save failed.");
    }
  }

  return (
    <section className="detail-panel detail-panel-wide persistence-panel">
      <div className="detail-panel-head">
        <div>
          <p className="eyebrow">Save</p>
          <h3>{hasPendingChanges ? "Local changes pending" : "No unsaved routine changes"}</h3>
        </div>
        <span className="sync-pill">{hasPendingChanges ? "Pending" : "No changes"}</span>
      </div>

      <div className="action-row save-action-row">
        <button className="primary-action" type="button" disabled={!hasPendingChanges} onClick={saveBrowserDraft}>
          Save draft
        </button>
        <button className="primary-action" type="button" disabled={!hasPendingChanges} onClick={saveToGitHub}>
          Save
        </button>
      </div>

      <p className="muted">{status}</p>

      <details className="advanced-save-panel">
        <summary>Advanced</summary>
        <dl className="scene-summary draft-summary">
          <div>
            <dt>Added</dt>
            <dd>{draftSummary.added}</dd>
          </div>
          <div>
            <dt>Changed</dt>
            <dd>{draftSummary.changed}</dd>
          </div>
          <div>
            <dt>Disabled</dt>
            <dd>{draftSummary.disabled}</dd>
          </div>
          <div>
            <dt>Removed</dt>
            <dd>{draftSummary.removed}</dd>
          </div>
        </dl>
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
        <button className="text-button bordered-action" type="button" disabled={!hasPendingChanges} onClick={downloadDraft}>
          Download JSON
        </button>
      </details>
    </section>
  );
}

function toRoutinesConfig(sourceConfig: RoutinesConfig, routines: Routine[]): RoutinesConfig {
  const routinesWithTasks = routines.filter((routine) => routine.listId && routine.tasks);

  return {
    ...sourceConfig,
    schemaVersion: sourceConfig.schemaVersion ?? 1,
    routines: routines.map(stripHydratedRoutine),
    lists: (sourceConfig.lists ?? []).map((list) => {
      const owningRoutine = routinesWithTasks.find((routine) => routine.listId === list.id);

      if (!owningRoutine?.tasks) {
        return list;
      }

      return {
        ...list,
        items: owningRoutine.tasks.map((task) => {
          const sourceItem: Partial<RoutineTask> = list.items?.find((item) => item.id === task.id) ?? {};

          return {
            ...sourceItem,
            id: task.id,
            label: task.label,
            icon: task.icon ?? sourceItem.icon,
            ownerId: task.ownerId,
            assignee: task.assignee,
            targetOffsetMinutes: task.targetOffsetMinutes,
          };
        }),
      };
    }),
  };
}

function stableConfigJson(config: RoutinesConfig) {
  return JSON.stringify(config);
}

function routineDraftSummary(sourceConfig: RoutinesConfig, draftConfig: RoutinesConfig): RoutineDraftSummary {
  const sourceRoutines = sourceConfig.routines ?? [];
  const draftRoutines = draftConfig.routines ?? [];
  const sourceById = new Map(sourceRoutines.map((routine) => [routine.id, routine]));
  const draftById = new Map(draftRoutines.map((routine) => [routine.id, routine]));
  const sourceLists = sourceConfig.lists ?? [];
  const draftLists = draftConfig.lists ?? [];
  const sourceListById = new Map(sourceLists.map((list) => [list.id, list]));
  let changed = 0;
  let disabled = 0;

  draftRoutines.forEach((routine) => {
    const sourceRoutine = sourceById.get(routine.id);

    if (!sourceRoutine) {
      return;
    }

    if (stableRoutineJson(sourceRoutine) !== stableRoutineJson(routine)) {
      changed += 1;
    }

    if (sourceRoutine.enabled !== false && routine.enabled === false) {
      disabled += 1;
    }
  });

  draftLists.forEach((list) => {
    const sourceList = sourceListById.get(list.id);

    if (sourceList && JSON.stringify(sourceList) !== JSON.stringify(list)) {
      changed += 1;
    }
  });

  return {
    added: draftRoutines.filter((routine) => !sourceById.has(routine.id)).length,
    changed,
    disabled,
    removed: sourceRoutines.filter((routine) => !draftById.has(routine.id)).length,
  };
}

function stableRoutineJson(routine: Routine) {
  return JSON.stringify(stripHydratedRoutine(routine));
}

function moveItem<T extends { id: string }>(items: T[], itemId: string, offset: number) {
  const currentIndex = items.findIndex((item) => item.id === itemId);
  const nextIndex = currentIndex + offset;

  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(currentIndex, 1);

  nextItems.splice(nextIndex, 0, item);
  return nextItems;
}

function nextTimelineStart(lastItem: TimelineItem | undefined, fallbackStart: string) {
  if (!lastItem?.start) {
    return fallbackStart;
  }

  return addMinutesToTime(lastItem.start, lastItem.durationMinutes ?? 15);
}

function addMinutesToTime(value: string, minutesToAdd: number) {
  const [hour, minute] = value.split(":").map(Number);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return value;
  }

  const total = (hour * 60 + minute + minutesToAdd) % (24 * 60);
  const safeTotal = total < 0 ? total + 24 * 60 : total;
  const nextHour = Math.floor(safeTotal / 60);
  const nextMinute = safeTotal % 60;

  return `${String(nextHour).padStart(2, "0")}:${String(nextMinute).padStart(2, "0")}`;
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

async function deriveSchoolRoute(key: string, origin: string, destination: string): Promise<RouteConfig> {
  const maps = await loadGoogleMaps(key);
  const routes = maps.importLibrary ? await maps.importLibrary("routes") : maps;
  const DistanceMatrixService = routes.DistanceMatrixService || maps.DistanceMatrixService;
  const service = new DistanceMatrixService();
  const request = {
    origins: [origin],
    destinations: [destination],
    travelMode: maps.TravelMode.DRIVING,
    unitSystem: maps.UnitSystem.IMPERIAL,
    drivingOptions: {
      departureTime: new Date(Date.now() + 60_000),
      trafficModel: "bestguess",
    },
  };
  const response = service.getDistanceMatrix.length < 2
    ? await service.getDistanceMatrix(request)
    : await new Promise<any>((resolve, reject) => {
        service.getDistanceMatrix(request, (result: any, status: string) =>
          status === "OK" ? resolve(result) : reject(new Error(status)),
        );
      });
  const leg = response?.rows?.[0]?.elements?.[0];

  if (!leg || leg.status !== "OK") {
    throw new Error(leg?.status ?? "No school route returned.");
  }

  const trafficSeconds = Number((leg.duration_in_traffic || leg.duration || {}).value || 0);
  const normalSeconds = Number((leg.duration || {}).value || 0);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);

  return {
    id: "route-school-morning",
    label: "US-17 N to School",
    derived: {
      provider: "google-maps",
      durationMinutes: Math.max(1, Math.round(trafficSeconds / 60)),
      trafficStatus: trafficStatus(trafficSeconds, normalSeconds),
      updatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    },
  };
}

function updateRouteDerived(routesConfig: RoutesConfig, routeId: string, nextRoute: RouteConfig): RoutesConfig {
  return {
    ...routesConfig,
    routes: (routesConfig.routes ?? []).map((route) =>
      route.id === routeId
        ? {
            ...route,
            derived: nextRoute.derived,
          }
        : route,
    ),
  };
}

function loadGoogleMaps(key: string): Promise<any> {
  const existingGoogle = (window as any).google;

  if (existingGoogle?.maps) {
    return Promise.resolve(existingGoogle.maps);
  }

  if (mapsPromise) {
    return mapsPromise;
  }

  mapsPromise = new Promise((resolve, reject) => {
    const callbackName = "__famFrameReactMapsReady";
    const script = document.createElement("script");

    (window as any)[callbackName] = () => {
      resolve((window as any).google.maps);
      delete (window as any)[callbackName];
    };
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places&v=weekly&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => reject(new Error("Google Maps failed to load."));
    document.head.appendChild(script);
  });

  return mapsPromise;
}

function trafficStatus(trafficSeconds: number, normalSeconds: number) {
  if (!trafficSeconds || !normalSeconds) {
    return "unknown";
  }

  const ratio = trafficSeconds / normalSeconds;

  if (ratio >= 1.35) {
    return "heavy";
  }

  if (ratio >= 1.12) {
    return "moderate";
  }

  return "light";
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
