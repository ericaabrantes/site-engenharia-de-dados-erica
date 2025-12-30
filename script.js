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

// ==========================================================
// 5. ESTATÍSTICAS SOCIAIS (API + ANIMAÇÃO)
// ==========================================================
document.addEventListener("DOMContentLoaded", async () => {
  
  // --- CONFIGURAÇÕES ---
  const ytChannelId = "UCfbF-WRAt6paMIo-ZUDZtOA";
  const apiKey = "AIzaSyAFsK5QnNk0Qw1g7QfFkeJSg2BgX1qxqqM"; 
  const githubUser = "ericaabrantes"; 

  // Elementos do DOM
  const ytElement = document.getElementById("yt-subs");
  const ghElement = document.getElementById("gh-followers");
  
  // Função para formatar números (ex: 1500 vira 1.5k ou 1.500)
  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  // Função de Animação de Contagem
  const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Cálculo do valor atual
      const currentVal = Math.floor(progress * (end - start) + start);
      
      // Atualiza o texto formatado
      obj.innerHTML = formatNumber(currentVal);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Garante que o número final seja exato e adiciona um "+" se for manual
        obj.innerHTML = formatNumber(end) + (obj.classList.contains('counter') ? "+" : "");
      }
    };
    window.requestAnimationFrame(step);
  };

  // 1. Buscar Inscritos YouTube (Automático)
  if (ytElement) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${ytChannelId}&key=${apiKey}`;
      const resp = await fetch(url);
      const data = await resp.json();
      const subs = parseInt(data.items[0].statistics.subscriberCount);
      
      // Anima do 0 até o valor real
      animateValue(ytElement, 0, subs, 2000);
    } catch (e) {
      console.error("Erro YT Stats:", e);
      ytElement.innerText = "---";
    }
  }

  // 2. Buscar Seguidores GitHub (Automático)
  if (ghElement) {
    try {
      const url = `https://api.github.com/users/${githubUser}`;
      const resp = await fetch(url);
      const data = await resp.json();
      const followers = data.followers;
      
      // Anima do 0 até o valor real
      animateValue(ghElement, 0, followers, 2000);
    } catch (e) {
      console.error("Erro GitHub Stats:", e);
      ghElement.innerText = "---";
    }
  }

  // 3. Animar os Manuais (LinkedIn e Instagram)
  // Eles usam a classe .counter e o atributo data-target no HTML
  const counters = document.querySelectorAll('.counter');
  
  // Usamos o IntersectionObserver para só animar quando a pessoa rolar a tela até lá
  const observerStats = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        animateValue(entry.target, 0, target, 2000); // 2000ms = 2 segundos de animação
        observerStats.unobserve(entry.target); // Para de observar depois que animou
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observerStats.observe(counter));
});