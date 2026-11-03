# FLIGHT 271 — The Last Descent

Playable GitHub Pages experience: https://xaviourzone.github.io/Articles/FLIGHT-271/

A 40-second browser-based educational reconstruction of the final phase of Learjet 60 N722BD near Lake Worth Beach / Greenacres, Florida, on 1 November 2026.

## Controls
- Drag the on-screen joystick for pitch and roll.
- Use the throttle slider for engine power.
- Arrow keys / WASD control pitch and roll.
- Switch between external chase and cockpit views.
- Pause and resume the simulation.

## Evidence and limitations
This is not an official NTSB reconstruction, flight-data-recorder playback, flight-training device, or finding about the accident cause. The NTSB investigation is ongoing.

Public ADS-B records can provide position, barometric altitude, ground speed and track. They do not provide indicated airspeed, bank angle, control-surface positions, pilot inputs, or aerodynamic drag. Accordingly, the published event sequence is separated from an illustrative point-mass flight model. Aircraft response, icing accumulation, lift, drag, and control authority are model variables—not recovered measurements or validated Learjet 60 performance data.

The 40-second game compresses the reported final phase; it is not literal real-time playback. The Florida map and environment are schematic context, not surveyed terrain or a historical weather-radar reconstruction. Three.js loads from jsDelivr, so gameplay requires internet access.

## Sources
- NTSB investigation ERA27MA026: https://www.ntsb.gov/investigations/Pages/ERA27MA026.aspx
- Flightradar24 incident report and tracking downloads: https://www.flightradar24.com/blog/flight-tracking-news/major-incident/learjet-60-crashes-near-west-palm-beach-florida/
- ADS-B data analysis and limitations: https://map.flights/news/2434-crash-of-learjet-60-n722bd-near-west-palm-beach-on-11-1-2026-ads-b-data

## Run locally
Serve the repository root with any HTTP server, then open /FLIGHT-271/ (for example, python -m http.server 8000). ES modules do not work reliably from file://.
