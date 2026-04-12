import { COMMAND_MAP } from "./command-map.js";

const STARTUP_DELAY_MS = 80;
const DEFAULT_COMMAND_DELAY_MS = 120;
const FCDC_COMMAND_DELAY_MS = 200;
const POST_CONNECT_DELAY_MS = 250;
const POST_STARTUP_SETTLE_MS = 400;
const MAX_LOG_ITEMS = 60;
const LAST_DEVICE_ID_KEY = "grandduo.lastDeviceId";
const LAST_DEVICE_NAME_KEY = "grandduo.lastDeviceName";

const TABS = [
  { id: "session", label: "Session" },
  { id: "position", label: "Position" },
  { id: "programs", label: "Programs" },
  { id: "massage", label: "Massage" },
  { id: "heat", label: "Heat" },
  { id: "comfort", label: "Comfort" },
  { id: "ai", label: "AI" },
];

const SCREENS = {
  session: [
    { title: "Power", names: ["power_on", "power_off"] },
    { title: "Pause", names: ["pause_on", "pause_off"] },
    { title: "Time", names: ["minus_10_minutes", "plus_10_minutes"] },
  ],
  position: [
    { title: "Position", names: ["zero_gravity", "relaxation", "sleep", "reset_position", "restore_on", "restore_off", "legs_up"] },
  ],
  programs: [
    { title: "Programs", category: "wellness_programs" },
    { title: "Scan", category: "body_scan_and_health" },
  ],
  massage: [
    { title: "Massage Modes", category: "massage_modes" },
    { title: "Air Pressure", category: "air_pressure" },
    { title: "Rollers", category: "rollers_non_ai" },
    { title: "Upper 4D", category: "upper_4d_strength" },
    { title: "Lower 4D", category: "lower_4d_strength" },
  ],
  heat: [
    { title: "Roller Heat", names: ["roller_heat_0", "roller_heat_1", "roller_heat_2", "roller_heat_3"] },
    { title: "Calf Heat", names: ["calf_heat_0", "calf_heat_1", "calf_heat_2", "calf_heat_3"] },
    { title: "Shawl Heat", names: ["shawl_heat_0", "shawl_heat_1", "shawl_heat_2", "shawl_heat_3"] },
    { title: "Foot Heat", names: ["foot_heat_0", "foot_heat_1", "foot_heat_2", "foot_heat_3"] },
  ],
  comfort: [
    { title: "LED Light", names: ["light_therapy_mode_1", "light_therapy_mode_2", "light_therapy_mode_3", "light_therapy_mode_4", "light_therapy_mode_5", "light_therapy_off"] },
    { title: "Anion", names: ["anion_on", "anion_off"] },
    { title: "Aroma", names: ["aroma_off", "aroma_1", "aroma_2", "aroma_3", "aroma_4", "aroma_5"] },
  ],
};

const AI_PRESETS = {
  mixed: {
    label: "Mixed",
    state: createAiState({
      zones: [
        { technique: "knocking", speed: 1, depth: 5 },
        { technique: "knocking", speed: 3, depth: 3 },
        { technique: "knocking", speed: 5, depth: 1 },
        { technique: "knocking", speed: 2, depth: 4 },
      ],
    }),
  },
  allKneading: {
    label: "All Kneading",
    state: createAiState({ zones: Array.from({ length: 4 }, () => ({ technique: "kneading", speed: 3, depth: 3 })) }),
  },
  allKnocking: {
    label: "All Knocking",
    state: createAiState({ zones: Array.from({ length: 4 }, () => ({ technique: "knocking", speed: 3, depth: 3 })) }),
  },
  allShiatsu: {
    label: "All Shiatsu",
    state: createAiState({ zones: Array.from({ length: 4 }, () => ({ technique: "shiatsu", speed: 3, depth: 3 })) }),
  },
  mixedHeat: {
    label: "Mixed + Heat",
    state: createAiState({
      zones: [
        { technique: "knocking", speed: 1, depth: 5 },
        { technique: "knocking", speed: 3, depth: 3 },
        { technique: "knocking", speed: 5, depth: 1 },
        { technique: "knocking", speed: 2, depth: 4 },
      ],
      heat: true,
    }),
  },
  mixedFullAir: {
    label: "Mixed + Full Air",
    state: createAiState({
      zones: [
        { technique: "knocking", speed: 1, depth: 5 },
        { technique: "knocking", speed: 3, depth: 3 },
        { technique: "knocking", speed: 5, depth: 1 },
        { technique: "knocking", speed: 2, depth: 4 },
      ],
      fullBodyAir: 5,
    }),
  },
  mixedFootRollers: {
    label: "Mixed + Foot Rollers",
    state: createAiState({
      zones: [
        { technique: "knocking", speed: 1, depth: 5 },
        { technique: "knocking", speed: 3, depth: 3 },
        { technique: "knocking", speed: 5, depth: 1 },
        { technique: "knocking", speed: 2, depth: 4 },
      ],
      rollers: "foot1",
    }),
  },
  mixedCalfRollers: {
    label: "Mixed + Calf Rollers",
    state: createAiState({
      zones: [
        { technique: "knocking", speed: 1, depth: 5 },
        { technique: "knocking", speed: 3, depth: 3 },
        { technique: "knocking", speed: 5, depth: 1 },
        { technique: "knocking", speed: 2, depth: 4 },
      ],
      rollers: "calf1",
    }),
  },
};

