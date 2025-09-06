document.addEventListener("DOMContentLoaded", async function () {
  // 👉 troque só esta linha:
  const apiKey = "AIzaSyAFsK5QnNk0Qw1g7QfFkeJSg2BgX1qxqqM";
  const channelId = "UCfbF-WRAt6paMIo-ZUDZtOA";

  const box = document.querySelector(".youtube-video");
  if (!box) return;

  const MAX_RESULTS = 8;     // checar vários recentes
  const MIN_SECONDS = 120;   // >= 4 minutos (evita shorts)

  async function fetchJSON(url) {
    const r = await fetch(url);
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data?.error?.message || `${r.status} ${r.statusText}`);
    return data;
  }

  // parse "PT#H#M#S" -> segundos
  function parseISODuration(iso) {
    const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || "");
    const h = parseInt(m?.[1] || 0, 10);
    const mn = parseInt(m?.[2] || 0, 10);
    const s = parseInt(m?.[3] || 0, 10);
    return h * 3600 + mn * 60 + s;
  }

  // Busca por vídeos (não lives) com duração filtrada
  async function searchIdsByDuration(duration /* 'medium' | 'long' */) {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("part", "snippet,id");
    url.searchParams.set("type", "video");
    url.searchParams.set("order", "date");
    url.searchParams.set("videoEmbeddable", "true"); // já filtra embutíveis
    url.searchParams.set("videoDuration", duration); // medium=4–20m, long=>20m
    url.searchParams.set("maxResults", String(MAX_RESULTS));

    const data = await fetchJSON(url);
    return (data.items || [])
      .filter(it => it.id?.videoId && (it.snippet?.liveBroadcastContent || "none") === "none")
      .map(it => it.id.videoId);
  }

  // Playlist de uploads do canal (fallback)
  async function getUploadsIds(n = MAX_RESULTS) {
    const ch = new URL("https://www.googleapis.com/youtube/v3/channels");
    ch.searchParams.set("key", apiKey);
    ch.searchParams.set("id", channelId);
    ch.searchParams.set("part", "contentDetails");
    const cdata = await fetchJSON(ch);
    const uploads = cdata?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploads) return [];

    const pl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    pl.searchParams.set("key", apiKey);
    pl.searchParams.set("playlistId", uploads);
    pl.searchParams.set("part", "contentDetails");
    pl.searchParams.set("maxResults", String(n));
    const pdata = await fetchJSON(pl);
    return (pdata.items || []).map(it => it?.contentDetails?.videoId).filter(Boolean);
  }

  // Pega detalhes dos vídeos e retorna o primeiro embutível, público e longo (>= MIN_SECONDS)
  async function pickFirstEmbeddableLong(ids) {
    if (!ids.length) return null;
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("id", ids.join(","));
    url.searchParams.set("part", "status,contentDetails");
    const data = await fetchJSON(url);

    // mantém a ordem dos ids
    const byId = new Map((data.items || []).map(v => [v.id, v]));
    for (const id of ids) {
      const v = byId.get(id);
      if (!v) continue;
      const emb = v?.status?.embeddable === true;
      const pub = v?.status?.privacyStatus === "public";
      const sec = parseISODuration(v?.contentDetails?.duration);
      if (emb && pub && sec >= MIN_SECONDS) return id;
    }
    return null;
  }

  function render(videoId) {
    box.innerHTML = `
      <iframe width="100%" height="315"
        src="https://www.youtube.com/embed/${videoId}"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    `;
  }

  try {
    box.innerHTML = "<p>Carregando vídeo...</p>";

    // 1) tenta medium (4–20m)
    let ids = await searchIdsByDuration("medium");
    let vid = await pickFirstEmbeddableLong(ids);

    // 2) tenta long (>20m)
    if (!vid) {
      ids = await searchIdsByDuration("long");
      vid = await pickFirstEmbeddableLong(ids);
    }

    // 3) fallback pela playlist de uploads (filtrando por duração)
    if (!vid) {
      ids = await getUploadsIds();
      vid = await pickFirstEmbeddableLong(ids);
    }

    if (vid) render(vid);
    else box.innerHTML = "<p>Nenhum vídeo longo disponível para incorporação.</p>";
  } catch (err) {
    console.error(err);
    box.innerHTML = `<p>Erro ao carregar vídeo: ${err.message}</p>`;
  }
});
