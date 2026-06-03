/* =====================================================
   RAAZ ESTATES — script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     1. LOADER
     ===================================================== */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 1800);
  });
  document.body.style.overflow = 'hidden';


  /* =====================================================
     2. NAVBAR – scroll effect + active link
     ===================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Sticky style
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });

    // Back-to-top
    const backTop = document.getElementById('backTop');
    if (backTop) {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* =====================================================
     3. HAMBURGER MENU
     ===================================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* =====================================================
     4. SCROLL REVEAL
     ===================================================== */
  const reveals = document.querySelectorAll('.reveal');

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObs.observe(el));


  /* =====================================================
     5. COUNTERS (Hero + Stats section)
     ===================================================== */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll
          ? entry.target.querySelectorAll('[data-count], .counter')
          : [];
        counters.forEach(c => animateCounter(c));
        // Also handle hstat-num
        if (entry.target.classList.contains('hstat-num') ||
            entry.target.classList.contains('counter')) {
          animateCounter(entry.target);
        }
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Hero stats
  document.querySelectorAll('.hstat-num').forEach(el => counterObs.observe(el));
  // Stats section
  document.querySelectorAll('.stats-grid').forEach(el => counterObs.observe(el));


  /* =====================================================
     6. PROPERTY FILTER
     ===================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const propCards = document.querySelectorAll('.prop-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      propCards.forEach(card => {
        const cat = card.dataset.cat;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          // Re-trigger reveal if needed
          setTimeout(() => {
            card.classList.add('visible');
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* =====================================================
     7. GALLERY LIGHTBOX
     ===================================================== */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentLbIdx = 0;

  function openLightbox(idx) {
    currentLbIdx = idx;
    const item = galleryItems[idx];
    const img = item.querySelector('img');
    const cap = item.querySelector('.gallery-overlay span');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    if (lbCaption && cap) lbCaption.textContent = cap.textContent;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextLb() {
    openLightbox((currentLbIdx + 1) % galleryItems.length);
  }

  function prevLb() {
    openLightbox((currentLbIdx - 1 + galleryItems.length) % galleryItems.length);
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbNext) lbNext.addEventListener('click', nextLb);
  if (lbPrev) lbPrev.addEventListener('click', prevLb);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLb();
    if (e.key === 'ArrowLeft') prevLb();
  });


  /* =====================================================
     8. FAQ ACCORDION
     ===================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(fi => fi.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });


  /* =====================================================
     9. CONTACT FORM
     ===================================================== */
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fname').value.trim();
      const phone = document.getElementById('fphone').value.trim();
      const prop = document.getElementById('fprop').value;
      const budget = document.getElementById('fbudget').value;
      const msg = document.getElementById('fmsg').value.trim();

      if (!name || !phone) {
        showToast('Please fill in your name and phone number.', 'error');
        return;
      }

      // Build WhatsApp message
      const text = `Hello Raaz Estates,%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AProperty Type: ${encodeURIComponent(prop || 'Not specified')}%0ABudget: ${encodeURIComponent(budget || 'Not specified')}%0AMessage: ${encodeURIComponent(msg || 'Inquiry from website')}`;
      window.open(`https://wa.me/919802300409?text=${text}`, '_blank');

      showToast('Redirecting to WhatsApp...', 'success');
      inquiryForm.reset();
    });
  }


  /* =====================================================
     10. TOAST NOTIFICATION
     ===================================================== */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.style.cssText = `
      position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
      background: ${type === 'success' ? '#25D366' : '#e74c3c'};
      color: white; padding: 0.9rem 2rem;
      border-radius: 50px; font-size: 0.9rem; font-weight: 600;
      z-index: 9999; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      animation: toastIn 0.4s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Add keyframe if not present
    if (!document.getElementById('toastStyle')) {
      const style = document.createElement('style');
      style.id = 'toastStyle';
      style.textContent = `@keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }


  /* =====================================================
     11. BACK TO TOP
     ===================================================== */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* =====================================================
     12. SMOOTH SCROLL for anchor links
     ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });


  /* =====================================================
     13. FLOATING BUTTONS – Hide on small scroll areas
     ===================================================== */
  // Pulse animation for WhatsApp button
  const floatWa = document.querySelector('.float-wa');
  if (floatWa) {
    setInterval(() => {
      floatWa.style.transform = 'scale(1.07) translateY(-4px)';
      setTimeout(() => {
        floatWa.style.transform = '';
      }, 400);
    }, 4000);
  }

}); // End DOMContentLoaded
