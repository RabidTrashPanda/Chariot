# Grand Duo Bluefy Web App

This is a **static single-page web app** built from your April 12, 2026 Grand Duo controller bundle.

It is designed for the path you described:

- browser-based BLE control
- no bundler required
- host over HTTPS
- open it in **Bluefy** on iPhone
- reuse the cleaned command map instead of hardcoding a giant mess of packets

## Included app files

- `index.html` — main SPA shell
- `styles.css` — responsive tablet/phone layout
- `app.js` — Web Bluetooth transport, startup burst, FA parser, command UI
- `command-map.js` — your Grand Duo command map embedded as a JS module

## What this version does

- Connects to a `Grand Duo-*` BLE device through Web Bluetooth
- Uses:
  - service: `0000FFF0-0000-1000-8000-00805F9B34FB`
  - notify: `0734594A-A8E7-4B1A-A6B1-CD5243059A57`
  - write: `0000FFF1-0000-1000-8000-00805F9B34FB`
- Auto-sends the known startup burst after connect
- Renders the cleaned command groups as touch-friendly buttons
- Parses full 34-byte `FA` frames
- Shows:
  - connection status
  - timer decode
  - state family
  - mode prefix
  - recent notifications
  - command history
- Supports raw hex sends
- Hides `legs_down` by default, but allows experimental commands to be shown

## Why this is the right first web version

I kept it as a **plain static app** instead of React/Vite so you can:

- drop it onto GitHub Pages / Netlify / Cloudflare Pages
- open it immediately in Bluefy
- avoid dealing with a build pipeline before the BLE path is proven on iPhone

That keeps the first deployment focused on whether the chair behavior matches your command map.

## How to run it in Bluefy

### Option 1: GitHub Pages
1. Create a new GitHub repo.
2. Upload these app files.
3. Enable GitHub Pages for the repo.
4. Open the resulting HTTPS URL in Bluefy on iPhone.
5. Tap **Connect**.
6. Choose your `Grand Duo-*` chair.
7. The app will auto-run the startup burst, then commands should be live.

### Option 2: Netlify / Cloudflare Pages
1. Upload this folder as a static site.
2. Use the generated HTTPS URL.
3. Open that URL in Bluefy.

## Important operating notes

- This must be served over **HTTPS** for Web Bluetooth.
- Safari on iPhone does not expose Web Bluetooth, so use **Bluefy**.
- `requestDevice()` must be triggered from a user gesture, which is why connection starts from the **Connect** button.
- Backgrounding the browser may disconnect the BLE session.

## Iteration plan

### Iteration 1 — working web controller
This build is Iteration 1.

Goal:
- prove the BLE transport path on Bluefy
- verify startup burst + known commands + state feed
- get a usable tablet/phone UI running quickly

Included:
- command sections
- logs
- raw hex panel
- FA parser
- hidden command fence

### Iteration 2 — state-aware operator UI
Next pass should add:

- favorites / pinned commands
- better chair-state decoding beyond timer/family/mode
- per-command badges like confirmed / tentative / composite
- state diffs between FA frames
- safer packet throttling / queueing
- AI command explanation drawer showing the exact FCDC packets being sent
- import / export of local presets

### Iteration 3 — real “productized” controller
After Bluefy validation, the best long-term step is:

- wrap the same UI in a native shell
- keep the command model
- swap the BLE transport layer

Best likely paths:
- **Capacitor** for a thin native shell with a web UI
- **.NET MAUI Blazor Hybrid** if you want to stay in the MAUI direction you mentioned earlier

That removes the Bluefy dependency while preserving most of the UI and command-layer logic.

## Architecture notes

The app is intentionally structured so the BLE pieces can be swapped later:

- `connectToChair()` / `disconnectFromChair()` — transport entry points
- `sendHex()` — single write primitive
- `sendStartupBurst()` — session bootstrap
- `sendCommand()` — command sequencing
- `extractFrames()` — notification reassembly
- `parseFaFrame()` — current state parser
- `renderCommands()` — UI from command-map metadata

That means the later migration path is straightforward:

1. keep the command map
2. keep the UI sections and rendering logic
3. replace the Web Bluetooth transport with native BLE

## Known limits in this first version

- Only the current working `FA` timer/family/mode decode is implemented
- No full AI custom payload editor yet
- No persistent local presets
- No reconnect workflow beyond manual reconnect
- No foot in / foot out editor because those commands were intentionally not promoted in your cleaned bundle

## Recommended next pass

The next best upgrade is not a framework rewrite. It is:

1. add a **packet queue + pacing guard**
2. add an **AI editor** for the `FCDC` family
3. add **favorites + macros**
4. then decide whether to keep Bluefy or wrap the same UI in MAUI / Capacitor
