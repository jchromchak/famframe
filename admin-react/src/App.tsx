import { useEffect, useMemo, useState } from "react";
import { ConfigState, Routine, formatRoutineWindow, loadConfig, routineTheme } from "./config";
import {
  Account,
  DeviceTarget,
  Family,
  FamilyMember,
  Membership,
  accounts,
  deviceTargets as seedDeviceTargets,
  families as seedFamilies,
  familyMembers as seedFamilyMembers,
  memberships as seedMemberships,
} from "./mockData";

type View = "week" | "capture" | "routines" | "system";

const navItems: Array<{ id: View; label: string }> = [
  { id: "week", label: "This Week" },
  { id: "capture", label: "Capture" },
  { id: "routines", label: "Routines" },
  { id: "system", label: "System" },
];

const sampleAppends = ["Library books tomorrow", "Pack soccer gear", "Late start morning"];
const timezoneOptions = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"];

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

function App() {
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [activeFamily, setActiveFamily] = useState<Family | null>(null);
  const [activeDevice, setActiveDevice] = useState<DeviceTarget | null>(null);
  const [activeView, setActiveView] = useState<View>("week");
  const [families, setFamilies] = useState<Family[]>(seedFamilies);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(seedFamilyMembers);
  const [memberships, setMemberships] = useState<Membership[]>(seedMemberships);
  const [deviceTargets, setDeviceTargets] = useState<DeviceTarget[]>(seedDeviceTargets);
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
  const operationalRoutines = activeRoutines.filter((routine) => routine.enabled !== false);
  const visibleAppends = captureText.trim() ? sampleAppends : [];

  const familiesForActiveAccount = useMemo(() => {
    if (!activeAccount) {
      return [];
    }

    if (activeAccount.isSuperAdmin) {
      return families;
    }

    return families.filter((family) =>
      memberships.some((membership) => membership.accountEmail === activeAccount.email && membership.familyId === family.id),
    );
  }, [activeAccount, families, memberships]);

  function devicesForFamily(familyId: string) {
    return deviceTargets.filter((device) => device.familyId === familyId);
  }

  function membersForFamily(familyId: string) {
    return familyMembers.filter((member) => member.familyId === familyId);
  }

  function roleForAccount(account: Account, familyId: string) {
    return memberships.find(
      (membership) => membership.accountEmail === account.email && membership.familyId === familyId,
    )?.role;
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
    return <LoginScreen onLogin={setActiveAccount} />;
  }

  if (!activeFamily) {
    return (
      <FamilySwitcher
        account={activeAccount}
        families={familiesForActiveAccount}
        devicesForFamily={devicesForFamily}
        membersForFamily={membersForFamily}
        roleForAccount={roleForAccount}
        onBack={() => setActiveAccount(null)}
        onSelectFamily={(family, device) => {
          setActiveFamily(family);
          setActiveDevice(device);
        }}
        onCreateFamily={createFamily}
      />
    );
  }

  const familyRole = roleForAccount(activeAccount, activeFamily.id);
  const familyDevices = devicesForFamily(activeFamily.id);

  return (
    <main className="admin-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">{activeFamily.name}</p>
          <h1>{navItems.find((item) => item.id === activeView)?.label}</h1>
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
          <ThisWeek
            routines={operationalRoutines}
            appends={visibleAppends}
            account={activeAccount}
            family={activeFamily}
            device={activeDevice}
            devices={familyDevices}
            onDeviceChange={setActiveDevice}
          />
        ) : null}
        {activeView === "capture" ? (
          <Capture text={captureText} onTextChange={setCaptureText} appends={visibleAppends} />
        ) : null}
        {activeView === "routines" ? <Routines routines={operationalRoutines} /> : null}
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

function LoginScreen({ onLogin }: { onLogin: (account: Account) => void }) {
  const [email, setEmail] = useState(accounts[0].email);
  const selectedAccount = accounts.find((account) => account.email === email) ?? accounts[0];

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
        <button className="primary-action" type="button" onClick={() => onLogin(selectedAccount)}>
          Continue
        </button>
        <p className="muted">Mock login only. This is shaping identity and family access before real auth exists.</p>
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
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Smith Family" />
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

function ThisWeek({
  routines,
  appends,
  account,
  family,
  device,
  devices,
  onDeviceChange,
}: {
  routines: Routine[];
  appends: string[];
  account: Account;
  family: Family;
  device: DeviceTarget | null;
  devices: DeviceTarget[];
  onDeviceChange: (device: DeviceTarget) => void;
}) {
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
          <dd>{routineTheme(routine)}</dd>
        </div>
      </dl>
    </article>
  );
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
