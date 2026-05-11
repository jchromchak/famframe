import {
  Account,
  DeviceTarget,
  Family,
  FamilyMember,
  Membership,
  accounts as fallbackAccounts,
  deviceTargets as fallbackDeviceTargets,
  families as fallbackFamilies,
  familyMembers as fallbackFamilyMembers,
  memberships as fallbackMemberships,
} from "./mockData";

export type RoutineTask = {
  id: string;
  label: string;
  time?: string;
  icon?: string;
  ownerId?: string;
};

export type Routine = {
  id: string;
  label: string;
  type?: string;
  enabled?: boolean;
  layer?: string;
  appliesTo?: {
    days?: number[];
  };
  window?: {
    start?: string;
    end?: string;
  };
  display?: {
    scene?: string;
    priority?: number;
    themeId?: string;
  };
  timing?: {
    leaveAt?: string;
    arriveBy?: string;
    deadline?: string;
  };
  targetTime?: string;
  deadlineTime?: string;
  routeId?: string;
  listId?: string;
  listIds?: string[];
  themeId?: string;
  tasks?: RoutineTask[];
};

export type AdminScene = {
  id: string;
  label: string;
  type: "routine" | "tribute";
  status: "active" | "inactive";
  source: string;
  schedule: string;
  imagePath?: string;
  routine?: Routine;
};

type RoutinesConfig = {
  routines: Routine[];
};

export type DisplayConfig = {
  theme?: string;
  runtime?: {
    scene?: string;
    routineId?: string;
  };
};

export type ConfigState = {
  routines: Routine[];
  display: DisplayConfig;
  scenes: AdminScene[];
};

export type IdentityConfig = {
  accounts: Account[];
  families: Family[];
  familyMembers: FamilyMember[];
  memberships: Membership[];
  deviceTargets: DeviceTarget[];
};

export const fallbackIdentity: IdentityConfig = {
  accounts: fallbackAccounts,
  families: fallbackFamilies,
  familyMembers: fallbackFamilyMembers,
  memberships: fallbackMemberships,
  deviceTargets: fallbackDeviceTargets,
};

const configUrl = (path: string) => (import.meta.env.DEV ? `/${path}` : `../${path}`);

async function readJson<T>(path: string): Promise<T> {
  const response = await fetch(configUrl(path));

  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }

  return response.json() as Promise<T>;
}

export async function loadConfig(): Promise<ConfigState> {
  const [routineConfig, display] = await Promise.all([
    readJson<RoutinesConfig>("config/routines.json"),
    readJson<DisplayConfig>("config/display.json"),
  ]);

  const routines = routineConfig.routines ?? [];

  return { routines, display, scenes: deriveScenes(routines) };
}

export async function loadIdentityConfig(): Promise<IdentityConfig> {
  try {
    const identity = await readJson<Partial<IdentityConfig>>("config/identity.json");

    return {
      accounts: identity.accounts ?? fallbackIdentity.accounts,
      families: identity.families ?? fallbackIdentity.families,
      familyMembers: identity.familyMembers ?? fallbackIdentity.familyMembers,
      memberships: identity.memberships ?? fallbackIdentity.memberships,
      deviceTargets: identity.deviceTargets ?? fallbackIdentity.deviceTargets,
    };
  } catch {
    return fallbackIdentity;
  }
}

export function formatRoutineWindow(routine: Routine) {
  const start = routine.window?.start;
  const end = routine.window?.end;

  if (start && end) {
    return `${start} to ${end}`;
  }

  if (routine.timing?.leaveAt) {
    return `Leave ${routine.timing.leaveAt}`;
  }

  if (routine.targetTime) {
    return `Target ${routine.targetTime}`;
  }

  return "Flexible";
}

export function routineTheme(routine: Routine) {
  return routine.display?.themeId || routine.themeId || "Default";
}

export function sceneTypeLabel(scene: AdminScene) {
  return scene.type === "tribute" ? "Tribute scene" : "Routine scene";
}

function deriveScenes(routines: Routine[]): AdminScene[] {
  const routineScenes = routines.map((routine) => ({
    id: `scene-${routine.id}`,
    label: routine.label,
    type: "routine" as const,
    status: routine.enabled === false ? "inactive" as const : "active" as const,
    source: routine.display?.scene || routine.type || "routine",
    schedule: formatRoutineWindow(routine),
    routine,
  }));

  const tributeScenes: AdminScene[] = [
    {
      id: "scene-arthur-birthday-2026",
      label: "Happy Birthday Arthur!",
      type: "tribute",
      status: "active",
      source: "Special day",
      schedule: "May 10-11, 2026",
      imagePath: "../assets/tributes/arthur-birthday-2026.png",
    },
  ];

  return [...tributeScenes, ...routineScenes];
}
