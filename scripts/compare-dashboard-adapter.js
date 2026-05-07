#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { toDashboardConfig } = require('../config/dashboard-adapter');

const root = path.resolve(__dirname, '..');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}

function readText(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function loadCurrentDashboardConfig() {
  return require(path.join(root, 'dashboard-config.js'));
}

function pick(obj, paths) {
  const out = {};
  paths.forEach((keyPath) => {
    const parts = keyPath.split('.');
    let source = obj;
    let target = out;
    parts.forEach((part, index) => {
      if (source == null || !(part in source)) return;
      if (index === parts.length - 1) {
        target[part] = source[part];
        return;
      }
      target[part] = target[part] || {};
      target = target[part];
      source = source[part];
    });
  });
  return out;
}

function summarize(config) {
  return {
    timeZone: config.time && config.time.timeZone,
    modes: config.modes,
    routineIds: (config.routines || []).map((routine) => routine.id),
    commuteRouteIds: Object.keys((config.commute && config.commute.routes) || {}),
    morningChecklistCount: (config.morningChecklist || []).length,
    eveningTimelineCount: (config.eveningTimeline || []).length,
    familyKidsCount: (config.family && config.family.kids || []).length,
  };
}

const adapted = toDashboardConfig({
  family: readJson('config/family.json'),
  routines: readJson('config/routines.json'),
  routes: readJson('config/routes.json'),
  display: readJson('config/display.json'),
  modules: readJson('config/modules.json'),
  messagesMarkdown: readText('content/messages.md'),
  quotesMarkdown: readText('content/quotes.md'),
});

const current = loadCurrentDashboardConfig();
const comparisonPaths = [
  'time.timeZone',
  'time.locale',
  'time.hour12',
  'modes',
  'schoolDays',
  'scenarios',
  'weekend',
];

console.log(JSON.stringify({
  adapted: summarize(adapted),
  current: summarize(current),
  comparableShape: {
    adapted: pick(adapted, comparisonPaths),
    current: pick(current, comparisonPaths),
  },
}, null, 2));
