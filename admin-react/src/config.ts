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
  scene?: string;
  days?: string[];
  window?: {
    start?: string;
    end?: string;
  };
  targetTime?: string;
  deadlineTime?: string;
  routeId?: string;
  listIds?: string[];
  themeId?: string;
  tasks?: RoutineTask[];
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
  const [routines, display] = await Promise.all([
    readJson<Routine[]>("config/routines.json"),
    readJson<DisplayConfig>("config/display.json"),
  ]);

  return { routines, display };
}

export function formatRoutineWindow(routine: Routine) {
  const start = routine.window?.start;
  const end = routine.window?.end;

  if (start && end) {
    return `${start} to ${end}`;
  }

  if (routine.targetTime) {
    return `Target ${routine.targetTime}`;
  }

  return "Flexible";
}
