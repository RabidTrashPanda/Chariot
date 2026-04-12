# SNIFF TODO

This is the remaining capture backlog for Chariot.

## 1. Validate Air Pressure Off
Highest-value experimental gap.

Goal:
- prove whether the universal air family really has a `0 = Off` packet
- validate or kill the current experimental candidate

Current candidate:
- `F100006F6F`

Clean capture:
1. start any massage
2. raise air pressure above zero
3. trigger the experimental Air Pressure Off control in Chariot
4. wait long enough to see whether airbags actually stop
5. repeat once

## 2. Tighten AI heat mask behavior
The AI builder now exposes experimental heat-surface toggles.

Goal:
- fully lock the heat mask byte
- confirm the roller bit cleanly in isolation
- make sure mixed heat-surface combinations do not depend on some hidden tablet UI state

Best cases:
- all off
- roller only
- shawl only
- calf only
- foot only
- all on
- one or two mixed combinations

Keep the AI technique, air, rollers, speed, and 4D fixed during this pass.

## 3. Telemetry / state feedback
Command coverage is now much better than feedback coverage.

Goal:
- decode enough `FA` state bytes to support real position/status UI instead of time-based estimates

Best targets:
- lower position movement with idle baselines
- upper track movement with idle baselines
- air region changes with no other control changes
- passive telemetry during a running program

## 4. Optional heat-level sanity pass
Low priority, mainly for bookkeeping.

Goal:
- reconfirm level packets 0 through 3 for roller, calf, shawl, and foot in one clean run
- make sure the universal Heat tab mappings are fully consistent across surfaces
