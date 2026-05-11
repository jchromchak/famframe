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
  targetOffsetMinutes?: number;
};

export type TimelineItem = {
  id: string;
  label: string;
  start?: string;
  durationMinutes?: number;
  note?: string;
};

export type Routine = {
  id: string;
  label: string;
  type?: string;
  enabled?: boolean;
  layer?: string;
  appliesTo?: {
    days?: number[];
    dates?: string[];
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
  timeline?: TimelineItem[];
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
  lists?: RoutineList[];
};

type RoutineList = {
  id: string;
  label: string;
  items?: RoutineTask[];
};

type ScenesConfig = {
  scenes?: SceneConfig[];
};

type SceneConfig = {
  id: string;
  label: string;
  type: "tribute" | "routine";
  enabled?: boolean;
  priority?: number;
  schedule?: {
    dates?: string[];
    start?: string;
    end?: string;
  };
  tribute?: {
    image?: string;
    title?: string;
    message?: string;
    mark?: string;
    tone?: string;
  };
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
  const [routineConfig, display, sceneConfig] = await Promise.all([
    readJson<RoutinesConfig>("config/routines.json"),
    readJson<DisplayConfig>("config/display.json"),
    readJson<ScenesConfig>("config/scenes.json"),
  ]);

  const routines = hydrateRoutineTasks(routineConfig.routines ?? [], routineConfig.lists ?? []);

  return { routines, display, scenes: deriveScenes(routines, sceneConfig.scenes ?? []) };
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

export function routineItemCount(routine: Routine) {
  return (routine.tasks?.length ?? 0) + (routine.timeline?.length ?? 0);
}

export function sceneTypeLabel(scene: AdminScene) {
  return scene.type === "tribute" ? "Tribute scene" : "Routine scene";
}

function deriveScenes(routines: Routine[], configuredScenes: SceneConfig[]): AdminScene[] {
  const routineScenes = routines.map((routine) => ({
    id: `scene-${routine.id}`,
    label: routine.label,
    type: "routine" as const,
    status: routine.enabled === false ? "inactive" as const : "active" as const,
    source: routine.display?.scene || routine.type || "routine",
    schedule: formatRoutineWindow(routine),
    routine,
  }));

  const tributeScenes: AdminScene[] = configuredScenes
    .filter((scene) => scene.type === "tribute")
    .map((scene) => ({
      id: scene.id,
      label: scene.tribute?.title || scene.label,
      type: "tribute" as const,
      status: scene.enabled === false ? "inactive" as const : "active" as const,
      source: "Scene config",
      schedule: sceneScheduleLabel(scene),
      imagePath: scene.tribute?.image,
    }));

  return [...tributeScenes, ...routineScenes];
}

function sceneScheduleLabel(scene: SceneConfig) {
  const dates = scene.schedule?.dates ?? [];
  const dateLabel = dates.length ? compactDateRange(dates) : "Unscheduled";
  const start = scene.schedule?.start;
  const end = scene.schedule?.end;

  if (start && end) {
    return `${dateLabel}, ${start} to ${end}`;
  }

  return dateLabel;
}

function compactDateRange(dates: string[]) {
  if (dates.length === 1) return dates[0];
  return `${dates[0]} to ${dates[dates.length - 1]}`;
}

function hydrateRoutineTasks(routines: Routine[], lists: RoutineList[]) {
  const listsById = new Map(lists.map((list) => [list.id, list]));

  return routines.map((routine) => {
    if (routine.tasks?.length || routine.timeline?.length || !routine.listId) {
      return routine;
    }

    const list = listsById.get(routine.listId);
    if (!list?.items?.length) {
      return routine;
    }

    return {
      ...routine,
      tasks: list.items.map((item) => ({
        id: item.id,
        label: item.label,
        icon: item.icon,
        ownerId: item.ownerId,
        targetOffsetMinutes: item.targetOffsetMinutes,
      })),
    };
  });
}
