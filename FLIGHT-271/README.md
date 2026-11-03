# FLIGHT 271 — Survival Run

Mobile-first, full-screen 30-second 3D browser game. Three.js scene with a procedural Learjet-style aircraft, Florida coastal environment, ocean, volumetric-style cloud clusters, atmospheric lighting, precipitation, cockpit overlay and touch-first controls.

## Play
https://xaviourzone.github.io/Articles/FLIGHT-271/

## Controls
- Drag the virtual yoke for pitch and roll (touch or mouse).
- Throttle slider for engine power.
- Autopilot and anti-ice system buttons.
- Camera button switches external chase and cockpit views.
- On Windows, mouse drag and keyboard WASD / arrow keys work.

## Accuracy note
This is an educational, illustrative simulation. The procedural aircraft is not a photogrammetric Learjet 60 asset; the landscape and clouds are generated game scenery, not a surveyed Florida terrain mesh or historical weather radar. The aerodynamic model is not validated Learjet performance data. IAS, ice accumulation and recovery outcomes are game-model values, not flight-recorder measurements. It must not be used for flight training or as a claim about the real accident's cause or recoverability.

Three.js is loaded from jsDelivr and Google Fonts from Google Fonts; network access is required. For production deployment, pin and self-host these dependencies and replace the procedural aircraft with a properly licensed high-detail 3D asset.
