# AIS provider integration

FREESHIPPING TRACKER now has adapters for OpenSeaFeed and Open Waters. AISStream and AISHub require a private edge proxy because neither provider's credentials may be placed in this public GitHub Pages application.

## Provider requirements

- AISStream: create an API key and configure it as a server-side secret named AISSTREAM_API_KEY. AISStream explicitly prohibits direct browser connections. The proxy must open wss://stream.aisstream.io/v0/stream and subscribe with the API key, then forward only AIS JSON frames to the browser.
- AISHub: access is reciprocal. Operate and contribute a genuine AIS receiver feed, apply through https://www.aishub.net/join-us, and use the API key issued after approval. The API is polled no more than once per minute. Keep AISHUB_API_KEY server-side and return normalized GeoJSON to the browser.
- OpenSeaFeed: existing anonymous live stream, delayed snapshot and 48-hour downsampled history. Contributor access can expand area and history.
- Open Waters: existing anonymous regional snapshot polling and stream endpoints. Coverage and freshness vary by region.

## Deployment sequence

1. Deploy a private edge worker with WebSocket route /aisstream and HTTP route /aishub.
2. Store AISSTREAM_API_KEY and AISHUB_API_KEY as worker secrets. Do not commit them to this repository.
3. For AISStream, the worker must subscribe server-side to the desired bounding boxes and forward PositionReport, StandardClassBPositionReport, ExtendedClassBPositionReport and LongRangeAisBroadcastMessage frames over WebSocket.
4. For AISHub, poll https://data.aishub.net/ws.php?username=KEY&format=1&output=json&interval=60 at most once per minute, cache the response, and convert MMSI, LATITUDE, LONGITUDE, NAME, IMO, TYPE, SOG, COG, HEADING and TIME into GeoJSON features.
5. Set window.FREESHIPPING_CONFIG = { proxyUrl: 'https://YOUR-WORKER.workers.dev' } before the main application script in index.html. The application will connect to /aisstream and poll /aishub every 65 seconds.
6. Check the worker health endpoint and browser console. A source is only active after its credentials and service access have been configured.

## Important

AISHub API access is granted to qualifying contributors; a key cannot be generated merely by registering. Its public API allows one request per minute. Do not scrape the website or relay raw data in violation of its terms. Display AISHub contributor attribution. AIS data is delayed/incomplete and is not for navigation.
