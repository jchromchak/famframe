// ═══════════════════════════════════════════════════════════════════
// DASHBOARD CONFIG — safe display data only; no secrets
// Last updated: 2026-05-06T15:24:16.173Z
// ═══════════════════════════════════════════════════════════════════

var DASHBOARD_CONFIG = {
  "time": {
    "timeZone": "America/New_York",
    "locale": "en-US",
    "hour12": true,
    "morningProgressWindowMin": 75,
    "countdownClockAtMin": 4,
    "morningMessageThresholds": {
      "critMin": 5,
      "hotMin": 10,
      "warnMin": 20
    },
    "departureUrgency": {
      "critMin": 10,
      "warnMin": 20
    },
    "checklistTiming": {
      "activeBeforeMin": 8,
      "doneAfterMin": 2
    }
  },
  "family": {
    "kids": [
      {
        "name": "Kid 1",
        "age": null
      },
      {
        "name": "Kid 2",
        "age": null
      }
    ],
    "location": {
      "city": "Mount Pleasant, SC",
      "lat": 32.83,
      "lon": -79.83,
      "school": "US-17 N to School",
      "schoolRoute": "US-17 N to School"
    }
  },
  "api": {},
  "modules": {
    "quote": {
      "source": "stoic"
    }
  },
  "modes": {
    "morning": {
      "start": "06:00",
      "end": "13:00"
    },
    "evening": {
      "start": "17:00",
      "end": "22:00"
    }
  },
  "schoolDays": [
    1,
    2,
    3,
    4,
    5
  ],
  "routines": [
    {
      "id": "school-morning",
      "label": "School morning",
      "type": "departure",
      "enabled": true,
      "days": [
        1,
        2,
        3,
        4,
        5
      ],
      "window": {
        "start": "06:00",
        "end": "13:00"
      },
      "primaryTime": "06:45",
      "targetTime": "07:20",
      "deadline": "07:25",
      "routeId": "school-morning",
      "display": {
        "scene": "departure",
        "priority": 80
      },
      "segments": [
        {
          "id": "school-run",
          "label": "Leave for school",
          "routeLabel": "US-17 N to School",
          "destinationLabel": "School",
          "stopCount": 0,
          "bufferMin": 5,
          "fallbackDriveMin": 28
        }
      ],
      "listItems": [
        {
          "id": "breakfast",
          "label": "Breakfast",
          "targetMin": -40,
          "icon": "breakfast"
        },
        {
          "id": "dressed",
          "label": "Get dressed",
          "targetMin": -30,
          "icon": "dressed"
        },
        {
          "id": "backpack",
          "label": "Backpacks ready",
          "targetMin": -20,
          "icon": "backpack"
        },
        {
          "id": "teeth",
          "label": "Brush teeth",
          "targetMin": -15,
          "icon": "teeth"
        },
        {
          "id": "shoes",
          "label": "Shoes on",
          "targetMin": -5,
          "icon": "shoes"
        },
        {
          "id": "car",
          "label": "Get in the car",
          "targetMin": 0,
          "icon": "car"
        }
      ]
    },
    {
      "id": "school-pickup",
      "label": "School pickup",
      "type": "departure",
      "enabled": true,
      "days": [
        1,
        2,
        3,
        4,
        5
      ],
      "window": {
        "start": "14:15",
        "end": "15:15"
      },
      "primaryTime": "14:35",
      "targetTime": "14:45",
      "deadline": "14:50",
      "routeId": "school-pickup",
      "display": {
        "scene": "departure",
        "priority": 70
      },
      "segments": [
        {
          "id": "pickup-run",
          "label": "Leave for pickup",
          "routeLabel": "Home to pickup",
          "destinationLabel": "Pickup",
          "stopCount": 1,
          "bufferMin": 5,
          "fallbackDriveMin": 18
        }
      ],
      "listItems": [
        {
          "id": "keys",
          "label": "Keys and wallet",
          "targetMin": -10,
          "icon": "backpack"
        },
        {
          "id": "water",
          "label": "Water bottles",
          "targetMin": -8,
          "icon": "breakfast"
        },
        {
          "id": "car",
          "label": "Get in the car",
          "targetMin": 0,
          "icon": "car"
        }
      ]
    }
  ],
  "scenarios": {
    "default": {
      "leave": "06:45",
      "school": "07:20",
      "lateBell": "07:25",
      "driveMinEst": 28,
      "carBufferMin": 5,
      "note": ""
    }
  },
  "morningChecklist": [
    {
      "id": "breakfast",
      "label": "Breakfast",
      "targetMin": -40,
      "icon": "🥣"
    },
    {
      "id": "dressed",
      "label": "Get dressed",
      "targetMin": -30,
      "icon": "👕"
    },
    {
      "id": "backpack",
      "label": "Backpacks ready",
      "targetMin": -20,
      "icon": "🎒"
    },
    {
      "id": "teeth",
      "label": "Brush teeth",
      "targetMin": -15,
      "icon": "🪥"
    },
    {
      "id": "shoes",
      "label": "Shoes on",
      "targetMin": -5,
      "icon": "👟"
    },
    {
      "id": "car",
      "label": "Get in the car",
      "targetMin": 0,
      "icon": "🚗"
    }
  ],
  "eveningTimeline": [
    {
      "id": "home",
      "label": "Home & decompress",
      "icon": "🏠",
      "start": "17:30",
      "durationMin": 30,
      "note": "Snack, unwind"
    },
    {
      "id": "homework",
      "label": "Homework",
      "icon": "📚",
      "start": "18:00",
      "durationMin": 30,
      "note": "Both kids"
    },
    {
      "id": "dinner",
      "label": "Dinner",
      "icon": "🍽",
      "start": "18:30",
      "durationMin": 30,
      "note": "Together"
    },
    {
      "id": "baths",
      "label": "Baths",
      "icon": "🛁",
      "start": "19:15",
      "durationMin": 30,
      "note": ""
    },
    {
      "id": "reading",
      "label": "Reading",
      "icon": "📖",
      "start": "19:45",
      "durationMin": 30,
      "note": "30 min each"
    },
    {
      "id": "winddown",
      "label": "Wind down",
      "icon": "🌙",
      "start": "20:15",
      "durationMin": 15,
      "note": "No screens"
    },
    {
      "id": "bed",
      "label": "Lights out",
      "icon": "💤",
      "start": "20:30",
      "durationMin": 0,
      "note": "8:30 PM"
    }
  ],
  "messages": {
    "morning": {
      "calm": [
        "Morning is easy.",
        "Plenty of time.",
        "Take your time."
      ],
      "warn": [
        "Start getting ready.",
        "Time to move.",
        "Get going soon."
      ],
      "hot": [
        "Shoes on, please.",
        "Almost time.",
        "Wrap it up."
      ],
      "crit": [
        "Move it!",
        "Let's go!",
        "Out the door!"
      ],
      "gone": [
        "Have a great day. ☀︎",
        "Go get 'em.",
        "See you this afternoon."
      ]
    },
    "evening": {
      "onTrack": [
        "On track. Nice work.",
        "Looking good.",
        "Good rhythm tonight."
      ],
      "behind": [
        "Running a little behind.",
        "Pick up the pace.",
        "Stay on schedule."
      ],
      "late": [
        "Behind schedule.",
        "Let's catch up.",
        "Time to hustle."
      ],
      "done": [
        "Great job tonight. Rest up.",
        "All done. Sleep well.",
        "See you in the morning. 💤"
      ]
    }
  },
  "weekend": {
    "enabled": true,
    "message": "No school today.",
    "subtext": "Enjoy the morning.",
    "showWeather": true
  },
  "commute": {
    "activeRouteId": "school-morning",
    "routes": {
      "school-morning": {
        "provider": "google-maps",
        "routeLabel": "US-17 N to School",
        "stopCount": 0,
        "durationMinutes": 31,
        "trafficStatus": "light",
        "updatedAt": "2026-05-06T15:24:15.859Z",
        "expiresAt": "2026-05-06T15:39:15.859Z"
      },
      "school-pickup": {
        "provider": "",
        "routeLabel": "Home to pickup",
        "stopCount": 1,
        "durationMinutes": null,
        "trafficStatus": "",
        "updatedAt": "",
        "expiresAt": ""
      }
    },
    "defaultDriveMin": 12,
    "driveEstimates": [
      {
        "start": "06:00",
        "end": "07:00",
        "driveMin": 14
      },
      {
        "start": "07:00",
        "end": "07:30",
        "driveMin": 20
      },
      {
        "start": "07:30",
        "end": "08:30",
        "driveMin": 26
      },
      {
        "start": "08:30",
        "end": "09:00",
        "driveMin": 18
      }
    ]
  }
};

if (typeof module !== "undefined") module.exports = DASHBOARD_CONFIG;
