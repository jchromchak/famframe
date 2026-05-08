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

  return { routines: routineConfig.routines ?? [], display };
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