const state = {
  map: COMMAND_MAP,
  device: null,
  server: null,
  service: null,
  notifyCharacteristic: null,
  writeCharacteristic: null,
  connected: false,
  startupBurstSent: false,
  lastState: null,
  frameBuffer: [],
  logs: [],
  activeTab: "session",
  aiState: structuredClone(AI_PRESETS.mixed.state),
};

const els = {
  connectBtn: document.getElementById("connectBtn"),
  disconnectBtn: document.getElementById("disconnectBtn"),
  startupBtn: document.getElementById("startupBtn"),
  statusField: document.getElementById("statusField"),
  timerField: document.getElementById("timerField"),
  tabBar: document.getElementById("tabBar"),
  screens: document.getElementById("screens"),
  activityLog: document.getElementById("activityLog"),
  deviceDialog: document.getElementById("deviceDialog"),
  deviceChoices: document.getElementById("deviceChoices"),
  commandButtonTemplate: document.getElementById("commandButtonTemplate"),
};

bootstrap();

function bootstrap() {
  els.connectBtn.addEventListener("click", connectToChair);
  els.disconnectBtn.addEventListener("click", disconnectFromChair);
  els.startupBtn.addEventListener("click", () => sendStartupBurst(true));
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
  if (!navigator.bluetooth) {
    addLog("Web Bluetooth is not available in this browser.");
  }
  renderTabs();
  renderScreen();
  renderConnectionState();
  renderLog();
}

function renderTabs() {
  els.tabBar.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (const tab of TABS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `tab-button${state.activeTab === tab.id ? " active" : ""}`;
    button.textContent = tab.label;
    button.addEventListener("click", () => {
      state.activeTab = tab.id;
      renderTabs();
      renderScreen();
    });
    frag.append(button);
  }
  els.tabBar.append(frag);
}

function renderScreen() {
  els.screens.innerHTML = "";
  if (state.activeTab === "ai") {
    els.screens.append(renderAiScreen());
    return;
  }

  const groups = SCREENS[state.activeTab] || [];
  const frag = document.createDocumentFragment();
  for (const group of groups) {
    const commands = getCommandsForGroup(group);
    const panel = document.createElement("section");
    panel.className = "panel screen-panel";

    const title = document.createElement("h2");
    title.textContent = group.title;
    panel.append(title);

    const grid = document.createElement("div");
    grid.className = "button-grid";
    for (const command of commands) {
      grid.append(createCommandButton(command));
    }
    panel.append(grid);
    frag.append(panel);
  }
  els.screens.append(frag);
}

