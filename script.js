document.addEventListener('DOMContentLoaded', () => {
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
    toggle.innerHTML = '&times;'; // X
    document.body.style.overflow = 'hidden';
    addBackdrop();
  }

  function closeMenu() {
    nav.classList.remove(OPEN_CLASS);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('is-open');
    toggle.innerHTML = '&#9776;'; // ☰
    document.body.style.overflow = '';
    removeBackdrop();
  }

  function toggleMenu() {
    nav.classList.contains(OPEN_CLASS) ? closeMenu() : openMenu();
  }

  // A11y
  toggle.setAttribute('aria-controls', 'nav-links');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');

  // Clique no hambúrguer
  toggle.addEventListener('click', toggleMenu);

  // Fecha ao clicar em um link (mobile)
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 768px)').matches) closeMenu();
    });
  });

  // Fecha com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Corrige estado ao redimensionar
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
});

// ====================================
// ===== CÓDIGO PARA SCROLL REVEAL (FADE-IN-SECTION) =====
// ====================================

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1 // Ativa quando 10% da seção está visível
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          // Adiciona a classe que faz a animação no CSS
          entry.target.classList.add('is-visible'); 
          // Para de observar depois que a seção aparece
          observer.unobserve(entry.target); 
      }
  });
}, observerOptions);

// Observa todas as seções que têm a classe 'fade-in-section'
document.querySelectorAll('.fade-in-section').forEach(section => {
  observer.observe(section);
});
// ====================================
