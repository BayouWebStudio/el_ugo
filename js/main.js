/* ===== EL UGO — Main JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Nav scroll --- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle?.classList.remove('open');
    links.classList.remove('open');
  }));

  /* --- Fade-up on scroll --- */
  const fades = document.querySelectorAll('.fade-up');
  if (fades.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    fades.forEach(el => io.observe(el));
  }

  /* --- Hero zoom trigger --- */
  const hero = document.querySelector('.hero');
  if (hero) setTimeout(() => hero.classList.add('visible'), 100);

  /* --- Lightbox --- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg = lightbox.querySelector('img');
    const lbClose = lightbox.querySelector('.lightbox-close');
    const lbPrev = lightbox.querySelector('.lightbox-prev');
    const lbNext = lightbox.querySelector('.lightbox-next');

    // Collect all lightbox-eligible items: [data-lightbox] anchors AND .masonry a items
    const items = Array.from(document.querySelectorAll('[data-lightbox], .masonry a'));
    // Deduplicate by href/src
    const seen = new Set();
    const uniqueItems = items.filter(el => {
      const key = el.href || el.querySelector('img')?.src;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    let current = 0;

    const getSrc = (el) => el.href || el.querySelector('img')?.src || '';

    const open = (idx) => {
      current = ((idx % uniqueItems.length) + uniqueItems.length) % uniqueItems.length;
      lbImg.src = getSrc(uniqueItems[current]);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lbImg.src = '';
    };

    const prev = (e) => { if (e) e.stopPropagation(); open(current - 1); };
    const next = (e) => { if (e) e.stopPropagation(); open(current + 1); };

    uniqueItems.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); open(i); }));

    lbClose?.addEventListener('click', (e) => { e.stopPropagation(); close(); });
    lbPrev?.addEventListener('click', prev);
    lbNext?.addEventListener('click', next);

    // Click overlay to close
    lightbox.addEventListener('click', close);
    lbImg?.addEventListener('click', (e) => e.stopPropagation());

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(current - 1);
      if (e.key === 'ArrowRight') open(current + 1);
    });

    // Touch swipe
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        if (dx < 0) open(current + 1);
        else open(current - 1);
      }
    }, { passive: true });
  }

});
