document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================
  // 1. FUNCIONALIDADES DO MENU MOBILE
  // ==========================================================
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-links');
  
  // Só executa se os elementos existirem
  if (toggle && nav) {
    const OPEN_CLASS = 'show';

    function addBackdrop() {
      let bd = document.getElementById('nav-backdrop');
      if (!bd) {
        bd = document.createElement('div');
        bd.id = 'nav-backdrop';
        bd.className = 'nav-backdrop';
        document.body.appendChild(bd);
        bd.addEventListener('click', closeMenu);
      }
    }

    function removeBackdrop() {
      const bd = document.getElementById('nav-backdrop');
      if (bd) bd.remove();
    }

    function openMenu() {
      nav.classList.add(OPEN_CLASS);
      toggle.setAttribute('aria-expanded', 'true');
      toggle.classList.add('is-open');
      toggle.innerHTML = '&times;';
      document.body.style.overflow = 'hidden';
      addBackdrop();
    }

    function closeMenu() {
      nav.classList.remove(OPEN_CLASS);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.classList.remove('is-open');
      toggle.innerHTML = '&#9776;';
      document.body.style.overflow = '';
      removeBackdrop();
    }

    function toggleMenu() {
      nav.classList.contains(OPEN_CLASS) ? closeMenu() : openMenu();
    }

    // A11y e Eventos do Menu
    toggle.setAttribute('aria-controls', 'nav-links');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.addEventListener('click', toggleMenu);

    // Fecha ao clicar em um link (mobile)
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 768px)').matches) closeMenu();
      });
    });

    // Fecha com ESC e Correção de Redimensionamento
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (!window.matchMedia('(max-width: 768px)').matches) {
        closeMenu();
        nav.classList.remove(OPEN_CLASS);
      }
    });
  }

  // ==========================================================
  // 2. SCROLL REVEAL E TIMELINE OBSERVER
  // ==========================================================

  const revealOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  // Observa todas as seções para o fade-in básico
  document.querySelectorAll('.fade-in-section').forEach(section => {
    revealObserver.observe(section);
  });
  
  // OBSERVER PARA A LINHA DO TEMPO (Animation dots)
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('timeline-active'); 
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 
  });

  document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
  });

}); // FIM DO BLOCO DOMContentLoaded PRINCIPAL


// ==========================================================
// 3. SCROLL SUAVE PARA ÂNCORAS (Aprimorado)
// ==========================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      
      if (target) {
        e.preventDefault();
        // Tenta pegar a altura do header, se não existir assume 0
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        
        // Calcula a posição de rolagem: topo do alvo menos a altura do header
        const scrollPosition = target.offsetTop - headerHeight - 20; 
        
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});


// ==========================================================
// 4. CARREGAR ÚLTIMO VÍDEO DO YOUTUBE (DESTAQUE)
// ==========================================================
document.addEventListener("DOMContentLoaded", async () => {
  const videoContainer = document.getElementById("youtube-destaque-container");
  
  // Se não tiver o container na página, para por aqui (evita erros)
  if (!videoContainer) return;

  const channelId = "UCfbF-WRAt6paMIo-ZUDZtOA";
  const apiKey = "AIzaSyAFsK5QnNk0Qw1g7QfFkeJSg2BgX1qxqqM"; 

  try {
    // 1. Pegar a playlist "uploads" do canal
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const channelResp = await fetch(channelUrl);
    
    if (!channelResp.ok) throw new Error("Erro ao buscar canal");
    const channelData = await channelResp.json();
    
    const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) throw new Error("Playlist de uploads não encontrada");

    // 2. Pegar o vídeo mais recente (maxResults=1)
    const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${uploadsPlaylistId}&key=${apiKey}`;
    const videosResp = await fetch(videosUrl);
    
    if (!videosResp.ok) throw new Error("Erro ao buscar vídeo");
    const videosData = await videosResp.json();

    if (videosData.items.length === 0) {
        videoContainer.innerHTML = "<p>Nenhum vídeo encontrado.</p>";
        return;
    }

    // 3. Montar o player
    const latestVideo = videosData.items[0];
    const videoId = latestVideo.snippet.resourceId.videoId;
    const videoTitle = latestVideo.snippet.title;

    videoContainer.innerHTML = `
      <iframe
        width="560" height="315"
        src="https://www.youtube.com/embed/${videoId}"
        title="${videoTitle}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen>
      </iframe>
    `;

  } catch (err) {
    console.error("Erro na API do YouTube:", err);
    videoContainer.innerHTML = "<p>Não foi possível carregar o vídeo.</p>";
  }
});