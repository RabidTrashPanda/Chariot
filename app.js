const COMMAND_MAP_URL = "./grandduo_command_map.json";

const STARTUP_DELAY_MS = 80;
const DEFAULT_COMMAND_DELAY_MS = 120;
const FCDC_COMMAND_DELAY_MS = 200;
const POST_CONNECT_DELAY_MS = 250;
const POST_STARTUP_SETTLE_MS = 400;
const MAX_LOG_ITEMS = 80;
const STORAGE_KEYS = {
  preferences: "grandduo.preferences.v1",
  aiPresets: "grandduo.aiPresets.v1",
  macros: "grandduo.macros.v1",
};
const MOTION_CATEGORY_BEHAVIOR = {
  leg_rest_motion: { positive: "up", negative: "down", stop: "stop" },
  back_rest_motion: { positive: "up", negative: "down", stop: "stop" },
  foot_rest_motion: { positive: "out", negative: "in", stop: "stop" },
  manual_upper_position_motion: { positive: "up", negative: "down", stop: "stop" },
  manual_lower_position_motion: { positive: "up", negative: "down", stop: "stop" },
};

const AI_ZONE_CONFIG = [
  { key: "upper", label: "Upper" },
  { key: "midUpper", label: "Mid Upper" },
  { key: "midLower", label: "Mid Lower" },
  { key: "lower", label: "Lower" },
];

const AI_TECHNIQUES = [
  { value: "off", label: "Off" },
  { value: "kneading", label: "Kneading" },
  { value: "knocking", label: "Knocking" },
  { value: "shiatsu", label: "Shiatsu" },
];

const AI_AIR_LEVELS = [0, 1, 2, 3, 4, 5];
const AI_ROLLER_OPTIONS = [
  { value: "off", label: "Off", byte: "00" },
  { value: "foot1", label: "Foot Rollers 1", byte: "10" },
  { value: "foot2", label: "Foot Rollers 2", byte: "20" },
  { value: "calf1", label: "Calf Rollers 1", byte: "21" },
  { value: "calf2", label: "Calf Rollers 2", byte: "22" },
];

const AI_HEAT_SURFACE_CONFIG = [
  { key: "roller", label: "Roller", bit: 0x40 },
  { key: "shawl", label: "Shawl", bit: 0x01 },
  { key: "calf", label: "Calf", bit: 0x02 },
  { key: "foot", label: "Foot", bit: 0x08 },
];


