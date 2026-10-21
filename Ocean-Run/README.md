# Ocean Run 🌊⚓

**Ocean Run is a mobile-first 3D maritime combat arcade game.** Take the helm of a patrol craft, steer continuously with a circular wheel, engage hostile vessel contacts, respond to bridge orders, protect hull integrity, and reach the patrol rendezvous.

## Play
- Project: https://github.com/XaviourZone/Articles/tree/main/Ocean-Run
- GitHub Pages URL (when Pages is enabled): https://xaviourzone.github.io/Articles/Ocean-Run/

## Controls
- **Steering wheel:** drag around the circular helm to turn. The wheel and craft respond continuously; release to hold the selected course.
- **Fire:** tap the pulse cannon when a hostile contact is aligned ahead.
- **Transponder:** toggle the transponder when the bridge order appears.
- **Keyboard:** A/D or arrow keys steer; Space fires; T toggles the transponder.
- **Touch gesture:** swipe left/right on the scene for a steering adjustment; swipe upward to fire.

## Gameplay loop
1. Enter the patrol zone.
2. A bridge order requests transponder activation; respond with the control.
3. Steer into alignment with hostile contacts and fire projectiles.
4. Destroyed contacts award score and trigger a short debrief with a maritime fact—no multiple-choice quiz.
5. Avoid drifting hazards and hostile contacts. Collisions damage hull integrity and deduct points.
6. Collect supply caches to recover hull integrity and earn points.
7. Neutralise five contacts and reach the rendezvous with hull integrity remaining to complete the mission.

## Project structure
- `index.html` — game screens and combat HUD.
- `assets/game.css` — mobile HUD, circular helm, buttons, debrief overlays.
- `assets/game.js` — Three.js scene, animated shader water, patrol craft, hostile vessels, hazards, projectiles, collision logic, mission state, and debriefs.
- `assets/ocean-logo.svg` — SVG mark.

## Technical notes
- Uses Three.js from jsDelivr and Google Fonts from Google Fonts; internet access is required for those external assets.
- Boat, enemy contacts, obstacles, water, island silhouettes, particles, wake, lights, and effects are generated procedurally. No build step or backend is needed.
- Rendering pixel ratio is capped to improve mobile performance.
- This is an arcade fiction, not a real navigation or weapons simulator. Maritime facts are brief educational context, not operational instructions.
- No account or personal data collection.

## Third-party software
Three.js is distributed under the MIT License: https://github.com/mrdoob/three.js/blob/dev/LICENSE
