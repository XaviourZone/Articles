# OCEAN EYE — Live Maritime Globe

A mobile-first, single-file 3D Earth explorer showing public AIS vessel reports and vessel tracks.

## Open the site

When GitHub Pages is enabled for the parent repository:

https://xaviourzone.github.io/Articles/FREESHIPPING/

## Run locally

Open `index.html` in a modern browser, or serve this folder with any static HTTP server. No build step, package installation, backend, database, or API key is required.

## Live data

- Provider: [OpenSeaFeed](https://openseafeed.com/)
- WebSocket: `wss://stream.openseafeed.com/v1/stream`
- History API: `https://api.openseafeed.com/v1/history/{mmsi}`
- API documentation: [openseafeed.com/docs](https://openseafeed.com/docs)
- Open-source network: [BetterInc/openseafeed](https://github.com/BetterInc/openseafeed)

The page subscribes anonymously to a broad latitude band from 41.5°S to 41.5°N across all longitudes. This is intentionally below the documented 30,000 square-degree anonymous streaming-area limit. It is not full polar coverage.

The stream requests initial vessel state, then consumes live AIS position messages. When a vessel is selected, the page requests its recent history and combines it with positions received during the current session. Live trails are also retained in browser memory.

## Important limitations

- Public AIS reception is uneven and depends on shore receivers, satellite reception, upstream contributors, and vessel transponders.
- The anonymous OpenSeaFeed tier provides recent history (up to 48 hours, downsampled) and has usage limits. Provider availability and CORS policy can change.
- The initial-state replay is the provider's last-known state, not a simultaneous live snapshot.
- Vessel tracks are based on reported AIS fixes. Straight segments connect successive fixes; they are not proof of the vessel's exact path between transmissions.
- If the selected vessel has no available history, its visible trail grows as new reports arrive.
- Globe textures and the Globe.gl library are loaded from public CDNs, so internet access is required.
- This is a public-data visualisation and is not intended for navigation, safety-of-life decisions, or operational use.

## Controls

- Drag / touch-drag: rotate the Earth.
- Scroll / pinch: zoom.
- Select a vessel: open its information and recent track.
- Tracks ON/OFF: toggle short trails for other vessels.
- Home: reset the globe view.

## Attribution

AIS data is provided by the OpenSeaFeed community network. See the provider documentation and terms before redistribution or commercial use. Globe rendering uses [Globe.gl](https://globe.gl/) and its public example Earth textures.