const SECTION_CONFIG = [
  {
    key: "session",
    title: "Session",
    groups: [
      {
        label: "Time",
        names: ["session_time_10", "session_time_20", "session_time_30"],
        style: "segmented",
        optionLabels: {
          session_time_10: "10 Minutes",
          session_time_20: "20 Minutes",
          session_time_30: "30 Minutes",
        },
      },
      { label: "4D Profile", category: "massage_modes", style: "segmented" },
    ],
  },
  {
    key: "position",
    title: "Position",
    groups: [
      { label: "Presets", names: ["zero_gravity", "relaxation", "sleep", "reset_position"], style: "segmented" },
      { label: "Leg Rest", category: "leg_rest_motion" },
      { label: "Back Rest", category: "back_rest_motion" },
      { label: "Foot Rest", category: "foot_rest_motion" },
    ],
  },
  {
    key: "programs",
    title: "Programs",
    groups: [
      { label: "Wellness", category: "wellness_programs" },
      { label: "Healing", category: "program_healing" },
      { label: "International", category: "program_international" },
      { label: "Point Massage", category: "program_point_massage" },
      { label: "Calming", category: "program_calming" },
      { label: "Focused", category: "program_focused" },
      { label: "Sports Recovery", category: "program_sports_recovery" },
      { label: "Full Body", category: "program_full_body" },
    ],
  },
  {
    key: "manual",
    title: "Manual",
    groups: [
      { label: "Upper Mode", category: "manual_upper_modes", style: "segmented" },
      { label: "Upper Focus", names: ["manual_upper_whole", "manual_upper_partial", "manual_upper_point"], style: "segmented", optionLabels: { manual_upper_whole: "Whole", manual_upper_partial: "Partial", manual_upper_point: "Point" } },
      { label: "Upper Track", category: "manual_upper_position_motion" },
      { label: "Upper 4D", category: "upper_4d_strength", style: "range", valueLabels: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" } },
      { label: "Lower Mechanism", category: "manual_lower_mechanism", style: "segmented" },
      { label: "Lower Focus", names: ["manual_lower_whole", "manual_lower_partial", "manual_lower_point"], style: "segmented", optionLabels: { manual_lower_whole: "Whole", manual_lower_partial: "Partial", manual_lower_point: "Point" } },
      { label: "Lower Track", category: "manual_lower_position_motion" },
      { label: "Lower 4D", category: "lower_4d_strength", style: "range", valueLabels: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" } },
      { label: "Lower Speed", category: "manual_lower_speed", style: "range", valueLabels: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" } },
      { label: "Air Region", category: "manual_air_regions", custom: "manual_air_region", style: "segmented", optionLabels: { manual_air_off: "Off", manual_air_full: "Full", manual_air_arm_shoulder: "Arm / Shoulder", manual_air_waist_seat: "Waist / Seat", manual_air_leg_foot: "Leg / Foot" } },
      { label: "Air Pressure", category: "air_pressure", style: "range", valueLabels: { 0: "Off (Exp)", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" } },
      { label: "Roller Region", custom: "manual_roller_region", style: "segmented", optionLabels: { manual_roller_region_off: "Off", manual_roller_region_foot: "Foot", manual_roller_region_calf: "Calf" } },
      { label: "Roller Level", custom: "manual_roller_level", style: "range", valueLabels: { 1: "1", 2: "2" } },
    ],
  },
  {
    key: "massage",
    title: "Massage",
    groups: [
      { label: "Air Pressure Level", category: "air_pressure", style: "range", valueLabels: { 0: "Off (Exp)", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" } },
      { label: "Rollers", category: "rollers_non_ai", style: "range", valueLabels: { 0: "Off", 1: "1", 2: "2" } },
      { label: "Upper 4D", category: "upper_4d_strength", style: "range", valueLabels: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" } },
      { label: "Lower 4D", category: "lower_4d_strength", style: "range", valueLabels: { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" } },
    ],
  },
  {
    key: "heat",
    title: "Heat",
    groups: [
      { label: "Roller Heat", names: ["roller_heat_0", "roller_heat_1", "roller_heat_2", "roller_heat_3"], style: "range", valueLabels: { 0: "Off", 1: "1", 2: "2", 3: "3" } },
      { label: "Calf Heat", names: ["calf_heat_0", "calf_heat_1", "calf_heat_2", "calf_heat_3"], style: "range", valueLabels: { 0: "Off", 1: "1", 2: "2", 3: "3" } },
      { label: "Shawl Heat", names: ["shawl_heat_0", "shawl_heat_1", "shawl_heat_2", "shawl_heat_3"], style: "range", valueLabels: { 0: "Off", 1: "1", 2: "2", 3: "3" } },
      { label: "Foot Heat", names: ["foot_heat_0", "foot_heat_1", "foot_heat_2", "foot_heat_3"], style: "range", valueLabels: { 0: "Off", 1: "1", 2: "2", 3: "3" } },
    ],
  },
  {
    key: "comfort",
    title: "Comfort",
    groups: [
      { label: "Restore", names: ["restore_on", "restore_off"], style: "toggle", optionLabels: { restore_on: "On", restore_off: "Off" } },
      { label: "LED", names: ["light_therapy_off", "light_therapy_mode_1", "light_therapy_mode_2", "light_therapy_mode_3", "light_therapy_mode_4", "light_therapy_mode_5"], style: "range", valueLabels: { 0: "Off", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" } },
      { label: "Voice", names: ["voice_on", "voice_off"], style: "toggle", optionLabels: { voice_on: "On", voice_off: "Off" } },
      { label: "Anion", names: ["anion_on", "anion_off"], style: "toggle", optionLabels: { anion_on: "On", anion_off: "Off" } },
      { label: "Aromatherapy", names: ["aroma_off", "aroma_1", "aroma_2", "aroma_3", "aroma_4", "aroma_5"], style: "range", valueLabels: { 0: "Off" } },
    ],
  },
  {
    key: "ai",
    title: "AI",
    groups: [
      { label: "Shoulder Air", names: ["ai_shoulder_air_1", "ai_shoulder_air_5"], style: "range", valueLabels: { 1: "1", 5: "5" } },
      { label: "Waist Air", names: ["ai_waist_air_1", "ai_waist_air_5"], style: "range", valueLabels: { 1: "1", 5: "5" } },
      { label: "Leg / Foot Air", names: ["ai_leg_foot_air_1", "ai_leg_foot_air_5"], style: "range", valueLabels: { 1: "1", 5: "5" } },
      { label: "Full Body Air", names: ["ai_full_body_air_1", "ai_full_body_air_5"], style: "range", valueLabels: { 1: "1", 5: "5" } },
      { label: "Rollers", names: ["ai_foot_rollers_1", "ai_foot_rollers_2", "ai_calf_rollers_1", "ai_calf_rollers_2"], style: "segmented", optionLabels: { ai_foot_rollers_1: "Foot 1", ai_foot_rollers_2: "Foot 2", ai_calf_rollers_1: "Calf 1", ai_calf_rollers_2: "Calf 2" } },
    ],
  },
];

const state = {
  map: null,
  device: null,
  server: null,
  service: null,
  notifyCharacteristic: null,
  writeCharacteristic: null,
  connected: false,
  startupBurstSent: false,
  lastState: null,
  health: null,
  healthRequested: false,
  recentNotifications: [],
  commandHistory: [],
  frameBuffer: [],
  aiBuilder: createDefaultAiBuilderState(),
  preferences: createDefaultPreferences(),
  savedAiPresets: [],
  savedMacros: [],
  macroDraft: { name: "", steps: [] },
  paused: false,
  poweredOn: false,
  activeTab: "session",
  programsSubtab: "wellness_programs",
  manualSubtab: "upper",
  manualControls: createDefaultManualControlState(),
  uiSelections: {},
};

const els = {
  connectBtn: document.getElementById("connectBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  powerBtn: document.getElementById("powerBtn"),
  sectionNav: document.getElementById("sectionNav"),
  commandSections: document.getElementById("commandSections"),
  commandHistory: document.getElementById("commandHistory"),
  notifyLog: document.getElementById("notifyLog"),
  logsPanel: document.getElementById("logsPanel"),
  customAiPanel: document.getElementById("customAiPanel"),
  presetsPanel: document.getElementById("presetsPanel"),
  settingsPanel: document.getElementById("settingsPanel"),
  connectHealthMount: document.getElementById("connectHealthMount"),
  statusField: document.getElementById("statusField"),
  timerField: document.getElementById("timerField"),
  healthPanel: document.getElementById("healthPanel"),
  healthStatus: document.getElementById("healthStatus"),
  heartRateValue: document.getElementById("heartRateValue"),
  heartRateState: document.getElementById("heartRateState"),
  bloodOxygenValue: document.getElementById("bloodOxygenValue"),
  bloodOxygenState: document.getElementById("bloodOxygenState"),
  microValue: document.getElementById("microValue"),
  microState: document.getElementById("microState"),
  fatigueValue: document.getElementById("fatigueValue"),
  fatigueState: document.getElementById("fatigueState"),
  mapVersion: document.getElementById("mapVersion"),
  commandButtonTemplate: document.getElementById("commandButtonTemplate"),
  aiBuilderZoneRows: document.getElementById("aiBuilderZoneRows"),
  aiAllKneadingBtn: document.getElementById("aiAllKneadingBtn"),
  aiAllKnockingBtn: document.getElementById("aiAllKnockingBtn"),
  aiAllShiatsuBtn: document.getElementById("aiAllShiatsuBtn"),
  aiSendBtn: document.getElementById("aiSendBtn"),
  aiClearBtn: document.getElementById("aiClearBtn"),
  aiShoulderAir: document.getElementById("aiShoulderAir"),
  aiWaistAir: document.getElementById("aiWaistAir"),
  aiLegAir: document.getElementById("aiLegAir"),
  aiFullBodyAir: document.getElementById("aiFullBodyAir"),
  aiRollers: document.getElementById("aiRollers"),
  aiHeatRoller: document.getElementById("aiHeatRoller"),
  aiHeatShawl: document.getElementById("aiHeatShawl"),
  aiHeatCalf: document.getElementById("aiHeatCalf"),
  aiHeatFoot: document.getElementById("aiHeatFoot"),
  aiPresetName: document.getElementById("aiPresetName"),
  aiSavePresetBtn: document.getElementById("aiSavePresetBtn"),
  savedAiPresetList: document.getElementById("savedAiPresetList"),
  macroName: document.getElementById("macroName"),
  addMacroCommandBtn: document.getElementById("addMacroCommandBtn"),
  addMacroWaitBtn: document.getElementById("addMacroWaitBtn"),
  addMacroAiBtn: document.getElementById("addMacroAiBtn"),
  saveMacroBtn: document.getElementById("saveMacroBtn"),
  macroSteps: document.getElementById("macroSteps"),
  savedMacroList: document.getElementById("savedMacroList"),
  aromaName1: document.getElementById("aromaName1"),
  aromaName2: document.getElementById("aromaName2"),
  aromaName3: document.getElementById("aromaName3"),
  aromaName4: document.getElementById("aromaName4"),
  aromaName5: document.getElementById("aromaName5"),
  saveSettingsBtn: document.getElementById("saveSettingsBtn"),
  resetSettingsBtn: document.getElementById("resetSettingsBtn"),
};


async function loadCommandMap() {
  if (window.location.protocol === "file:") {
    throw new Error("This build no longer embeds the command map in JavaScript. Serve the app over HTTP so it can load grandduo_command_map.json.");
  }

  const response = await fetch(COMMAND_MAP_URL, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} loading command map`);
  }

  const map = await response.json();
  if (!map || typeof map !== "object" || !map.commands_by_function || !map.device) {
    throw new Error("Command map JSON is missing required fields");
  }

  return map;
}

bootstrap().catch((error) => {
  console.error("Bootstrap failed", error);
  setStatus("Command map failed to load");
  appendCommandHistory(`Command map failed to load: ${error?.message || error}`);
});

async function bootstrap() {
  state.map = await loadCommandMap();

  if (els.mapVersion) {
    els.mapVersion.textContent = `Map version: ${state.map.map_revision || "local"}`;
  }

  fillSelectWithLevels(els.aiShoulderAir, AI_AIR_LEVELS, "Off");
  fillSelectWithLevels(els.aiWaistAir, AI_AIR_LEVELS, "Off");
  fillSelectWithLevels(els.aiLegAir, AI_AIR_LEVELS, "Off");
  fillSelectWithLevels(els.aiFullBodyAir, AI_AIR_LEVELS, "Off");
  fillSelectWithOptions(els.aiRollers, AI_ROLLER_OPTIONS.map((item) => ({ value: item.value, label: item.label })));

  loadPersistentState();

  els.connectBtn?.addEventListener("click", toggleConnection);
  els.pauseBtn?.addEventListener("click", togglePause);
  els.powerBtn?.addEventListener("click", togglePower);
  els.aiClearBtn?.addEventListener("click", () => {
    state.aiBuilder = createEmptyAiBuilderState();
    renderAiBuilder();
  });
  els.aiAllKneadingBtn?.addEventListener("click", () => applyAiPresetTechnique("kneading"));
  els.aiAllKnockingBtn?.addEventListener("click", () => applyAiPresetTechnique("knocking"));
  els.aiAllShiatsuBtn?.addEventListener("click", () => applyAiPresetTechnique("shiatsu"));
  els.aiSendBtn?.addEventListener("click", sendAiBuilderPacket);
  els.aiSavePresetBtn?.addEventListener("click", saveCurrentAiPreset);
  els.addMacroCommandBtn?.addEventListener("click", () => addMacroStep("command"));
  els.addMacroWaitBtn?.addEventListener("click", () => addMacroStep("wait"));
  els.addMacroAiBtn?.addEventListener("click", () => addMacroStep("ai_preset"));
  els.saveMacroBtn?.addEventListener("click", saveMacroDraft);
  els.saveSettingsBtn?.addEventListener("click", saveSettings);
  els.resetSettingsBtn?.addEventListener("click", resetSettings);
  els.macroName?.addEventListener("input", (event) => {
    state.macroDraft.name = event.target.value;
  });

  [els.aiShoulderAir, els.aiWaistAir, els.aiLegAir, els.aiFullBodyAir, els.aiRollers, els.aiHeatRoller, els.aiHeatShawl, els.aiHeatCalf, els.aiHeatFoot]
    .filter(Boolean)
    .forEach((el) => el.addEventListener("change", handleAiAddonChange));

  renderAiBuilder();
  renderCommands();
  renderConnectHealth();
  renderSectionNav();
  renderSavedAiPresets();
  renderMacroDraft();
  renderSavedMacros();
  renderSettings();
  renderConnectionState();
  renderHealthReport();
  renderLogs();
  updateTabVisibility();

  if (!navigator.bluetooth) {
    appendCommandHistory("This browser does not expose Web Bluetooth. Use Bluefy or another supported browser.");
  }
}

function createDefaultAiBuilderState() {
  return {
    zones: AI_ZONE_CONFIG.map((zone) => ({ key: zone.key, technique: "kneading", speed: 3, depth: 3 })),
    addons: {
      shoulderAir: 0,
      waistAir: 0,
      legAir: 0,
      fullBodyAir: 0,
      rollers: "off",
      heatMask: createDefaultAiHeatMask(),
    },
  };
}

function createDefaultAiHeatMask() {
  return {
    roller: false,
    shawl: false,
    calf: false,
    foot: false,
  };
}

function createEmptyAiBuilderState() {
  return {
    zones: AI_ZONE_CONFIG.map((zone) => ({ key: zone.key, technique: "off", speed: 3, depth: 3 })),
    addons: {
      shoulderAir: 0,
      waistAir: 0,
      legAir: 0,
      fullBodyAir: 0,
      rollers: "off",
      heatMask: createDefaultAiHeatMask(),
    },
  };
}

function createDefaultManualControlState() {
  return {
    airRegion: "manual_air_off",
    rollerRegion: "off",
    rollerLevel: 1,
  };
}

function createDefaultPreferences() {
  return {
    aromaNames: ["Aroma 1", "Aroma 2", "Aroma 3", "Aroma 4", "Aroma 5"],
  };
}

function loadStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function saveStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizePreferences(input) {
  const defaults = createDefaultPreferences();
  const names = Array.isArray(input?.aromaNames) ? input.aromaNames.slice(0, 5) : defaults.aromaNames.slice();
  while (names.length < 5) names.push(defaults.aromaNames[names.length]);
  return { aromaNames: names.map((item, index) => String(item || defaults.aromaNames[index]).trim() || defaults.aromaNames[index]) };
}

function normalizeAiBuilderState(input) {
  const fallback = createDefaultAiBuilderState();
  const zones = Array.isArray(input?.zones) ? input.zones.slice(0, AI_ZONE_CONFIG.length) : fallback.zones;
  const normalizedZones = AI_ZONE_CONFIG.map((zone, index) => ({
    key: zone.key,
    technique: zones[index]?.technique || fallback.zones[index].technique,
    speed: Number(zones[index]?.speed || fallback.zones[index].speed),
    depth: Number(zones[index]?.depth || fallback.zones[index].depth),
  }));
  const heatMask = { ...createDefaultAiHeatMask(), ...(input?.addons?.heatMask || {}) };
  return {
    zones: normalizedZones,
    addons: {
      shoulderAir: Number(input?.addons?.shoulderAir ?? fallback.addons.shoulderAir),
      waistAir: Number(input?.addons?.waistAir ?? fallback.addons.waistAir),
      legAir: Number(input?.addons?.legAir ?? fallback.addons.legAir),
      fullBodyAir: Number(input?.addons?.fullBodyAir ?? fallback.addons.fullBodyAir),
      rollers: input?.addons?.rollers || fallback.addons.rollers,
      heatMask,
    },
  };
}

function loadPersistentState() {
  state.preferences = normalizePreferences(loadStoredJson(STORAGE_KEYS.preferences, createDefaultPreferences()));
  const savedPresets = Array.isArray(loadStoredJson(STORAGE_KEYS.aiPresets, [])) ? loadStoredJson(STORAGE_KEYS.aiPresets, []) : [];
  state.savedAiPresets = savedPresets.map((preset) => ({ ...preset, builderState: normalizeAiBuilderState(preset.builderState) }));
  state.savedMacros = Array.isArray(loadStoredJson(STORAGE_KEYS.macros, [])) ? loadStoredJson(STORAGE_KEYS.macros, []) : [];
  state.aiBuilder = normalizeAiBuilderState(state.aiBuilder);
}

function persistPreferences() {
  saveStoredJson(STORAGE_KEYS.preferences, state.preferences);
}

function persistAiPresets() {
  saveStoredJson(STORAGE_KEYS.aiPresets, state.savedAiPresets);
}

function persistMacros() {
  saveStoredJson(STORAGE_KEYS.macros, state.savedMacros);
}

function getAllCommands() {
  const all = [];
  for (const [category, list] of Object.entries(state.map.commands_by_function || {})) {
    for (const command of list) {
      all.push({ ...command, _category: category });
    }
  }
  return all;
}

function getAromaDisplayLabel(command) {
  const match = /^aroma_(\d)$/.exec(command.name || "");
  if (!match) return null;
  const index = Number(match[1]) - 1;
  return state.preferences.aromaNames[index] || command.label;
}

function getDisplayLabel(command) {
  return getAromaDisplayLabel(command) || command.label;
}

function createEmptyMacroDraft() {
  return { name: "", steps: [] };
}

function createMacroStep(type = "command") {
  if (type === "wait") return { type: "wait", seconds: 1 };
  if (type === "ai_preset") return { type: "ai_preset", presetId: state.savedAiPresets[0]?.id || "" };
  const fallbackCommand = getAllCommands().find((item) => !item.name.endsWith('_stop')) || getAllCommands()[0];
  return { type: "command", commandName: fallbackCommand?.name || "" };
}

function fillSelectWithLevels(select, values, offLabel = "0") {
  if (!select) return;
  select.innerHTML = "";
  for (const value of values) {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = value === 0 ? offLabel : String(value);
    select.append(option);
  }
}

function fillSelectWithOptions(select, options) {
  if (!select) return;
  select.innerHTML = "";
  for (const item of options) {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    select.append(option);
  }
}

function getCommandsByName() {
  const byName = {};
  for (const list of Object.values(state.map.commands_by_function || {})) {
    for (const command of list) {
      byName[command.name] = command;
    }
  }
  return byName;
}

function getCommandsForGroup(group) {
  const byName = getCommandsByName();
  if (group.category === "manual_upper_position_motion") {
    return ["manual_upper_move_up_start", "manual_upper_move_down_start", "manual_upper_move_stop"].map((name) => byName[name]).filter(Boolean);
  }
  if (group.category) {
    return [...(state.map.commands_by_function[group.category] || [])];
  }
  if (group.names) {
    return group.names.map((name) => byName[name]).filter(Boolean);
  }
  return [];
}


function getMotionBehavior(group) {
  if (!group?.category) return null;
  return MOTION_CATEGORY_BEHAVIOR[group.category] || null;
}

function findMotionCommand(commands, token, group) {
  let command = commands.find((item) => item.name.includes(token));
  if (command) return command;

  if (group?.category === "foot_rest_motion") {
    if (token.includes("out_start")) return commands.find((item) => item.name.includes("down_start")) || null;
    if (token.includes("in_start")) return commands.find((item) => item.name.includes("up_start")) || null;
  }

  return null;
}

function createMotionButton(label, command, stopCommand, variant = "move") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `command-button motion-button ${variant === "stop" ? "motion-stop-button" : ""}`.trim();
  button.textContent = label;

  if (!command) {
    button.disabled = true;
    return button;
  }

  if (variant === "stop") {
    button.addEventListener("click", () => sendCommand(command));
    return button;
  }

  let pressed = false;
  const start = async (event) => {
    event?.preventDefault?.();
    if (pressed) return;
    pressed = true;
    await sendCommand(command);
  };
  const release = async (event) => {
    event?.preventDefault?.();
    if (!pressed) return;
    pressed = false;
    if (stopCommand) await sendCommand(stopCommand);
  };

  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("touchend", release, { passive: false });
  button.addEventListener("touchcancel", release, { passive: false });
  button.addEventListener("mouseup", release);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") start(event);
  });
  button.addEventListener("keyup", (event) => {
    if (event.key === "Enter" || event.key === " ") release(event);
  });
  return button;
}

function getGroupId(group) {
  if (group.id) return group.id;
  if (group.category) return group.category;
  if (group.names?.length) return group.names.join("|");
  return group.label;
}

function inferLevelFromCommand(command) {
  if (!command) return null;
  if (/_off$/.test(command.name) || /(?:^|\s)off$/i.test(command.label || "")) return 0;
  const nameMatch = command.name.match(/_(\d+)$/);
  if (nameMatch) return Number(nameMatch[1]);
  const labelMatch = String(command.label || "").match(/(\d+)$/);
  if (labelMatch) return Number(labelMatch[1]);
  return null;
}

function getCommandOptionLabel(command, group = null) {
  if (group?.optionLabels?.[command.name]) return group.optionLabels[command.name];
  const aroma = getAromaDisplayLabel(command);
  if (aroma) return aroma;
  let label = String(command.label || command.name || "");
  if (group?.label) {
    const escaped = group.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    label = label.replace(new RegExp(`^${escaped}:?\\s*`, "i"), "");
  }
  label = label
    .replace(/^Manual Upper:\s*/i, "")
    .replace(/^Manual Air:\s*/i, "")
    .replace(/^Manual Lower(?: Mechanism)?:\s*/i, "")
    .replace(/^Healing:\s*/i, "")
    .replace(/^International:\s*/i, "")
    .replace(/^Point Massage:\s*/i, "")
    .replace(/^Calming:\s*/i, "")
    .replace(/^Focused:\s*/i, "")
    .replace(/^Sports Recovery:\s*/i, "")
    .replace(/^Full Body:\s*/i, "")
    .replace(/^AI\s+/i, "")
    .replace(/^LED\s+Light\s+/i, "")
    .replace(/^Aromatherapy\s+/i, "")
    .trim();
  if (group?.style === "toggle") {
    if (/_on$/.test(command.name)) return "On";
    if (/_off$/.test(command.name)) return "Off";
  }
  return label;
}

function getRangeOptions(commands, group) {
  const options = commands
    .map((command) => ({ command, level: inferLevelFromCommand(command) }))
    .filter((item) => item.level !== null)
    .sort((a, b) => a.level - b.level)
    .map((item) => ({ ...item, label: group?.valueLabels?.[item.level] ?? getCommandOptionLabel(item.command, group) }));
  return options;
}

function createStaticSegmentedControl(options, selectedValue, onSelect) {
  const grid = document.createElement("div");
  grid.className = "button-grid segmented-grid";
  for (const option of options) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "command-button segment-button label-only";
    button.textContent = option.label;
    if (String(selectedValue) === String(option.value)) button.classList.add("is-active");
    button.addEventListener("click", async () => {
      await onSelect(option.value);
    });
    grid.append(button);
  }
  return grid;
}

async function applyManualRollerSelection() {
  const { rollerRegion, rollerLevel } = state.manualControls;
  const byName = getCommandsByName();
  if (rollerRegion === "foot") {
    const command = byName[`foot_rollers_${rollerLevel}`];
    if (command) {
      await sendCommand(command);
      return;
    }
  }
  if (rollerRegion === "calf") {
    const command = byName[`calf_rollers_${rollerLevel}`];
    if (command) {
      await sendCommand(command);
      return;
    }
  }
  if (rollerRegion === "off") {
    if (byName.foot_rollers_0) await sendCommand(byName.foot_rollers_0);
    if (byName.calf_rollers_0) await sendCommand(byName.calf_rollers_0);
    return;
  }
}

function createManualAirRegionControl() {
  const options = [
    { value: "manual_air_off", label: "Off (Exp)" },
    { value: "manual_air_full", label: "Full" },
    { value: "manual_air_arm_shoulder", label: "Arm / Shoulder" },
    { value: "manual_air_waist_seat", label: "Waist / Seat" },
    { value: "manual_air_leg_foot", label: "Leg / Foot" },
  ];
  const byName = getCommandsByName();
  return createStaticSegmentedControl(options, state.manualControls.airRegion, async (value) => {
    state.manualControls.airRegion = value;
    if (value === "manual_air_off") {
      const experimentalOff = byName.air_pressure_0;
      if (experimentalOff) {
        setStatus("Manual air Off is experimental. Sending the air pressure 0 candidate packet now.");
        await sendCommand(experimentalOff);
      } else {
        setStatus("Manual air Off is selected in the UI, but no experimental off packet is loaded.");
      }
      renderCommands();
      return;
    }
    const command = byName[value];
    if (command) await sendCommand(command);
    renderCommands();
  });
}

function createManualRollerRegionControl() {
  const options = [
    { value: "off", label: "Off" },
    { value: "foot", label: "Foot" },
    { value: "calf", label: "Calf" },
  ];
  return createStaticSegmentedControl(options, state.manualControls.rollerRegion, async (value) => {
    state.manualControls.rollerRegion = value;
    await applyManualRollerSelection();
    renderCommands();
  });
}

function createManualRollerLevelControl(group) {
  const options = [
    { value: 1, label: group?.valueLabels?.[1] ?? "1" },
    { value: 2, label: group?.valueLabels?.[2] ?? "2" },
  ];

  const wrap = document.createElement("div");
  wrap.className = "level-control slider-control compact-slider-control";

  const current = document.createElement("div");
  current.className = "level-current";
  current.textContent = options.find((item) => String(item.value) === String(state.manualControls.rollerLevel))?.label || String(state.manualControls.rollerLevel);

  const slider = document.createElement("input");
  slider.type = "range";
  slider.className = "level-slider";
  slider.min = "0";
  slider.max = String(Math.max(0, options.length - 1));
  slider.step = "1";
  slider.value = String(Math.max(0, options.findIndex((item) => String(item.value) === String(state.manualControls.rollerLevel))));
  slider.addEventListener("input", () => {
    const option = options[Number(slider.value)] || options[0];
    current.textContent = option.label;
  });
  slider.addEventListener("change", async () => {
    const option = options[Number(slider.value)] || options[0];
    state.manualControls.rollerLevel = Number(option.value);
    current.textContent = option.label;
    await applyManualRollerSelection();
    renderCommands();
  });

  const ticks = document.createElement("div");
  ticks.className = "level-ticks";
  ticks.style.setProperty("--tick-count", String(options.length));
  options.forEach((option, index) => {
    const tick = document.createElement("button");
    tick.type = "button";
    tick.className = "tick-button";
    tick.textContent = option.label;
    if (index === Number(slider.value)) tick.classList.add("is-active");
    tick.addEventListener("click", async () => {
      slider.value = String(index);
      state.manualControls.rollerLevel = Number(option.value);
      current.textContent = option.label;
      await applyManualRollerSelection();
      renderCommands();
    });
    ticks.append(tick);
  });

  wrap.append(current, slider, ticks);
  return wrap;
}

function createSegmentedControl(group, commands) {
  const grid = document.createElement("div");
  grid.className = "button-grid segmented-grid";
  const groupId = getGroupId(group);
  for (const command of commands) {
    grid.append(createCommandButton(command, group, getCommandOptionLabel(command, group), groupId));
  }
  return grid;
}

function createRangeControl(group, commands) {
  const options = getRangeOptions(commands, group);
  if (!options.length) return createSegmentedControl(group, commands);

  const groupId = getGroupId(group);
  const wrap = document.createElement("div");
  wrap.className = "level-control slider-control";

  const currentStored = String(state.uiSelections[groupId] ?? options[0].level);
  const currentIndex = Math.max(0, options.findIndex((item) => String(item.level) === currentStored));
  const currentOption = options[currentIndex] || options[0];

  const head = document.createElement("div");
  head.className = "level-control-head";
  const current = document.createElement("div");
  current.className = "level-current";
  current.textContent = currentOption.label;
  head.append(current);

  const slider = document.createElement("input");
  slider.type = "range";
  slider.className = "level-slider";
  slider.min = "0";
  slider.max = String(Math.max(0, options.length - 1));
  slider.step = "1";
  slider.value = String(currentIndex);
  slider.setAttribute("aria-label", group.label);

  slider.addEventListener("input", () => {
    const option = options[Number(slider.value)] || options[0];
    current.textContent = option.label;
  });

  slider.addEventListener("change", async () => {
    const option = options[Number(slider.value)] || options[0];
    state.uiSelections[groupId] = String(option.level);
    current.textContent = option.label;
    await sendCommand(option.command);
    renderCommands();
  });

  const ticks = document.createElement("div");
  ticks.className = "level-ticks";
  ticks.style.setProperty("--tick-count", String(options.length));
  for (const [index, option] of options.entries()) {
    const tick = document.createElement("button");
    tick.type = "button";
    tick.className = "tick-button";
    tick.textContent = option.label;
    if (index === currentIndex) tick.classList.add("is-active");
    tick.addEventListener("click", async () => {
      slider.value = String(index);
      state.uiSelections[groupId] = String(option.level);
      current.textContent = option.label;
      await sendCommand(option.command);
      renderCommands();
    });
    ticks.append(tick);
  }

  wrap.append(head, slider, ticks);
  return wrap;
}

function createDiscreteLevelBar(options, selectedValue, onSelect) {
  const wrap = document.createElement("div");
  wrap.className = "level-control slider-control compact-slider-control";

  const current = document.createElement("div");
  current.className = "level-current";
  current.textContent = options.find((item) => String(item.value) === String(selectedValue))?.label || String(selectedValue);

  const slider = document.createElement("input");
  slider.type = "range";
  slider.className = "level-slider";
  slider.min = "0";
  slider.max = String(Math.max(0, options.length - 1));
  slider.step = "1";
  slider.value = String(Math.max(0, options.findIndex((item) => String(item.value) === String(selectedValue))));
  slider.addEventListener("input", () => {
    const option = options[Number(slider.value)] || options[0];
    current.textContent = option.label;
  });
  slider.addEventListener("change", () => {
    const option = options[Number(slider.value)] || options[0];
    current.textContent = option.label;
    onSelect(option.value);
  });

  const ticks = document.createElement("div");
  ticks.className = "level-ticks";
  ticks.style.setProperty("--tick-count", String(options.length));
  options.forEach((option, index) => {
    const tick = document.createElement("button");
    tick.type = "button";
    tick.className = "tick-button";
    tick.textContent = option.label;
    if (index === Number(slider.value)) tick.classList.add("is-active");
    tick.addEventListener("click", () => {
      slider.value = String(index);
      current.textContent = option.label;
      onSelect(option.value);
      renderAiBuilder();
    });
    ticks.append(tick);
  });

  wrap.append(current, slider, ticks);
  return wrap;
}

function createGroupControlGrid(group, commands) {
  if (group?.custom === "manual_air_region") return createManualAirRegionControl(group);
  if (group?.custom === "manual_roller_region") return createManualRollerRegionControl(group);
  if (group?.custom === "manual_roller_level") return createManualRollerLevelControl(group);

  const motion = getMotionBehavior(group);
  const grid = document.createElement("div");
  if (motion) {
    grid.className = "motion-grid";
    const positive = findMotionCommand(commands, `${motion.positive}_start`, group) || findMotionCommand(commands, `move_${motion.positive}_start`, group);
    const negative = findMotionCommand(commands, `${motion.negative}_start`, group) || findMotionCommand(commands, `move_${motion.negative}_start`, group);
    const stop = findMotionCommand(commands, motion.stop, group);
    grid.append(
      createMotionButton(labelForMotion(group, motion.positive), positive, stop),
      createMotionButton(labelForMotion(group, motion.negative), negative, stop)
    );
    return grid;
  }

  if (group.style === "range") return createRangeControl(group, commands);
  if (group.style === "segmented" || group.style === "toggle") return createSegmentedControl(group, commands);

  grid.className = "button-grid";
  for (const command of commands) {
    grid.append(createCommandButton(command, group, getCommandOptionLabel(command, group)));
  }
  return grid;
}

function labelForMotion(group, direction) {
  if (group.category === "foot_rest_motion") {
    return direction === "out" ? "Out" : direction === "in" ? "In" : "Stop";
  }
  return direction.charAt(0).toUpperCase() + direction.slice(1);
}

function renderAiBuilder() {
  if (!els.aiBuilderZoneRows) return;
  els.aiBuilderZoneRows.innerHTML = "";
  const fragment = document.createDocumentFragment();

  AI_ZONE_CONFIG.forEach((zoneConfig, index) => {
    const zone = state.aiBuilder.zones[index];

    const row = document.createElement("div");
    row.className = "ai-zone-row";

    const label = document.createElement("div");
    label.className = "ai-zone-label";
    label.textContent = zoneConfig.label;

    const techniqueWrap = document.createElement("div");
    techniqueWrap.className = "field";
    const techniqueLabel = document.createElement("span");
    techniqueLabel.textContent = "Technique";
    const techniqueGrid = document.createElement("div");
    techniqueGrid.className = "button-grid segmented-grid compact-segmented-grid";
    for (const option of AI_TECHNIQUES) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "segment-button";
      if (zone.technique === option.value) button.classList.add("is-active");
      button.textContent = option.label;
      button.addEventListener("click", () => {
        zone.technique = option.value;
        renderAiBuilder();
      });
      techniqueGrid.append(button);
    }
    techniqueWrap.append(techniqueLabel, techniqueGrid);

    const speedWrap = document.createElement("div");
    speedWrap.className = "field";
    const speedLabel = document.createElement("span");
    speedLabel.textContent = "Speed";
    const speedBar = createDiscreteLevelBar(
      [1, 2, 3, 4, 5].map((value) => ({ value, label: String(value) })),
      zone.speed,
      (value) => {
        if (zone.technique === "off") return;
        zone.speed = Number(value);
        renderAiBuilder();
      }
    );
    if (zone.technique === "off") speedBar.classList.add("is-disabled");
    speedWrap.append(speedLabel, speedBar);

    const depthWrap = document.createElement("div");
    depthWrap.className = "field";
    const depthLabel = document.createElement("span");
    depthLabel.textContent = "4D Depth";
    const depthBar = createDiscreteLevelBar(
      [1, 2, 3, 4, 5].map((value) => ({ value, label: String(value) })),
      zone.depth,
      (value) => {
        if (zone.technique === "off") return;
        zone.depth = Number(value);
        renderAiBuilder();
      }
    );
    if (zone.technique === "off") depthBar.classList.add("is-disabled");
    depthWrap.append(depthLabel, depthBar);

    row.append(label, techniqueWrap, speedWrap, depthWrap);
    fragment.append(row);
  });

  els.aiBuilderZoneRows.append(fragment);
  syncAiAddonControls();
}

function syncAiAddonControls() {
  const addons = state.aiBuilder.addons;
  if (els.aiShoulderAir) els.aiShoulderAir.value = String(addons.shoulderAir);
  if (els.aiWaistAir) els.aiWaistAir.value = String(addons.waistAir);
  if (els.aiLegAir) els.aiLegAir.value = String(addons.legAir);
  if (els.aiFullBodyAir) els.aiFullBodyAir.value = String(addons.fullBodyAir);
  if (els.aiRollers) els.aiRollers.value = addons.rollers;
  if (els.aiHeatRoller) els.aiHeatRoller.checked = Boolean(addons.heatMask?.roller);
  if (els.aiHeatShawl) els.aiHeatShawl.checked = Boolean(addons.heatMask?.shawl);
  if (els.aiHeatCalf) els.aiHeatCalf.checked = Boolean(addons.heatMask?.calf);
  if (els.aiHeatFoot) els.aiHeatFoot.checked = Boolean(addons.heatMask?.foot);
}

function handleAiAddonChange() {
  state.aiBuilder.addons = {
    shoulderAir: Number(els.aiShoulderAir?.value || 0),
    waistAir: Number(els.aiWaistAir?.value || 0),
    legAir: Number(els.aiLegAir?.value || 0),
    fullBodyAir: Number(els.aiFullBodyAir?.value || 0),
    rollers: els.aiRollers?.value || "off",
    heatMask: {
      roller: Boolean(els.aiHeatRoller?.checked),
      shawl: Boolean(els.aiHeatShawl?.checked),
      calf: Boolean(els.aiHeatCalf?.checked),
      foot: Boolean(els.aiHeatFoot?.checked),
    },
  };
}

function applyAiPresetTechnique(technique) {
  state.aiBuilder.zones = AI_ZONE_CONFIG.map((zone) => ({ key: zone.key, technique, speed: 3, depth: 3 }));
  renderAiBuilder();
}


function renderSavedAiPresets() {
  if (!els.savedAiPresetList) return;
  els.savedAiPresetList.innerHTML = "";
  if (!state.savedAiPresets.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No saved presets yet.";
    els.savedAiPresetList.append(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const preset of state.savedAiPresets) {
    const row = document.createElement("div");
    row.className = "saved-item";
    const title = document.createElement("div");
    title.className = "saved-title";
    title.textContent = preset.name;
    const actions = document.createElement("div");
    actions.className = "saved-actions";
    const loadBtn = document.createElement("button");
    loadBtn.type = "button";
    loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", () => loadAiPresetIntoBuilder(preset));
    const sendBtn = document.createElement("button");
    sendBtn.type = "button";
    sendBtn.textContent = "Send";
    sendBtn.addEventListener("click", () => sendSavedAiPreset(preset.id));
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteAiPreset(preset.id));
    actions.append(loadBtn, sendBtn, deleteBtn);
    row.append(title, actions);
    fragment.append(row);
  }
  els.savedAiPresetList.append(fragment);
}

function loadAiPresetIntoBuilder(preset) {
  state.aiBuilder = deepClone(preset.builderState);
  if (els.aiPresetName) els.aiPresetName.value = preset.name;
  renderAiBuilder();
  appendCommandHistory(`Loaded preset ${preset.name}.`);
}

async function sendSavedAiPreset(presetId) {
  const preset = state.savedAiPresets.find((item) => item.id === presetId);
  if (!preset) return;
  await sendAiState(preset.builderState, `preset: ${preset.name}`);
}

function saveCurrentAiPreset() {
  const name = String(els.aiPresetName?.value || "").trim();
  if (!name) {
    appendCommandHistory("Name the preset before saving.");
    return;
  }
  const existing = state.savedAiPresets.find((item) => item.name.toLowerCase() === name.toLowerCase());
  const preset = {
    id: existing?.id || `ai_${Date.now()}`,
    name,
    builderState: deepClone(state.aiBuilder),
  };
  if (existing) {
    existing.builderState = preset.builderState;
    existing.name = preset.name;
  } else {
    state.savedAiPresets.unshift(preset);
  }
  persistAiPresets();
  renderSavedAiPresets();
  appendCommandHistory(`${existing ? "Updated" : "Saved"} preset ${name}.`);
}

function deleteAiPreset(presetId) {
  const preset = state.savedAiPresets.find((item) => item.id === presetId);
  state.savedAiPresets = state.savedAiPresets.filter((item) => item.id !== presetId);
  persistAiPresets();
  renderSavedAiPresets();
  renderMacroDraft();
  renderSavedMacros();
  if (preset) appendCommandHistory(`Deleted preset ${preset.name}.`);
}

function renderSettings() {
  const names = state.preferences.aromaNames;
  [els.aromaName1, els.aromaName2, els.aromaName3, els.aromaName4, els.aromaName5].forEach((el, index) => {
    if (el) el.value = names[index] || `Aroma ${index + 1}`;
  });
}

function saveSettings() {
  state.preferences = normalizePreferences({
    aromaNames: [els.aromaName1?.value, els.aromaName2?.value, els.aromaName3?.value, els.aromaName4?.value, els.aromaName5?.value],
  });
  persistPreferences();
  renderSettings();
  renderCommands();
  appendCommandHistory("Saved settings.");
}

function resetSettings() {
  state.preferences = createDefaultPreferences();
  persistPreferences();
  renderSettings();
  renderCommands();
  appendCommandHistory("Reset aroma labels.");
}

function addMacroStep(type) {
  state.macroDraft.steps.push(createMacroStep(type));
  renderMacroDraft();
}

function renderMacroDraft() {
  if (els.macroName) els.macroName.value = state.macroDraft.name || "";
  if (!els.macroSteps) return;
  els.macroSteps.innerHTML = "";
  if (!state.macroDraft.steps.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No macro steps yet.";
    els.macroSteps.append(empty);
    return;
  }

  const allCommands = getAllCommands().sort((a, b) => getDisplayLabel(a).localeCompare(getDisplayLabel(b)));
  const fragment = document.createDocumentFragment();
  state.macroDraft.steps.forEach((step, index) => {
    const row = document.createElement("div");
    row.className = "macro-step";

    const typeBadge = document.createElement("div");
    typeBadge.className = "macro-step-type";
    typeBadge.textContent = step.type === "ai_preset" ? "Preset" : step.type === "wait" ? "Wait" : "Command";

    const editor = document.createElement("div");
    editor.className = "macro-step-editor";

    if (step.type === "command") {
      const select = document.createElement("select");
      for (const command of allCommands) {
        const option = document.createElement("option");
        option.value = command.name;
        option.textContent = getDisplayLabel(command);
        if (command.name === step.commandName) option.selected = true;
        select.append(option);
      }
      select.addEventListener("change", (event) => {
        step.commandName = event.target.value;
      });
      editor.append(select);
    } else if (step.type === "wait") {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.step = "1";
      input.value = String(step.seconds || 1);
      input.addEventListener("input", (event) => {
        step.seconds = Math.max(1, Number(event.target.value || 1));
      });
      editor.append(input);
    } else {
      const select = document.createElement("select");
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = state.savedAiPresets.length ? "Choose preset" : "No presets saved";
      select.append(emptyOption);
      for (const preset of state.savedAiPresets) {
        const option = document.createElement("option");
        option.value = preset.id;
        option.textContent = preset.name;
        if (preset.id === step.presetId) option.selected = true;
        select.append(option);
      }
      select.addEventListener("change", (event) => {
        step.presetId = event.target.value;
      });
      editor.append(select);
    }

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      state.macroDraft.steps.splice(index, 1);
      renderMacroDraft();
    });

    row.append(typeBadge, editor, removeBtn);
    fragment.append(row);
  });
  els.macroSteps.append(fragment);
}

function saveMacroDraft() {
  const name = String(els.macroName?.value || state.macroDraft.name || "").trim();
  if (!name) {
    appendCommandHistory("Name the macro before saving.");
    return;
  }
  if (!state.macroDraft.steps.length) {
    appendCommandHistory("Add at least one macro step before saving.");
    return;
  }
  const existing = state.savedMacros.find((item) => item.name.toLowerCase() === name.toLowerCase());
  const macro = { id: existing?.id || `macro_${Date.now()}`, name, steps: deepClone(state.macroDraft.steps) };
  if (existing) {
    existing.name = macro.name;
    existing.steps = macro.steps;
  } else {
    state.savedMacros.unshift(macro);
  }
  persistMacros();
  renderSavedMacros();
  state.macroDraft = createEmptyMacroDraft();
  renderMacroDraft();
  appendCommandHistory(`${existing ? "Updated" : "Saved"} macro ${name}.`);
}

function renderSavedMacros() {
  if (!els.savedMacroList) return;
  els.savedMacroList.innerHTML = "";
  if (!state.savedMacros.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No macros saved yet.";
    els.savedMacroList.append(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const macro of state.savedMacros) {
    const row = document.createElement("div");
    row.className = "saved-item";
    const title = document.createElement("div");
    title.className = "saved-title";
    title.textContent = macro.name;
    const actions = document.createElement("div");
    actions.className = "saved-actions";
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      state.macroDraft = deepClone(macro);
      renderMacroDraft();
      appendCommandHistory(`Loaded macro ${macro.name}.`);
    });
    const runBtn = document.createElement("button");
    runBtn.type = "button";
    runBtn.textContent = "Run";
    runBtn.addEventListener("click", () => runMacro(macro));
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteMacro(macro.id));
    actions.append(editBtn, runBtn, deleteBtn);
    row.append(title, actions);
    fragment.append(row);
  }
  els.savedMacroList.append(fragment);
}

function deleteMacro(macroId) {
  const macro = state.savedMacros.find((item) => item.id === macroId);
  state.savedMacros = state.savedMacros.filter((item) => item.id !== macroId);
  persistMacros();
  renderSavedMacros();
  if (macro) appendCommandHistory(`Deleted macro ${macro.name}.`);
}

async function runMacro(macro) {
  if (!state.connected) {
    appendCommandHistory("Connect to the chair first.");
    return;
  }
  appendCommandHistory(`Running macro ${macro.name}.`);
  const byName = getCommandsByName();
  for (const step of macro.steps) {
    if (step.type === "wait") {
      appendCommandHistory(`Waiting ${step.seconds}s.`);
      await delay(Math.max(1, Number(step.seconds || 1)) * 1000);
      continue;
    }
    if (step.type === "ai_preset") {
      const preset = state.savedAiPresets.find((item) => item.id === step.presetId);
      if (preset) await sendAiState(preset.builderState, `preset: ${preset.name}`);
      continue;
    }
    const command = byName[step.commandName];
    if (command) await sendCommand(command);
  }
}

function buildAiFcdcPacket(builderState) {
  const zoneHex = builderState.zones.map((zone) => encodeAiZoneField(zone)).join("");
  const addonHex = encodeAiAddonBlock(builderState.addons);
  return `FCDC${zoneHex}${addonHex}FA`;
}

function encodeAiZoneField(zone) {
  if (!zone || zone.technique === "off") return "000000";
  const speed = clampNibble(zone.speed);
  const depth = clampNibble(zone.depth);
  const pair = `${toHexNibble(speed)}${toHexNibble(depth)}`;
  switch (zone.technique) {
    case "kneading":
      return `${pair}0000`;
    case "knocking":
      return `00${pair}00`;
    case "shiatsu":
      return `0000${pair}`;
    default:
      return "000000";
  }
}

function encodeAiAddonBlock(addons) {
  const byte1 = (clampNibble(addons.shoulderAir) << 4) | clampNibble(addons.waistAir);
  const byte2 = (clampNibble(addons.legAir) << 4) | clampNibble(addons.fullBodyAir);
  const rollerByte = AI_ROLLER_OPTIONS.find((item) => item.value === addons.rollers)?.byte || "00";
  const heatByte = AI_HEAT_SURFACE_CONFIG.reduce((mask, item) => mask | (addons.heatMask?.[item.key] ? item.bit : 0), 0);
  return `${toHexByte(byte1)}${toHexByte(byte2)}${rollerByte}${toHexByte(heatByte)}`;
}

function clampNibble(value, fallback = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(15, Math.trunc(number)));
}

function toHexNibble(value) {
  return clampNibble(value).toString(16).toUpperCase();
}

async function sendAiState(builderState, historyLabel = "custom preset") {
  if (!state.connected) {
    appendCommandHistory("Connect to the chair first.");
    return;
  }
  if (!state.startupBurstSent) {
    await sendStartupBurst(false);
    await delay(FCDC_COMMAND_DELAY_MS);
  }
  appendCommandHistory(`Sending ${historyLabel}.`);
  await sendHex(buildAiFcdcPacket(builderState), "custom_ai", FCDC_COMMAND_DELAY_MS);
}

async function sendAiBuilderPacket() {
  await sendAiState(state.aiBuilder, "custom preset");
}

function renderConnectHealth() {
  if (!els.connectHealthMount) return;
  els.connectHealthMount.innerHTML = "";
  const commands = state.map?.commands_by_function?.body_scan_and_health || [];
  if (!commands.length) return;

  const group = { label: "Startup Health", category: "body_scan_and_health", style: "actions" };
  const subgroup = document.createElement("div");
  subgroup.className = "subgroup connect-health-group";
  const title = document.createElement("h3");
  title.textContent = "Startup Health";
  const note = document.createElement("p");
  note.className = "muted connect-health-note";
  note.textContent = "Run the scan here, then use Health Recommendation to let the chair choose a massage.";
  const controls = createGroupControlGrid(group, commands);
  subgroup.append(title, note, controls);
  els.connectHealthMount.append(subgroup);
}

function getGroupControlCount(group) {
  if (group?.custom === "manual_air_region") return 5;
  if (group?.custom === "manual_roller_region") return 3;
  if (group?.custom === "manual_roller_level") return 2;
  return getCommandsForGroup(group).length;
}

function renderProgramSection(section) {
  const wrapper = document.createElement("section");
  wrapper.className = "panel section tab-panel";
  wrapper.dataset.tabKey = section.key;

  const heading = document.createElement("div");
  heading.className = "section-header-static";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = section.title;

  const total = section.groups.reduce((sum, group) => sum + getGroupControlCount(group), 0);
  const meta = document.createElement("div");
  meta.className = "summary-meta";
  meta.textContent = `${total} control${total === 1 ? "" : "s"}`;
  heading.append(title, meta);

  const body = document.createElement("div");
  body.className = "section-body";

  const validGroups = section.groups.filter((group) => getCommandsForGroup(group).length);
  const activeKey = validGroups.some((group) => group.category === state.programsSubtab) ? state.programsSubtab : (validGroups[0]?.category || null);
  state.programsSubtab = activeKey;

  const nav = document.createElement("div");
  nav.className = "program-subnav";
  for (const group of validGroups) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "subtab-button";
    button.textContent = group.label;
    if (group.category === activeKey) button.classList.add("is-active");
    button.addEventListener("click", () => {
      state.programsSubtab = group.category;
      renderCommands();
    });
    nav.append(button);
  }
  body.append(nav);

  const activeGroup = validGroups.find((group) => group.category === activeKey) || validGroups[0];
  if (activeGroup) {
    const commands = getCommandsForGroup(activeGroup);
    const groupEl = document.createElement("div");
    groupEl.className = "subgroup";
    const groupTitle = document.createElement("h3");
    groupTitle.textContent = activeGroup.label;
    const grid = createGroupControlGrid(activeGroup, commands);
    groupEl.append(groupTitle, grid);
    body.append(groupEl);
  }

  wrapper.append(heading, body);
  return wrapper;
}

function renderPositionSection(section) {
  const wrapper = document.createElement("section");
  wrapper.className = "panel section tab-panel";
  wrapper.dataset.tabKey = section.key;

  const heading = document.createElement("div");
  heading.className = "section-header-static";
  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = section.title;
  const count = section.groups.reduce((sum, group) => sum + getGroupControlCount(group), 0);
  const meta = document.createElement("div");
  meta.className = "summary-meta";
  meta.textContent = `${count} control${count === 1 ? "" : "s"}`;
  heading.append(title, meta);

  const body = document.createElement("div");
  body.className = "section-body";

  const presetGroup = section.groups.find((group) => group.label === "Presets");
  const motionGroups = section.groups.filter((group) => group.label !== "Presets");

  if (presetGroup) {
    const commands = getCommandsForGroup(presetGroup);
    if (commands.length) {
      const subgroup = document.createElement("div");
      subgroup.className = "subgroup";
      const h3 = document.createElement("h3");
      h3.textContent = "Presets";
      subgroup.append(h3, createGroupControlGrid(presetGroup, commands));
      body.append(subgroup);
    }
  }

  if (motionGroups.length) {
    const subgroup = document.createElement("div");
    subgroup.className = "subgroup position-adjustments-group";
    const h3 = document.createElement("h3");
    h3.textContent = "Adjustments";
    subgroup.append(h3);
    const motionWrap = document.createElement("div");
    motionWrap.className = "position-motion-stack";
    for (const group of motionGroups) {
      const commands = getCommandsForGroup(group);
      if (!commands.length) continue;
      const row = document.createElement("div");
      row.className = "position-motion-row";
      const label = document.createElement("div");
      label.className = "position-motion-label";
      label.textContent = group.label;
      const control = createGroupControlGrid(group, commands);
      control.classList.add("compact-motion-grid");
      row.append(label, control);
      motionWrap.append(row);
    }
    subgroup.append(motionWrap);
    body.append(subgroup);
  }

  wrapper.append(heading, body);
  return wrapper;
}

function renderManualSection(section) {
  const wrapper = document.createElement("section");
  wrapper.className = "panel section tab-panel";
  wrapper.dataset.tabKey = section.key;

  const heading = document.createElement("div");
  heading.className = "section-header-static";
  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = section.title;
  const count = section.groups.reduce((sum, group) => sum + getGroupControlCount(group), 0);
  const meta = document.createElement("div");
  meta.className = "summary-meta";
  meta.textContent = `${count} control${count === 1 ? "" : "s"}`;
  heading.append(title, meta);

  const tabs = [
    { key: "upper", label: "Upper", groups: ["Upper Mode", "Upper Focus", "Upper Track", "Upper 4D"] },
    { key: "lower", label: "Lower", groups: ["Lower Mechanism", "Lower Focus", "Lower Track", "Lower 4D", "Lower Speed"] },
    { key: "air", label: "Air / Rollers", groups: ["Air Region", "Air Pressure", "Roller Region", "Roller Level"] },
  ];
  const active = tabs.some((tab) => tab.key === state.manualSubtab) ? state.manualSubtab : tabs[0].key;
  state.manualSubtab = active;

  const body = document.createElement("div");
  body.className = "section-body";

  const nav = document.createElement("div");
  nav.className = "program-subnav manual-subnav";
  for (const tab of tabs) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "subtab-button";
    button.textContent = tab.label;
    if (tab.key === active) button.classList.add("is-active");
    button.addEventListener("click", () => {
      state.manualSubtab = tab.key;
      renderCommands();
    });
    nav.append(button);
  }
  body.append(nav);

  const activeTab = tabs.find((tab) => tab.key === active) || tabs[0];
  const activeGroups = section.groups.filter((group) => activeTab.groups.includes(group.label));
  for (const group of activeGroups) {
    const commands = getCommandsForGroup(group);
    if (!commands.length) continue;
    const groupEl = document.createElement("div");
    groupEl.className = "subgroup";
    const groupTitle = document.createElement("h3");
    groupTitle.textContent = group.label;
    groupEl.append(groupTitle, createGroupControlGrid(group, commands));
    if (group.label === "Lower Mechanism") {
      const note = document.createElement("p");
      note.className = "muted";
      note.textContent = "All five lower manual mechanisms are now capture-backed from the ManualLower pass.";
      groupEl.append(note);
    }
    body.append(groupEl);
  }

  if (active === "air") {
    const note = document.createElement("p");
    note.className = "muted";
    note.textContent = "Manual roller Foot and Calf families are now wired from capture-backed packets. Manual air Off still needs a dedicated confirmation pass. Future idea: timed cycling across air regions would be a useful macro-style feature.";
    body.append(note);
  }

  wrapper.append(heading, body);
  return wrapper;
}

function renderCommands() {
  if (!els.commandSections) return;
  els.commandSections.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (const section of SECTION_CONFIG) {
    if (section.key === "programs") {
      fragment.append(renderProgramSection(section));
      continue;
    }
    if (section.key === "position") {
      fragment.append(renderPositionSection(section));
      continue;
    }
    if (section.key === "manual") {
      fragment.append(renderManualSection(section));
      continue;
    }

    const wrapper = document.createElement("section");
    wrapper.className = "panel section tab-panel";
    wrapper.dataset.tabKey = section.key;

    const heading = document.createElement("div");
    heading.className = "section-header-static";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = section.title;

    const count = section.groups.reduce((sum, group) => sum + getGroupControlCount(group), 0);
    const meta = document.createElement("div");
    meta.className = "summary-meta";
    meta.textContent = `${count} control${count === 1 ? "" : "s"}`;

    heading.append(title, meta);

    const body = document.createElement("div");
    body.className = "section-body";

    for (const group of section.groups) {
      const commands = getCommandsForGroup(group);
      if (!commands.length && !group.custom) continue;

      const groupEl = document.createElement("div");
      groupEl.className = "subgroup";

      const groupTitle = document.createElement("h3");
      groupTitle.textContent = group.label;

      const grid = createGroupControlGrid(group, commands);

      groupEl.append(groupTitle, grid);
      body.append(groupEl);
    }

    if (!body.children.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "No controls available in this section.";
      body.append(empty);
    }

    wrapper.append(heading, body);
    fragment.append(wrapper);
  }

  els.commandSections.append(fragment);
  updateTabVisibility();
}

const TAB_LABEL_OVERRIDES = {
  session: "Session",
  position: "Position",
  programs: "Programs",
  manual: "Manual",
  massage: "Massage",
  heat: "Heat",
  comfort: "Comfort",
  ai_massage: "AI",
  "custom-ai": "Builder",
  presets: "Presets",
  settings: "Settings",
  logs: "Logs",
  health: "Health",
};

function getTabItems() {
  const items = SECTION_CONFIG.map((section) => ({ key: section.key, label: TAB_LABEL_OVERRIDES[section.key] || section.title }));
  items.push({ key: "custom-ai", label: TAB_LABEL_OVERRIDES["custom-ai"] });
  items.push({ key: "presets", label: TAB_LABEL_OVERRIDES.presets });
  items.push({ key: "settings", label: TAB_LABEL_OVERRIDES.settings });
  items.push({ key: "logs", label: TAB_LABEL_OVERRIDES.logs });
  if (state.healthRequested && state.health && state.health.received) {
    items.push({ key: "health", label: TAB_LABEL_OVERRIDES.health });
  }
  return items;
}

function renderSectionNav() {
  if (!els.sectionNav) return;
  const items = getTabItems();
  if (!items.some((item) => item.key === state.activeTab)) {
    state.activeTab = items[0]?.key || "session";
  }

  els.sectionNav.innerHTML = "";
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-button";
    button.textContent = item.label;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", item.key === state.activeTab ? "true" : "false");
    if (item.key === state.activeTab) button.classList.add("is-active");
    button.addEventListener("click", () => {
      state.activeTab = item.key;
      renderSectionNav();
      updateTabVisibility();
    });
    fragment.append(button);
  }
  els.sectionNav.append(fragment);
}

function updateTabVisibility() {
  const sectionKeys = new Set(SECTION_CONFIG.map((section) => section.key));
  if (els.commandSections) {
    els.commandSections.hidden = !sectionKeys.has(state.activeTab);
  }

  document.querySelectorAll("[data-tab-key]").forEach((node) => {
    const key = node.dataset.tabKey;
    let visible = key === state.activeTab;
    if (key === "health") {
      visible = visible && Boolean(state.healthRequested && state.health && state.health.received);
    }
    node.hidden = !visible;
  });
}

function createCommandButton(command, group = null, overrideLabel = null, selectionKey = null) {
  const node = els.commandButtonTemplate.content.firstElementChild.cloneNode(true);
  const labelEl = node.querySelector(".command-label");
  const metaEl = node.querySelector(".command-meta");
  const baseLabel = overrideLabel || getCommandOptionLabel(command, group);
  const experimental = String(command?.status || "").toLowerCase().includes("experimental");
  const displayLabel = experimental && !/experimental/i.test(baseLabel) ? `${baseLabel} Experimental` : baseLabel;
  labelEl.textContent = displayLabel;
  if (experimental) node.classList.add("experimental-command");
  if (metaEl) metaEl.remove();
  node.title = displayLabel;
  node.dataset.requiresConnection = "true";
  node.dataset.commandName = command.name;
  node.classList.add("label-only");
  if (group?.style === "segmented" || group?.style === "toggle") {
    node.classList.add("segment-button");
    const groupId = selectionKey || getGroupId(group);
    if (state.uiSelections[groupId] === command.name) node.classList.add("is-active");
    node.addEventListener("click", async () => {
      state.uiSelections[groupId] = command.name;
      await sendCommand(command);
      renderCommands();
    });
  } else {
    node.addEventListener("click", () => sendCommand(command));
  }
  return node;
}

function updateControlDisabledState() {
  // Intentionally left empty. Controls stay visible and clickable before connect.
}

function getCommandByName(name) {
  return getCommandsByName()[name] || null;
}

async function toggleConnection() {
  if (state.connected) {
    await disconnectFromChair();
  } else {
    await connectToChair();
  }
}

async function togglePause() {
  const command = getCommandByName(state.paused ? "pause_off" : "pause_on");
  if (command) await sendCommand(command);
}

async function togglePower() {
  const command = getCommandByName(state.poweredOn ? "power_off" : "power_on");
  if (command) await sendCommand(command);
}

function applyCommandStateEffects(command) {
  switch (command?.name) {
    case "power_on":
      state.poweredOn = true;
      state.paused = false;
      break;
    case "power_off":
      state.poweredOn = false;
      state.paused = false;
      break;
    case "pause_on":
      state.paused = true;
      break;
    case "pause_off":
      state.paused = false;
      break;
    default:
      break;
  }
}

async function connectToChair() {
  const deviceInfo = state.map.device;
  try {
    appendCommandHistory("Opening Bluetooth device picker...");
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: deviceInfo.advertised_name_prefix }],
      optionalServices: [deviceInfo.service_uuid],
    });

    state.device = device;
    state.device.addEventListener("gattserverdisconnected", onDisconnected);

    appendCommandHistory(`Selected ${device.name || "Grand Duo"}. Connecting...`);
    state.server = await device.gatt.connect();
    state.service = await state.server.getPrimaryService(deviceInfo.service_uuid);
    state.notifyCharacteristic = await state.service.getCharacteristic(deviceInfo.notify_uuid);
    state.writeCharacteristic = await state.service.getCharacteristic(deviceInfo.write_uuid);

    await state.notifyCharacteristic.startNotifications();
    state.notifyCharacteristic.addEventListener("characteristicvaluechanged", handleNotification);

    state.connected = true;
    state.startupBurstSent = false;
    state.poweredOn = true;
    state.paused = false;
    renderConnectionState();
    updateControlDisabledState();

    appendCommandHistory("Connected.");
    await delay(POST_CONNECT_DELAY_MS);
    await sendStartupBurst(true);
    await delay(POST_STARTUP_SETTLE_MS);
  } catch (error) {
    appendCommandHistory(`Connect failed: ${formatError(error)}`);
    state.connected = false;
    state.poweredOn = false;
    state.paused = false;
    renderConnectionState();
    updateControlDisabledState();
  }
}

async function disconnectFromChair() {
  try {
    if (state.notifyCharacteristic) {
      try { state.notifyCharacteristic.removeEventListener("characteristicvaluechanged", handleNotification); } catch {}
      try { await state.notifyCharacteristic.stopNotifications(); } catch {}
    }
    if (state.device?.gatt?.connected) {
      state.device.gatt.disconnect();
    }
  } finally {
    onDisconnected();
  }
}

function onDisconnected() {
  if (state.device) {
    try { state.device.removeEventListener("gattserverdisconnected", onDisconnected); } catch {}
  }
  state.server = null;
  state.service = null;
  state.notifyCharacteristic = null;
  state.writeCharacteristic = null;
  state.connected = false;
  state.startupBurstSent = false;
  state.poweredOn = false;
  state.paused = false;
  state.lastState = null;
  state.health = null;
  state.healthRequested = false;
  renderConnectionState();
  renderHealthReport();
  updateControlDisabledState();
  appendCommandHistory("Disconnected.");
}

async function sendStartupBurst(force = false) {
  if (!state.connected) {
    appendCommandHistory("Cannot send startup while disconnected.");
    return;
  }
  if (state.startupBurstSent && !force) return;

  appendCommandHistory("Sending startup...");
  const packets = state.map.startup?.session_bootstrap?.packets || [];
  for (const packet of packets) {
    await sendHex(packet, "startup", STARTUP_DELAY_MS);
  }
  state.startupBurstSent = true;
  renderConnectionState();
}

async function sendCommand(command) {
  if (!state.connected) {
    appendCommandHistory("Connect to the chair first.");
    return;
  }
  if (command.requires_startup && !state.startupBurstSent) {
    await sendStartupBurst(false);
    await delay(FCDC_COMMAND_DELAY_MS);
  }

  if (["health_test_screen", "health_test_start", "ai_recommendation"].includes(command.name)) {
    state.healthRequested = true;
    renderHealthReport();
  }
  if (command.name === "health_test_stop") {
    state.healthRequested = false;
    state.health = null;
    renderHealthReport();
  }

  appendCommandHistory(`Sending ${command.label}`);
  if (String(command.status || "").toLowerCase().includes("experimental")) {
    setStatus(`Experimental command: ${command.label}`);
  }
  const delayAfter = command.family === "FCDC" ? FCDC_COMMAND_DELAY_MS : DEFAULT_COMMAND_DELAY_MS;
  for (const packet of command.packets || []) {
    await sendHex(packet, command.label, delayAfter);
  }
  applyCommandStateEffects(command);
  renderConnectionState();
}

async function sendHex(hexString, source = "command", delayAfterMs = 0) {
  if (!state.connected || !state.writeCharacteristic) {
    throw new Error("Not connected.");
  }
  const clean = cleanHex(hexString);
  const payload = hexToBytes(clean);
  appendCommandHistory(`[WRITE] ${clean} (${source})`);
  if (typeof state.writeCharacteristic.writeValueWithoutResponse === "function") {
    await state.writeCharacteristic.writeValueWithoutResponse(payload);
  } else if (typeof state.writeCharacteristic.writeValue === "function") {
    await state.writeCharacteristic.writeValue(payload);
  } else {
    throw new Error("No supported write method on characteristic.");
  }
  if (delayAfterMs > 0) await delay(delayAfterMs);
}

function handleNotification(event) {
  const value = event.target.value;
  const chunk = new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
  for (const byte of chunk) state.frameBuffer.push(byte);
  const frames = extractFrames();
  for (const frame of frames) recordFrame(frame);
}

function extractFrames() {
  const output = [];
  while (state.frameBuffer.length > 0) {
    if (state.frameBuffer.length >= 8 && state.frameBuffer.slice(0, 8).every((value) => value === 0xFF)) {
      output.push(Uint8Array.from(state.frameBuffer.slice(0, 8)));
      state.frameBuffer.splice(0, 8);
      continue;
    }

    if (state.frameBuffer[0] === 0xFA) {
      if (isHealthFramePrefix(state.frameBuffer) && state.frameBuffer.length >= 58) {
        output.push(Uint8Array.from(state.frameBuffer.slice(0, 58)));
        state.frameBuffer.splice(0, 58);
        continue;
      }
      if (state.frameBuffer.length >= 34) {
        output.push(Uint8Array.from(state.frameBuffer.slice(0, 34)));
        state.frameBuffer.splice(0, 34);
        continue;
      }
      break;
    }

    const nextFa = state.frameBuffer.indexOf(0xFA, 1);
    const nextFf = findHeartbeatIndex(state.frameBuffer, 1);
    const candidates = [nextFa, nextFf].filter((index) => index >= 0);
    if (candidates.length) {
      state.frameBuffer.splice(0, Math.min(...candidates));
    } else {
      if (state.frameBuffer.length > 80) {
        state.frameBuffer.splice(0, state.frameBuffer.length - 80);
      }
      break;
    }
  }
  return output;
}

function findHeartbeatIndex(buffer, startIndex) {
  for (let index = startIndex; index <= buffer.length - 4; index += 1) {
    if (buffer[index] === 0xFF && buffer[index + 1] === 0xFF && buffer[index + 2] === 0xFF && buffer[index + 3] === 0xFF) {
      return index;
    }
  }
  return -1;
}

function recordFrame(frame) {
  const bytes = frame instanceof Uint8Array ? frame : Uint8Array.from(frame);
  const hexValue = bytesToHex(bytes);
  let parsedText = "";

  if (bytes.length === 8 && bytes.every((value) => value === 0xFF)) {
    parsedText = "heartbeat";
  } else {
    const health = parseHealthFrame(bytes);
    if (health) {
      state.health = health;
      parsedText = `health ${health.overallStatus} hr=${health.metrics.heartRate.value ?? "--"} spo2=${health.metrics.bloodOxygen.value ?? "--"}`;
    } else {
      const parsed = parseFaFrame(bytes, state.lastState);
      if (parsed) {
        state.lastState = parsed;
        parsedText = summarizeState(parsed);
      }
    }
  }

  state.recentNotifications.unshift({ stamp: new Date(), title: hexValue, body: parsedText });
  state.recentNotifications = state.recentNotifications.slice(0, MAX_LOG_ITEMS);
  renderConnectionState();
  renderHealthReport();
  renderLogs();
  updateTabVisibility();
}

function parseFaFrame(bytes, lastState) {
  if (!(bytes instanceof Uint8Array) || bytes.length !== 34 || bytes[0] !== 0xFA) return null;

  let minutes = null;
  let seconds = null;
  if (bytes.length > 22) {
    const candidateMinutes = bytes[19];
    const candidateSeconds = bytes[22];
    if (candidateMinutes <= 99 && candidateSeconds <= 59) {
      minutes = candidateMinutes;
      seconds = candidateSeconds;
    }
  }
  if (lastState && (minutes === null || seconds === null)) {
    minutes = lastState.timerMinutes;
    seconds = lastState.timerSeconds;
  }

  return {
    rawHex: bytesToHex(bytes),
    timerMinutes: minutes,
    timerSeconds: seconds,
    family: `${toHexByte(bytes[4])}${toHexByte(bytes[5])}`,
    modePrefix: `${toHexByte(bytes[1])}${toHexByte(bytes[2])}${toHexByte(bytes[3])}`,
    capturedAt: Date.now(),
  };
}

function summarizeState(parsed) {
  return `time=${formatTimer(parsed.timerMinutes, parsed.timerSeconds)} family=${parsed.family} mode=${parsed.modePrefix}`;
}

function isHealthFramePrefix(buffer) {
  return Array.isArray(buffer) && buffer.length >= 58 && buffer[0] === 0xFA;
}

function decodeBcd(value) {
  const hi = (value >> 4) & 0x0F;
  const lo = value & 0x0F;
  if (hi > 9 || lo > 9) return null;
  return hi * 10 + lo;
}

function decodeSwappedBcd(value) {
  const hi = (value >> 4) & 0x0F;
  const lo = value & 0x0F;
  if (hi > 9 || lo > 9) return null;
  return lo * 10 + hi;
}

function parseHealthFrame(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length < 58 || bytes[0] !== 0xFA) return null;

  const heartRate = decodeSwappedBcd(bytes[33]);
  const bloodOxygen = decodeBcd(bytes[36]);
  const microcirculation = decodeBcd(bytes[37]) ?? bloodOxygen;
  const fatigue = Number.isFinite(bytes[55]) ? bytes[55] : null;

  const metrics = {
    heartRate: {
      value: heartRate,
      state: heartRate === null ? "--" : heartRate >= 60 && heartRate <= 100 ? "Normal" : "Check",
    },
    bloodOxygen: {
      value: bloodOxygen === null ? null : `${bloodOxygen}%`,
      state: bloodOxygen === null ? "--" : bloodOxygen >= 95 ? "Normal" : "Low",
    },
    microcirculation: {
      value: microcirculation === null ? null : `${microcirculation}%`,
      state: microcirculation === null ? "--" : microcirculation >= 80 && microcirculation <= 100 ? "Normal" : "Check",
    },
    fatigue: {
      value: fatigue,
      state: fatigue === null ? "--" : fatigue <= 80 ? "Normal" : "High",
    },
  };

  const states = Object.values(metrics).map((item) => item.state);
  const overallStatus = states.includes("High") || states.includes("Check") ? "Attention" : states.includes("Low") ? "Low" : "Normal";

  return {
    rawHex: bytesToHex(bytes),
    overallStatus,
    received: true,
    metrics,
    capturedAt: Date.now(),
  };
}

function renderHealthReport() {
  const shouldShow = Boolean(state.healthRequested && state.health && state.health.received);
  if (!shouldShow && state.activeTab === "health") {
    state.activeTab = "session";
  }
  if (els.healthPanel) els.healthPanel.classList.toggle("hidden", !shouldShow);
  renderSectionNav();
  updateTabVisibility();
  if (!shouldShow) return;

  els.healthStatus.textContent = state.health.overallStatus || "--";
  els.heartRateValue.textContent = state.health.metrics.heartRate.value ?? "--";
  els.heartRateState.textContent = state.health.metrics.heartRate.state || "--";
  els.bloodOxygenValue.textContent = state.health.metrics.bloodOxygen.value ?? "--";
  els.bloodOxygenState.textContent = state.health.metrics.bloodOxygen.state || "--";
  els.microValue.textContent = state.health.metrics.microcirculation.value ?? "--";
  els.microState.textContent = state.health.metrics.microcirculation.state || "--";
  els.fatigueValue.textContent = state.health.metrics.fatigue.value ?? "--";
  els.fatigueState.textContent = state.health.metrics.fatigue.state || "--";
}

function renderConnectionState() {
  setFieldText(els.statusField, state.connected ? `Connected to ${state.device?.name || "Grand Duo"}` : "Disconnected");
  setFieldText(els.timerField, formatTimer(state.lastState?.timerMinutes, state.lastState?.timerSeconds));

  if (els.connectBtn) {
    els.connectBtn.textContent = state.connected ? "Disconnect" : "Connect";
    els.connectBtn.classList.toggle("is-active", state.connected);
  }
  if (els.pauseBtn) {
    els.pauseBtn.textContent = state.paused ? "Resume" : "Pause";
    els.pauseBtn.classList.toggle("is-active", state.paused);
  }
  if (els.powerBtn) {
    els.powerBtn.textContent = state.poweredOn ? "Power Off" : "Power On";
    els.powerBtn.classList.toggle("is-active", state.poweredOn);
  }
}

function renderLogs() {
  renderLogList(els.commandHistory, state.commandHistory);
  renderLogList(els.notifyLog, state.recentNotifications);
}

function renderLogList(target, items) {
  if (!target) return;
  target.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Nothing yet.";
    target.append(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const row = document.createElement("div");
    row.className = "log-item";
    const stamp = document.createElement("div");
    stamp.className = "stamp";
    stamp.textContent = item.stamp instanceof Date ? item.stamp.toLocaleTimeString() : "";
    const title = document.createElement("div");
    title.className = "title";
    title.textContent = item.title;
    row.append(stamp, title);
    if (item.body) {
      const body = document.createElement("div");
      body.textContent = item.body;
      row.append(body);
    }
    fragment.append(row);
  }
  target.append(fragment);
}

function appendCommandHistory(message) {
  state.commandHistory.unshift({ stamp: new Date(), title: message, body: "" });
  state.commandHistory = state.commandHistory.slice(0, MAX_LOG_ITEMS);
  renderLogs();
}

function cleanHex(value) {
  const clean = String(value).replace(/[\s:,-]/g, "").toUpperCase();
  if (!clean) throw new Error("Empty hex string.");
  if (clean.length % 2 !== 0) throw new Error("Hex string must have an even number of characters.");
  if (!/^[0-9A-F]+$/.test(clean)) throw new Error("Hex string contains non-hex characters.");
  return clean;
}

function hexToBytes(clean) {
  const out = new Uint8Array(clean.length / 2);
  for (let index = 0; index < clean.length; index += 2) {
    out[index / 2] = parseInt(clean.slice(index, index + 2), 16);
  }
  return out;
}

function bytesToHex(bytes) {
  return Array.from(bytes, toHexByte).join("");
}

function toHexByte(value) {
  return value.toString(16).padStart(2, "0").toUpperCase();
}

function setFieldText(element, text) {
  if (!element) return;
  if ("value" in element) {
    element.value = text;
  } else {
    element.textContent = text;
  }
}

function setStatus(text) {
  setFieldText(els.statusField, text);
}

function formatTimer(minutes, seconds) {
  if (minutes === null || minutes === undefined || seconds === null || seconds === undefined) {
    return "--:--";
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatError(error) {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  return error.message || String(error);
}