function renderAiScreen() {
  const wrapper = document.createElement("div");
  wrapper.className = "ai-layout";

  const presetPanel = document.createElement("section");
  presetPanel.className = "panel screen-panel";
  const presetTitle = document.createElement("h2");
  presetTitle.textContent = "AI Presets";
  presetPanel.append(presetTitle);
  const presetGrid = document.createElement("div");
  presetGrid.className = "button-grid";
  for (const [key, preset] of Object.entries(AI_PRESETS)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "command-button";
    button.textContent = preset.label;
    button.disabled = !state.connected;
    button.addEventListener("click", async () => {
      state.aiState = structuredClone(preset.state);
      renderScreen();
      await sendAiState(preset.label);
    });
    presetGrid.append(button);
  }
  presetPanel.append(presetGrid);

  const builderPanel = document.createElement("section");
  builderPanel.className = "panel screen-panel";
  const builderTitle = document.createElement("h2");
  builderTitle.textContent = "Custom AI";
  builderPanel.append(builderTitle);

  const zones = ["Upper", "Mid Upper", "Mid Lower", "Lower"];
  const zoneGrid = document.createElement("div");
  zoneGrid.className = "ai-zone-grid";
  state.aiState.zones.forEach((zone, index) => {
    const card = document.createElement("div");
    card.className = "ai-zone-card";

    const zoneTitle = document.createElement("h3");
    zoneTitle.textContent = zones[index];
    card.append(zoneTitle);

    card.append(createSelectField("Technique", [
      ["off", "Off"],
      ["kneading", "Kneading"],
      ["knocking", "Knocking"],
      ["shiatsu", "Shiatsu"],
    ], zone.technique, (value) => {
      zone.technique = value;
    }));

    card.append(createSelectField("Speed", [1,2,3,4,5].map((n) => [String(n), String(n)]), String(zone.speed), (value) => {
      zone.speed = Number(value);
    }));

    card.append(createSelectField("4D", [1,2,3,4,5].map((n) => [String(n), String(n)]), String(zone.depth), (value) => {
      zone.depth = Number(value);
    }));

    zoneGrid.append(card);
  });
  builderPanel.append(zoneGrid);

  const addonGrid = document.createElement("div");
  addonGrid.className = "ai-addon-grid";
  addonGrid.append(createSelectField("Shoulder Air", levelOptions(), String(state.aiState.shoulderAir), (value) => {
    state.aiState.shoulderAir = Number(value);
  }));
  addonGrid.append(createSelectField("Waist Air", levelOptions(), String(state.aiState.waistAir), (value) => {
    state.aiState.waistAir = Number(value);
  }));
  addonGrid.append(createSelectField("Leg/Foot Air", levelOptions(), String(state.aiState.legFootAir), (value) => {
    state.aiState.legFootAir = Number(value);
  }));
  addonGrid.append(createSelectField("Full Body Air", levelOptions(), String(state.aiState.fullBodyAir), (value) => {
    state.aiState.fullBodyAir = Number(value);
  }));
  addonGrid.append(createSelectField("Rollers", [
    ["off", "Off"],
    ["foot1", "Foot 1"],
    ["foot2", "Foot 2"],
    ["calf1", "Calf 1"],
    ["calf2", "Calf 2"],
  ], state.aiState.rollers, (value) => {
    state.aiState.rollers = value;
  }));

  const heatField = document.createElement("label");
  heatField.className = "select-field checkbox-field";
  const heatSpan = document.createElement("span");
  heatSpan.textContent = "Heat";
  const heatInput = document.createElement("input");
  heatInput.type = "checkbox";
  heatInput.checked = state.aiState.heat;
  heatInput.addEventListener("change", () => {
    state.aiState.heat = heatInput.checked;
  });
  heatField.append(heatSpan, heatInput);
  addonGrid.append(heatField);
  builderPanel.append(addonGrid);

  const actions = document.createElement("div");
  actions.className = "ai-actions";
  const sendButton = document.createElement("button");
  sendButton.type = "button";
  sendButton.className = "primary";
  sendButton.textContent = "Send AI";
  sendButton.disabled = !state.connected;
  sendButton.addEventListener("click", () => sendAiState("Custom AI"));

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "Reset to Mixed";
  resetButton.addEventListener("click", () => {
    state.aiState = structuredClone(AI_PRESETS.mixed.state);
    renderScreen();
  });
  actions.append(sendButton, resetButton);
  builderPanel.append(actions);

  wrapper.append(presetPanel, builderPanel);
  return wrapper;
}

function createSelectField(label, options, value, onChange) {
  const field = document.createElement("label");
  field.className = "select-field";
  const span = document.createElement("span");
  span.textContent = label;
  const select = document.createElement("select");
  for (const [optionValue, optionLabel] of options) {
    const option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionLabel;
    if (optionValue === value) {
      option.selected = true;
    }
    select.append(option);
  }
  select.addEventListener("change", () => onChange(select.value));
  field.append(span, select);
  return field;
}

