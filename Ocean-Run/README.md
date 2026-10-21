# Ocean Run 🌊⚓

**A mobile-first 3D maritime endless runner.** Dodge obstacles, collect chart fragments, fire at marked arcade targets, and answer fast maritime-knowledge questions before reaching the lighthouse.

## Play

GitHub Pages URL (when Pages is enabled for this repository):
https://xaviourzone.github.io/Articles/Ocean-Run/

Source folder: https://github.com/XaviourZone/Articles/tree/main/Ocean-Run

## Controls
- Swipe left/right on the game scene or use the lane buttons to steer.
- Swipe down or tap the slide button to duck/settle low.
- Tap **FIRE** to launch a visible pulse at marked floating targets.
- Collect glowing chart books to trigger a knowledge checkpoint.
- Correct answers award points; collisions cost points.
- Finish the 60-second voyage and share your score.

## Project structure
- `index.html` — game UI and screen layout.
- `assets/game.css` — responsive HUD, glass panels, buttons, and overlays.
- `assets/game.js` — Three.js 3D scene, animated shader water, patrol craft, obstacles, pickups, projectiles, particle effects, quiz logic, and controls.
- `assets/ocean-logo.svg` — SVG title mark.

## Visual / technical notes
- Uses Three.js via jsDelivr CDN; the browser needs internet access to load that library.
- The boat, obstacles, water shader, wake, lights, clouds, and particles are generated procedurally in Three.js. No large third-party 3D models are downloaded into the repository.
- Mobile-first renderer settings limit pixel ratio for smoother play on phones.
- Includes reduced-motion styling and keyboard controls for desktop.
- No build step, backend, account, or data collection.

## Knowledge note
Quiz questions are educational prompts, not navigation instructions. Actual maritime operations must follow official charts, notices, equipment manuals, and applicable procedures.

## Third-party software
Three.js is distributed under the MIT License: https://github.com/mrdoob/three.js/blob/dev/LICENSE
