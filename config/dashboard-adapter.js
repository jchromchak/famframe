/*
 * JSON-to-dashboard compatibility adapter.
 *
 * This is a pure boundary layer: it maps safe JSON config/content files into
 * the normalized dashboard runtime shape.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.FamFrameDashboardAdapter = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var DEFAULT_MESSAGES = {
    morning: {
      calm: [],
      warn: [],
      hot: [],
      crit: [],
      gone: [],
    },
    evening: {
      onTrack: ['On track. Nice work.', 'Looking good.', 'Good rhythm tonight.'],
      behind: ['Running a little behind.', 'Pick up the pace.', 'Stay on schedule.'],
      late: ['Behind schedule.', "Let's catch up.", 'Time to hustle.'],
      done: ['Great job tonight. Rest up.', 'All done. Sleep well.', 'See you in the morning.'],
    },
  };

  var DEFAULT_TIME = {
    timeZone: 'America/New_York',
    locale: 'en-US',
    hour12: true,
    morningProgressWindowMin: 75,
    countdownClockAtMin: 4,
    morningMessageThresholds: { critMin: 5, hotMin: 10, warnMin: 20 },
    departureUrgency: { critMin: 10, warnMin: 20 },
    checklistTiming: { activeBeforeMin: 8, doneAfterMin: 2 },
  };

  var DEFAULT_DRIVE_ESTIMATES = [
    { start: '06:00', end: '07:00', driveMin: 14 },
    { start: '07:00', end: '07:30', driveMin: 20 },
    { start: '07:30', end: '08:30', driveMin: 26 },
    { start: '08:30', end: '09:00', driveMin: 18 },
  ];

  var ICONS = {
    backpack: 'backpack',
    bag: 'backpack',
    breakfast: 'breakfast',
    car: 'car',
    dressed: 'dressed',
    shoes: 'shoes',
    teeth: 'teeth',
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function arr(value) {
    return Array.isArray(value) ? value : [];
  }

  function cleanId(value, fallback) {
    var raw = String(value || fallback || 'item').trim().toLowerCase();
    return raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || fallback || 'item';
  }

  function routeKey(routeId) {
    return cleanId(String(routeId || '').replace(/^route-/, ''), 'route');
  }

  function routineKey(routineId, fallback) {
    return cleanId(String(routineId || '').replace(/^routine-/, ''), fallback || 'routine');
  }

  function time(value, fallback) {
    return /^\d{2}:\d{2}$/.test(String(value || '')) ? value : fallback;
  }

  function timeToMinutes(value) {
    var match = String(value || '').match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2]);
  }

  function minutesToTime(value) {
    var day = 24 * 60;
    var total = ((Math.round(Number(value || 0)) % day) + day) % day;
    var hour = Math.floor(total / 60);
    var minute = total % 60;
    return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
  }

  function shouldDeriveWindow(routine) {
    var win = routine && routine.window ? routine.window : null;
    return !win || win.mode === 'auto' || win.derived === true || (!win.start && !win.end);
  }

  function explicitWindow(routine, fallbackStart, fallbackEnd) {
    var win = routine && routine.window ? routine.window : {};
    return {
      start: time(win.start, fallbackStart),
      end: time(win.end, fallbackEnd),
    };
  }

  function departureWindow(routine) {
    if (!shouldDeriveWindow(routine)) return explicitWindow(routine, '06:00', '07:00');
    var timing = routine && routine.timing ? routine.timing : {};
    var leave = timeToMinutes(timing.leaveAt) == null ? timeToMinutes('07:00') : timeToMinutes(timing.leaveAt);
    var finish = timeToMinutes(timing.deadline) == null
      ? (timeToMinutes(timing.arriveBy) == null ? leave : timeToMinutes(timing.arriveBy))
      : timeToMinutes(timing.deadline);
    return {
      start: minutesToTime(leave - Number((routine.display && routine.display.startBeforeMinutes) || 30)),
      end: minutesToTime(finish + Number((routine.display && routine.display.endAfterMinutes) || 30)),
    };
  }

  function timelineWindow(routine) {
    if (!shouldDeriveWindow(routine)) return explicitWindow(routine, '17:00', '21:00');
    var starts = arr(routine && routine.timeline).map(function (item) { return timeToMinutes(item.start); }).filter(function (value) { return value != null; });
    if (!starts.length) return { start: '17:00', end: '21:00' };
    var first = Math.min.apply(null, starts);
    var last = arr(routine.timeline).reduce(function (max, item) {
      var start = timeToMinutes(item.start);
      if (start == null) return max;
      return Math.max(max, start + Math.max(0, Number(item.durationMinutes || item.durationMin || 0)));
    }, first);
    return {
      start: minutesToTime(first - Number((routine.display && routine.display.startBeforeMinutes) || 30)),
      end: minutesToTime(last + Number((routine.display && routine.display.endAfterMinutes) || 30)),
    };
  }

  function firstDeparture(routines) {
    return arr(routines).find(function (routine) {
      return routine && routine.type === 'departure' && routine.enabled !== false;
    }) || null;
  }

  function firstTimeline(routines) {
    return arr(routines).find(function (routine) {
      return routine && (routine.type === 'timeline' || (routine.display && routine.display.scene === 'evening')) && routine.enabled !== false;
    }) || null;
  }

  function routeById(routesConfig) {
    var out = {};
    arr(routesConfig && routesConfig.routes).forEach(function (route) {
      if (route && route.id) out[route.id] = route;
    });
    return out;
  }

  function listById(routinesConfig) {
    var out = {};
    arr(routinesConfig && routinesConfig.lists).forEach(function (list) {
      if (list && list.id) out[list.id] = list;
    });
    return out;
  }

  function mapListItems(list) {
    return arr(list && list.items).map(function (item, index) {
      return {
        id: cleanId(item.id || item.label, 'item-' + index),
        label: item.label || 'List item',
        icon: ICONS[item.icon] || item.icon || '',
        targetMin: Number(item.targetOffsetMinutes == null ? item.targetMin || 0 : item.targetOffsetMinutes),
        assignee: item.assignee || '',
      };
    });
  }

  function mapStops(route) {
    return arr(route && route.stops).map(function (stop, index) {
      return {
        id: cleanId(stop.id || stop.label, 'stop-' + (index + 1)),
        label: stop.label || 'Stop ' + (index + 1),
        bufferMin: Math.max(0, Math.floor(Number(stop.bufferMinutes == null ? stop.bufferMin || 0 : stop.bufferMinutes))),
      };
    });
  }

  function routeDestinationLabel(route) {
    return (route && route.destination && route.destination.label) || 'Destination';
  }

  function routeFallbackDriveMin(route) {
    return Math.max(0, Math.floor(Number(route && (route.fallbackDriveMinutes == null ? route.fallbackDriveMin || 0 : route.fallbackDriveMinutes))));
  }

  function routeBufferMinutes(route, stops) {
    if (route && route.bufferMinutes != null) return Math.max(0, Math.floor(Number(route.bufferMinutes || 0)));
    return arr(stops).reduce(function (sum, stop) { return sum + Number(stop.bufferMin || 0); }, 0);
  }

  function mapDepartureRoutine(routine, route, list) {
    var stops = mapStops(route);
    var key = routeKey(routine.routeId || routine.id);
    return {
      id: routineKey(routine.id, key),
      label: routine.label || 'Departure',
      type: 'departure',
      enabled: routine.enabled !== false,
      days: arr(routine.appliesTo && routine.appliesTo.days).map(Number),
      dates: arr(routine.appliesTo && routine.appliesTo.dates).map(String),
      window: departureWindow(routine),
      primaryTime: time(routine.timing && routine.timing.leaveAt, '07:00'),
      targetTime: time(routine.timing && routine.timing.arriveBy, '07:30'),
      deadline: time(routine.timing && routine.timing.deadline, time(routine.timing && routine.timing.arriveBy, '07:30')),
      routeId: key,
      display: {
        scene: (routine.display && routine.display.scene) || 'departure',
        priority: Number(routine.display && routine.display.priority == null ? 50 : routine.display.priority),
        themeId: (routine.display && routine.display.themeId) || '',
      },
      segments: [{
        id: cleanId(key + '-run', 'route-run'),
        label: 'Leave for ' + routeDestinationLabel(route).toLowerCase(),
        routeLabel: (route && route.label) || routine.label || 'Route',
        destinationLabel: routeDestinationLabel(route),
        stops: stops,
        stopCount: stops.length,
        bufferMin: routeBufferMinutes(route, stops),
        fallbackDriveMin: routeFallbackDriveMin(route),
      }],
      listItems: mapListItems(list),
    };
  }

  function mapTimelineRoutine(routine) {
    return {
      id: routineKey(routine.id, 'evening'),
      label: routine.label || 'Evening',
      type: 'timeline',
      enabled: routine.enabled !== false,
      days: arr(routine.appliesTo && routine.appliesTo.days).map(Number),
      dates: arr(routine.appliesTo && routine.appliesTo.dates).map(String),
      window: timelineWindow(routine),
      display: {
        scene: (routine.display && routine.display.scene) || 'evening',
        priority: Number(routine.display && routine.display.priority == null ? 40 : routine.display.priority),
        themeId: (routine.display && routine.display.themeId) || '',
      },
      timelineItems: arr(routine.timeline).map(function (item, index) {
        return {
          id: cleanId(item.id || item.label, 'timeline-' + index),
          label: item.label || 'Timeline item',
          icon: item.icon || '',
          start: time(item.start, '17:00'),
          durationMin: Math.max(0, Math.floor(Number(item.durationMinutes == null ? item.durationMin || 0 : item.durationMinutes))),
          note: item.note || '',
        };
      }),
    };
  }

  function mapCommuteRoute(route) {
    var derived = route && route.derived ? route.derived : {};
    var stops = mapStops(route);
    return {
      provider: derived.provider || '',
      routeLabel: (route && route.label) || 'Route',
      stopCount: stops.length,
      durationMinutes: derived.durationMinutes == null ? null : Number(derived.durationMinutes),
      trafficStatus: derived.trafficStatus || '',
      updatedAt: derived.updatedAt || '',
      expiresAt: derived.expiresAt || '',
      stops: stops,
      bufferMinutes: routeBufferMinutes(route, stops),
    };
  }

  function parseMessagesMarkdown(markdown) {
    if (!markdown) return clone(DEFAULT_MESSAGES);
    var current = null;
    var buckets = clone(DEFAULT_MESSAGES);
    var sectionMap = {
      'morning calm': ['morning', 'calm'],
      'morning tight': ['morning', 'warn'],
      'morning late': ['morning', 'hot'],
      'morning critical': ['morning', 'crit'],
      'morning gone': ['morning', 'gone'],
      evening: ['evening', 'onTrack'],
      'evening on track': ['evening', 'onTrack'],
      'evening behind': ['evening', 'behind'],
      'evening late': ['evening', 'late'],
      'evening done': ['evening', 'done'],
    };
    markdown.split(/\r?\n/).forEach(function (line) {
      var heading = line.match(/^##\s+(.+?)\s*$/);
      if (heading) {
        current = sectionMap[heading[1].trim().toLowerCase()] || null;
        if (current) buckets[current[0]][current[1]] = [];
        return;
      }
      var item = line.match(/^-\s+(.+?)\s*$/);
      if (item && current) buckets[current[0]][current[1]].push(item[1]);
    });
    return buckets;
  }

  function toDashboardConfig(input) {
    input = input || {};
    var family = input.family || {};
    var display = input.display || {};
    var modules = input.modules || {};
    var routinesConfig = input.routines || {};
    var scenesConfig = input.scenes || {};
    var routesConfig = input.routes || {};
    var routes = routeById(routesConfig);
    var lists = listById(routinesConfig);
    var dashboardRoutines = arr(routinesConfig.routines).map(function (routine) {
      if (routine.type === 'timeline') return mapTimelineRoutine(routine);
      return mapDepartureRoutine(routine, routes[routine.routeId], lists[routine.listId]);
    });
    var primaryDeparture = firstDeparture(dashboardRoutines);
    var primaryTimeline = firstTimeline(dashboardRoutines);
    var commuteRoutes = {};

    arr(routesConfig.routes).forEach(function (route) {
      commuteRoutes[routeKey(route.id)] = mapCommuteRoute(route);
    });

    var timeConfig = Object.assign({}, DEFAULT_TIME, display.time || {});
    var home = family.home || {};
    var kids = arr(family.members).filter(function (member) {
      return member && member.role === 'child';
    }).map(function (member) {
      return { name: member.displayName || member.name || 'Kid', age: member.age == null ? null : member.age };
    });

    return {
      time: timeConfig,
      theme: clone(display.theme || { id: 'default-editorial', accent: '#d99a3d' }),
      family: {
        kids: kids,
        location: {
          city: home.city || '',
          lat: home.coordinates && Number(home.coordinates.lat) || null,
          lon: home.coordinates && Number(home.coordinates.lon) || null,
          school: (commuteRoutes.school && commuteRoutes.school.routeLabel) || (primaryDeparture && primaryDeparture.segments[0].routeLabel) || '',
          schoolRoute: (primaryDeparture && primaryDeparture.segments[0].routeLabel) || '',
        },
      },
      api: {},
      modules: {
        quote: { source: (modules.quotes && modules.quotes.source) || 'stoic' },
      },
      modes: {
        morning: primaryDeparture ? clone(primaryDeparture.window) : { start: '06:00', end: '08:00' },
        evening: primaryTimeline ? clone(primaryTimeline.window) : { start: '17:00', end: '21:00' },
      },
      schoolDays: primaryDeparture ? clone(primaryDeparture.days) : [1, 2, 3, 4, 5],
      routines: dashboardRoutines,
      scenes: clone(arr(scenesConfig.scenes)),
      scenarios: {
        default: {
          leave: primaryDeparture ? primaryDeparture.primaryTime : '07:00',
          school: primaryDeparture ? primaryDeparture.targetTime : '07:30',
          lateBell: primaryDeparture ? primaryDeparture.deadline : '07:35',
          driveMinEst: primaryDeparture ? primaryDeparture.segments[0].fallbackDriveMin : 0,
          carBufferMin: primaryDeparture ? primaryDeparture.segments[0].bufferMin : 0,
          note: '',
        },
      },
      morningChecklist: primaryDeparture ? clone(primaryDeparture.listItems) : [],
      eveningTimeline: primaryTimeline ? clone(primaryTimeline.timelineItems) : [],
      messages: parseMessagesMarkdown(input.messagesMarkdown || ''),
      weekend: { enabled: true, message: 'No school today.', subtext: 'Enjoy the morning.', showWeather: true },
      commute: {
        activeRouteId: primaryDeparture ? primaryDeparture.routeId : '',
        routes: commuteRoutes,
        defaultDriveMin: 12,
        driveEstimates: clone(DEFAULT_DRIVE_ESTIMATES),
      },
    };
  }

  return {
    toDashboardConfig: toDashboardConfig,
    parseMessagesMarkdown: parseMessagesMarkdown,
  };
});