function levelOptions() {
  return [0,1,2,3,4,5].map((n) => [String(n), String(n)]);
}

function getCommandsByName() {
  const byName = {};
  for (const commands of Object.values(state.map.commands_by_function)) {
    for (const command of commands) {
      byName[command.name] = command;
    }
  }
  return byName;
}

function getCommandsForGroup(group) {
  const byName = getCommandsByName();
  if (group.category) {
    return [...(state.map.commands_by_function[group.category] || [])];
  }
  if (group.names) {
    return group.names.map((name) => byName[name]).filter(Boolean);
  }
  return [];
}

function createCommandButton(command) {
  const node = els.commandButtonTemplate.content.firstElementChild.cloneNode(true);
  node.textContent = command.label;
  node.disabled = !state.connected;
  node.addEventListener("click", () => sendCommand(command));
  return node;
}

async function connectToChair() {
  if (!navigator.bluetooth) {
    addLog("Web Bluetooth is not available here.");
    return;
  }

  const deviceInfo = state.map.device;
  try {
    let device = await pickKnownApprovedDevice();
    if (!device) {
      device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: deviceInfo.advertised_name_prefix }],
        optionalServices: [deviceInfo.service_uuid],
      });
    }
    await connectDevice(device);
  } catch (error) {
    if (error?.name === "NotFoundError") {
      addLog("No chair selected.");
      return;
    }
    addLog(`Connect failed: ${formatError(error)}`);
    console.error(error);
    onDisconnected(false);
  }
}

async function pickKnownApprovedDevice() {
  if (typeof navigator.bluetooth.getDevices !== "function") {
    return null;
  }
  const prefix = state.map.device.advertised_name_prefix || "Grand Duo-";
  const rememberedId = localStorage.getItem(LAST_DEVICE_ID_KEY);
  const devices = (await navigator.bluetooth.getDevices())
    .filter((device) => (device.name || "").startsWith(prefix));

  if (!devices.length) {
    return null;
  }
  if (devices.length === 1) {
    return devices[0];
  }
  const remembered = rememberedId ? devices.find((device) => device.id === rememberedId) : null;
  if (remembered) {
    return remembered;
  }
  return chooseApprovedDevice(devices);
}

function chooseApprovedDevice(devices) {
  return new Promise((resolve, reject) => {
    els.deviceChoices.innerHTML = "";
    for (const device of devices) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "device-choice";
      button.textContent = device.name || "Grand Duo";
      button.addEventListener("click", () => {
        els.deviceDialog.close("selected");
        resolve(device);
      });
      els.deviceChoices.append(button);
    }

    const onClose = () => {
      els.deviceDialog.removeEventListener("close", onClose);
      if (els.deviceDialog.returnValue !== "selected") {
        reject(new DOMException("User cancelled device selection", "NotFoundError"));
      }
    };

    els.deviceDialog.addEventListener("close", onClose);
    els.deviceDialog.showModal();
  });
}

async function connectDevice(device) {
  const deviceInfo = state.map.device;
  state.device = device;
  state.device.addEventListener("gattserverdisconnected", onDisconnected);

  addLog(`Connecting to ${device.name || "Grand Duo"}...`);
  state.server = await device.gatt.connect();
  state.service = await state.server.getPrimaryService(deviceInfo.service_uuid);
  state.notifyCharacteristic = await state.service.getCharacteristic(deviceInfo.notify_uuid);
  state.writeCharacteristic = await state.service.getCharacteristic(deviceInfo.write_uuid);

  await state.notifyCharacteristic.startNotifications();
  state.notifyCharacteristic.addEventListener("characteristicvaluechanged", handleNotification);

  state.connected = true;
  state.startupBurstSent = false;
  rememberDevice(device);
  renderConnectionState();
  renderScreen();

  await delay(POST_CONNECT_DELAY_MS);
  await sendStartupBurst(true);
  await delay(POST_STARTUP_SETTLE_MS);
  addLog(`Connected to ${device.name || "Grand Duo"}.`);
}

function rememberDevice(device) {
  try {
    if (device.id) {
      localStorage.setItem(LAST_DEVICE_ID_KEY, device.id);
    }
    localStorage.setItem(LAST_DEVICE_NAME_KEY, device.name || "Grand Duo");
  } catch {}
}

