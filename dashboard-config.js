// ═══════════════════════════════════════════════════════════════════
// DASHBOARD CONFIG — safe display data only; no secrets
// Last updated: 2026-05-07T15:20:57.742Z
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
      "lat": 32.9022832,
      "lon": -79.78906090000001,
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
      "id": "school_morning",
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
      "routeId": "school_morning",
      "display": {
        "scene": "departure",
        "priority": 80
      },
      "segments": [
        {
          "id": "school_run",
          "label": "Leave for school",
          "routeLabel": "US-17 N to School",
          "destinationLabel": "School",
          "stops": [],
          "stopCount": 0,
          "bufferMin": 5,
          "fallbackDriveMin": 28
        }
      ],
      "listItems": [
        {
          "id": "breakfast",
          "label": "Breakfast",
          "icon": "🥣",
          "targetMin": -40,
          "assignee": ""
        },
        {
          "id": "dressed",
          "label": "Get dressed",
          "icon": "👕",
          "targetMin": -30,
          "assignee": ""
        },
        {
          "id": "backpack",
          "label": "Backpacks ready",
          "icon": "🎒",
          "targetMin": -20,
          "assignee": ""
        },
        {
          "id": "teeth",
          "label": "Brush teeth",
          "icon": "🪥",
          "targetMin": -15,
          "assignee": ""
        },
        {
          "id": "shoes",
          "label": "Shoes on",
          "icon": "👟",
          "targetMin": -5,
          "assignee": ""
        },
        {
          "id": "car",
          "label": "Get in the car",
          "icon": "🚗",
          "targetMin": 0,
          "assignee": ""
        }
      ]
    },
    {
      "id": "evening",
      "label": "Evening wind-down",
      "type": "timeline",
      "enabled": true,
      "days": [
        0,
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "window": {
        "start": "17:00",
        "end": "22:00"
      },
      "display": {
        "scene": "evening",
        "priority": 40
      },
      "timelineItems": [
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
      ]
    },
    {
      "id": "school_pickup_1778097357000",
      "label": "Pickup",
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
        "end": "17:15"
      },
      "primaryTime": "15:35",
      "targetTime": "16:15",
      "deadline": "16:30",
      "routeId": "pickup_1778097357000",
      "display": {
        "scene": "departure",
        "priority": 60
      },
      "segments": [
        {
          "id": "pickup_run",
          "label": "Leave for pickup",
          "routeLabel": "Home to pickup",
          "destinationLabel": "Pickup",
          "stops": [],
          "stopCount": 0,
          "bufferMin": 5,
          "fallbackDriveMin": 18
        }
      ],
      "listItems": [
        {
          "id": "keys",
          "label": "Keys and wallet",
          "icon": "backpack",
          "targetMin": -10,
          "assignee": ""
        },
        {
          "id": "water",
          "label": "Water bottles",
          "icon": "breakfast",
          "targetMin": -8,
          "assignee": ""
        },
        {
          "id": "car",
          "label": "Get in the car",
          "icon": "car",
          "targetMin": 0,
          "assignee": ""
        }
      ]
    },
    {
      "id": "school_pickup_1778124119125",
      "label": "Swimming",
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
      "routeId": "pickup_1778124119125",
      "display": {
        "scene": "departure",
        "priority": 60
      },
      "segments": [
        {
          "id": "pickup_run",
          "label": "Leave for pickup",
          "routeLabel": "Home to pickup",
          "destinationLabel": "Pickup",
          "stops": [
            {
              "id": "pickup_stop",
              "label": "Pickup stop",
              "bufferMin": 5
            }
          ],
          "stopCount": 1,
          "bufferMin": 5,
          "fallbackDriveMin": 18
        }
      ],
      "listItems": [
        {
          "id": "keys",
          "label": "Keys and wallet",
          "icon": "backpack",
          "targetMin": -10,
          "assignee": ""
        },
        {
          "id": "water",
          "label": "Water bottles",
          "icon": "breakfast",
          "targetMin": -8,
          "assignee": ""
        },
        {
          "id": "car",
          "label": "Get in the car",
          "icon": "car",
          "targetMin": 0,
          "assignee": ""
        }
      ]
    },
    {
      "id": "school_pickup_1778166294260",
      "label": "Mothers Day Tea",
      "type": "departure",
      "enabled": true,
      "days": [
        4
      ],
      "window": {
        "start": "11:15",
        "end": "15:15"
      },
      "primaryTime": "14:35",
      "targetTime": "14:45",
      "deadline": "14:50",
      "routeId": "pickup_1778166294260",
      "display": {
        "scene": "departure",
        "priority": 60
      },
      "segments": [
        {
          "id": "pickup_run",
          "label": "Leave for pickup",
          "routeLabel": "Home to pickup",
          "destinationLabel": "Pickup",
          "stops": [
            {
              "id": "pickup_stop",
              "label": "Pickup stop",
              "bufferMin": 5
            }
          ],
          "stopCount": 1,
          "bufferMin": 5,
          "fallbackDriveMin": 18
        }
      ],
      "listItems": [
        {
          "id": "keys",
          "label": "Keys and wallet",
          "icon": "backpack",
          "targetMin": -10,
          "assignee": ""
        },
        {
          "id": "car",
          "label": "Get in the car",
          "icon": "car",
          "targetMin": 0,
          "assignee": ""
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
      "icon": "🥣",
      "targetMin": -40,
      "assignee": ""
    },
    {
      "id": "dressed",
      "label": "Get dressed",
      "icon": "👕",
      "targetMin": -30,
      "assignee": ""
    },
    {
      "id": "backpack",
      "label": "Backpacks ready",
      "icon": "🎒",
      "targetMin": -20,
      "assignee": ""
    },
    {
      "id": "teeth",
      "label": "Brush teeth",
      "icon": "🪥",
      "targetMin": -15,
      "assignee": ""
    },
    {
      "id": "shoes",
      "label": "Shoes on",
      "icon": "👟",
      "targetMin": -5,
      "assignee": ""
    },
    {
      "id": "car",
      "label": "Get in the car",
      "icon": "🚗",
      "targetMin": 0,
      "assignee": ""
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
        "updatedAt": "2026-05-07T15:20:57.485Z",
        "expiresAt": "2026-05-07T15:35:57.485Z",
        "stops": [],
        "bufferMinutes": 0
      },
      "school_morning": {
        "provider": "google-maps",
        "durationMinutes": 26,
        "trafficStatus": "light",
        "updatedAt": "2026-05-07T10:28:43.951Z",
        "expiresAt": "2026-05-07T10:43:43.951Z",
        "routeLabel": "US-17 N to School",
        "stopCount": 0,
        "stops": [],
        "bufferMinutes": 0
      },
      "pickup_1778097357000": {
        "provider": "google-maps",
        "durationMinutes": 28,
        "trafficStatus": "moderate",
        "updatedAt": "2026-05-06T19:57:40.329Z",
        "expiresAt": "2026-05-06T20:12:40.329Z",
        "routeLabel": "Home to pickup",
        "stopCount": 0,
        "stops": []
      },
      "pickup_1778124119125": {
        "provider": "",
        "durationMinutes": null,
        "trafficStatus": "",
        "updatedAt": "",
        "expiresAt": "",
        "routeLabel": "Home to pickup",
        "stopCount": 1,
        "stops": [
          {
            "id": "pickup_stop",
            "label": "Pickup stop",
            "bufferMin": 5
          }
        ]
      },
      "pickup_1778166294260": {
        "provider": "",
        "durationMinutes": null,
        "trafficStatus": "",
        "updatedAt": "",
        "expiresAt": "",
        "routeLabel": "Home to pickup",
        "stopCount": 1,
        "stops": [
          {
            "id": "pickup_stop",
            "label": "Pickup stop",
            "bufferMin": 5
          }
        ]
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
