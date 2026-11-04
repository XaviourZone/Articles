# FREESHIPPING TRACKER — AISStream proxy

This Cloudflare Worker keeps the AISStream API key server-side. Never put the key in `index.html`, GitHub source, or browser storage.

## Deploy

1. Install Wrangler and authenticate: `npx wrangler login`.
2. From this directory run: `npx wrangler secret put AISSTREAM_API_KEY`.
3. Paste a freshly rotated AISStream key into the hidden terminal prompt.
4. Deploy: `npx wrangler deploy`.
5. Check `https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/health` returns `{ "ok": true }`.
6. Set `AISSTREAM_PROXY_URL` in `FREESHIPPING/index.html` to `wss://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/stream` and deploy Pages.

The Worker subscribes to a broad latitude band (-41.5° to 41.5°) across all longitudes. Actual coverage depends on AISStream plan limits and upstream availability. The app merges contacts by MMSI with existing feeds.

## Security

- Rotate keys exposed in screenshots or chat before deployment.
- Never commit `.dev.vars`, API keys, or secrets.
- Browser clients cannot change the Worker subscription or access the key.
