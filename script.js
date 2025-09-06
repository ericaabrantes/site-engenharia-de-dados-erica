document.addEventListener("DOMContentLoaded", async function () {
  // 👉 TROQUE SOMENTE ESTAS DUAS LINHAS:
  const apiKey = "SUA_CHAVE_YT_AQUI";               // ex: AIzaSyD...
  const channelId = "UCfbF-WRAt6paMIo-ZUDZtOA";     // seu canal

  const box = document.querySelector(".youtube-video");
  if (!box) return;

  // helper simples
  async function j(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
  }

  // tenta pegar o vídeo mais recente (só vídeos)
  async function latestVideoId() {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("channelId", channelId);
    url.searchParams.set("part", "snippet,id");
    url.searchParams.set("type", "video");   // garante que é vídeo
    url.searchParams.set("order", "date");
    url.searchParams.set("maxResults", "1");

    const data = await j(url);
    return data?.items?.[0]?.id?.videoId || null;
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
    const vid = await latestVideoId();
    box.innerHTML = vid ? "" : "<p>Nenhum vídeo encontrado.</p>";
    if (vid) render(vid);
  } catch (err) {
    box.innerHTML = `<p>Erro ao carregar vídeo: ${err.message}</p>`;
    console.error(err);
  }
});
