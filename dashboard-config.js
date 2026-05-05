
// ═══════════════════════════════════════════════════════════════════
// DASHBOARD CONFIG — edit this file, not the dashboard HTML
// ═══════════════════════════════════════════════════════════════════
 
const DASHBOARD_CONFIG = {
 
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
 
  // ── API KEYS ──────────────────────────────────────────────────────
  // Google Calendar: console.cloud.google.com → Calendar API → API Key
  // Restrict key to Calendar API + your GitHub Pages domain
  api: {
    googleCalendarKey: "",
    googleCalendarIds: [],
    // googleMapsKey: "",  // optional — for real-time traffic
  },
 
  // ── DISPLAY MODES & SCHEDULE ──────────────────────────────────────
  // The dashboard auto-switches mode based on time of day + day of week
  modes: {
    // MORNING: active window
    morning: {
      startHour: 6,    // 6:00 AM
      startMin:  0,
      endHour:   8,    // 8:00 AM (after kids leave)
      endMin:    30,
    },
    // EVENING: active window
    evening: {
      startHour: 17,   // 5:00 PM
      startMin:  0,
      endHour:   21,   // 9:00 PM
      endMin:    0,
    },
    // Outside these windows → blank/art mode
  },
 
  // ── SCHOOL DAYS ───────────────────────────────────────────────────
  // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  schoolDays: [1, 2, 3, 4, 5],
 
  // ── SCENARIOS: morning variants by day ───────────────────────────
  // Each school day can have a different departure time + note
  scenarios: {
    default: {
      leaveHour:    6,
      leaveMin:     45,
      schoolHour:   7,
      schoolMin:    20,
      lateBellHour: 7,
      lateBellMin:  25,
      driveMinEst:  22,
      carBufferMin: 5,
      note:         "",
    },
    // Override specific days as needed:
    // wednesday: {
    //   leaveHour: 8,
    //   leaveMin:  15,
    //   schoolHour: 9,
    //   schoolMin:  0,
    //   lateBellHour: 9,
    //   lateBellMin: 10,
    //   driveMinEst: 22,
    //   carBufferMin: 5,
    //   note: "Late start Wednesdays",
    // },
    // friday: {
    //   leaveHour: 6,
    //   leaveMin:  45,
    //   schoolHour: 7,
    //   schoolMin:  20,
    //   lateBellHour: 7,
    //   lateBellMin:  25,
    //   driveMinEst:  22,
    //   carBufferMin: 5,
    //   note: "Spirit day 🎉",
    // },
  },
 
  // ── MORNING CHECKLIST (reminders shown on screen) ─────────────────
  // These appear in morning mode as a live checklist.
  // completedByMin: auto-marks done this many minutes before departure
  morningChecklist: [
    { id: "breakfast",  label: "Breakfast",        targetMin: -40, icon: "🥣" },
    { id: "dressed",    label: "Get dressed",       targetMin: -30, icon: "👕" },
    { id: "backpack",   label: "Backpacks ready",   targetMin: -20, icon: "🎒" },
    { id: "teeth",      label: "Brush teeth",       targetMin: -15, icon: "🪥" },
    { id: "shoes",      label: "Shoes on",          targetMin: -5,  icon: "👟" },
    { id: "car",        label: "Get in the car",    targetMin:  0,  icon: "🚗" },
  ],
 
  // ── EVENING TIMELINE ──────────────────────────────────────────────
  // startHour/startMin = when this block should begin
  // durationMin        = how long the block lasts
  // icon, label, note  = display text
  eveningTimeline: [
    {
      id:          "home",
      label:       "Home & decompress",
      icon:        "🏠",
      startHour:   17, startMin: 30,
      durationMin: 30,
      note:        "Snack, unwind",
    },
    {
      id:          "homework",
      label:       "Homework",
      icon:        "📚",
      startHour:   18, startMin: 0,
      durationMin: 30,
      note:        "Both kids",
    },
    {
      id:          "dinner",
      label:       "Dinner",
      icon:        "🍽",
      startHour:   18, startMin: 30,
      durationMin: 30,
      note:        "Together",
    },
    {
      id:          "baths",
      label:       "Baths",
      icon:        "🛁",
      startHour:   19, startMin: 15,
      durationMin: 30,
      note:        "",
    },
    {
      id:          "reading",
      label:       "Reading",
      icon:        "📖",
      startHour:   19, startMin: 45,
      durationMin: 30,
      note:        "30 min each",
    },
    {
      id:          "winddown",
      label:       "Wind down",
      icon:        "🌙",
      startHour:   20, startMin: 15,
      durationMin: 15,
      note:        "No screens",
    },
    {
      id:          "bed",
      label:       "Lights out",
      icon:        "💤",
      startHour:   20, startMin: 30,
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
};
 
// Export for dashboard use
if (typeof module !== "undefined") module.exports = DASHBOARD_CONFIG;
 
