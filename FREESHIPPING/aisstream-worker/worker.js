export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/health") return Response.json({ ok: true, service: "freeshipping-aisstream-proxy" });
    if (url.pathname !== "/stream") return new Response("Not found", { status: 404 });
    if (request.headers.get("Upgrade") !== "websocket") return new Response("WebSocket upgrade required", { status: 426 });
    if (!env.AISSTREAM_API_KEY) return new Response("AISSTREAM_API_KEY secret is not configured", { status: 503 });
    const pair = new WebSocketPair(), client = pair[0], server = pair[1];
    server.accept();
    let upstream, closed = false;
    const closeBoth = (code = 1000, reason = "closed") => {
      if (closed) return; closed = true;
      try { server.close(code, reason); } catch {}
      try { upstream?.close(code, reason); } catch {}
    };
    try {
      upstream = new WebSocket("wss://stream.aisstream.io/v0/stream");
      upstream.addEventListener("open", () => upstream.send(JSON.stringify({
        APIKey: env.AISSTREAM_API_KEY,
        BoundingBoxes: [[[-41.5, -180], [41.5, 180]]],
        FilterMessageTypes: ["PositionReport", "StandardClassBPositionReport", "ExtendedClassBPositionReport", "LongRangeAisBroadcastMessage"]
      })));
      upstream.addEventListener("message", e => { if (!closed) { try { server.send(e.data); } catch { closeBoth(1011, "relay failure"); } } });
      upstream.addEventListener("error", () => closeBoth(1011, "AISStream upstream error"));
      upstream.addEventListener("close", () => closeBoth(1012, "AISStream disconnected"));
      server.addEventListener("message", e => { try { if (JSON.parse(e.data)?.type === "ping") server.send(JSON.stringify({type:"pong"})); } catch {} });
      server.addEventListener("close", () => closeBoth());
      server.addEventListener("error", () => closeBoth(1011, "client socket error"));
    } catch { closeBoth(1011, "proxy startup failed"); }
    return new Response(null, { status: 101, webSocket: client });
  }
};
