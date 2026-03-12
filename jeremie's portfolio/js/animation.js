

function initCount(root) {
  (root || document).querySelectorAll('[data-count="group"]').forEach(g => {
    g.querySelectorAll('.w-condition-invisible').forEach(el => el.remove());
    g.querySelectorAll('[data-count="child"]').forEach((c, i) =>
      c.style.setProperty('--index', i)
    );
  });
}

/* ---- syncClasses — gère active/prev/next sur les slides texte ---- */
function syncClasses(slides, active) {
  slides.forEach((s, i) => {
    s.classList.remove('active', 'prev', 'next');
    if (i === active)     s.classList.add('active');
    else if (i < active) s.classList.add('prev');
    else                  s.classList.add('next');
  });
}

/* ---- initPortfolioSlider ---- */
function initPortfolioSlider() {
  const groups = document.querySelectorAll('[data-pf="group"]');
  if (!groups.length) return;

  const mm = gsap.matchMedia();

  groups.forEach(group => {
    const mainEl  = group.querySelector('[data-pf="main"]');
    const listEl  = group.querySelector('[data-pf="list"]');
    const nextBtn = group.querySelector('[data-swiper="next"]');
    const prevBtn = group.querySelector('[data-swiper="prev"]');
    if (!mainEl || !listEl) return;

    const contentSlides = Array.from(listEl.querySelectorAll('.swiper-slide.cc-pf'));
    let mSw = null, sSw = null;

    const base = {
      loop: false,
      centeredSlides: true,
      speed: 600,
      slideActiveClass: 'active',
      slideNextClass:   'next',
      slidePrevClass:   'prev',
    };

    const syncSlides = (idx) => {
      syncClasses(contentSlides, idx);
      if (sSw) sSw.slideTo(idx, 0);
    };

    const setupEvents = () => {
      if (mSw) mSw.on('slideChange', () => syncSlides(mSw.activeIndex));
    };

    const destroy = () => {
      if (mSw) { mSw.destroy(true, true); mSw = null; }
      if (sSw) { sSw.destroy(true, true); sSw = null; }
    };

    /* Desktop — vertical */
    mm.add('(min-width: 992px)', () => {
      mSw = new Swiper(mainEl, {
        ...base,
        direction: 'vertical',
        slidesPerView: 'auto',
        spaceBetween: 12,
        navigation: { nextEl: nextBtn, prevEl: prevBtn },
      });
      sSw = new Swiper(listEl, {
        ...base,
        speed: 0,
        allowTouchMove: false,
        slidesPerView: 'auto',
        spaceBetween: 0,
        direction: 'vertical',
        noSwiping: true,
        noSwipingClass: 'swiper-wrapper',
      });
      setupEvents();
      syncSlides(0);
      return () => destroy();
    });

    /* Mobile — horizontal */
    mm.add('(max-width: 991px)', () => {
      mSw = new Swiper(mainEl, {
        ...base,
        direction: 'horizontal',
        slidesPerView: 1.5,
        spaceBetween: 12,
        breakpoints: {
          320: { slidesPerView: 1.05, spaceBetween: 0 },
          480: { slidesPerView: 1.2,  spaceBetween: 0 },
          768: { slidesPerView: 1.5,  spaceBetween: 0 },
        },
        navigation: { nextEl: nextBtn, prevEl: prevBtn },
      });
      sSw = new Swiper(listEl, {
        ...base,
        speed: 0,
        allowTouchMove: false,
        slidesPerView: 1,
        spaceBetween: 0,
        direction: 'horizontal',
        noSwiping: true,
        noSwipingClass: 'swiper-wrapper',
      });
      setupEvents();
      syncSlides(0);
      return () => destroy();
    });
  });
}

/* ---- GSAP intro ---- */
function initIntro() {
  gsap.set('.pf_visual__group', { clipPath: 'inset(0 100% 0 0 round 1.125em)' });
  gsap.set('.swiper-nav',        { opacity: 0, scale: .85 });
  gsap.set('.pf_content__group', { opacity: 0, x: 20 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: .1 });

  tl.to('.pf_visual__group', {
      clipPath: 'inset(0 0% 0 0 round 1.125em)',
      duration: 1,
      ease: 'expo.inOut',
    }, 0)
    .to('.swiper-nav',        { opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.5)' }, '.55')
    .to('.pf_content__group', { opacity: 1, x: 0,    duration: .7 }, '.45');
}

/* ---- Boot ---- */
document.addEventListener('DOMContentLoaded', () => {
  initCount();
  initPortfolioSlider();
  initIntro();
});
