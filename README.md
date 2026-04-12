# Chariot

Chariot is an alternative web interface for controlling an Osaki Grand Duo massage chair over Web Bluetooth.

It is a static web app. There is no backend.

## What it does

The app can:
- connect to a nearby Grand Duo chair
- start chair sessions and change the session time
- run the known massage programs
- control chair position and movement
- use manual upper and lower mechanism controls
- adjust 4D, speed, rollers, airbags, heat, and comfort settings
- run the health scan flow and trigger Health Recommendation

## Current status

Most core chair controls are working.

A few areas are still experimental:
- Air Pressure Off
- parts of the AI heat surface mask
- deeper live telemetry decoding from `FA` state frames

Those experimental items are exposed in the UI as experimental on purpose.

## Files in this repo

- `index.html` — app shell
- `styles.css` — UI styling
- `app.js` — app logic, BLE handling, rendering, and controls
- `grandduo_command_map.json` — command map and packet definitions
- `README.md` — this file
- `SNIFF_TODO.md` — remaining packet-capture work

## How to run it

Because this app uses Web Bluetooth and fetches the command map JSON at runtime, do not open it directly with `file://`.

Use one of these instead:
- serve it locally from `localhost`
- host it on an HTTPS site such as GitHub Pages

Then:
1. open the site in a Web Bluetooth capable browser
2. power on the chair
3. connect to a nearby `Grand Duo-*` device

## How to change chair commands

Edit `grandduo_command_map.json`.

That file is the command source of truth for the app. If a capture confirms a new packet or corrects an old one, update the JSON and then update the UI code in `app.js` if needed.

## Heat model

The app treats heat as a chair-wide control that can be adjusted during a massage.

The current heat surfaces are:
- roller
- shawl
- calf
- foot

Heat levels are exposed as stages from 0 through 3.

## Health workflow

Health Recommendation is treated as a trigger, not as a fixed hidden program name.

The intended flow is:
1. run a health scan
2. review the results
3. trigger Health Recommendation
4. let the chair choose a massage based on that scan

## What still needs work

The biggest remaining gaps are:
- confirming a real air-off packet if one exists
- tightening the AI heat mask behavior
- decoding more live state from `FA` telemetry

The detailed capture backlog is in `SNIFF_TODO.md`.
