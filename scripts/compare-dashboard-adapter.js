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

console.log(JSON.stringify({
  adapted: summarize(adapted),
  source: 'config/*.json + content/*.md',
}, null, 2));
