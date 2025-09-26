document.addEventListener('DOMContentLoaded', () => {
  // 1. Funcionalidades do Menu Mobile
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav-links');
  if (!toggle || !nav) return;

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

  // Scroll suave para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });


  // ==========================================================
  // 2. SCROLL REVEAL E TIMELINE OBSERVER (Otimizado)
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
  
  // NOVO: OBSERVER PARA A LINHA DO TEMPO
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Quando o item da timeline entra na tela
      if (entry.isIntersecting) {
        // Adiciona a classe 'active' ao card e ao dot
        entry.target.classList.add('timeline-active'); 
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Ativa quando metade do card está visível
  });

  // Observa cada item da timeline individualmente
  document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
  });
});

// Scroll suave para âncoras (versão aprimorada com compensação de altura)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      const headerHeight = document.querySelector('.site-header').offsetHeight; // Obtém a altura do header
      
      if (target) {
        e.preventDefault();
        
        // Calcula a posição de rolagem: topo do alvo menos a altura do header
        const scrollPosition = target.offsetTop - headerHeight - 20; // -20px de margem extra
        
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});