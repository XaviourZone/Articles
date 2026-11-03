# FLIGHT 271 — Pilot-Controlled Scenario

Play: https://xaviourzone.github.io/Articles/FLIGHT-271/

A single-screen, responsive browser simulation. The aircraft begins in stable cruise. Weather builds during the flight, followed by turbulence and modelled ice accretion. The player can take manual control and manage aircraft attitude, thrust, anti-ice and autopilot.

## Controls
- Drag the yoke: pitch and roll (the yoke springs back to centre).
- Throttle slider: engine thrust command.
- Wing / engine anti-ice: toggle to reduce modelled ice accumulation; it carries a small thrust penalty.
- Autopilot: toggle on/off.
- Keyboard: arrows or WASD for pitch and roll; Shift / Ctrl adjust throttle.
- External / cockpit buttons change camera presentation.

## Important model disclaimer
This is an educational, fictionalised control scenario inspired by the reported sequence, not an official accident reconstruction, flight-data-recorder playback, flight-training device, or claim about the actual cause or recoverability. Public ADS-B does not provide pilot inputs, indicated airspeed, control-surface positions, bank angle, icing rate or engine health. The flight dynamics and systems degradation in this game are illustrative model variables, not recovered aircraft data or validated Learjet 60 performance. The scenario should not be used for real-world pilot training.

The page is designed to fit a single viewport on desktop and mobile; no page scrolling is intended. The 3D dependency has been replaced with a lightweight rendered flight scene for reliable responsive operation.

## Source references
- NTSB investigation: https://www.ntsb.gov/investigations/Pages/ERA27MA026.aspx
- Flightradar24 incident report: https://www.flightradar24.com/blog/flight-tracking-news/major-incident/learjet-60-crashes-near-west-palm-beach-florida/
- ADS-B analysis: https://map.flights/news/2434-crash-of-learjet-60-n722bd-near-west-palm-beach-on-11-1-2026-ads-b-data
