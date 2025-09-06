document.addEventListener("DOMContentLoaded", function () {
    const apiKey = 'AIzaSyB1OdA38HFYmQGxsN0cTv8i3AB3cPZbA_0';
    const channelId = 'UCfbF-WRAt6paMIo-ZUDZtOA';
    const maxResults = 1;
  
    const youtubeContainer = document.querySelector('.youtube-video');
  
    if (!apiKey || !channelId) {
      youtubeContainer.innerHTML = "<p>API Key ou Channel ID não configurados.</p>";
      return;
    }
  
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`)
      .then(response => response.json())
      .then(data => {
        if (!data.items || data.items.length === 0) {
          youtubeContainer.innerHTML = '<p>Nenhum vídeo encontrado.</p>';
          return;
        }
  
        const item = data.items[0];
        const videoId = item.id.videoId || item.id; // fallback de segurança
  
        if (!videoId) {
          youtubeContainer.innerHTML = '<p>Erro: vídeo inválido ou privado.</p>';
          return;
        }
  
        youtubeContainer.innerHTML = `
          <iframe width="100%" height="315"
            src="https://www.youtube.com/embed/${videoId}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        `;
      })
      .catch(error => {
        youtubeContainer.innerHTML = `<p>Erro ao carregar vídeo: ${error.message}</p>`;
        console.error('Erro ao buscar o vídeo mais recente:', error);
      });
  });
  