async function disconnectFromChair() {
  try {
    if (state.notifyCharacteristic) {
      try {
        state.notifyCharacteristic.removeEventListener("characteristicvaluechanged", handleNotification);
      } catch {}
      try {
        await state.notifyCharacteristic.stopNotifications();
      } catch {}
    }
    if (state.device?.gatt?.connected) {
      state.device.gatt.disconnect();
    }
  } finally {
    onDisconnected();
  }
}

function onDisconnected(logIt = true) {
  if (state.device) {
    try {
      state.device.removeEventListener("gattserverdisconnected", onDisconnected);
    } catch {}
  }
  state.server = null;
  state.service = null;
  state.notifyCharacteristic = null;
  state.writeCharacteristic = null;
  state.connected = false;
  state.startupBurstSent = false;
  renderConnectionState();
  renderScreen();
  if (logIt) {
    addLog("Disconnected.");
  }
}

async function sendStartupBurst(force = false) {
  if (!state.connected) {
    addLog("Connect first.");
    return;
  }
  if (state.startupBurstSent && !force) {
    return;
  }
  const packets = state.map.startup?.session_bootstrap?.packets || [];
  addLog("Sending startup.");
  for (const packet of packets) {
    await writeHex(packet, STARTUP_DELAY_MS);
  }
  state.startupBurstSent = true;
}

async function sendCommand(command) {
  if (!state.connected) {
    addLog("Connect first.");
    return;
  }
  if (command.requires_startup && !state.startupBurstSent) {
    await sendStartupBurst(false);
    await delay(FCDC_COMMAND_DELAY_MS);
  }
  addLog(command.label);
  const delayAfter = command.family === "FCDC" ? FCDC_COMMAND_DELAY_MS : DEFAULT_COMMAND_DELAY_MS;
  for (const packet of command.packets || []) {
    await writeHex(packet, delayAfter);
  }
}

async function sendAiState(label) {
  if (!state.connected) {
    addLog("Connect first.");
    return;
  }
  if (!state.startupBurstSent) {
    await sendStartupBurst(false);
    await delay(FCDC_COMMAND_DELAY_MS);
  }
  addLog(label);
  await writeHex(buildAiPacket(state.aiState), FCDC_COMMAND_DELAY_MS);
}

async function writeHex(hexString, delayAfterMs = 0) {
  if (!state.connected || !state.writeCharacteristic) {
    throw new Error("Not connected.");
  }
  const payload = hexToBytes(cleanHex(hexString));
  if (typeof state.writeCharacteristic.writeValueWithoutResponse === "function") {
    await state.writeCharacteristic.writeValueWithoutResponse(payload);
  } else if (typeof state.writeCharacteristic.writeValue === "function") {
    await state.writeCharacteristic.writeValue(payload);
  } else {
    throw new Error("No supported write method.");
  }
  if (delayAfterMs > 0) {
    await delay(delayAfterMs);
  }
}

function handleNotification(event) {
  const value = event.target.value;
  const chunk = new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
  for (const byte of chunk) {
    state.frameBuffer.push(byte);
  }
  const frames = extractFrames();
  for (const frame of frames) {
    recordFrame(frame);
  }
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
      if (state.frameBuffer.length > 40) {
        state.frameBuffer.splice(0, state.frameBuffer.length - 40);
      }
      break;
    }
  }
  return output;
}

function findHeartbeatIndex(buffer, startIndex) {
  for (let index = startIndex; index <= buffer.length - 8; index += 1) {
    if (buffer.slice(index, index + 8).every((value) => value === 0xFF)) {
      return index;
    }
  }
  return -1;
}

function recordFrame(frame) {
  const hex = bytesToHex(frame);
  if (hex === "FFFFFFFFFFFFFFFF") {
    return;
  }
  if (frame[0] === 0xFA) {
    const parsed = parseFaFrame(frame, state.lastState);
    if (parsed) {
      state.lastState = parsed;
      renderConnectionState();
    }
  }
}

function parseFaFrame(bytes, lastState) {
  if (!(bytes instanceof Uint8Array) || bytes.length < 23 || bytes[0] !== 0xFA) {
    return null;
  }
  let minutes = bytes[19];
  let seconds = bytes[22];
  if (minutes > 59) {
    minutes = null;
  }
  if (seconds > 59) {
    seconds = null;
  }
  if (lastState && (minutes === null || seconds === null)) {
    minutes = lastState.timerMinutes;
    seconds = lastState.timerSeconds;
  }
  return {
    timerMinutes: minutes,
    timerSeconds: seconds,
  };
}

