fetch('/api/youtube-latest')

document.addEventListener("DOMContentLoaded", async function () {
  const youtubeContainer = document.querySelector(".youtube-video");
  try {
    const resp = await fetch("/api/youtube-latest");
    const data = await resp.json();
    const videoId = data?.videoId;

    if (videoId) {
      youtubeContainer.innerHTML = `
        <iframe width="100%" height="315"
          src="https://www.youtube.com/embed/${videoId}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      `;
    } else {
      youtubeContainer.innerHTML = "<p>Nenhum vídeo encontrado.</p>";
    }
  } catch (err) {
    youtubeContainer.innerHTML = `<p>Erro ao carregar vídeo: ${err.message}</p>`;
  }
});
