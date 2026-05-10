import type { Routine } from "./config";

export type CaptureAppend = {
  id: string;
  label: string;
  routineId: string | null;
  routineLabel: string;
  timing: string;
  confidence: "high" | "medium" | "low";
};

const timingPatterns: Array<[RegExp, string]> = [
  [/\btomorrow\b/i, "Tomorrow"],
  [/\btoday\b/i, "Today"],
  [/\btonight\b/i, "Tonight"],
  [/\bthis weekend\b/i, "This weekend"],
  [/\bnext week\b/i, "Next week"],
  [/\bmonday\b/i, "Monday"],
  [/\btuesday\b/i, "Tuesday"],
  [/\bwednesday\b/i, "Wednesday"],
  [/\bthursday\b/i, "Thursday"],
  [/\bfriday\b/i, "Friday"],
  [/\bsaturday\b/i, "Saturday"],
  [/\bsunday\b/i, "Sunday"],
];

const routineHints: Array<[RegExp, RegExp]> = [
  [/\bsoccer|cleats|shin guards|practice|field\b/i, /\bsoccer\b/i],
  [/\bswim|swimming|goggles|pool\b/i, /\bswim\b/i],
  [/\bpickup|pick up|early dismissal|dismissal\b/i, /\bpickup\b/i],
  [/\blibrary|books?|backpack|pack|lunch|school|late start|homework\b/i, /\bschool|morning\b/i],
  [/\bdinner|bath|bed|reading|lights out|tonight\b/i, /\bevening|wind\b/i],
];

const leadingNoise = /^(please\s+)?(remember\s+to\s+|need\s+to\s+|need\s+|bring\s+|pack\s+|grab\s+|don't\s+forget\s+|do\s+not\s+forget\s+)/i;

export function parseCaptureAppends(text: string, routines: Routine[]): CaptureAppend[] {
  const seen = new Set<string>();

  return splitCaptureText(text)
    .map((phrase) => toAppend(phrase, routines))
    .filter((append): append is CaptureAppend => {
      if (!append || seen.has(append.label.toLowerCase())) {
        return false;
      }

      seen.add(append.label.toLowerCase());
      return true;
    })
    .slice(0, 8);
}

function splitCaptureText(text: string) {
  return text
    .split(/[\n.;]+/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 3);
}

function toAppend(phrase: string, routines: Routine[]): CaptureAppend | null {
  const label = formatAppendLabel(phrase);

  if (!label) {
    return null;
  }

  const routineMatch = findRoutineForPhrase(phrase, routines);
  const timing = timingForPhrase(phrase);

  return {
    id: `${slugify(label)}-${slugify(timing)}`,
    label,
    routineId: routineMatch.routine?.id ?? null,
    routineLabel: routineMatch.routine?.label ?? "Needs routine",
    timing,
    confidence: routineMatch.confidence,
  };
}

function formatAppendLabel(phrase: string) {
  const cleaned = phrase
    .replace(leadingNoise, "")
    .replace(/\b(today|tomorrow|tonight|this weekend|next week)\b/gi, "")
    .replace(/\b(on )?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return "";
  }

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function timingForPhrase(phrase: string) {
  return timingPatterns.find(([pattern]) => pattern.test(phrase))?.[1] ?? "Next routine";
}

function findRoutineForPhrase(phrase: string, routines: Routine[]) {
  const enabledRoutines = routines.filter((routine) => routine.enabled !== false);
  const match = routineHints.find(([phrasePattern]) => phrasePattern.test(phrase));

  if (!match) {
    return { routine: enabledRoutines[0] ?? null, confidence: enabledRoutines[0] ? "low" : "low" } as const;
  }

  const [, routinePattern] = match;
  const routine = enabledRoutines.find((candidate) => routinePattern.test(candidate.label));

  if (routine) {
    return { routine, confidence: "high" } as const;
  }

  return { routine: enabledRoutines[0] ?? null, confidence: enabledRoutines[0] ? "medium" : "low" } as const;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