function renderConnectionState() {
  const fallbackName = safeLocalStorageGet(LAST_DEVICE_NAME_KEY) || "Grand Duo";
  const deviceName = state.device?.name || (state.connected ? fallbackName : "Grand Duo");
  els.statusField.value = state.connected ? `Connected to ${deviceName}` : "Disconnected";
  els.timerField.value = formatTimer(state.lastState?.timerMinutes, state.lastState?.timerSeconds);
  els.connectBtn.disabled = state.connected;
  els.disconnectBtn.disabled = !state.connected;
  els.startupBtn.disabled = !state.connected;
}

function addLog(message) {
  state.logs.unshift(`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}  ${message}`);
  state.logs = state.logs.slice(0, MAX_LOG_ITEMS);
  renderLog();
}

function renderLog() {
  els.activityLog.innerHTML = "";
  const frag = document.createDocumentFragment();
  for (const line of state.logs) {
    const item = document.createElement("div");
    item.className = "log-line";
    item.textContent = line;
    frag.append(item);
  }
  els.activityLog.append(frag);
}

function buildAiPacket(aiState) {
  const zoneHex = aiState.zones.map(encodeAiZone).join("");
  const byte0 = ((clampNibble(aiState.shoulderAir) << 4) | clampNibble(aiState.waistAir)).toString(16).padStart(2, "0");
  const byte1 = ((clampNibble(aiState.legFootAir) << 4) | clampNibble(aiState.fullBodyAir)).toString(16).padStart(2, "0");
  const byte2 = encodeRollers(aiState.rollers);
  const byte3 = aiState.heat ? "4B" : "00";
  return `FCDC${zoneHex}${byte0}${byte1}${byte2}${byte3}FA`.toUpperCase();
}

function encodeAiZone(zone) {
  const value = ((clampLevel(zone.speed) << 4) | clampLevel(zone.depth)).toString(16).padStart(2, "0").toUpperCase();
  switch (zone.technique) {
    case "kneading":
      return `${value}0000`;
    case "knocking":
      return `00${value}00`;
    case "shiatsu":
      return `0000${value}`;
    default:
      return "000000";
  }
}

function encodeRollers(value) {
  switch (value) {
    case "foot1":
      return "10";
    case "foot2":
      return "20";
    case "calf1":
      return "21";
    case "calf2":
      return "22";
    default:
      return "00";
  }
}

function createAiState(overrides = {}) {
  return {
    zones: overrides.zones ? overrides.zones.map((zone) => ({ ...zone })) : [
      { technique: "knocking", speed: 1, depth: 5 },
      { technique: "knocking", speed: 3, depth: 3 },
      { technique: "knocking", speed: 5, depth: 1 },
      { technique: "knocking", speed: 2, depth: 4 },
    ],
    shoulderAir: overrides.shoulderAir ?? 0,
    waistAir: overrides.waistAir ?? 0,
    legFootAir: overrides.legFootAir ?? 0,
    fullBodyAir: overrides.fullBodyAir ?? 0,
    rollers: overrides.rollers ?? "off",
    heat: overrides.heat ?? false,
  };
}

function clampNibble(value) {
  const num = Number(value);
  return Number.isFinite(num) ? Math.max(0, Math.min(15, num)) : 0;
}

function clampLevel(value) {
  const num = Number(value);
  return Number.isFinite(num) ? Math.max(1, Math.min(15, num)) : 1;
}

function cleanHex(value) {
  return value.replace(/[^0-9a-f]/gi, "").toUpperCase();
}

function hexToBytes(hexString) {
  if (!hexString || hexString.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters.");
  }
  const bytes = new Uint8Array(hexString.length / 2);
  for (let index = 0; index < hexString.length; index += 2) {
    bytes[index / 2] = Number.parseInt(hexString.slice(index, index + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function formatTimer(minutes, seconds) {
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
    return "--:--";
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function safeLocalStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function formatError(error) {
  if (!error) {
    return "Unknown error";
  }
  return error.message || error.name || String(error);
}
