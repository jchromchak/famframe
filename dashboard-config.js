
// ═══════════════════════════════════════════════════════════════════
// DASHBOARD CONFIG — edit this file, not the dashboard HTML
// ═══════════════════════════════════════════════════════════════════
 
var DASHBOARD_CONFIG = {
 
  // ── TIME ──────────────────────────────────────────────────────────
  // All schedule times below are local wall-clock times in this IANA time zone.
  // Use "HH:MM" in 24-hour time, e.g. "06:00", "17:30", "20:15".
  time: {
    timeZone: "America/New_York",
    locale:   "en-US",
    hour12:   true,

    morningProgressWindowMin: 75,
    countdownClockAtMin: 4,

    morningMessageThresholds: {
      critMin: 5,
      hotMin:  10,
      warnMin: 20,
    },

    departureUrgency: {
      critMin: 10,
      warnMin: 20,
    },

    checklistTiming: {
      activeBeforeMin: 8,
      doneAfterMin:    2,
    },
  },

  // ── FAMILY ────────────────────────────────────────────────────────
  family: {
    kids: [
      { name: "Kid 1", age: null },   // fill in names + ages
      { name: "Kid 2", age: null },
    ],
    location: {
      city:    "Mount Pleasant, SC",
      lat:     32.83,
      lon:    -79.83,
      school:  "US-17 N to School",
    },
  },
 
  // ── SAFE DISPLAY DATA ONLY ────────────────────────────────────────
  // Do not commit API keys, tokens, PATs, or write credentials here.
  // The admin app may store credentials locally and write safe derived data.
 
  // ── DISPLAY MODES & SCHEDULE ──────────────────────────────────────
  // The dashboard auto-switches mode based on local time in time.timeZone.
  modes: {
    morning: { start: "06:00", end: "15:30" },
    evening: { start: "17:00", end: "21:00" },
    // Outside these windows → blank/art mode
  },
 
  // ── SCHOOL DAYS ───────────────────────────────────────────────────
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  schoolDays: [1, 2, 3, 4, 5],
 
  // ── SCENARIOS: morning variants by day ───────────────────────────
  // Each school day can have a different departure time + note
  scenarios: {
    default: {
      leave:       "15:45",
      school:      "16:20",
      lateBell:    "16:25",
      driveMinEst:  22,
      carBufferMin: 5,
      note:         "",
    },
    // Override specific days as needed:
    // wednesday: {
    //   leave:       "08:15",
    //   school:      "09:00",
    //   lateBell:    "09:10",
    //   driveMinEst: 22,
    //   carBufferMin: 5,
    //   note: "Late start Wednesdays",
    // },
    // friday: {
    //   leave:       "06:45",
    //   school:      "07:20",
    //   lateBell:    "07:25",
    //   driveMinEst:  22,
    //   carBufferMin: 5,
    //   note: "Spirit day 🎉",
    // },
  },
 
  // ── MORNING CHECKLIST (reminders shown on screen) ─────────────────
  // These appear in morning mode as a live checklist.
  // targetMin is relative to leave time. Example: -15 means 15 min before leave.
  morningChecklist: [
    { id: "breakfast",  label: "Breakfast",        targetMin: -40, icon: "🥣" },
    { id: "dressed",    label: "Get dressed",       targetMin: -30, icon: "👕" },
    { id: "backpack",   label: "Backpacks ready",   targetMin: -20, icon: "🎒" },
    { id: "teeth",      label: "Brush teeth",       targetMin: -15, icon: "🪥" },
    { id: "shoes",      label: "Shoes on",          targetMin: -5,  icon: "👟" },
    { id: "car",        label: "Get in the car",    targetMin:  0,  icon: "🚗" },
  ],
 
  // ── EVENING TIMELINE ──────────────────────────────────────────────
  // start = when this block should begin, local wall-clock time in time.timeZone
  // durationMin        = how long the block lasts
  // icon, label, note  = display text
  eveningTimeline: [
    {
      id:          "home",
      label:       "Home & decompress",
      icon:        "🏠",
      start:       "17:30",
      durationMin: 30,
      note:        "Snack, unwind",
    },
    {
      id:          "homework",
      label:       "Homework",
      icon:        "📚",
      start:       "18:00",
      durationMin: 30,
      note:        "Both kids",
    },
    {
      id:          "dinner",
      label:       "Dinner",
      icon:        "🍽",
      start:       "18:30",
      durationMin: 30,
      note:        "Together",
    },
    {
      id:          "baths",
      label:       "Baths",
      icon:        "🛁",
      start:       "19:15",
      durationMin: 30,
      note:        "",
    },
    {
      id:          "reading",
      label:       "Reading",
      icon:        "📖",
      start:       "19:45",
      durationMin: 30,
      note:        "30 min each",
    },
    {
      id:          "winddown",
      label:       "Wind down",
      icon:        "🌙",
      start:       "20:15",
      durationMin: 15,
      note:        "No screens",
    },
    {
      id:          "bed",
      label:       "Lights out",
      icon:        "💤",
      start:       "20:30",
      durationMin: 0,
      note:        "8:30 PM",
    },
  ],
 
  // ── MESSAGES by urgency state ─────────────────────────────────────
  messages: {
    morning: {
      calm:   ["Morning is easy.", "Plenty of time.", "Take your time."],
      warn:   ["Start getting ready.", "Time to move.", "Get going soon."],
      hot:    ["Shoes on, please.", "Almost time.", "Wrap it up."],
      crit:   ["Move it!", "Let's go!", "Out the door!"],
      gone:   ["Have a great day. ☀︎", "Go get 'em.", "See you this afternoon."],
    },
    evening: {
      onTrack: ["On track. Nice work.", "Looking good.", "Good rhythm tonight."],
      behind:  ["Running a little behind.", "Pick up the pace.", "Stay on schedule."],
      late:    ["Behind schedule.", "Let's catch up.", "Time to hustle."],
      done:    ["Great job tonight. Rest up.", "All done. Sleep well.", "See you in the morning. 💤"],
    },
  },
 
  // ── WEEKEND / NO-SCHOOL MODE ──────────────────────────────────────
  // When it's not a school day, morning mode shows this instead
  weekend: {
    enabled:  true,
    message:  "No school today.",
    subtext:  "Enjoy the morning.",
    showWeather: true,
  },

  // ── COMMUTE ESTIMATES ─────────────────────────────────────────────
  // Derived route data is safe for the TV. It may be written by the admin app.
  // Fallback estimates are used when derived data is stale or missing.
  // stopCount is intermediate stops before the final destination. Use 0 to hide.
  commute: {
    activeRouteId: "school-morning",
    routes: {
      "school-morning": {
        provider: "",
        routeLabel: "US-17 N to School",
        stopCount: 0,
        durationMinutes: null,
        trafficStatus: "",
        updatedAt: "",
        expiresAt: "",
      },
    },
    defaultDriveMin: 12,
    driveEstimates: [
      { start: "06:00", end: "07:00", driveMin: 14 },
      { start: "07:00", end: "07:30", driveMin: 20 },
      { start: "07:30", end: "08:30", driveMin: 26 },
      { start: "08:30", end: "09:00", driveMin: 18 },
    ],
  },
};
 
// Export for dashboard use
if (typeof module !== "undefined") module.exports = DASHBOARD_CONFIG;
 
