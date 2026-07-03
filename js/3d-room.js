/* ===================================================================
   3D Room Background Engine — Royal Sphire
   Creates floating mobile-accessory emojis that drift in 3D space.
   Responds to mouse movement (desktop) and device orientation (mobile).
   =================================================================== */

(function () {
  'use strict';

  /* ---------- Utility helpers ---------- */

  /**
   * Returns true when the user prefers reduced motion.
   */
  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  }

  /**
   * Simple throttle — limits `fn` to once every `wait` ms.
   */
  function throttle(fn, wait) {
    var lastTime = 0;
    return function () {
      var now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, arguments);
      }
    };
  }

  /* ---------- Floating items data ---------- */

  var ITEMS = [
    { imgUrl: 'images/floating-case-white.png', size: 120, x: 10, y: 20, delay: 0 },
    { imgUrl: 'images/floating-cable-white.png', size: 90, x: 80, y: 15, delay: 2 },
    { imgUrl: 'images/floating-earbud-white.png', size: 100, x: 25, y: 70, delay: 4 },
    { imgUrl: 'images/floating-case-white.png', size: 85, x: 70, y: 60, delay: 1 },
    { imgUrl: 'images/floating-cable-white.png', size: 110, x: 50, y: 35, delay: 3 },
    { imgUrl: 'images/floating-earbud-white.png', size: 95, x: 90, y: 80, delay: 5 },
    { imgUrl: 'images/floating-case-white.png', size: 100, x: 15, y: 50, delay: 2.5 },
    { imgUrl: 'images/floating-earbud-white.png', size: 110, x: 60, y: 85, delay: 1.5 }
  ];

  /* ---------- Core init ---------- */

  var rafId = null; // stored so we could cancel if needed

  function init3DRoom() {
    var scene = document.getElementById('scene-3d');
    if (!scene) return;

    /* --- Spawn floating items --- */
    ITEMS.forEach(function (item, i) {
      var el = document.createElement('div');
      el.className = 'floating-item';
      el.setAttribute('aria-hidden', 'true'); // decorative only
      el.style.cssText =
        'left:' + item.x + '%;' +
        'top:' + item.y + '%;' +
        'width:' + item.size + 'px;' +
        'height:' + item.size + 'px;' +
        'animation:float-' + (i + 1) + ' ' + (18 + i * 2) + 's ease-in-out infinite;' +
        'animation-delay:' + item.delay + 's;' +
        'opacity:0.65;' +
        'position:absolute;' +
        'pointer-events:none;' +
        'will-change:transform;' +
        'z-index:0;';

      var img = document.createElement('img');
      img.src = item.imgUrl;
      img.alt = '';
      img.style.cssText = 'width:100%; height:100%; object-fit:contain; mix-blend-mode:multiply; filter: drop-shadow(0 4px 15px rgba(0, 168, 255, 0.15));';
      el.appendChild(img);
      scene.appendChild(el);
    });

    /* --- Parallax state --- */
    var mouseX  = 0;
    var mouseY  = 0;
    var currentX = 0;
    var currentY = 0;

    /* --- Desktop: mouse-driven parallax --- */
    document.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 30;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    });

    /* --- Mobile: device-orientation parallax (throttled) --- */
    if (window.DeviceOrientationEvent) {
      var handleOrientation = throttle(function (e) {
        if (e.gamma !== null && e.beta !== null) {
          mouseX = e.gamma * 0.5;          // left-right tilt
          mouseY = (e.beta - 45) * 0.5;    // front-back tilt (centered around 45°)
        }
      }, 50); // ~20 fps on mobile — keeps things smooth without burning battery

      window.addEventListener('deviceorientation', handleOrientation);
    }

    /* --- Smooth parallax render loop --- */
    var easing = 0.05;

    function animateParallax() {
      currentX += (mouseX - currentX) * easing;
      currentY += (mouseY - currentY) * easing;

      scene.style.transform =
        'translate3d(' + currentX + 'px, ' + currentY + 'px, 0) ' +
        'rotateX(' + (currentY * 0.1) + 'deg) ' +
        'rotateY(' + (currentX * 0.1) + 'deg)';

      rafId = requestAnimationFrame(animateParallax);
    }

    animateParallax();

    /* --- Pause animation when tab is hidden (performance) --- */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        if (!rafId) {
          animateParallax();
        }
      }
    });
  }

  /* ---------- Bootstrap ---------- */

  document.addEventListener('DOMContentLoaded', function () {
    // Respect the user's motion preferences
    if (prefersReducedMotion()) return;

    try {
      init3DRoom();
    } catch (err) {
      // Fail silently — the 3D background is purely decorative
      if (typeof console !== 'undefined') {
        console.warn('[3D-Room] Initialisation error:', err);
      }
    }
  });
})();
