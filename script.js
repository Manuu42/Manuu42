document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- año dinámico en el footer ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- efecto de tipeo en el prompt del hero ----
  const eyebrow = document.querySelector('.hero .eyebrow');
  if (eyebrow) {
    const fullText = eyebrow.dataset.text || eyebrow.textContent.trim();
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    if (reduceMotion) {
      eyebrow.textContent = fullText;
      eyebrow.appendChild(cursor);
    } else {
      eyebrow.textContent = '';
      let i = 0;
      const type = () => {
        if (i <= fullText.length) {
          eyebrow.textContent = fullText.slice(0, i);
          eyebrow.appendChild(cursor);
          i++;
          setTimeout(type, 28);
        }
      };
      type();
    }
  }

  // ---- reveal al hacer scroll ----
  const revealTargets = document.querySelectorAll(
    'section, .project, .stack-list span'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateReveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  // ---- animate reveal con requestAnimationFrame ----
  function animateReveal(el) {
    let startTime = null;
    const duration = 500; // 900ms
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      el.style.opacity = progress;
      el.style.transform = `translateY(${40 * (1 - progress)}px)`;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        el.classList.add('is-visible');
      }
    };
    requestAnimationFrame(animate);

  // ---- resaltar el link activo del nav según la sección visible ----
  const navLinks = document.querySelectorAll('.topbar nav a');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = () => {
    let current = sections[0];
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current.id}`
      );
    });
  };
  if (sections.length) {
    setActive();
    window.addEventListener('scroll', setActive, { passive: true });
  }

  // ---- botón volver arriba ----
  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.type = 'button';
  toTop.setAttribute('aria-label', 'Volver arriba');
  toTop.textContent = '↑';
  document.body.appendChild(toTop);

  const toggleToTop = () => {
    toTop.classList.toggle('is-visible', window.scrollY > 480);
  };
  toggleToTop();
  window.addEventListener('scroll', toggleToTop, { passive: true });

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
};

// ---- reveal more projects ----
  const revealMoreBtn = document.querySelector('.reveal-more-btn');
  const revealMoreContent = document.querySelector('.reveal-more-content');
  if (revealMoreBtn) {
    revealMoreBtn.addEventListener('click', () => {
      revealMoreContent.classList.toggle('is-open');
      revealMoreBtn.textContent = revealMoreContent.classList.contains('is-open')
        ? '↓ cerrar'
        : '¿quieres ver más?';
    });
  };

// ---- highlight contact section on click ----
  const contactLinks = document.querySelectorAll('a[href="#contacto"]');
  contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const contactSection = document.getElementById('contacto');
      if (contactSection) {
        contactSection.classList.add('highlight-target');
        setTimeout(() => {
          contactSection.classList.remove('highlight-target');
        }, 400); // 1 segundo
      }
    });
  });
});
