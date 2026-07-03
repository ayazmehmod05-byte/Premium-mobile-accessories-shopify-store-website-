/* ===================================================================
   Main.js — Royal Sphire Core Engine
   Handles: loader, navbar, mobile menu, typing animation, scroll
   reveal, counters, countdown timer, testimonials slider, newsletter,
   contact form, smooth scroll, toasts, and dropdown toggles.
   =================================================================== */

(function () {
  'use strict';

  /* =================================================================
     1. LOADING SCREEN
     ================================================================= */
  function initLoader() {
    var loader       = document.getElementById('loader');
    var progressFill = document.querySelector('.loader-progress-fill');
    var percentText  = document.getElementById('loader-percent');

    if (!loader) return;

    var progress = 0;

    var interval = setInterval(function () {
      progress += Math.random() * 15;

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setTimeout(function () {
          loader.classList.add('loaded');
          document.body.style.overflow = 'auto';

          // Initialise AOS (Animate On Scroll) once content is visible
          if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 800, once: false, offset: 100 });
          }
        }, 500);
      }

      if (progressFill) progressFill.style.width = progress + '%';
      if (percentText)  percentText.textContent   = Math.floor(progress) + '%';
    }, 100);
  }

  /* =================================================================
     2. NAVBAR SCROLL EFFECT
     ================================================================= */
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    }, { passive: true });
  }

  /* =================================================================
     3. MOBILE HAMBURGER MENU
     ================================================================= */
  function initMobileMenu() {
    var hamburger  = document.getElementById('hamburger-btn');
    var mobileMenu = document.getElementById('mobile-menu');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow =
        mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when any link inside it is clicked
    var links = mobileMenu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    }
  }

  /* =================================================================
     4. TYPING ANIMATION
     ================================================================= */
  function initTyping() {
    var typingEl = document.getElementById('typing-text');
    if (!typingEl) return;

    var texts = [
      'Premium Phone Cases',
      'Fast Charging Cables',
      'Wireless Earbuds',
      'Screen Protectors',
      'Power Banks',
      'Smart Watches'
    ];

    var textIndex   = 0;
    var charIndex   = 0;
    var isDeleting  = false;
    var typingSpeed = 100;
    var timerId     = null;

    function type() {
      var current = texts[textIndex];

      if (isDeleting) {
        charIndex--;
        typingSpeed = 50;
      } else {
        charIndex++;
        typingSpeed = 100;
      }

      typingEl.textContent = current.substring(0, charIndex);

      if (!isDeleting && charIndex === current.length) {
        typingSpeed = 2000;   // pause at end of word
        isDeleting  = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting  = false;
        textIndex   = (textIndex + 1) % texts.length;
        typingSpeed = 500;    // short pause before next word
      }

      timerId = setTimeout(type, typingSpeed);
    }

    type();

    // Pause typing when tab is hidden to save resources
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearTimeout(timerId);
      } else {
        timerId = setTimeout(type, typingSpeed);
      }
    });
  }

  /* =================================================================
     5. SCROLL REVEAL  (Custom IntersectionObserver for .reveal els)
     ================================================================= */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything immediately
      for (var i = 0; i < reveals.length; i++) {
        reveals[i].classList.add('active');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    for (var j = 0; j < reveals.length; j++) {
      observer.observe(reveals[j]);
    }
  }

  /* =================================================================
     6. COUNTER ANIMATION  (for #why-us stats with data-count)
     ================================================================= */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: set final values immediately
      counters.forEach(function (el) {
        el.textContent = el.dataset.count + (el.dataset.suffix || '');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el        = entry.target;
        var target    = parseInt(el.dataset.count, 10);
        var suffix    = el.dataset.suffix || '';
        var current   = 0;
        var steps     = 60;
        var increment = target / steps;

        var timer = setInterval(function () {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current) + suffix;
        }, 30);

        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    for (var i = 0; i < counters.length; i++) {
      observer.observe(counters[i]);
    }
  }

  /* =================================================================
     7. COUNTDOWN TIMER  (for #deals section)
     ================================================================= */
  function initCountdown() {
    var daysEl  = document.getElementById('countdown-days');
    var hoursEl = document.getElementById('countdown-hours');
    var minsEl  = document.getElementById('countdown-mins');
    var secsEl  = document.getElementById('countdown-secs');

    // Bail early if none of the countdown elements exist
    if (!daysEl && !hoursEl && !minsEl && !secsEl) return;

    // Set target date 7 days from now (persisted in memory)
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    function pad(n) {
      return String(n).padStart(2, '0');
    }

    function updateCountdown() {
      var now  = new Date();
      var diff = targetDate - now;

      if (diff <= 0) {
        // Timer expired — show zeroes
        if (daysEl)  daysEl.textContent  = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl)  minsEl.textContent  = '00';
        if (secsEl)  secsEl.textContent  = '00';
        return;
      }

      var days  = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins  = Math.floor((diff % 3600000)  / 60000);
      var secs  = Math.floor((diff % 60000)    / 1000);

      if (daysEl)  daysEl.textContent  = pad(days);
      if (hoursEl) hoursEl.textContent = pad(hours);
      if (minsEl)  minsEl.textContent  = pad(mins);
      if (secsEl)  secsEl.textContent  = pad(secs);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* =================================================================
     8. TESTIMONIALS SLIDER
     ================================================================= */
  function initTestimonials() {
    var track   = document.getElementById('testimonial-track');
    var prevBtn = document.getElementById('testimonial-prev');
    var nextBtn = document.getElementById('testimonial-next');

    if (!track || !prevBtn || !nextBtn) return;

    var currentSlide = 0;
    var cards = track.querySelectorAll('.testimonial-card');
    if (!cards.length) return;

    function getVisibleCards() {
      var w = window.innerWidth;
      if (w <= 768)  return 1;
      if (w <= 1024) return 2;
      return 3;
    }

    function updateSlider() {
      var visible  = getVisibleCards();
      var maxSlide = Math.max(0, cards.length - visible);
      currentSlide = Math.min(currentSlide, maxSlide);
      var cardWidth = 100 / visible;
      track.style.transform = 'translateX(-' + (currentSlide * cardWidth) + '%)';
    }

    prevBtn.addEventListener('click', function () {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
      }
    });

    nextBtn.addEventListener('click', function () {
      var visible  = getVisibleCards();
      var maxSlide = cards.length - visible;
      if (currentSlide < maxSlide) {
        currentSlide++;
        updateSlider();
      }
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();

    // Auto-play every 5 seconds
    setInterval(function () {
      var visible  = getVisibleCards();
      var maxSlide = cards.length - visible;
      currentSlide = currentSlide >= maxSlide ? 0 : currentSlide + 1;
      updateSlider();
    }, 5000);
  }

  /* =================================================================
     9. NEWSLETTER FORM
     ================================================================= */
  function initNewsletter() {
    var form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailEl = document.getElementById('newsletter-email');
      var email   = emailEl ? emailEl.value.trim() : '';

      if (email) {
        showToast('Thank you for subscribing!', 'success');
        form.reset();
      }
    });
  }

  /* =================================================================
     10. CONTACT FORM
     ================================================================= */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('Message sent successfully!', 'success');
      form.reset();
    });
  }

  /* =================================================================
     11. SMOOTH SCROLL for anchor links
     ================================================================= */
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');

        // Skip bare hashes or admin link
        if (href === '#' || href === '#admin') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  /* =================================================================
     12. TOAST NOTIFICATIONS  (globally accessible)
     ================================================================= */
  function showToast(message, type) {
    type = type || 'success';

    // Remove any existing toast first
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast       = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;

    // Accessible live-region announcement
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    document.body.appendChild(toast);

    // Trigger reflow before adding .show so the CSS transition fires
    // eslint-disable-next-line no-unused-expressions
    toast.offsetHeight;

    setTimeout(function () { toast.classList.add('show'); }, 50);

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 3000);
  }

  // Expose showToast globally so other scripts (e.g. admin.js) can use it
  window.showToast = showToast;

  /* =================================================================
     13. DROPDOWN TOGGLE (mobile nav dropdowns)
     ================================================================= */
  function initDropdowns() {
    var triggers = document.querySelectorAll('.nav-dropdown-trigger');
    var dropdowns = document.querySelectorAll('.nav-dropdown');

    // Click to toggle dropdown for both mobile and desktop
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var parent = this.closest('.nav-dropdown');
        if (parent) {
          // Close other dropdowns first
          for (var k = 0; k < dropdowns.length; k++) {
            if (dropdowns[k] !== parent) {
              dropdowns[k].classList.remove('open');
            }
          }
          parent.classList.toggle('open');
        }
      });
    }

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      for (var j = 0; j < dropdowns.length; j++) {
        var dropdown = dropdowns[j];
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open');
        }
      }
    });
  }

  /* =================================================================
     3D Holographic Phone Parallax Effect
     ================================================================= */
  function initHoloPhone3D() {
    var phone = document.getElementById('holo-phone');
    var container = document.querySelector('.holo-phone-container');
    if (!phone || !container) return;

    var rect = container.getBoundingClientRect();
    
    // Mouse movement inside container tilts the phone
    container.addEventListener('mousemove', function (e) {
      var x = e.clientX - rect.left - (rect.width / 2);
      var y = e.clientY - rect.top - (rect.height / 2);
      
      // Calculate rotation angles (max 15 degrees)
      var rotateY = (x / (rect.width / 2)) * 15;
      var rotateX = -(y / (rect.height / 2)) * 15;
      
      phone.style.transform = 'rotateY(' + rotateY + 'deg) rotateX(' + rotateX + 'deg) scale(1.03)';
    });

    // Reset when mouse leaves
    container.addEventListener('mouseleave', function () {
      phone.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });

    // Handle resize
    window.addEventListener('resize', function () {
      rect = container.getBoundingClientRect();
    });
  }

  /* =================================================================
     14. PREMIUM 3D CARD TILT ON HOVER
     ================================================================= */
  function initCardTilt() {
    function setupTilt(card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -6;
        var rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = 'translateY(-12px) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    }

    // Apply to all interactive cards
    var selectors = '.product-card, .category-card, .stat-card, .deal-card, .testimonial-card, .contact-card';
    var cards = document.querySelectorAll(selectors);
    for (var i = 0; i < cards.length; i++) {
      setupTilt(cards[i]);
    }

    // Also observe for dynamically added product cards
    var grid = document.getElementById('products-grid');
    if (grid) {
      var observer = new MutationObserver(function () {
        var newCards = grid.querySelectorAll('.product-card');
        for (var j = 0; j < newCards.length; j++) {
          if (!newCards[j].dataset.tiltReady) {
            newCards[j].dataset.tiltReady = '1';
            setupTilt(newCards[j]);
          }
        }
      });
      observer.observe(grid, { childList: true, subtree: true });
    }
  }

  /* =================================================================
     15. STAGGERED CARD ENTRANCE ANIMATIONS
     ================================================================= */
  function initStaggeredReveal() {
    var sections = document.querySelectorAll('.products-grid, .categories-grid, .stats-grid, .deals-container');
    
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var cards = entry.target.children;
          for (var i = 0; i < cards.length; i++) {
            (function (card, index) {
              setTimeout(function () {
                card.classList.add('card-revealed');
              }, index * 120);
            })(cards[i], i);
          }
        }
      });
    }, { threshold: 0.1 });

    for (var i = 0; i < sections.length; i++) {
      // Add initial hidden state to children
      var children = sections[i].children;
      for (var j = 0; j < children.length; j++) {
        children[j].classList.add('card-hidden');
      }
      observer.observe(sections[i]);
    }
  }

  /* =================================================================
     16. MAGNETIC CURSOR GLOW EFFECT ON CARDS
     ================================================================= */
  function initMagneticGlow() {
    document.addEventListener('mousemove', function (e) {
      var cards = document.querySelectorAll('.product-card, .category-card');
      for (var i = 0; i < cards.length; i++) {
        var rect = cards[i].getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        cards[i].style.setProperty('--mouse-x', x + 'px');
        cards[i].style.setProperty('--mouse-y', y + 'px');
      }
    });
  }


  /* =================================================================
     INITIALISE EVERYTHING ON DOMContentLoaded
     ================================================================= */
  document.addEventListener('DOMContentLoaded', function () {
    // Lock scroll while loader plays
    document.body.style.overflow = 'hidden';

    try { initLoader();        } catch (e) { console.warn('[Loader]',        e); }
    try { initNavbar();        } catch (e) { console.warn('[Navbar]',        e); }
    try { initMobileMenu();    } catch (e) { console.warn('[MobileMenu]',    e); }
    try { initTyping();        } catch (e) { console.warn('[Typing]',        e); }
    try { initScrollReveal();  } catch (e) { console.warn('[ScrollReveal]',  e); }
    try { initCounters();      } catch (e) { console.warn('[Counters]',      e); }
    try { initCountdown();     } catch (e) { console.warn('[Countdown]',     e); }
    try { initTestimonials();  } catch (e) { console.warn('[Testimonials]',  e); }
    try { initNewsletter();    } catch (e) { console.warn('[Newsletter]',    e); }
    try { initContactForm();   } catch (e) { console.warn('[ContactForm]',   e); }
    try { initSmoothScroll();  } catch (e) { console.warn('[SmoothScroll]',  e); }
    try { initDropdowns();     } catch (e) { console.warn('[Dropdowns]',     e); }
    try { initHoloPhone3D();   } catch (e) { console.warn('[HoloPhone3D]',   e); }

    // Premium animations (init after slight delay so cards are rendered)
    setTimeout(function () {
      try { initCardTilt();          } catch (e) { console.warn('[CardTilt]',          e); }
      try { initStaggeredReveal();   } catch (e) { console.warn('[StaggeredReveal]',   e); }
      try { initMagneticGlow();      } catch (e) { console.warn('[MagneticGlow]',      e); }
    }, 600);
  });
})();
