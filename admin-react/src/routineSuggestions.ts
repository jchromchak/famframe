import type { Routine } from "./config";

export type RoutineSuggestion = {
  id: string;
  label: string;
  kind: "timeline" | "checklist";
  durationMinutes?: number;
  targetOffsetMinutes?: number;
  note?: string;
  tier: "primary" | "more";
};

const eveningSuggestions: RoutineSuggestion[] = [
  { id: "snack", label: "Snack", kind: "timeline", durationMinutes: 15, note: "Reset after school", tier: "primary" },
  { id: "homework", label: "Homework", kind: "timeline", durationMinutes: 30, note: "Both kids", tier: "primary" },
  { id: "dinner", label: "Dinner", kind: "timeline", durationMinutes: 30, note: "Together", tier: "primary" },
  { id: "baths", label: "Baths", kind: "timeline", durationMinutes: 30, tier: "primary" },
  { id: "reading", label: "Reading", kind: "timeline", durationMinutes: 30, note: "30 min each", tier: "primary" },
  { id: "lights-out", label: "Lights out", kind: "timeline", durationMinutes: 0, tier: "primary" },
  { id: "pack-bags", label: "Pack bags", kind: "timeline", durationMinutes: 10, tier: "more" },
  { id: "choose-clothes", label: "Choose clothes", kind: "timeline", durationMinutes: 10, tier: "more" },
  { id: "water-bottles", label: "Water bottles", kind: "timeline", durationMinutes: 5, tier: "more" },
  { id: "coffee", label: "Drink coffee", kind: "timeline", durationMinutes: 10, note: "For the grownups", tier: "more" },
];

const morningSuggestions: RoutineSuggestion[] = [
  { id: "breakfast", label: "Breakfast", kind: "checklist", targetOffsetMinutes: -40, tier: "primary" },
  { id: "dressed", label: "Get dressed", kind: "checklist", targetOffsetMinutes: -30, tier: "primary" },
  { id: "backpack", label: "Backpack", kind: "checklist", targetOffsetMinutes: -20, tier: "primary" },
  { id: "teeth", label: "Brush teeth", kind: "checklist", targetOffsetMinutes: -15, tier: "primary" },
  { id: "shoes", label: "Shoes", kind: "checklist", targetOffsetMinutes: -5, tier: "primary" },
  { id: "car", label: "Get in the car", kind: "checklist", targetOffsetMinutes: 0, tier: "primary" },
  { id: "lunch", label: "Pack lunch", kind: "checklist", targetOffsetMinutes: -35, tier: "more" },
  { id: "library-books", label: "Library books", kind: "checklist", targetOffsetMinutes: -25, tier: "more" },
  { id: "water-bottle", label: "Water bottle", kind: "checklist", targetOffsetMinutes: -10, tier: "more" },
  { id: "coffee", label: "Drink coffee", kind: "checklist", targetOffsetMinutes: -45, tier: "more" },
];

const departureSuggestions: RoutineSuggestion[] = [
  { id: "keys", label: "Keys and wallet", kind: "checklist", targetOffsetMinutes: -10, tier: "primary" },
  { id: "water", label: "Water bottles", kind: "checklist", targetOffsetMinutes: -8, tier: "primary" },
  { id: "bathroom", label: "Bathroom stop", kind: "checklist", targetOffsetMinutes: -7, tier: "primary" },
  { id: "shoes", label: "Shoes", kind: "checklist", targetOffsetMinutes: -5, tier: "primary" },
  { id: "car", label: "Get in the car", kind: "checklist", targetOffsetMinutes: 0, tier: "primary" },
  { id: "snack", label: "Pack snack", kind: "checklist", targetOffsetMinutes: -12, tier: "more" },
  { id: "sunscreen", label: "Sunscreen", kind: "checklist", targetOffsetMinutes: -15, tier: "more" },
  { id: "jacket", label: "Grab jacket", kind: "checklist", targetOffsetMinutes: -10, tier: "more" },
];

export function suggestionsForRoutine(routine: Routine, existingLabels: string[]) {
  const label = routine.label.toLowerCase();
  const scene = routine.display?.scene ?? routine.type ?? "";
  const existing = new Set(existingLabels.map(normalizeLabel));
  const pool = suggestionPool(label, scene);

  return pool.filter((suggestion) => !existing.has(normalizeLabel(suggestion.label)));
}

function suggestionPool(label: string, scene: string) {
  if (scene === "evening" || scene === "timeline" || /evening|bed|wind|night|homework|dinner/.test(label)) {
    return eveningSuggestions;
  }

  if (/morning|school|breakfast/.test(label)) {
    return morningSuggestions;
  }

  return departureSuggestions;
}

function normalizeLabel(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
}
