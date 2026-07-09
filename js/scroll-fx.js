/* =========================================================
   SCROLL FX PREMIUM — SnapBite
   Animações de rolagem inspiradas na fluidez do PayPal.

   Este arquivo é 100% aditivo:
   - não altera cores, textos, imagens, botões ou HTML;
   - não mexe no header/footer além de um leve encolher + blur
     (usando a classe .scrolled que o próprio app.js já aplica);
   - não reordena nem remove nada, só adiciona classes via JS
     e observa a entrada dos elementos na viewport.
   ========================================================= */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Seletores usados para identificar automaticamente
  // título / subtítulo / descrição / botões / imagens / cards
  // dentro de cada <section> do site, sem precisar editar o HTML.
  const SEL_CARD = '[class*="-card"], [class*="-item"]:not(.navbar-links a), [class*="-step"], .cultura-card, .plano-card, .val-card, .num-box, .membro';
  const SEL_TITLE = 'h1, h2, h3, .section-title, .page-title, .hero-titulo';
  const SEL_SUB = '.section-sub, .page-sub, .parceiros-sub, .porque-sub, .section-lead';
  const SEL_DESC = 'p';
  const SEL_BTN = '.btn-primary, .btn-secondary, .btn-retangular, .btn-retangular-outline, .btn-ghost, .btn-carrinho';
  const SEL_IMG = 'img';

  if (prefersReduced) {
    // Respeita a preferência do usuário: nada de animação, conteúdo direto.
    return;
  }

  const revealed = new WeakSet();
  const STAGGER_MS = 95; // ~80-120ms pedido

  function isNested(el, list) {
    return list.some((other) => other !== el && other.contains(el));
  }

  function collect(section, selector, exclude) {
    const found = Array.from(section.querySelectorAll(selector));
    return found.filter((el) => {
      if (exclude && el.closest(exclude)) return false;
      return true;
    });
  }

  function prepareSection(section, sectionIndex) {
    if (section.dataset.sfxReady) return;
    section.dataset.sfxReady = '1';

    // Cards (repetições dentro da seção)
    let cards = collect(section, SEL_CARD);
    cards = cards.filter((el) => !isNested(el, cards));

    // Título / subtítulo / descrição / botões que NÃO estejam dentro de um card
    // (evita duplicar o stagger de textos que já pertencem a um card)
    const notInCard = `${SEL_CARD}`;
    const titles = collect(section, SEL_TITLE, notInCard);
    const subs = collect(section, SEL_SUB, notInCard);
    const descs = collect(section, SEL_DESC, notInCard).filter((p) => p.textContent.trim().length > 0);
    const btns = collect(section, SEL_BTN, notInCard);

    // Imagens (fora de cards, que ganham parallax próprio)
    const imgs = collect(section, SEL_IMG, notInCard);

    // Ordem da cascata: título -> subtítulo -> descrição -> botões -> imagens -> cards
    const cascade = [...titles, ...subs, ...descs, ...btns, ...imgs, ...cards];

    let delayIndex = 0;
    cascade.forEach((el) => {
      if (el.dataset.sfxTagged) return;
      el.dataset.sfxTagged = '1';
      const isImg = el.tagName === 'IMG';
      el.classList.add(isImg ? 'sfx-img' : 'sfx-el');
      const delay = Math.min(delayIndex, 8) * STAGGER_MS;
      el.style.transitionDelay = `${delay}ms`;
      delayIndex += 1;
      mainObserver.observe(el);
    });

    // Se a seção não tiver nenhum elemento reconhecido, revela a seção inteira
    if (!cascade.length) {
      section.classList.add('sfx-el');
      mainObserver.observe(section);
    }
  }

  const mainObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !revealed.has(entry.target)) {
          revealed.add(entry.target);
          entry.target.classList.add('sfx-in');
          mainObserver.unobserve(entry.target);

          // Para imagens: só liga o parallax contínuo depois que a
          // animação de entrada (translate/scale via CSS) terminar,
          // pra não brigar com o transform que o JS vai controlar.
          if (entry.target.tagName === 'IMG') {
            window.setTimeout(() => {
              entry.target.classList.add('sfx-parallax-active');
            }, 1050);
          }
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -60px 0px' }
  );

  function initReveal() {
    const sections = document.querySelectorAll('section, .page-hero, .mapa-hero');
    sections.forEach((section, i) => prepareSection(section, i));
  }

  /* ---------- Parallax leve nas imagens já reveladas ---------- */
  const parallaxEls = new Set();
  const parallaxObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) parallaxEls.add(entry.target);
        else parallaxEls.delete(entry.target);
      });
    },
    { threshold: 0 }
  );

  function watchParallax() {
    document.querySelectorAll('.sfx-img.sfx-parallax-active').forEach((img) => parallaxObserver.observe(img));
  }

  let ticking = false;
  function onScrollParallax() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      parallaxEls.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const center = rect.top + rect.height / 2;
        const offset = (center - vh / 2) / vh; // -0.5 .. 0.5 aprox
        const move = offset * -18; // movimento sutil, mais lento que o scroll
        img.style.transform = `translateY(${move}px)`;
      });
      ticking = false;
    });
  }

  function start() {
    initReveal();
    watchParallax();
    window.addEventListener('scroll', onScrollParallax, { passive: true });
    onScrollParallax();

    // Novas seções que possam aparecer dinamicamente (ex: componentes injetados)
    let moTimeout = null;
    const mo = new MutationObserver(() => {
      if (moTimeout) return;
      moTimeout = window.setTimeout(() => {
        initReveal();
        watchParallax();
        moTimeout = null;
      }, 400);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
